(function() {
  var BufferedProcess, ClangFlags, ClangProvider, CompositeDisposable, Disposable, File, LocationSelectList, Selection, defaultPrecompiled, existsSync, path, ref, spawn, util;

  ref = require('atom'), CompositeDisposable = ref.CompositeDisposable, Disposable = ref.Disposable, BufferedProcess = ref.BufferedProcess, Selection = ref.Selection, File = ref.File;

  util = require('./util');

  spawn = require('child_process').spawn;

  path = require('path');

  existsSync = require('fs').existsSync;

  ClangFlags = require('clang-flags');

  LocationSelectList = require('./location-select-view.coffee');

  ClangProvider = null;

  defaultPrecompiled = require('./defaultPrecompiled');

  module.exports = {
    config: {
      clangCommand: {
        type: 'string',
        "default": 'clang'
      },
      includePaths: {
        type: 'array',
        "default": ['.'],
        items: {
          type: 'string'
        }
      },
      pchFilePrefix: {
        type: 'string',
        "default": '.stdafx'
      },
      ignoreClangErrors: {
        type: 'boolean',
        "default": true
      },
      includeDocumentation: {
        type: 'boolean',
        "default": true
      },
      includeSystemHeadersDocumentation: {
        type: 'boolean',
        "default": false,
        description: "**WARNING**: if there are any PCHs compiled without this option, you will have to delete them and generate them again"
      },
      includeNonDoxygenCommentsAsDocumentation: {
        type: 'boolean',
        "default": false
      },
      "std c++": {
        type: 'string',
        "default": "c++11"
      },
      "std c": {
        type: 'string',
        "default": "c99"
      },
      "preCompiledHeaders c++": {
        type: 'array',
        "default": defaultPrecompiled.cpp,
        item: {
          type: 'string'
        }
      },
      "preCompiledHeaders c": {
        type: 'array',
        "default": defaultPrecompiled.c,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c": {
        type: 'array',
        "default": defaultPrecompiled.objc,
        items: {
          type: 'string'
        }
      },
      "preCompiledHeaders objective-c++": {
        type: 'array',
        "default": defaultPrecompiled.objcpp,
        items: {
          type: 'string'
        }
      }
    },
    deactivationDisposables: null,
    activate: function(state) {
      this.deactivationDisposables = new CompositeDisposable;
      this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:emit-pch': (function(_this) {
          return function() {
            return _this.emitPch(atom.workspace.getActiveTextEditor());
          };
        })(this)
      }));
      return this.deactivationDisposables.add(atom.commands.add('atom-text-editor:not([mini])', {
        'autocomplete-clang:go-declaration': (function(_this) {
          return function(e) {
            return _this.goDeclaration(atom.workspace.getActiveTextEditor(), e);
          };
        })(this)
      }));
    },
    goDeclaration: function(editor, e) {
      var args, command, lang, options, term;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        e.abortKeyBinding();
        return;
      }
      command = atom.config.get("autocomplete-clang.clangCommand");
      editor.selectWordsContainingCursors();
      term = editor.getSelectedText();
      args = this.buildGoDeclarationCommandArgs(editor, lang, term);
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
            return resolve(_this.handleGoDeclarationResult(editor, {
              output: allOutput.join("\n"),
              term: term
            }, code));
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
    },
    emitPch: function(editor) {
      var args, clang_command, emit_process, h, headers, headersInput, lang;
      lang = util.getFirstCursorSourceScopeLang(editor);
      if (!lang) {
        alert("autocomplete-clang:emit-pch\nError: Incompatible Language");
        return;
      }
      clang_command = atom.config.get("autocomplete-clang.clangCommand");
      args = this.buildEmitPchCommandArgs(editor, lang);
      emit_process = spawn(clang_command, args);
      emit_process.on("exit", (function(_this) {
        return function(code) {
          return _this.handleEmitPchResult(code);
        };
      })(this));
      emit_process.stdout.on('data', function(data) {
        return console.log("out:\n" + data.toString());
      });
      emit_process.stderr.on('data', function(data) {
        return console.log("err:\n" + data.toString());
      });
      headers = atom.config.get("autocomplete-clang.preCompiledHeaders " + lang);
      headersInput = ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = headers.length; j < len; j++) {
          h = headers[j];
          results.push("#include <" + h + ">");
        }
        return results;
      })()).join("\n");
      emit_process.stdin.write(headersInput);
      return emit_process.stdin.end();
    },
    buildGoDeclarationCommandArgs: function(editor, language, term) {
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
      args.push("-Xclang", "-ast-dump");
      args.push("-Xclang", "-ast-dump-filter");
      args.push("-Xclang", "" + term);
      if (existsSync(pchPath)) {
        args.push("-include-pch", pchPath);
      }
      ref1 = atom.config.get("autocomplete-clang.includePaths");
      for (j = 0, len = ref1.length; j < len; j++) {
        i = ref1[j];
        args.push("-I" + i);
      }
      args.push("-I" + currentDir);
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
    },
    buildEmitPchCommandArgs: function(editor, lang) {
      var args, dir, file, i, include_paths, pch, pch_file_prefix, std;
      dir = path.dirname(editor.getPath());
      pch_file_prefix = atom.config.get("autocomplete-clang.pchFilePrefix");
      file = [pch_file_prefix, lang, "pch"].join('.');
      pch = path.join(dir, file);
      std = atom.config.get("autocomplete-clang.std " + lang);
      args = ["-x" + lang + "-header", "-Xclang", '-emit-pch', '-o', pch];
      if (std) {
        args = args.concat(["-std=" + std]);
      }
      include_paths = atom.config.get("autocomplete-clang.includePaths");
      args = args.concat((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = include_paths.length; j < len; j++) {
          i = include_paths[j];
          results.push("-I" + i);
        }
        return results;
      })());
      if (atom.config.get("autocomplete-clang.includeDocumentation")) {
        args.push("-Xclang", "-code-completion-brief-comments");
        if (atom.config.get("autocomplete-clang.includeNonDoxygenCommentsAsDocumentation")) {
          args.push("-fparse-all-comments");
        }
        if (atom.config.get("autocomplete-clang.includeSystemHeadersDocumentation")) {
          args.push("-fretain-comments-from-system-headers");
        }
      }
      args = args.concat(["-"]);
      return args;
    },
    handleGoDeclarationResult: function(editor, result, returnCode) {
      var list, places;
      if (returnCode === !0) {
        if (!atom.config.get("autocomplete-clang.ignoreClangErrors")) {
          return;
        }
      }
      places = this.parseAstDump(result['output'], result['term']);
      if (places.length === 1) {
        return this.goToLocation(editor, places.pop());
      } else if (places.length > 1) {
        list = new LocationSelectList(editor, this.goToLocation);
        return list.setItems(places);
      }
    },
    goToLocation: function(editor, arg) {
      var col, f, file, line;
      file = arg[0], line = arg[1], col = arg[2];
      if (file === '<stdin>') {
        return editor.setCursorBufferPosition([line - 1, col - 1]);
      }
      if (file.startsWith(".")) {
        file = path.join(editor.getDirectoryPath(), file);
      }
      f = new File(file);
      return f.exists().then(function(result) {
        if (result) {
          return atom.workspace.open(file, {
            initialLine: line - 1,
            initialColumn: col - 1
          });
        }
      });
    },
    parseAstDump: function(aststring, term) {
      var _, candidate, candidates, col, declRangeStr, declTerms, file, j, len, line, lines, match, places, posStr, positions, ref1, ref2;
      candidates = aststring.split('\n\n');
      places = [];
      for (j = 0, len = candidates.length; j < len; j++) {
        candidate = candidates[j];
        match = candidate.match(RegExp("^Dumping\\s(?:[A-Za-z_]*::)*?" + term + ":"));
        if (match !== null) {
          lines = candidate.split('\n');
          if (lines.length < 2) {
            continue;
          }
          declTerms = lines[1].split(' ');
          _ = declTerms[0], _ = declTerms[1], declRangeStr = declTerms[2], _ = declTerms[3], posStr = declTerms[4];
          if (declRangeStr === "prev") {
            _ = declTerms[0], _ = declTerms[1], _ = declTerms[2], _ = declTerms[3], declRangeStr = declTerms[4], _ = declTerms[5], posStr = declTerms[6];
          }
          ref1 = declRangeStr.slice(1, -1).split(':'), file = ref1[0], line = ref1[1], col = ref1[2];
          positions = posStr.match(/(line|col):([0-9]+)(?::([0-9]+))?/);
          if (positions) {
            if (positions[1] === 'line') {
              ref2 = [positions[2], positions[3]], line = ref2[0], col = ref2[1];
            } else {
              col = positions[2];
            }
          }
          places.push([file, Number(line), Number(col)]);
        }
      }
      return places;
    },
    handleEmitPchResult: function(code) {
      if (!code) {
        alert("Emiting precompiled header has successfully finished");
        return;
      }
      return alert(("Emiting precompiled header exit with " + code + "\n") + "See console for detailed error message");
    },
    deactivate: function() {
      this.deactivationDisposables.dispose();
      return console.log("autocomplete-clang deactivated");
    },
    provide: function() {
      if (ClangProvider == null) {
        ClangProvider = require('./clang-provider');
      }
      return new ClangProvider();
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9hdXRvY29tcGxldGUtY2xhbmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFrRSxPQUFBLENBQVEsTUFBUixDQUFsRSxFQUFDLDZDQUFELEVBQXFCLDJCQUFyQixFQUFnQyxxQ0FBaEMsRUFBZ0QseUJBQWhELEVBQTBEOztFQUMxRCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBUyxPQUFBLENBQVEsZUFBUjs7RUFDVixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sYUFBYyxPQUFBLENBQVEsSUFBUjs7RUFDZixVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVI7O0VBRWIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLCtCQUFSOztFQUVyQixhQUFBLEdBQWdCOztFQUNoQixrQkFBQSxHQUFxQixPQUFBLENBQVEsc0JBQVI7O0VBRXJCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FEVDtPQURGO01BR0EsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsR0FBRCxDQURUO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtPQUpGO01BUUEsYUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFNBRFQ7T0FURjtNQVdBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQVpGO01BY0Esb0JBQUEsRUFDRTtRQUFBLElBQUEsRUFB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QXdCLHNCQUF4Qjs7VUFDQSxPQUFrQixZQUFhLGFBQU0sQ0FBQyxLQUFwQixDQUEwQixHQUExQixDQUFsQixFQUFDLGNBQUQsRUFBTSxjQUFOLEVBQVc7VUFDWCxTQUFBLEdBQVksTUFBTSxDQUFDLEtBQVAsQ0FBYSxtQ0FBYjtVQUNaLElBQUcsU0FBSDtZQUNFLElBQUcsU0FBVSxDQUFBLENBQUEsQ0FBVixLQUFnQixNQUFuQjtjQUNFLE9BQWEsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUFYLEVBQWUsU0FBVSxDQUFBLENBQUEsQ0FBekIsQ0FBYixFQUFDLGNBQUQsRUFBTSxjQURSO2FBQUEsTUFBQTtjQUdFLEdBQUEsR0FBTSxTQUFVLENBQUEsQ0FBQSxFQUhsQjthQURGOztVQUtBLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sTUFBQSxDQUFPLElBQVAsQ0FBUCxFQUFxQixNQUFBLENBQU8sR0FBUCxDQUFyQixDQUFaLEVBYkY7O0FBRkY7QUFnQkEsYUFBTztJQW5CSyxDQXRLZDtJQTJMQSxtQkFBQSxFQUFxQixTQUFDLElBQUQ7TUFDbkIsSUFBQSxDQUFPLElBQVA7UUFDRSxLQUFBLENBQU0sc0RBQU47QUFDQSxlQUZGOzthQUdBLEtBQUEsQ0FBTSxDQUFBLHVDQUFBLEdBQXdDLElBQXhDLEdBQTZDLElBQTdDLENBQUEsR0FDSix3Q0FERjtJQUptQixDQTNMckI7SUFrTUEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsdUJBQXVCLENBQUMsT0FBekIsQ0FBQTthQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksZ0NBQVo7SUFGVSxDQWxNWjtJQXNNQSxPQUFBLEVBQVMsU0FBQTs7UUFDUCxnQkFBaUIsT0FBQSxDQUFRLGtCQUFSOzthQUNiLElBQUEsYUFBQSxDQUFBO0lBRkcsQ0F0TVQ7O0FBYkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZSxEaXNwb3NhYmxlLEJ1ZmZlcmVkUHJvY2VzcyxTZWxlY3Rpb24sRmlsZX0gPSByZXF1aXJlICdhdG9tJ1xudXRpbCA9IHJlcXVpcmUgJy4vdXRpbCdcbntzcGF3bn0gPSByZXF1aXJlICdjaGlsZF9wcm9jZXNzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57ZXhpc3RzU3luY30gPSByZXF1aXJlICdmcydcbkNsYW5nRmxhZ3MgPSByZXF1aXJlICdjbGFuZy1mbGFncydcblxuTG9jYXRpb25TZWxlY3RMaXN0ID0gcmVxdWlyZSAnLi9sb2NhdGlvbi1zZWxlY3Qtdmlldy5jb2ZmZWUnXG5cbkNsYW5nUHJvdmlkZXIgPSBudWxsXG5kZWZhdWx0UHJlY29tcGlsZWQgPSByZXF1aXJlICcuL2RlZmF1bHRQcmVjb21waWxlZCdcblxubW9kdWxlLmV4cG9ydHMgPVxuICBjb25maWc6XG4gICAgY2xhbmdDb21tYW5kOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6ICdjbGFuZydcbiAgICBpbmNsdWRlUGF0aHM6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBbJy4nXVxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgcGNoRmlsZVByZWZpeDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnLnN0ZGFmeCdcbiAgICBpZ25vcmVDbGFuZ0Vycm9yczpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIGluY2x1ZGVEb2N1bWVudGF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgaW5jbHVkZVN5c3RlbUhlYWRlcnNEb2N1bWVudGF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiKipXQVJOSU5HKio6IGlmIHRoZXJlIGFyZSBhbnkgUENIcyBjb21waWxlZCB3aXRob3V0IHRoaXMgb3B0aW9uLCB5b3Ugd2lsbCBoYXZlIHRvIGRlbGV0ZSB0aGVtIGFuZCBnZW5lcmF0ZSB0aGVtIGFnYWluXCJcbiAgICBpbmNsdWRlTm9uRG94eWdlbkNvbW1lbnRzQXNEb2N1bWVudGF0aW9uOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgIFwic3RkIGMrK1wiOlxuICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIGRlZmF1bHQ6IFwiYysrMTFcIlxuICAgIFwic3RkIGNcIjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImM5OVwiXG4gICAgXCJwcmVDb21waWxlZEhlYWRlcnMgYysrXCI6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0UHJlY29tcGlsZWQuY3BwXG4gICAgICBpdGVtOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIFwicHJlQ29tcGlsZWRIZWFkZXJzIGNcIjpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRQcmVjb21waWxlZC5jXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBcInByZUNvbXBpbGVkSGVhZGVycyBvYmplY3RpdmUtY1wiOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogZGVmYXVsdFByZWNvbXBpbGVkLm9iamNcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIFwicHJlQ29tcGlsZWRIZWFkZXJzIG9iamVjdGl2ZS1jKytcIjpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRQcmVjb21waWxlZC5vYmpjcHBcbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuXG4gIGRlYWN0aXZhdGlvbkRpc3Bvc2FibGVzOiBudWxsXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAZGVhY3RpdmF0aW9uRGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLFxuICAgICAgJ2F1dG9jb21wbGV0ZS1jbGFuZzplbWl0LXBjaCc6ID0+XG4gICAgICAgIEBlbWl0UGNoIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3I6bm90KFttaW5pXSknLFxuICAgICAgJ2F1dG9jb21wbGV0ZS1jbGFuZzpnby1kZWNsYXJhdGlvbic6IChlKT0+IEBnb0RlY2xhcmF0aW9uIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSxlXG5cbiAgZ29EZWNsYXJhdGlvbjogKGVkaXRvcixlKS0+XG4gICAgbGFuZyA9IHV0aWwuZ2V0Rmlyc3RDdXJzb3JTb3VyY2VTY29wZUxhbmcgZWRpdG9yXG4gICAgdW5sZXNzIGxhbmdcbiAgICAgIGUuYWJvcnRLZXlCaW5kaW5nKClcbiAgICAgIHJldHVyblxuICAgIGNvbW1hbmQgPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuY2xhbmdDb21tYW5kXCJcbiAgICBlZGl0b3Iuc2VsZWN0V29yZHNDb250YWluaW5nQ3Vyc29ycygpO1xuICAgIHRlcm0gPSBlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcbiAgICBhcmdzID0gQGJ1aWxkR29EZWNsYXJhdGlvbkNvbW1hbmRBcmdzKGVkaXRvcixsYW5nLHRlcm0pXG4gICAgb3B0aW9ucyA9XG4gICAgICBjd2Q6IHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgICAgaW5wdXQ6IGVkaXRvci5nZXRUZXh0KClcbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgIGFsbE91dHB1dCA9IFtdXG4gICAgICBzdGRvdXQgPSAob3V0cHV0KSA9PiBhbGxPdXRwdXQucHVzaChvdXRwdXQpXG4gICAgICBzdGRlcnIgPSAob3V0cHV0KSA9PiBjb25zb2xlLmxvZyBvdXRwdXRcbiAgICAgIGV4aXQgPSAoY29kZSkgPT5cbiAgICAgICAgcmVzb2x2ZShAaGFuZGxlR29EZWNsYXJhdGlvblJlc3VsdChlZGl0b3IsIHtvdXRwdXQ6YWxsT3V0cHV0LmpvaW4oXCJcXG5cIiksdGVybTp0ZXJtfSwgY29kZSkpXG4gICAgICBidWZmZXJlZFByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzKHtjb21tYW5kLCBhcmdzLCBvcHRpb25zLCBzdGRvdXQsIHN0ZGVyciwgZXhpdH0pXG4gICAgICBidWZmZXJlZFByb2Nlc3MucHJvY2Vzcy5zdGRpbi5zZXRFbmNvZGluZyA9ICd1dGYtOCc7XG4gICAgICBidWZmZXJlZFByb2Nlc3MucHJvY2Vzcy5zdGRpbi53cml0ZShlZGl0b3IuZ2V0VGV4dCgpKVxuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4uZW5kKClcblxuICBlbWl0UGNoOiAoZWRpdG9yKS0+XG4gICAgbGFuZyA9IHV0aWwuZ2V0Rmlyc3RDdXJzb3JTb3VyY2VTY29wZUxhbmcgZWRpdG9yXG4gICAgdW5sZXNzIGxhbmdcbiAgICAgIGFsZXJ0IFwiYXV0b2NvbXBsZXRlLWNsYW5nOmVtaXQtcGNoXFxuRXJyb3I6IEluY29tcGF0aWJsZSBMYW5ndWFnZVwiXG4gICAgICByZXR1cm5cbiAgICBjbGFuZ19jb21tYW5kID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmNsYW5nQ29tbWFuZFwiXG4gICAgYXJncyA9IEBidWlsZEVtaXRQY2hDb21tYW5kQXJncyBlZGl0b3IsbGFuZ1xuICAgIGVtaXRfcHJvY2VzcyA9IHNwYXduIGNsYW5nX2NvbW1hbmQsYXJnc1xuICAgIGVtaXRfcHJvY2Vzcy5vbiBcImV4aXRcIiwgKGNvZGUpID0+IEBoYW5kbGVFbWl0UGNoUmVzdWx0IGNvZGVcbiAgICBlbWl0X3Byb2Nlc3Muc3Rkb3V0Lm9uICdkYXRhJywgKGRhdGEpLT4gY29uc29sZS5sb2cgXCJvdXQ6XFxuXCIrZGF0YS50b1N0cmluZygpXG4gICAgZW1pdF9wcm9jZXNzLnN0ZGVyci5vbiAnZGF0YScsIChkYXRhKS0+IGNvbnNvbGUubG9nIFwiZXJyOlxcblwiK2RhdGEudG9TdHJpbmcoKVxuICAgIGhlYWRlcnMgPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcucHJlQ29tcGlsZWRIZWFkZXJzICN7bGFuZ31cIlxuICAgIGhlYWRlcnNJbnB1dCA9IChcIiNpbmNsdWRlIDwje2h9PlwiIGZvciBoIGluIGhlYWRlcnMpLmpvaW4gXCJcXG5cIlxuICAgIGVtaXRfcHJvY2Vzcy5zdGRpbi53cml0ZSBoZWFkZXJzSW5wdXRcbiAgICBlbWl0X3Byb2Nlc3Muc3RkaW4uZW5kKClcblxuICBidWlsZEdvRGVjbGFyYXRpb25Db21tYW5kQXJnczogKGVkaXRvcixsYW5ndWFnZSx0ZXJtKS0+XG4gICAgc3RkID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnN0ZCAje2xhbmd1YWdlfVwiXG4gICAgY3VycmVudERpciA9IHBhdGguZGlybmFtZShlZGl0b3IuZ2V0UGF0aCgpKVxuICAgIHBjaEZpbGVQcmVmaXggPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcucGNoRmlsZVByZWZpeFwiXG4gICAgcGNoRmlsZSA9IFtwY2hGaWxlUHJlZml4LCBsYW5ndWFnZSwgXCJwY2hcIl0uam9pbiAnLidcbiAgICBwY2hQYXRoID0gcGF0aC5qb2luKGN1cnJlbnREaXIsIHBjaEZpbGUpXG5cbiAgICBhcmdzID0gW1wiLWZzeW50YXgtb25seVwiXVxuICAgIGFyZ3MucHVzaCBcIi14I3tsYW5ndWFnZX1cIlxuICAgIGFyZ3MucHVzaCBcIi1zdGQ9I3tzdGR9XCIgaWYgc3RkXG4gICAgYXJncy5wdXNoIFwiLVhjbGFuZ1wiLCBcIi1hc3QtZHVtcFwiXG4gICAgYXJncy5wdXNoIFwiLVhjbGFuZ1wiLCBcIi1hc3QtZHVtcC1maWx0ZXJcIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCIje3Rlcm19XCJcbiAgICBhcmdzLnB1c2goXCItaW5jbHVkZS1wY2hcIiwgcGNoUGF0aCkgaWYgZXhpc3RzU3luYyhwY2hQYXRoKVxuICAgIGFyZ3MucHVzaCBcIi1JI3tpfVwiIGZvciBpIGluIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlUGF0aHNcIlxuICAgIGFyZ3MucHVzaCBcIi1JI3tjdXJyZW50RGlyfVwiXG5cbiAgICB0cnlcbiAgICAgIGNsYW5nZmxhZ3MgPSBDbGFuZ0ZsYWdzLmdldENsYW5nRmxhZ3MoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIGFyZ3MgPSBhcmdzLmNvbmNhdCBjbGFuZ2ZsYWdzIGlmIGNsYW5nZmxhZ3NcbiAgICBjYXRjaCBlcnJvclxuICAgICAgY29uc29sZS5sb2cgZXJyb3JcblxuICAgIGFyZ3MucHVzaCBcIi1cIlxuICAgIGFyZ3NcblxuICBidWlsZEVtaXRQY2hDb21tYW5kQXJnczogKGVkaXRvcixsYW5nKS0+XG4gICAgZGlyID0gcGF0aC5kaXJuYW1lIGVkaXRvci5nZXRQYXRoKClcbiAgICBwY2hfZmlsZV9wcmVmaXggPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcucGNoRmlsZVByZWZpeFwiXG4gICAgZmlsZSA9IFtwY2hfZmlsZV9wcmVmaXgsIGxhbmcsIFwicGNoXCJdLmpvaW4gJy4nXG4gICAgcGNoID0gcGF0aC5qb2luIGRpcixmaWxlXG4gICAgc3RkID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnN0ZCAje2xhbmd9XCJcbiAgICBhcmdzID0gW1wiLXgje2xhbmd9LWhlYWRlclwiLCBcIi1YY2xhbmdcIiwgJy1lbWl0LXBjaCcsICctbycsIHBjaF1cbiAgICBhcmdzID0gYXJncy5jb25jYXQgW1wiLXN0ZD0je3N0ZH1cIl0gaWYgc3RkXG4gICAgaW5jbHVkZV9wYXRocyA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlUGF0aHNcIlxuICAgIGFyZ3MgPSBhcmdzLmNvbmNhdCAoXCItSSN7aX1cIiBmb3IgaSBpbiBpbmNsdWRlX3BhdGhzKVxuXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmluY2x1ZGVEb2N1bWVudGF0aW9uXCJcbiAgICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItY29kZS1jb21wbGV0aW9uLWJyaWVmLWNvbW1lbnRzXCJcbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlTm9uRG94eWdlbkNvbW1lbnRzQXNEb2N1bWVudGF0aW9uXCJcbiAgICAgICAgYXJncy5wdXNoIFwiLWZwYXJzZS1hbGwtY29tbWVudHNcIlxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmluY2x1ZGVTeXN0ZW1IZWFkZXJzRG9jdW1lbnRhdGlvblwiXG4gICAgICAgIGFyZ3MucHVzaCBcIi1mcmV0YWluLWNvbW1lbnRzLWZyb20tc3lzdGVtLWhlYWRlcnNcIlxuXG4gICAgYXJncyA9IGFyZ3MuY29uY2F0IFtcIi1cIl1cbiAgICByZXR1cm4gYXJnc1xuXG4gIGhhbmRsZUdvRGVjbGFyYXRpb25SZXN1bHQ6IChlZGl0b3IsIHJlc3VsdCwgcmV0dXJuQ29kZSktPlxuICAgIGlmIHJldHVybkNvZGUgaXMgbm90IDBcbiAgICAgIHJldHVybiB1bmxlc3MgYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmlnbm9yZUNsYW5nRXJyb3JzXCJcbiAgICBwbGFjZXMgPSBAcGFyc2VBc3REdW1wIHJlc3VsdFsnb3V0cHV0J10sIHJlc3VsdFsndGVybSddXG4gICAgaWYgcGxhY2VzLmxlbmd0aCBpcyAxXG4gICAgICAgIEBnb1RvTG9jYXRpb24gZWRpdG9yLCBwbGFjZXMucG9wKClcbiAgICBlbHNlIGlmIHBsYWNlcy5sZW5ndGggPiAxXG4gICAgICAgIGxpc3QgPSBuZXcgTG9jYXRpb25TZWxlY3RMaXN0KGVkaXRvciwgQGdvVG9Mb2NhdGlvbilcbiAgICAgICAgbGlzdC5zZXRJdGVtcyhwbGFjZXMpXG5cbiAgZ29Ub0xvY2F0aW9uOiAoZWRpdG9yLCBbZmlsZSxsaW5lLGNvbF0pIC0+XG4gICAgaWYgZmlsZSBpcyAnPHN0ZGluPidcbiAgICAgIHJldHVybiBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24gW2xpbmUtMSxjb2wtMV1cbiAgICBmaWxlID0gcGF0aC5qb2luIGVkaXRvci5nZXREaXJlY3RvcnlQYXRoKCksIGZpbGUgaWYgZmlsZS5zdGFydHNXaXRoKFwiLlwiKVxuICAgIGYgPSBuZXcgRmlsZSBmaWxlXG4gICAgZi5leGlzdHMoKS50aGVuIChyZXN1bHQpIC0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuIGZpbGUsIHtpbml0aWFsTGluZTpsaW5lLTEsIGluaXRpYWxDb2x1bW46Y29sLTF9IGlmIHJlc3VsdFxuXG4gIHBhcnNlQXN0RHVtcDogKGFzdHN0cmluZywgdGVybSktPlxuICAgIGNhbmRpZGF0ZXMgPSBhc3RzdHJpbmcuc3BsaXQgJ1xcblxcbidcbiAgICBwbGFjZXMgPSBbXVxuICAgIGZvciBjYW5kaWRhdGUgaW4gY2FuZGlkYXRlc1xuICAgICAgbWF0Y2ggPSBjYW5kaWRhdGUubWF0Y2ggLy8vXkR1bXBpbmdcXHMoPzpbQS1aYS16X10qOjopKj8je3Rlcm19Oi8vL1xuICAgICAgaWYgbWF0Y2ggaXNudCBudWxsXG4gICAgICAgIGxpbmVzID0gY2FuZGlkYXRlLnNwbGl0ICdcXG4nXG4gICAgICAgIGNvbnRpbnVlIGlmIGxpbmVzLmxlbmd0aCA8IDJcbiAgICAgICAgZGVjbFRlcm1zID0gbGluZXNbMV0uc3BsaXQgJyAnXG4gICAgICAgIFtfLF8sZGVjbFJhbmdlU3RyLF8scG9zU3RyLC4uLl0gPSBkZWNsVGVybXNcbiAgICAgICAgW18sXyxfLF8sZGVjbFJhbmdlU3RyLF8scG9zU3RyLC4uLl0gPSBkZWNsVGVybXMgaWYgZGVjbFJhbmdlU3RyIGlzIFwicHJldlwiXG4gICAgICAgIFtmaWxlLGxpbmUsY29sXSA9IGRlY2xSYW5nZVN0clsxLi4tMl0uc3BsaXQgJzonXG4gICAgICAgIHBvc2l0aW9ucyA9IHBvc1N0ci5tYXRjaCAvKGxpbmV8Y29sKTooWzAtOV0rKSg/OjooWzAtOV0rKSk/L1xuICAgICAgICBpZiBwb3NpdGlvbnNcbiAgICAgICAgICBpZiBwb3NpdGlvbnNbMV0gaXMgJ2xpbmUnXG4gICAgICAgICAgICBbbGluZSxjb2xdID0gW3Bvc2l0aW9uc1syXSwgcG9zaXRpb25zWzNdXVxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGNvbCA9IHBvc2l0aW9uc1syXVxuICAgICAgICBwbGFjZXMucHVzaCBbZmlsZSwoTnVtYmVyIGxpbmUpLChOdW1iZXIgY29sKV1cbiAgICByZXR1cm4gcGxhY2VzXG5cbiAgaGFuZGxlRW1pdFBjaFJlc3VsdDogKGNvZGUpLT5cbiAgICB1bmxlc3MgY29kZVxuICAgICAgYWxlcnQgXCJFbWl0aW5nIHByZWNvbXBpbGVkIGhlYWRlciBoYXMgc3VjY2Vzc2Z1bGx5IGZpbmlzaGVkXCJcbiAgICAgIHJldHVyblxuICAgIGFsZXJ0IFwiRW1pdGluZyBwcmVjb21waWxlZCBoZWFkZXIgZXhpdCB3aXRoICN7Y29kZX1cXG5cIitcbiAgICAgIFwiU2VlIGNvbnNvbGUgZm9yIGRldGFpbGVkIGVycm9yIG1lc3NhZ2VcIlxuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGRlYWN0aXZhdGlvbkRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgIGNvbnNvbGUubG9nIFwiYXV0b2NvbXBsZXRlLWNsYW5nIGRlYWN0aXZhdGVkXCJcblxuICBwcm92aWRlOiAtPlxuICAgIENsYW5nUHJvdmlkZXIgPz0gcmVxdWlyZSgnLi9jbGFuZy1wcm92aWRlcicpXG4gICAgbmV3IENsYW5nUHJvdmlkZXIoKVxuIl19
