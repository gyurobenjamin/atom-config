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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9jbGFuZy1wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUE7QUFBQSxNQUFBOztFQUFBLE1BQXVELE9BQUEsQ0FBUSxNQUFSLENBQXZELEVBQUMsaUJBQUQsRUFBUSxpQkFBUixFQUFlLHFDQUFmLEVBQWdDOztFQUNoQyxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sYUFBYyxPQUFBLENBQVEsSUFBUjs7RUFDZixVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7OzRCQUNKLFFBQUEsR0FBVTs7NEJBQ1YsaUJBQUEsR0FBbUI7OzRCQUVuQixXQUFBLEdBQ0U7TUFBQSxZQUFBLEVBQWMsS0FBZDtNQUNBLFVBQUEsRUFBWSxHQURaO01BRUEsYUFBQSxFQUFlLGFBRmY7TUFHQSxlQUFBLEVBQWlCLGVBSGpCOzs7NEJBS0YsY0FBQSxHQUFnQixTQUFDLElBQUQ7QUFDZCxVQUFBO01BRGdCLHNCQUFRLHdDQUFpQjtNQUN6QyxRQUFBLEdBQVcsWUFBWSxDQUFDLGtCQUFiLENBQWdDLElBQUMsQ0FBQSxXQUFqQyxFQUE4QyxlQUFlLENBQUMsY0FBaEIsQ0FBQSxDQUE5QztNQUNYLE1BQUEsR0FBUyxZQUFZLENBQUMsZ0JBQWIsQ0FBOEIsTUFBOUIsRUFBc0MsY0FBdEM7TUFDVCxPQUE4QixZQUFZLENBQUMscUJBQWIsQ0FBbUMsTUFBbkMsRUFBMkMsY0FBM0MsQ0FBOUIsRUFBQyx3QkFBRCxFQUFnQjtNQUNoQixpQkFBQSxHQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUNBQWhCO01BRXBCLElBQUcsMkJBQUEsSUFBdUIsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsaUJBQTFDO1FBQ0UsS0FBQSxHQUFRO1FBQ1IsSUFB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O0FBREY7YUFFQTtJQUhrQixDQUFwQjtJQUtBLGdCQUFBLEVBQWtCLFNBQUMsTUFBRCxFQUFTLGNBQVQ7QUFDaEIsVUFBQTtNQUFBLEtBQUEsR0FBUTtNQUNSLElBQUEsR0FBTyxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUFDLENBQUMsY0FBYyxDQUFDLEdBQWhCLEVBQXFCLENBQXJCLENBQUQsRUFBMEIsY0FBMUIsQ0FBdEI7dURBQ1ksQ0FBQSxDQUFBLFdBQW5CLElBQXlCO0lBSFQsQ0FMbEI7SUFVQSxxQkFBQSxFQUF1QixTQUFDLE1BQUQsRUFBUyxjQUFUO0FBQ3JCLFVBQUE7TUFBQSxLQUFBLEdBQVE7TUFDUixJQUFBLEdBQU8sTUFBTSxDQUFDLGNBQVAsQ0FBc0IsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxHQUFoQixFQUFxQixDQUFyQixDQUFELEVBQTBCLGNBQTFCLENBQXRCO01BQ1AsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsS0FBWDtNQUNWLElBQUcsT0FBSDtRQUNFLE1BQUEsR0FBUyxPQUFRLENBQUEsQ0FBQTtRQUNqQixZQUFBLEdBQWUsT0FBUSxDQUFBLENBQUEsQ0FBRSxDQUFDLE9BQVgsQ0FBbUIsTUFBbkIsQ0FBQSxHQUE2QixNQUFNLENBQUMsTUFBcEMsR0FBNkMsQ0FBQyxJQUFJLENBQUMsTUFBTCxHQUFjLE9BQVEsQ0FBQSxDQUFBLENBQUUsQ0FBQyxNQUExQjtlQUM1RCxDQUFDLElBQUksS0FBSixDQUFVLGNBQWMsQ0FBQyxHQUF6QixFQUE4QixZQUE5QixDQUFELEVBQTZDLE1BQU8sVUFBcEQsRUFIRjtPQUFBLE1BQUE7ZUFLRSxDQUFDLGNBQUQsRUFBZ0IsRUFBaEIsRUFMRjs7SUFKcUIsQ0FWdkI7O0FBcklGIiwic291cmNlc0NvbnRlbnQiOlsiIyBhdXRvY29tcGxldGUtcGx1cyBwcm92aWRlciBjb2RlIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2Jlbm9nbGUvYXV0b2NvbXBsZXRlLWNsYW5nXG4jIENvcHlyaWdodCAoYykgMjAxNSBCZW4gT2dsZSB1bmRlciBNSVQgbGljZW5zZVxuIyBDbGFuZyByZWxhdGVkIGNvZGUgZnJvbSBodHRwczovL2dpdGh1Yi5jb20veWFzdXl1a3kvYXV0b2NvbXBsZXRlLWNsYW5nXG5cbntQb2ludCwgUmFuZ2UsIEJ1ZmZlcmVkUHJvY2VzcywgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57ZXhpc3RzU3luY30gPSByZXF1aXJlICdmcydcbkNsYW5nRmxhZ3MgPSByZXF1aXJlICdjbGFuZy1mbGFncydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ2xhbmdQcm92aWRlclxuICBzZWxlY3RvcjogJy5zb3VyY2UuY3BwLCAuc291cmNlLmMsIC5zb3VyY2Uub2JqYywgLnNvdXJjZS5vYmpjcHAnXG4gIGluY2x1c2lvblByaW9yaXR5OiAxXG5cbiAgc2NvcGVTb3VyY2U6XG4gICAgJ3NvdXJjZS5jcHAnOiAnYysrJ1xuICAgICdzb3VyY2UuYyc6ICdjJ1xuICAgICdzb3VyY2Uub2JqYyc6ICdvYmplY3RpdmUtYydcbiAgICAnc291cmNlLm9iamNwcCc6ICdvYmplY3RpdmUtYysrJ1xuXG4gIGdldFN1Z2dlc3Rpb25zOiAoe2VkaXRvciwgc2NvcGVEZXNjcmlwdG9yLCBidWZmZXJQb3NpdGlvbn0pIC0+XG4gICAgbGFuZ3VhZ2UgPSBMYW5ndWFnZVV0aWwuZ2V0U291cmNlU2NvcGVMYW5nKEBzY29wZVNvdXJjZSwgc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KCkpXG4gICAgcHJlZml4ID0gTGFuZ3VhZ2VVdGlsLnByZWZpeEF0UG9zaXRpb24oZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICBbc3ltYm9sUG9zaXRpb24sbGFzdFN5bWJvbF0gPSBMYW5ndWFnZVV0aWwubmVhcmVzdFN5bWJvbFBvc2l0aW9uKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgbWluaW11bVdvcmRMZW5ndGggPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1wbHVzLm1pbmltdW1Xb3JkTGVuZ3RoJylcblxuICAgIGlmIG1pbmltdW1Xb3JkTGVuZ3RoPyBhbmQgcHJlZml4Lmxlbmd0aCA8IG1pbmltdW1Xb3JkTGVuZ3RoXG4gICAgICByZWdleCA9IC8oPzpcXC58LT58OjopXFxzKlxcdyokL1xuICAgICAgbGluZSA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbW2J1ZmZlclBvc2l0aW9uLnJvdywgMF0sIGJ1ZmZlclBvc2l0aW9uXSlcbiAgICAgIHJldHVybiB1bmxlc3MgcmVnZXgudGVzdChsaW5lKVxuXG4gICAgaWYgbGFuZ3VhZ2U/XG4gICAgICBAY29kZUNvbXBsZXRpb25BdChlZGl0b3IsIHN5bWJvbFBvc2l0aW9uLnJvdywgc3ltYm9sUG9zaXRpb24uY29sdW1uLCBsYW5ndWFnZSwgcHJlZml4KVxuXG4gIGNvZGVDb21wbGV0aW9uQXQ6IChlZGl0b3IsIHJvdywgY29sdW1uLCBsYW5ndWFnZSwgcHJlZml4KSAtPlxuICAgIGNvbW1hbmQgPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuY2xhbmdDb21tYW5kXCJcbiAgICBhcmdzID0gQGJ1aWxkQ2xhbmdBcmdzKGVkaXRvciwgcm93LCBjb2x1bW4sIGxhbmd1YWdlKVxuICAgIG9wdGlvbnMgPVxuICAgICAgY3dkOiBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIGlucHV0OiBlZGl0b3IuZ2V0VGV4dCgpXG5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgIGFsbE91dHB1dCA9IFtdXG4gICAgICBzdGRvdXQgPSAob3V0cHV0KSA9PiBhbGxPdXRwdXQucHVzaChvdXRwdXQpXG4gICAgICBzdGRlcnIgPSAob3V0cHV0KSA9PiBjb25zb2xlLmxvZyBvdXRwdXRcbiAgICAgIGV4aXQgPSAoY29kZSkgPT4gcmVzb2x2ZShAaGFuZGxlQ29tcGxldGlvblJlc3VsdChhbGxPdXRwdXQuam9pbignXFxuJyksIGNvZGUsIHByZWZpeCkpXG4gICAgICBidWZmZXJlZFByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKHtjb21tYW5kLCBhcmdzLCBvcHRpb25zLCBzdGRvdXQsIHN0ZGVyciwgZXhpdH0pXG4gICAgICBidWZmZXJlZFByb2Nlc3MucHJvY2Vzcy5zdGRpbi5zZXRFbmNvZGluZyA9ICd1dGYtOCc7XG4gICAgICBidWZmZXJlZFByb2Nlc3MucHJvY2Vzcy5zdGRpbi53cml0ZShlZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4uZW5kKClcblxuICBjb252ZXJ0Q29tcGxldGlvbkxpbmU6IChsaW5lLCBwcmVmaXgpIC0+XG4gICAgY29udGVudFJlID0gL15DT01QTEVUSU9OOiAoLiopL1xuICAgIFtsaW5lLCBjb250ZW50XSA9IGxpbmUubWF0Y2ggY29udGVudFJlXG4gICAgYmFzaWNJbmZvUmUgPSAvXiguKj8pIDogKC4qKS9cbiAgICBtYXRjaCA9IGNvbnRlbnQubWF0Y2ggYmFzaWNJbmZvUmVcbiAgICByZXR1cm4ge3RleHQ6IGNvbnRlbnR9IHVubGVzcyBtYXRjaD9cblxuICAgIFtjb250ZW50LCBiYXNpY0luZm8sIGNvbXBsZXRpb25BbmRDb21tZW50XSA9IG1hdGNoXG4gICAgY29tbWVudFJlID0gLyg/OiA6ICguKikpPyQvXG4gICAgW2NvbXBsZXRpb24sIGNvbW1lbnRdID0gY29tcGxldGlvbkFuZENvbW1lbnQuc3BsaXQgY29tbWVudFJlXG4gICAgcmV0dXJuVHlwZVJlID0gL15cXFsjKC4qPykjXFxdL1xuICAgIHJldHVyblR5cGUgPSBjb21wbGV0aW9uLm1hdGNoKHJldHVyblR5cGVSZSk/WzFdXG4gICAgY29uc3RNZW1GdW5jUmUgPSAvXFxbIyBjb25zdCNcXF0kL1xuICAgIGlzQ29uc3RNZW1GdW5jID0gY29uc3RNZW1GdW5jUmUudGVzdCBjb21wbGV0aW9uXG4gICAgaW5mb1RhZ3NSZSA9IC9cXFsjKC4qPykjXFxdL2dcbiAgICBjb21wbGV0aW9uID0gY29tcGxldGlvbi5yZXBsYWNlIGluZm9UYWdzUmUsICcnXG4gICAgYXJndW1lbnRzUmUgPSAvPCMoLio/KSM+L2dcbiAgICBvcHRpb25hbEFyZ3VtZW50c1N0YXJ0ID0gY29tcGxldGlvbi5pbmRleE9mICd7IydcbiAgICBjb21wbGV0aW9uID0gY29tcGxldGlvbi5yZXBsYWNlIC9cXHsjL2csICcnXG4gICAgY29tcGxldGlvbiA9IGNvbXBsZXRpb24ucmVwbGFjZSAvI1xcfS9nLCAnJ1xuICAgIGluZGV4ID0gMFxuICAgIGNvbXBsZXRpb24gPSBjb21wbGV0aW9uLnJlcGxhY2UgYXJndW1lbnRzUmUsIChtYXRjaCwgYXJnLCBvZmZzZXQpIC0+XG4gICAgICBpbmRleCsrXG4gICAgICBpZiBvcHRpb25hbEFyZ3VtZW50c1N0YXJ0ID4gMCBhbmQgb2Zmc2V0ID4gb3B0aW9uYWxBcmd1bWVudHNTdGFydFxuICAgICAgICByZXR1cm4gXCIkeyN7aW5kZXh9Om9wdGlvbmFsICN7YXJnfX1cIlxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gXCIkeyN7aW5kZXh9OiN7YXJnfX1cIlxuXG4gICAgc3VnZ2VzdGlvbiA9IHt9XG4gICAgc3VnZ2VzdGlvbi5sZWZ0TGFiZWwgPSByZXR1cm5UeXBlIGlmIHJldHVyblR5cGU/XG4gICAgaWYgaW5kZXggPiAwXG4gICAgICBzdWdnZXN0aW9uLnNuaXBwZXQgPSBjb21wbGV0aW9uXG4gICAgZWxzZVxuICAgICAgc3VnZ2VzdGlvbi50ZXh0ID0gY29tcGxldGlvblxuICAgIGlmIGlzQ29uc3RNZW1GdW5jXG4gICAgICBzdWdnZXN0aW9uLmRpc3BsYXlUZXh0ID0gY29tcGxldGlvbiArICcgY29uc3QnXG4gICAgc3VnZ2VzdGlvbi5kZXNjcmlwdGlvbiA9IGNvbW1lbnQgaWYgY29tbWVudD9cbiAgICBzdWdnZXN0aW9uLnJlcGxhY2VtZW50UHJlZml4ID0gcHJlZml4XG4gICAgc3VnZ2VzdGlvblxuXG4gIGhhbmRsZUNvbXBsZXRpb25SZXN1bHQ6IChyZXN1bHQsIHJldHVybkNvZGUsIHByZWZpeCkgLT5cbiAgICBpZiByZXR1cm5Db2RlIGlzIG5vdCAwXG4gICAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pZ25vcmVDbGFuZ0Vycm9yc1wiXG4gICAgIyBGaW5kIGFsbCBjb21wbGV0aW9ucyB0aGF0IG1hdGNoIG91ciBwcmVmaXggaW4gT05FIHJlZ2V4XG4gICAgIyBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucy5cbiAgICBjb21wbGV0aW9uc1JlID0gbmV3IFJlZ0V4cChcIl5DT01QTEVUSU9OOiAoXCIgKyBwcmVmaXggKyBcIi4qKSRcIiwgXCJtZ1wiKVxuICAgIG91dHB1dExpbmVzID0gcmVzdWx0Lm1hdGNoKGNvbXBsZXRpb25zUmUpXG5cbiAgICBpZiBvdXRwdXRMaW5lcz9cbiAgICAgICAgcmV0dXJuIChAY29udmVydENvbXBsZXRpb25MaW5lKGxpbmUsIHByZWZpeCkgZm9yIGxpbmUgaW4gb3V0cHV0TGluZXMpXG4gICAgZWxzZVxuICAgICAgICByZXR1cm4gW11cblxuICBidWlsZENsYW5nQXJnczogKGVkaXRvciwgcm93LCBjb2x1bW4sIGxhbmd1YWdlKSAtPlxuICAgIHN0ZCA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5zdGQgI3tsYW5ndWFnZX1cIlxuICAgIGN1cnJlbnREaXIgPSBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICBwY2hGaWxlUHJlZml4ID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnBjaEZpbGVQcmVmaXhcIlxuICAgIHBjaEZpbGUgPSBbcGNoRmlsZVByZWZpeCwgbGFuZ3VhZ2UsIFwicGNoXCJdLmpvaW4gJy4nXG4gICAgcGNoUGF0aCA9IHBhdGguam9pbihjdXJyZW50RGlyLCBwY2hGaWxlKVxuXG4gICAgYXJncyA9IFtcIi1mc3ludGF4LW9ubHlcIl1cbiAgICBhcmdzLnB1c2ggXCIteCN7bGFuZ3VhZ2V9XCJcbiAgICBhcmdzLnB1c2ggXCItc3RkPSN7c3RkfVwiIGlmIHN0ZFxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItY29kZS1jb21wbGV0aW9uLW1hY3Jvc1wiXG4gICAgYXJncy5wdXNoIFwiLVhjbGFuZ1wiLCBcIi1jb2RlLWNvbXBsZXRpb24tYXQ9LToje3JvdyArIDF9OiN7Y29sdW1uICsgMX1cIlxuICAgIGFyZ3MucHVzaChcIi1pbmNsdWRlLXBjaFwiLCBwY2hQYXRoKSBpZiBleGlzdHNTeW5jKHBjaFBhdGgpXG4gICAgYXJncy5wdXNoIFwiLUkje2l9XCIgZm9yIGkgaW4gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmluY2x1ZGVQYXRoc1wiXG4gICAgYXJncy5wdXNoIFwiLUkje2N1cnJlbnREaXJ9XCJcblxuICAgIGlmIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlRG9jdW1lbnRhdGlvblwiXG4gICAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiLWNvZGUtY29tcGxldGlvbi1icmllZi1jb21tZW50c1wiXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaW5jbHVkZU5vbkRveHlnZW5Db21tZW50c0FzRG9jdW1lbnRhdGlvblwiXG4gICAgICAgIGFyZ3MucHVzaCBcIi1mcGFyc2UtYWxsLWNvbW1lbnRzXCJcbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlU3lzdGVtSGVhZGVyc0RvY3VtZW50YXRpb25cIlxuICAgICAgICBhcmdzLnB1c2ggXCItZnJldGFpbi1jb21tZW50cy1mcm9tLXN5c3RlbS1oZWFkZXJzXCJcblxuICAgIHRyeVxuICAgICAgY2xhbmdmbGFncyA9IENsYW5nRmxhZ3MuZ2V0Q2xhbmdGbGFncyhlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgYXJncyA9IGFyZ3MuY29uY2F0IGNsYW5nZmxhZ3MgaWYgY2xhbmdmbGFnc1xuICAgIGNhdGNoIGVycm9yXG4gICAgICBjb25zb2xlLmxvZyBlcnJvclxuXG4gICAgYXJncy5wdXNoIFwiLVwiXG4gICAgYXJnc1xuXG5MYW5ndWFnZVV0aWwgPVxuICBnZXRTb3VyY2VTY29wZUxhbmc6IChzY29wZVNvdXJjZSwgc2NvcGVzQXJyYXkpIC0+XG4gICAgZm9yIHNjb3BlIGluIHNjb3Blc0FycmF5XG4gICAgICByZXR1cm4gc2NvcGVTb3VyY2Vbc2NvcGVdIGlmIHNjb3BlIG9mIHNjb3BlU291cmNlXG4gICAgbnVsbFxuXG4gIHByZWZpeEF0UG9zaXRpb246IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHJlZ2V4ID0gL1xcdyskL1xuICAgIGxpbmUgPSBlZGl0b3IuZ2V0VGV4dEluUmFuZ2UoW1tidWZmZXJQb3NpdGlvbi5yb3csIDBdLCBidWZmZXJQb3NpdGlvbl0pXG4gICAgbGluZS5tYXRjaChyZWdleCk/WzBdIG9yICcnXG5cbiAgbmVhcmVzdFN5bWJvbFBvc2l0aW9uOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICByZWdleCA9IC8oXFxXKylcXHcqJC9cbiAgICBsaW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKVxuICAgIG1hdGNoZXMgPSBsaW5lLm1hdGNoKHJlZ2V4KVxuICAgIGlmIG1hdGNoZXNcbiAgICAgIHN5bWJvbCA9IG1hdGNoZXNbMV1cbiAgICAgIHN5bWJvbENvbHVtbiA9IG1hdGNoZXNbMF0uaW5kZXhPZihzeW1ib2wpICsgc3ltYm9sLmxlbmd0aCArIChsaW5lLmxlbmd0aCAtIG1hdGNoZXNbMF0ubGVuZ3RoKVxuICAgICAgW25ldyBQb2ludChidWZmZXJQb3NpdGlvbi5yb3csIHN5bWJvbENvbHVtbiksc3ltYm9sWy0xLi5dXVxuICAgIGVsc2VcbiAgICAgIFtidWZmZXJQb3NpdGlvbiwnJ11cbiJdfQ==
