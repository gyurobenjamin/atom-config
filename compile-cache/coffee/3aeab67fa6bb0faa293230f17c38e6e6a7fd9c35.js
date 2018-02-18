(function() {
  var BufferedProcess, ClangFlags, ClangProvider, CompositeDisposable, LanguageUtil, Point, Range, existsSync, path, ref;

  ref = require('atom'), Point = ref.Point, Range = ref.Range, BufferedProcess = ref.BufferedProcess, CompositeDisposable = ref.CompositeDisposable;

  path = require('path');

  existsSync = require('fs').existsSync;

  ClangFlags = require('clang-flags');

  module.exports = ClangProvider = (function() {
    function ClangProvider() {}

    ClangProvider.prototype.selector = '.source.cpp, .source.c, .source.objc, .source.objcpp';

    ClangProvider.prototype.inclusionPriority = 1;

    ClangProvider.prototype.scopeSource = {
      'source.cpp': 'c++',
      'source.c': 'c',
      'source.objc': 'objective-c',
      'source.objcpp': 'objective-c++'
    };

    ClangProvider.prototype.getSuggestions = function(arg1) {
      var bufferPosition, editor, language, lastSymbol, line, minimumWordLength, prefix, ref1, regex, scopeDescriptor, symbolPosition;
      editor = arg1.editor, scopeDescriptor = arg1.scopeDescriptor, bufferPosition = arg1.bufferPosition;
      language = LanguageUtil.getSourceScopeLang(this.scopeSource, scopeDescriptor.getScopesArray());
      prefix = LanguageUtil.prefixAtPosition(editor, bufferPosition);
      ref1 = LanguageUtil.nearestSymbolPosition(editor, bufferPosition), symbolPosition = ref1[0], lastSymbol = ref1[1];
      minimumWordLength = atom.config.get('autocomplete-plus.minimumWordLength');
      if ((minimumWordLength != null) && prefix.length < minimumWordLength) {
        regex = /(?:\.|->|::)\s*\w*$/;
        line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
        if (!regex.test(line)) {
          return;
        }
      }
      if (language != null) {
        return this.codeCompletionAt(editor, symbolPosition.row, symbolPosition.column, language, prefix);
      }
    };

    ClangProvider.prototype.codeCompletionAt = function(editor, row, column, language, prefix) {
      var args, command, options;
      command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildClangArgs(editor, row, column, language);
      options = {
        cwd: path.dirname(editor.getPath()),
        input: editor.getText()
      };
      return new Promise((function(_this) {
        return function(resolve) {
          var allOutput, bufferedProcess, exit, stderr, stdout;
          allOutput = [];
          stdout = function(output) {
            return allOutput.push(output);
          };
          stderr = function(output) {
            return console.log(output);
          };
          exit = function(code) {
            return resolve(_this.handleCompletionResult(allOutput.join('\n'), code, prefix));
          };
          bufferedProcess = new BufferedProcess({
            command: command,
            args: args,
            options: options,
            stdout: stdout,
            stderr: stderr,
            exit: exit
          });
          bufferedProcess.process.stdin.setEncoding = 'utf-8';
          bufferedProcess.process.stdin.write(editor.getText());
          return bufferedProcess.process.stdin.end();
        };
      })(this));
    };

    ClangProvider.prototype.convertCompletionLine = function(line, prefix) {
      var argumentsRe, basicInfo, basicInfoRe, comment, commentRe, completion, completionAndComment, constMemFuncRe, content, contentRe, index, infoTagsRe, isConstMemFunc, match, optionalArgumentsStart, ref1, ref2, ref3, returnType, returnTypeRe, suggestion;
      contentRe = /^COMPLETION: (.*)/;
      ref1 = line.match(contentRe), line = ref1[0], content = ref1[1];
      basicInfoRe = /^(.*?) : (.*)/;
      match = content.match(basicInfoRe);
      if (match == null) {
        return {
          text: content
        };
      }
      content = match[0], basicInfo = match[1], completionAndComment = match[2];
      commentRe = /(?: : (.*))?$/;
      ref2 = completionAndComment.split(commentRe), completion = ref2[0], comment = ref2[1];
      returnTypeRe = /^\[#(.*?)#\]/;
      returnType = (ref3 = completion.match(returnTypeRe)) != null ? ref3[1] : void 0;
      constMemFuncRe = /\[# const#\]$/;
      isConstMemFunc = constMemFuncRe.test(completion);
      infoTagsRe = /\[#(.*?)#\]/g;
      completion = completion.replace(infoTagsRe, '');
      argumentsRe = /<#(.*?)#>/g;
      optionalArgumentsStart = completion.indexOf('{#');
      completion = completion.replace(/\{#/g, '');
      completion = completion.replace(/#\}/g, '');
      index = 0;
      completion = completion.replace(argumentsRe, function(match, arg, offset) {
        index++;
        if (optionalArgumentsStart > 0 && offset > optionalArgumentsStart) {
          return "${" + index + ":optional " + arg + "}";
        } else {
          return "${" + index + ":" + arg + "}";
        }
      });
      suggestion = {};
      if (returnType != null) {
        suggestion.leftLabel = returnType;
      }
      if (index > 0) {
        suggestion.snippet = completion;
      } else {
        suggestion.text = completion;
      }
      if (isConstMemFunc) {
        suggestion.displayText = completion + ' const';
      }
      if (comment != null) {
        suggestion.description = comment;
      }
      suggestion.replacementPrefix = prefix;
      return suggestion;
    };

    ClangProvider.prototype.handleCompletionResult = function(result, returnCode, prefix) {
      var completionsRe, line, outputLines;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      completionsRe = new RegExp("^COMPLETION: (" + prefix + ".*)$", "mg");
      outputLines = result.match(completionsRe);
      if (outputLines != null) {
        return (function() {
          var j, len, results;
          results = [];
          for (j = 0, len = outputLines.length; j < len; j++) {
            line = outputLines[j];
            results.push(this.convertCompletionLine(line, prefix));
          }
          return results;
        }).call(this);
      } else {
        return [];
      }
    };

    ClangProvider.prototype.buildClangArgs = function(editor, row, column, language) {
      var args, clangflags, currentDir, error, i, j, len, pchFile, pchFilePrefix, pchPath, ref1, std;
      std = atom.config.get("autocomplete-clang.std " + language);
      currentDir = path.dirname(editor.getPath());
      pchFilePrefix = atom.config.get("autocomplete-clang.pchFilePrefix");
      pchFile = [pchFilePrefix, language, "pch"].join('.');
      pchPath = path.join(currentDir, pchFile);
      args = ["-fsyntax-only"];
      args.push("-x" + language);
      if (std) {
        args.push("-std=" + std);
      }
      args.push("-Xclang", "-code-completion-macros");
      args.push("-Xclang", "-code-completion-at=-:" + (row + 1) + ":" + (column + 1));
      if (existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      ref1 = atom.config.get("autocomplete-clang.includePaths");
      for (j = 0, len = ref1.length; j < len; j++) {
        i = ref1[j];
        args.push("-I" + i);
      }
      args.push("-I" + currentDir);
      if (atom.config.get("autocomplete-clang.includeDocumentation")) {
        args.push("-Xclang", "-code-completion-brief-comments");
        if (atom.config.get("autocomplete-clang.includeNonDoxygenCommentsAsDocumentation")) {
          args.push("-fparse-all-comments");
        }
        if (atom.config.get("autocomplete-clang.includeSystemHeadersDocumentation")) {
          args.push("-fretain-comments-from-system-headers");
        }
      }
      try {
        clangflags = ClangFlags.getClangFlags(editor.getPath());
        if (clangflags) {
          args = args.concat(clangflags);
        }
      } catch (error1) {
        error = error1;
        console.log(error);
      }
      args.push("-");
      return args;
    };

    return ClangProvider;

  })();

  LanguageUtil = {
    getSourceScopeLang: function(scopeSource, scopesArray) {
      var j, len, scope;
      for (j = 0, len = scopesArray.length; j < len; j++) {
        scope = scopesArray[j];
        if (scope in scopeSource) {
          return scopeSource[scope];
        }
      }
      return null;
    },
    prefixAtPosition: function(editor, bufferPosition) {
      var line, ref1, regex;
      regex = /\w+$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      return ((ref1 = line.match(regex)) != null ? ref1[0] : void 0) || '';
    },
    nearestSymbolPosition: function(editor, bufferPosition) {
      var line, matches, regex, symbol, symbolColumn;
      regex = /(\W+)\w*$/;
      line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      matches = line.match(regex);
      if (matches) {
        symbol = matches[1];
        symbolColumn = matches[0].indexOf(symbol) + symbol.length + (line.length - matches[0].length);
        return [new Point(bufferPosition.row, symbolColumn), symbol.slice(-1)];
      } else {
        return [bufferPosition, ''];
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9jbGFuZy1wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7QUFBQSxNQUFBOztFQUFBLE1BQXVELE9BQUEsQ0FBUSxNQUFSLENBQXZELEVBQUMsaUJBQUQsRUFBUSxpQkFBUixFQUFlLHFDQUFmLEVBQWdDOztFQUNoQyxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sYUFBYyxPQUFBLENBQVEsSUFBUjs7RUFDZixVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7OzRCQUNKLFFBQUEsR0FBVTs7NEJBQ1YsaUJBQUEsR0FBbUI7OzRCQUVuQixXQUFBLEdBQ0U7TUFBQSxZQUFBLEVBQWMsS0FBZDtNQUNBLFVBQUEsRUFBWSxHQURaO01BRUEsYUFBQSxFQUFlLGFBRmY7TUFHQSxlQUFBLEVBQWlCLGVBSGpCOzs7NEJBS0YsY0FBQSxHQUFnQixTQUFDLElBQUQ7QUFDZCxVQUFBO01BRGdCLHNCQUFRLHdDQUFpQjtNQUN6QyxRQUFBLEdBQVcsWUFBWSxDQUFDLGtCQUFiLENBQWdDLElBQUMsQ0FBQSxXQUFqQyxFQUE4QyxlQUFlLENBQUMsY0FBaEIsQ0FBQSxDQUE5QztNQUNYLE1BQUEsR0FBUyxZQUFZLENBQUMsZ0JBQWIsQ0FBOEIsTUFBOUIsRUFBc0MsY0FBdEM7TUFDVCxPQUE4QixZQUFZLENBQUMscUJBQWIsQ0FBbUMsTUFBbkMsRUFBMkMsY0FBM0MsQ0FBOUIsRUFBQyx3QkFBRCxFQUFnQjtNQUNoQixpQkFBQSxHQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUNBQWhCO01BRXBCLElBQUcsMkJBQUEsSUFBdUIsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsaUJBQTFDO1FBQ0UsS0FBQSxHQUFRO1FBQ1IsSUFB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QUFERjthQUVBO0lBSGtCLENBQXBCO0lBS0EsZ0JBQUEsRUFBa0IsU0FBQyxNQUFELEVBQVMsY0FBVDtBQUNoQixVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsSUFBQSxHQUFPLE1BQU0sQ0FBQyxjQUFQLENBQXNCLENBQUMsQ0FBQyxjQUFjLENBQUMsR0FBaEIsRUFBcUIsQ0FBckIsQ0FBRCxFQUEwQixjQUExQixDQUF0Qjt1REFDWSxDQUFBLENBQUEsV0FBbkIsSUFBeUI7SUFIVCxDQUxsQjtJQVVBLHFCQUFBLEVBQXVCLFNBQUMsTUFBRCxFQUFTLGNBQVQ7QUFDckIsVUFBQTtNQUFBLEtBQUEsR0FBUTtNQUNSLElBQUEsR0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsY0FBMUIsQ0FBdEI7TUFDUCxPQUFBLEdBQVUsSUFBSSxDQUFDLEtBQUwsQ0FBVyxLQUFYO01BQ1YsSUFBRyxPQUFIO1FBQ0UsTUFBQSxHQUFTLE9BQVEsQ0FBQSxDQUFBO1FBQ2pCLFlBQUEsR0FBZSxPQUFRLENBQUEsQ0FBQSxDQUFFLENBQUMsT0FBWCxDQUFtQixNQUFuQixDQUFBLEdBQTZCLE1BQU0sQ0FBQyxNQUFwQyxHQUE2QyxDQUFDLElBQUksQ0FBQyxNQUFMLEdBQWMsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLE1BQTFCO2VBQzVELENBQUssSUFBQSxLQUFBLENBQU0sY0FBYyxDQUFDLEdBQXJCLEVBQTBCLFlBQTFCLENBQUwsRUFBNkMsTUFBTyxVQUFwRCxFQUhGO09BQUEsTUFBQTtlQUtFLENBQUMsY0FBRCxFQUFnQixFQUFoQixFQUxGOztJQUpxQixDQVZ2Qjs7QUFySUYiLCJzb3VyY2VzQ29udGVudCI6WyIjIGF1dG9jb21wbGV0ZS1wbHVzIHByb3ZpZGVyIGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20vYmVub2dsZS9hdXRvY29tcGxldGUtY2xhbmdcbiMgQ29weXJpZ2h0IChjKSAyMDE1IEJlbiBPZ2xlIHVuZGVyIE1JVCBsaWNlbnNlXG4jIENsYW5nIHJlbGF0ZWQgY29kZSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS95YXN1eXVreS9hdXRvY29tcGxldGUtY2xhbmdcblxue1BvaW50LCBSYW5nZSwgQnVmZmVyZWRQcm9jZXNzLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbntleGlzdHNTeW5jfSA9IHJlcXVpcmUgJ2ZzJ1xuQ2xhbmdGbGFncyA9IHJlcXVpcmUgJ2NsYW5nLWZsYWdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBDbGFuZ1Byb3ZpZGVyXG4gIHNlbGVjdG9yOiAnLnNvdXJjZS5jcHAsIC5zb3VyY2UuYywgLnNvdXJjZS5vYmpjLCAuc291cmNlLm9iamNwcCdcbiAgaW5jbHVzaW9uUHJpb3JpdHk6IDFcblxuICBzY29wZVNvdXJjZTpcbiAgICAnc291cmNlLmNwcCc6ICdjKysnXG4gICAgJ3NvdXJjZS5jJzogJ2MnXG4gICAgJ3NvdXJjZS5vYmpjJzogJ29iamVjdGl2ZS1jJ1xuICAgICdzb3VyY2Uub2JqY3BwJzogJ29iamVjdGl2ZS1jKysnXG5cbiAgZ2V0U3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBzY29wZURlc2NyaXB0b3IsIGJ1ZmZlclBvc2l0aW9ufSkgLT5cbiAgICBsYW5ndWFnZSA9IExhbmd1YWdlVXRpbC5nZXRTb3VyY2VTY29wZUxhbmcoQHNjb3BlU291cmNlLCBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVzQXJyYXkoKSlcbiAgICBwcmVmaXggPSBMYW5ndWFnZVV0aWwucHJlZml4QXRQb3NpdGlvbihlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgIFtzeW1ib2xQb3NpdGlvbixsYXN0U3ltYm9sXSA9IExhbmd1YWdlVXRpbC5uZWFyZXN0U3ltYm9sUG9zaXRpb24oZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICBtaW5pbXVtV29yZExlbmd0aCA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBsdXMubWluaW11bVdvcmRMZW5ndGgnKVxuXG4gICAgaWYgbWluaW11bVdvcmRMZW5ndGg/IGFuZCBwcmVmaXgubGVuZ3RoIDwgbWluaW11bVdvcmRMZW5ndGhcbiAgICAgIHJlZ2V4ID0gLyg/OlxcLnwtPnw6OilcXHMqXFx3KiQvXG4gICAgICBsaW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKVxuICAgICAgcmV0dXJuIHVubGVzcyByZWdleC50ZXN0KGxpbmUpXG5cbiAgICBpZiBsYW5ndWFnZT9cbiAgICAgIEBjb2RlQ29tcGxldGlvbkF0KGVkaXRvciwgc3ltYm9sUG9zaXRpb24ucm93LCBzeW1ib2xQb3NpdGlvbi5jb2x1bW4sIGxhbmd1YWdlLCBwcmVmaXgpXG5cbiAgY29kZUNvbXBsZXRpb25BdDogKGVkaXRvciwgcm93LCBjb2x1bW4sIGxhbmd1YWdlLCBwcmVmaXgpIC0+XG4gICAgY29tbWFuZCA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5jbGFuZ0NvbW1hbmRcIlxuICAgIGFyZ3MgPSBAYnVpbGRDbGFuZ0FyZ3MoZWRpdG9yLCByb3csIGNvbHVtbiwgbGFuZ3VhZ2UpXG4gICAgb3B0aW9ucyA9XG4gICAgICBjd2Q6IHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgaW5wdXQ6IGVkaXRvci5nZXRUZXh0KClcblxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgYWxsT3V0cHV0ID0gW11cbiAgICAgIHN0ZG91dCA9IChvdXRwdXQpID0+IGFsbE91dHB1dC5wdXNoKG91dHB1dClcbiAgICAgIHN0ZGVyciA9IChvdXRwdXQpID0+IGNvbnNvbGUubG9nIG91dHB1dFxuICAgICAgZXhpdCA9IChjb2RlKSA9PiByZXNvbHZlKEBoYW5kbGVDb21wbGV0aW9uUmVzdWx0KGFsbE91dHB1dC5qb2luKCdcXG4nKSwgY29kZSwgcHJlZml4KSlcbiAgICAgIGJ1ZmZlcmVkUHJvY2VzcyA9IG5ldyBCdWZmZXJlZFByb2Nlc3Moe2NvbW1hbmQsIGFyZ3MsIG9wdGlvbnMsIHN0ZG91dCwgc3RkZXJyLCBleGl0fSlcbiAgICAgIGJ1ZmZlcmVkUHJvY2Vzcy5wcm9jZXNzLnN0ZGluLnNldEVuY29kaW5nID0gJ3V0Zi04JztcbiAgICAgIGJ1ZmZlcmVkUHJvY2Vzcy5wcm9jZXNzLnN0ZGluLndyaXRlKGVkaXRvci5nZXRUZXh0KCkpXG4gICAgICBidWZmZXJlZFByb2Nlc3MucHJvY2Vzcy5zdGRpbi5lbmQoKVxuXG4gIGNvbnZlcnRDb21wbGV0aW9uTGluZTogKGxpbmUsIHByZWZpeCkgLT5cbiAgICBjb250ZW50UmUgPSAvXkNPTVBMRVRJT046ICguKikvXG4gICAgW2xpbmUsIGNvbnRlbnRdID0gbGluZS5tYXRjaCBjb250ZW50UmVcbiAgICBiYXNpY0luZm9SZSA9IC9eKC4qPykgOiAoLiopL1xuICAgIG1hdGNoID0gY29udGVudC5tYXRjaCBiYXNpY0luZm9SZVxuICAgIHJldHVybiB7dGV4dDogY29udGVudH0gdW5sZXNzIG1hdGNoP1xuXG4gICAgW2NvbnRlbnQsIGJhc2ljSW5mbywgY29tcGxldGlvbkFuZENvbW1lbnRdID0gbWF0Y2hcbiAgICBjb21tZW50UmUgPSAvKD86IDogKC4qKSk/JC9cbiAgICBbY29tcGxldGlvbiwgY29tbWVudF0gPSBjb21wbGV0aW9uQW5kQ29tbWVudC5zcGxpdCBjb21tZW50UmVcbiAgICByZXR1cm5UeXBlUmUgPSAvXlxcWyMoLio/KSNcXF0vXG4gICAgcmV0dXJuVHlwZSA9IGNvbXBsZXRpb24ubWF0Y2gocmV0dXJuVHlwZVJlKT9bMV1cbiAgICBjb25zdE1lbUZ1bmNSZSA9IC9cXFsjIGNvbnN0I1xcXSQvXG4gICAgaXNDb25zdE1lbUZ1bmMgPSBjb25zdE1lbUZ1bmNSZS50ZXN0IGNvbXBsZXRpb25cbiAgICBpbmZvVGFnc1JlID0gL1xcWyMoLio/KSNcXF0vZ1xuICAgIGNvbXBsZXRpb24gPSBjb21wbGV0aW9uLnJlcGxhY2UgaW5mb1RhZ3NSZSwgJydcbiAgICBhcmd1bWVudHNSZSA9IC88IyguKj8pIz4vZ1xuICAgIG9wdGlvbmFsQXJndW1lbnRzU3RhcnQgPSBjb21wbGV0aW9uLmluZGV4T2YgJ3sjJ1xuICAgIGNvbXBsZXRpb24gPSBjb21wbGV0aW9uLnJlcGxhY2UgL1xceyMvZywgJydcbiAgICBjb21wbGV0aW9uID0gY29tcGxldGlvbi5yZXBsYWNlIC8jXFx9L2csICcnXG4gICAgaW5kZXggPSAwXG4gICAgY29tcGxldGlvbiA9IGNvbXBsZXRpb24ucmVwbGFjZSBhcmd1bWVudHNSZSwgKG1hdGNoLCBhcmcsIG9mZnNldCkgLT5cbiAgICAgIGluZGV4KytcbiAgICAgIGlmIG9wdGlvbmFsQXJndW1lbnRzU3RhcnQgPiAwIGFuZCBvZmZzZXQgPiBvcHRpb25hbEFyZ3VtZW50c1N0YXJ0XG4gICAgICAgIHJldHVybiBcIiR7I3tpbmRleH06b3B0aW9uYWwgI3thcmd9fVwiXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBcIiR7I3tpbmRleH06I3thcmd9fVwiXG5cbiAgICBzdWdnZXN0aW9uID0ge31cbiAgICBzdWdnZXN0aW9uLmxlZnRMYWJlbCA9IHJldHVyblR5cGUgaWYgcmV0dXJuVHlwZT9cbiAgICBpZiBpbmRleCA+IDBcbiAgICAgIHN1Z2dlc3Rpb24uc25pcHBldCA9IGNvbXBsZXRpb25cbiAgICBlbHNlXG4gICAgICBzdWdnZXN0aW9uLnRleHQgPSBjb21wbGV0aW9uXG4gICAgaWYgaXNDb25zdE1lbUZ1bmNcbiAgICAgIHN1Z2dlc3Rpb24uZGlzcGxheVRleHQgPSBjb21wbGV0aW9uICsgJyBjb25zdCdcbiAgICBzdWdnZXN0aW9uLmRlc2NyaXB0aW9uID0gY29tbWVudCBpZiBjb21tZW50P1xuICAgIHN1Z2dlc3Rpb24ucmVwbGFjZW1lbnRQcmVmaXggPSBwcmVmaXhcbiAgICBzdWdnZXN0aW9uXG5cbiAgaGFuZGxlQ29tcGxldGlvblJlc3VsdDogKHJlc3VsdCwgcmV0dXJuQ29kZSwgcHJlZml4KSAtPlxuICAgIGlmIHJldHVybkNvZGUgaXMgbm90IDBcbiAgICAgIHJldHVybiB1bmxlc3MgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmlnbm9yZUNsYW5nRXJyb3JzXCJcbiAgICAjIEZpbmQgYWxsIGNvbXBsZXRpb25zIHRoYXQgbWF0Y2ggb3VyIHByZWZpeCBpbiBPTkUgcmVnZXhcbiAgICAjIGZvciBwZXJmb3JtYW5jZSByZWFzb25zLlxuICAgIGNvbXBsZXRpb25zUmUgPSBuZXcgUmVnRXhwKFwiXkNPTVBMRVRJT046IChcIiArIHByZWZpeCArIFwiLiopJFwiLCBcIm1nXCIpXG4gICAgb3V0cHV0TGluZXMgPSByZXN1bHQubWF0Y2goY29tcGxldGlvbnNSZSlcblxuICAgIGlmIG91dHB1dExpbmVzP1xuICAgICAgICByZXR1cm4gKEBjb252ZXJ0Q29tcGxldGlvbkxpbmUobGluZSwgcHJlZml4KSBmb3IgbGluZSBpbiBvdXRwdXRMaW5lcylcbiAgICBlbHNlXG4gICAgICAgIHJldHVybiBbXVxuXG4gIGJ1aWxkQ2xhbmdBcmdzOiAoZWRpdG9yLCByb3csIGNvbHVtbiwgbGFuZ3VhZ2UpIC0+XG4gICAgc3RkID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnN0ZCAje2xhbmd1YWdlfVwiXG4gICAgY3VycmVudERpciA9IHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgIHBjaEZpbGVQcmVmaXggPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcucGNoRmlsZVByZWZpeFwiXG4gICAgcGNoRmlsZSA9IFtwY2hGaWxlUHJlZml4LCBsYW5ndWFnZSwgXCJwY2hcIl0uam9pbiAnLidcbiAgICBwY2hQYXRoID0gcGF0aC5qb2luKGN1cnJlbnREaXIsIHBjaEZpbGUpXG5cbiAgICBhcmdzID0gW1wiLWZzeW50YXgtb25seVwiXVxuICAgIGFyZ3MucHVzaCBcIi14I3tsYW5ndWFnZX1cIlxuICAgIGFyZ3MucHVzaCBcIi1zdGQ9I3tzdGR9XCIgaWYgc3RkXG4gICAgYXJncy5wdXNoIFwiLVhjbGFuZ1wiLCBcIi1jb2RlLWNvbXBsZXRpb24tbWFjcm9zXCJcbiAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiLWNvZGUtY29tcGxldGlvbi1hdD0tOiN7cm93ICsgMX06I3tjb2x1bW4gKyAxfVwiXG4gICAgYXJncy5wdXNoKFwiLWluY2x1ZGUtcGNoXCIsIHBjaFBhdGgpIGlmIGV4aXN0c1N5bmMocGNoUGF0aClcbiAgICBhcmdzLnB1c2ggXCItSSN7aX1cIiBmb3IgaSBpbiBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaW5jbHVkZVBhdGhzXCJcbiAgICBhcmdzLnB1c2ggXCItSSN7Y3VycmVudERpcn1cIlxuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmluY2x1ZGVEb2N1bWVudGF0aW9uXCJcbiAgICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItY29kZS1jb21wbGV0aW9uLWJyaWVmLWNvbW1lbnRzXCJcbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlTm9uRG94eWdlbkNvbW1lbnRzQXNEb2N1bWVudGF0aW9uXCJcbiAgICAgICAgYXJncy5wdXNoIFwiLWZwYXJzZS1hbGwtY29tbWVudHNcIlxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmluY2x1ZGVTeXN0ZW1IZWFkZXJzRG9jdW1lbnRhdGlvblwiXG4gICAgICAgIGFyZ3MucHVzaCBcIi1mcmV0YWluLWNvbW1lbnRzLWZyb20tc3lzdGVtLWhlYWRlcnNcIlxuXG4gICAgdHJ5XG4gICAgICBjbGFuZ2ZsYWdzID0gQ2xhbmdGbGFncy5nZXRDbGFuZ0ZsYWdzKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICBhcmdzID0gYXJncy5jb25jYXQgY2xhbmdmbGFncyBpZiBjbGFuZ2ZsYWdzXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgICBhcmdzLnB1c2ggXCItXCJcbiAgICBhcmdzXG5cbkxhbmd1YWdlVXRpbCA9XG4gIGdldFNvdXJjZVNjb3BlTGFuZzogKHNjb3BlU291cmNlLCBzY29wZXNBcnJheSkgLT5cbiAgICBmb3Igc2NvcGUgaW4gc2NvcGVzQXJyYXlcbiAgICAgIHJldHVybiBzY29wZVNvdXJjZVtzY29wZV0gaWYgc2NvcGUgb2Ygc2NvcGVTb3VyY2VcbiAgICBudWxsXG5cbiAgcHJlZml4QXRQb3NpdGlvbjogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgcmVnZXggPSAvXFx3KyQvXG4gICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcbiAgICBsaW5lLm1hdGNoKHJlZ2V4KT9bMF0gb3IgJydcblxuICBuZWFyZXN0U3ltYm9sUG9zaXRpb246IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHJlZ2V4ID0gLyhcXFcrKVxcdyokL1xuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgbWF0Y2hlcyA9IGxpbmUubWF0Y2gocmVnZXgpXG4gICAgaWYgbWF0Y2hlc1xuICAgICAgc3ltYm9sID0gbWF0Y2hlc1sxXVxuICAgICAgc3ltYm9sQ29sdW1uID0gbWF0Y2hlc1swXS5pbmRleE9mKHN5bWJvbCkgKyBzeW1ib2wubGVuZ3RoICsgKGxpbmUubGVuZ3RoIC0gbWF0Y2hlc1swXS5sZW5ndGgpXG4gICAgICBbbmV3IFBvaW50KGJ1ZmZlclBvc2l0aW9uLnJvdywgc3ltYm9sQ29sdW1uKSxzeW1ib2xbLTEuLl1dXG4gICAgZWxzZVxuICAgICAgW2J1ZmZlclBvc2l0aW9uLCcnXVxuIl19
