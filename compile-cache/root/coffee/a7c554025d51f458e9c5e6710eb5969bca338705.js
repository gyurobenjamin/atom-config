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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9hdXRvY29tcGxldGUtY2xhbmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFrRSxPQUFBLENBQVEsTUFBUixDQUFsRSxFQUFDLDZDQUFELEVBQXFCLDJCQUFyQixFQUFnQyxxQ0FBaEMsRUFBZ0QseUJBQWhELEVBQTBEOztFQUMxRCxJQUFBLEdBQU8sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBUyxPQUFBLENBQVEsZUFBUjs7RUFDVixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sYUFBYyxPQUFBLENBQVEsSUFBUjs7RUFDZixVQUFBLEdBQWEsT0FBQSxDQUFRLGFBQVI7O0VBRWIsa0JBQUEsR0FBcUIsT0FBQSxDQUFRLCtCQUFSOztFQUVyQixhQUFBLEdBQWdCOztFQUNoQixrQkFBQSxHQUFxQixPQUFBLENBQVEsc0JBQVI7O0VBRXJCLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxNQUFBLEVBQ0U7TUFBQSxZQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FEVDtPQURGO01BR0EsWUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQUMsR0FBRCxDQURUO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtPQUpGO01BUUEsYUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFNBRFQ7T0FURjtNQVdBLGlCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtPQVpGO01BY0Esb0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO09BZkY7TUFpQkEsaUNBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLHVIQUZiO09BbEJGO01BcUJBLHdDQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQXRCRjtNQXdCQSxTQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FEVDtPQXpCRjtNQTJCQSxPQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtPQTVCRjtNQThCQSx3QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGtCQUFrQixDQUFDLEdBRDVCO1FBRUEsSUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtPQS9CRjtNQW1DQSxzQkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGtCQUFrQixDQUFDLENBRDVCO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtPQXBDRjtNQXdDQSxnQ0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGtCQUFrQixDQUFDLElBRDVCO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtPQXpDRjtNQTZDQSxrQ0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGtCQUFrQixDQUFDLE1BRDVCO1FBRUEsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FIRjtPQTlDRjtLQURGO0lBb0RBLHVCQUFBLEVBQXlCLElBcER6QjtJQXNEQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLHVCQUFELEdBQTJCLElBQUk7TUFDL0IsSUFBQyxDQUFBLHVCQUF1QixDQUFDLEdBQXpCLENBQTZCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw4QkFBbEIsRUFDM0I7UUFBQSw2QkFBQSxFQUErQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUM3QixLQUFDLENBQUEsT0FBRCxDQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxDQUFUO1VBRDZCO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUEvQjtPQUQyQixDQUE3QjthQUdBLElBQUMsQ0FBQSx1QkFBdUIsQ0FBQyxHQUF6QixDQUE2QixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsOEJBQWxCLEVBQzNCO1FBQUEsbUNBQUEsRUFBcUMsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO21CQUFNLEtBQUMsQ0FBQSxhQUFELENBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBLENBQWYsRUFBb0QsQ0FBcEQ7VUFBTjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckM7T0FEMkIsQ0FBN0I7SUFMUSxDQXREVjtJQThEQSxhQUFBLEVBQWUsU0FBQyxNQUFELEVBQVEsQ0FBUjtBQUNiLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLDZCQUFMLENBQW1DLE1BQW5DO01BQ1AsSUFBQSxDQUFPLElBQVA7UUFDRSxDQUFDLENBQUMsZUFBRixDQUFBO0FBQ0EsZUFGRjs7TUFHQSxPQUFBLEdBQVUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQjtNQUNWLE1BQU0sQ0FBQyw0QkFBUCxDQUFBO01BQ0EsSUFBQSxHQUFPLE1BQU0sQ0FBQyxlQUFQLENBQUE7TUFDUCxJQUFBLEdBQU8sSUFBQyxDQUFBLDZCQUFELENBQStCLE1BQS9CLEVBQXNDLElBQXRDLEVBQTJDLElBQTNDO01BQ1AsT0FBQSxHQUNFO1FBQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFiLENBQUw7UUFDQSxLQUFBLEVBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQURQOzthQUVGLElBQUksT0FBSixDQUFZLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO0FBQ1YsY0FBQTtVQUFBLFNBQUEsR0FBWTtVQUNaLE1BQUEsR0FBUyxTQUFDLE1BQUQ7bUJBQVksU0FBUyxDQUFDLElBQVYsQ0FBZSxNQUFmO1VBQVo7VUFDVCxNQUFBLEdBQVMsU0FBQyxNQUFEO21CQUFZLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtVQUFaO1VBQ1QsSUFBQSxHQUFPLFNBQUMsSUFBRDttQkFDTCxPQUFBLENBQVEsS0FBQyxDQUFBLHlCQUFELENBQTJCLE1BQTNCLEVBQW1DO2NBQUMsTUFBQSxFQUFPLFNBQVMsQ0FBQyxJQUFWLENBQWUsSUFBZixDQUFSO2NBQTZCLElBQUEsRUFBSyxJQUFsQzthQUFuQyxFQUE0RSxJQUE1RSxDQUFSO1VBREs7VUFFUCxlQUFBLEdBQWtCLElBQUksZUFBSixDQUFvQjtZQUFDLFNBQUEsT0FBRDtZQUFVLE1BQUEsSUFBVjtZQUFnQixTQUFBLE9BQWhCO1lBQXlCLFFBQUEsTUFBekI7WUFBaUMsUUFBQSxNQUFqQztZQUF5QyxNQUFBLElBQXpDO1dBQXBCO1VBQ2xCLGVBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLFdBQTlCLEdBQTRDO1VBQzVDLGVBQWUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQTlCLENBQW9DLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBcEM7aUJBQ0EsZUFBZSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBOUIsQ0FBQTtRQVRVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaO0lBWmEsQ0E5RGY7SUFxRkEsT0FBQSxFQUFTLFNBQUMsTUFBRDtBQUNQLFVBQUE7TUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLDZCQUFMLENBQW1DLE1BQW5DO01BQ1AsSUFBQSxDQUFPLElBQVA7UUFDRSxLQUFBLENBQU0sMkRBQU47QUFDQSxlQUZGOztNQUdBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQjtNQUNoQixJQUFBLEdBQU8sSUFBQyxDQUFBLHVCQUFELENBQXlCLE1BQXpCLEVBQWdDLElBQWhDO01BQ1AsWUFBQSxHQUFlLEtBQUEsQ0FBTSxhQUFOLEVBQW9CLElBQXBCO01BQ2YsWUFBWSxDQUFDLEVBQWIsQ0FBZ0IsTUFBaEIsRUFBd0IsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7aUJBQVUsS0FBQyxDQUFBLG1CQUFELENBQXFCLElBQXJCO1FBQVY7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO01BQ0EsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUFwQixDQUF1QixNQUF2QixFQUErQixTQUFDLElBQUQ7ZUFBUyxPQUFPLENBQUMsR0FBUixDQUFZLFFBQUEsR0FBUyxJQUFJLENBQUMsUUFBTCxDQUFBLENBQXJCO01BQVQsQ0FBL0I7TUFDQSxZQUFZLENBQUMsTUFBTSxDQUFDLEVBQXBCLENBQXVCLE1BQXZCLEVBQStCLFNBQUMsSUFBRDtlQUFTLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBQSxHQUFTLElBQUksQ0FBQyxRQUFMLENBQUEsQ0FBckI7TUFBVCxDQUEvQjtNQUNBLE9BQUEsR0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQUEsR0FBeUMsSUFBekQ7TUFDVixZQUFBLEdBQWU7O0FBQUM7YUFBQSx5Q0FBQTs7dUJBQUEsWUFBQSxHQUFhLENBQWIsR0FBZTtBQUFmOztVQUFELENBQW9DLENBQUMsSUFBckMsQ0FBMEMsSUFBMUM7TUFDZixZQUFZLENBQUMsS0FBSyxDQUFDLEtBQW5CLENBQXlCLFlBQXpCO2FBQ0EsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFuQixDQUFBO0lBZE8sQ0FyRlQ7SUFxR0EsNkJBQUEsRUFBK0IsU0FBQyxNQUFELEVBQVEsUUFBUixFQUFpQixJQUFqQjtBQUM3QixVQUFBO01BQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBQSxHQUEwQixRQUExQztNQUNOLFVBQUEsR0FBYSxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBYjtNQUNiLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQjtNQUNoQixPQUFBLEdBQVUsQ0FBQyxhQUFELEVBQWdCLFFBQWhCLEVBQTBCLEtBQTFCLENBQWdDLENBQUMsSUFBakMsQ0FBc0MsR0FBdEM7TUFDVixPQUFBLEdBQVUsSUFBSSxDQUFDLElBQUwsQ0FBVSxVQUFWLEVBQXNCLE9BQXRCO01BRVYsSUFBQSxHQUFPLENBQUMsZUFBRDtNQUNQLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQSxHQUFLLFFBQWY7TUFDQSxJQUEyQixHQUEzQjtRQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBQSxHQUFRLEdBQWxCLEVBQUE7O01BQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLFdBQXJCO01BQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGtCQUFyQjtNQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixFQUFBLEdBQUcsSUFBeEI7TUFDQSxJQUFzQyxVQUFBLENBQVcsT0FBWCxDQUF0QztRQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsY0FBVixFQUEwQixPQUExQixFQUFBOztBQUNBO0FBQUEsV0FBQSxzQ0FBQTs7UUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUEsR0FBSyxDQUFmO0FBQUE7TUFDQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQUEsR0FBSyxVQUFmO0FBRUE7UUFDRSxVQUFBLEdBQWEsVUFBVSxDQUFDLGFBQVgsQ0FBeUIsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUF6QjtRQUNiLElBQWlDLFVBQWpDO1VBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQVksVUFBWixFQUFQO1NBRkY7T0FBQSxjQUFBO1FBR007UUFDSixPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosRUFKRjs7TUFNQSxJQUFJLENBQUMsSUFBTCxDQUFVLEdBQVY7YUFDQTtJQXhCNkIsQ0FyRy9CO0lBK0hBLHVCQUFBLEVBQXlCLFNBQUMsTUFBRCxFQUFRLElBQVI7QUFDdkIsVUFBQTtNQUFBLEdBQUEsR0FBTSxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FBYjtNQUNOLGVBQUEsR0FBa0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQjtNQUNsQixJQUFBLEdBQU8sQ0FBQyxlQUFELEVBQWtCLElBQWxCLEVBQXdCLEtBQXhCLENBQThCLENBQUMsSUFBL0IsQ0FBb0MsR0FBcEM7TUFDUCxHQUFBLEdBQU0sSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLEVBQWMsSUFBZDtNQUNOLEdBQUEsR0FBTSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQUEsR0FBMEIsSUFBMUM7TUFDTixJQUFBLEdBQU8sQ0FBQyxJQUFBLEdBQUssSUFBTCxHQUFVLFNBQVgsRUFBcUIsU0FBckIsRUFBZ0MsV0FBaEMsRUFBNkMsSUFBN0MsRUFBbUQsR0FBbkQ7TUFDUCxJQUFzQyxHQUF0QztRQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUMsT0FBQSxHQUFRLEdBQVQsQ0FBWixFQUFQOztNQUNBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQjtNQUNoQixJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQUw7O0FBQWE7YUFBQSwrQ0FBQTs7dUJBQUEsSUFBQSxHQUFLO0FBQUw7O1VBQWI7TUFFUCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5Q0FBaEIsQ0FBSDtRQUNFLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixpQ0FBckI7UUFDQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiw2REFBaEIsQ0FBSDtVQUNFLElBQUksQ0FBQyxJQUFMLENBQVUsc0JBQVYsRUFERjs7UUFFQSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzREFBaEIsQ0FBSDtVQUNFLElBQUksQ0FBQyxJQUFMLENBQVUsdUNBQVYsRUFERjtTQUpGOztNQU9BLElBQUEsR0FBTyxJQUFJLENBQUMsTUFBTCxDQUFZLENBQUMsR0FBRCxDQUFaO0FBQ1AsYUFBTztJQW5CZ0IsQ0EvSHpCO0lBb0pBLHlCQUFBLEVBQTJCLFNBQUMsTUFBRCxFQUFTLE1BQVQsRUFBaUIsVUFBakI7QUFDekIsVUFBQTtNQUFBLElBQUcsVUFBQSxLQUFjLENBQUksQ0FBckI7UUFDRSxJQUFBLENBQWMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHNDQUFoQixDQUFkO0FBQUEsaUJBQUE7U0FERjs7TUFFQSxNQUFBLEdBQVMsSUFBQyxDQUFBLFlBQUQsQ0FBYyxNQUFPLENBQUEsUUFBQSxDQUFyQixFQUFnQyxNQUFPLENBQUEsTUFBQSxDQUF2QztNQUNULElBQUcsTUFBTSxDQUFDLE1BQVAsS0FBaUIsQ0FBcEI7ZUFDSSxJQUFDLENBQUEsWUFBRCxDQUFjLE1BQWQsRUFBc0IsTUFBTSxDQUFDLEdBQVAsQ0FBQSxDQUF0QixFQURKO09BQUEsTUFFSyxJQUFHLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQW5CO1FBQ0QsSUFBQSxHQUFPLElBQUksa0JBQUosQ0FBdUIsTUFBdkIsRUFBK0IsSUFBQyxDQUFBLFlBQWhDO2VBQ1AsSUFBSSxDQUFDLFFBQUwsQ0FBYyxNQUFkLEVBRkM7O0lBTm9CLENBcEozQjtJQThKQSxZQUFBLEVBQWMsU0FBQyxNQUFELEVBQVMsR0FBVDtBQUNaLFVBQUE7TUFEc0IsZUFBSyxlQUFLO01BQ2hDLElBQUcsSUFBQSxLQUFRLFNBQVg7QUFDRSxlQUFPLE1BQU0sQ0FBQyx1QkFBUCxDQUErQixDQUFDLElBQUEsR0FBSyxDQUFOLEVBQVEsR0FBQSxHQUFJLENBQVosQ0FBL0IsRUFEVDs7TUFFQSxJQUFvRCxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUFwRDtRQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLE1BQU0sQ0FBQyxnQkFBUCxDQUFBLENBQVYsRUFBcUMsSUFBckMsRUFBUDs7TUFDQSxDQUFBLEdBQUksSUFBSSxJQUFKLENBQVMsSUFBVDthQUNKLENBQUMsQ0FBQyxNQUFGLENBQUEsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsU0FBQyxNQUFEO1FBQ2QsSUFBdUUsTUFBdkU7aUJBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLElBQXBCLEVBQTBCO1lBQUMsV0FBQSxFQUFZLElBQUEsR0FBSyxDQUFsQjtZQUFxQixhQUFBLEVBQWMsR0FBQSxHQUFJLENBQXZDO1dBQTFCLEVBQUE7O01BRGMsQ0FBaEI7SUFMWSxDQTlKZDtJQXNLQSxZQUFBLEVBQWMsU0FBQyxTQUFELEVBQVksSUFBWjtBQUNaLFVBQUE7TUFBQSxVQUFBLEdBQWEsU0FBUyxDQUFDLEtBQVYsQ0FBZ0IsTUFBaEI7TUFDYixNQUFBLEdBQVM7QUFDVCxXQUFBLDRDQUFBOztRQUNFLEtBQUEsR0FBUSxTQUFTLENBQUMsS0FBVixDQUFnQixNQUFBLENBQUEsK0JBQUEsR0FBaUMsSUFBakMsR0FBc0MsR0FBdEMsQ0FBaEI7UUFDUixJQUFHLEtBQUEsS0FBVyxJQUFkO1VBQ0UsS0FBQSxHQUFRLFNBQVMsQ0FBQyxLQUFWLENBQWdCLElBQWhCO1VBQ1IsSUFBWSxLQUFLLENBQUMsTUFBTixHQUFlLENBQTNCO0FBQUEscUJBQUE7O1VBQ0EsU0FBQSxHQUFZLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxLQUFULENBQWUsR0FBZjtVQUNYLGdCQUFELEVBQUcsZ0JBQUgsRUFBSywyQkFBTCxFQUFrQixnQkFBbEIsRUFBb0I7VUFDcEIsSUFBbUQsWUFBQSxLQUFnQixNQUFuRTtZQUFDLGdCQUFELEVBQUcsZ0JBQUgsRUFBSyxnQkFBTCxFQUFPLGdCQUFQLEVBQVMsMkJBQVQsRUFBc0IsZ0JBQXRCLEVBQXdCLHNCQUF4Qjs7VUFDQSxPQUFrQixZQUFhLGFBQU0sQ0FBQyxLQUFwQixDQUEwQixHQUExQixDQUFsQixFQUFDLGNBQUQsRUFBTSxjQUFOLEVBQVc7VUFDWCxTQUFBLEdBQVksTUFBTSxDQUFDLEtBQVAsQ0FBYSxtQ0FBYjtVQUNaLElBQUcsU0FBSDtZQUNFLElBQUcsU0FBVSxDQUFBLENBQUEsQ0FBVixLQUFnQixNQUFuQjtjQUNFLE9BQWEsQ0FBQyxTQUFVLENBQUEsQ0FBQSxDQUFYLEVBQWUsU0FBVSxDQUFBLENBQUEsQ0FBekIsQ0FBYixFQUFDLGNBQUQsRUFBTSxjQURSO2FBQUEsTUFBQTtjQUdFLEdBQUEsR0FBTSxTQUFVLENBQUEsQ0FBQSxFQUhsQjthQURGOztVQUtBLE1BQU0sQ0FBQyxJQUFQLENBQVksQ0FBQyxJQUFELEVBQU8sTUFBQSxDQUFPLElBQVAsQ0FBUCxFQUFxQixNQUFBLENBQU8sR0FBUCxDQUFyQixDQUFaLEVBYkY7O0FBRkY7QUFnQkEsYUFBTztJQW5CSyxDQXRLZDtJQTJMQSxtQkFBQSxFQUFxQixTQUFDLElBQUQ7TUFDbkIsSUFBQSxDQUFPLElBQVA7UUFDRSxLQUFBLENBQU0sc0RBQU47QUFDQSxlQUZGOzthQUdBLEtBQUEsQ0FBTSxDQUFBLHVDQUFBLEdBQXdDLElBQXhDLEdBQTZDLElBQTdDLENBQUEsR0FDSix3Q0FERjtJQUptQixDQTNMckI7SUFrTUEsVUFBQSxFQUFZLFNBQUE7TUFDVixJQUFDLENBQUEsdUJBQXVCLENBQUMsT0FBekIsQ0FBQTthQUNBLE9BQU8sQ0FBQyxHQUFSLENBQVksZ0NBQVo7SUFGVSxDQWxNWjtJQXNNQSxPQUFBLEVBQVMsU0FBQTs7UUFDUCxnQkFBaUIsT0FBQSxDQUFRLGtCQUFSOzthQUNqQixJQUFJLGFBQUosQ0FBQTtJQUZPLENBdE1UOztBQWJGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGUsRGlzcG9zYWJsZSxCdWZmZXJlZFByb2Nlc3MsU2VsZWN0aW9uLEZpbGV9ID0gcmVxdWlyZSAnYXRvbSdcbnV0aWwgPSByZXF1aXJlICcuL3V0aWwnXG57c3Bhd259ID0gcmVxdWlyZSAnY2hpbGRfcHJvY2VzcydcbnBhdGggPSByZXF1aXJlICdwYXRoJ1xue2V4aXN0c1N5bmN9ID0gcmVxdWlyZSAnZnMnXG5DbGFuZ0ZsYWdzID0gcmVxdWlyZSAnY2xhbmctZmxhZ3MnXG5cbkxvY2F0aW9uU2VsZWN0TGlzdCA9IHJlcXVpcmUgJy4vbG9jYXRpb24tc2VsZWN0LXZpZXcuY29mZmVlJ1xuXG5DbGFuZ1Byb3ZpZGVyID0gbnVsbFxuZGVmYXVsdFByZWNvbXBpbGVkID0gcmVxdWlyZSAnLi9kZWZhdWx0UHJlY29tcGlsZWQnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY29uZmlnOlxuICAgIGNsYW5nQ29tbWFuZDpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiAnY2xhbmcnXG4gICAgaW5jbHVkZVBhdGhzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogWycuJ11cbiAgICAgIGl0ZW1zOlxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIHBjaEZpbGVQcmVmaXg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJy5zdGRhZngnXG4gICAgaWdub3JlQ2xhbmdFcnJvcnM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICBpbmNsdWRlRG9jdW1lbnRhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIGluY2x1ZGVTeXN0ZW1IZWFkZXJzRG9jdW1lbnRhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiBcIioqV0FSTklORyoqOiBpZiB0aGVyZSBhcmUgYW55IFBDSHMgY29tcGlsZWQgd2l0aG91dCB0aGlzIG9wdGlvbiwgeW91IHdpbGwgaGF2ZSB0byBkZWxldGUgdGhlbSBhbmQgZ2VuZXJhdGUgdGhlbSBhZ2FpblwiXG4gICAgaW5jbHVkZU5vbkRveHlnZW5Db21tZW50c0FzRG9jdW1lbnRhdGlvbjpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICBcInN0ZCBjKytcIjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBcImMrKzExXCJcbiAgICBcInN0ZCBjXCI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJjOTlcIlxuICAgIFwicHJlQ29tcGlsZWRIZWFkZXJzIGMrK1wiOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogZGVmYXVsdFByZWNvbXBpbGVkLmNwcFxuICAgICAgaXRlbTpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBcInByZUNvbXBpbGVkSGVhZGVycyBjXCI6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0UHJlY29tcGlsZWQuY1xuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgXCJwcmVDb21waWxlZEhlYWRlcnMgb2JqZWN0aXZlLWNcIjpcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRQcmVjb21waWxlZC5vYmpjXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICBcInByZUNvbXBpbGVkSGVhZGVycyBvYmplY3RpdmUtYysrXCI6XG4gICAgICB0eXBlOiAnYXJyYXknXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0UHJlY29tcGlsZWQub2JqY3BwXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcblxuICBkZWFjdGl2YXRpb25EaXNwb3NhYmxlczogbnVsbFxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgQGRlYWN0aXZhdGlvbkRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAZGVhY3RpdmF0aW9uRGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJyxcbiAgICAgICdhdXRvY29tcGxldGUtY2xhbmc6ZW1pdC1wY2gnOiA9PlxuICAgICAgICBAZW1pdFBjaCBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBAZGVhY3RpdmF0aW9uRGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yOm5vdChbbWluaV0pJyxcbiAgICAgICdhdXRvY29tcGxldGUtY2xhbmc6Z28tZGVjbGFyYXRpb24nOiAoZSk9PiBAZ29EZWNsYXJhdGlvbiBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCksZVxuXG4gIGdvRGVjbGFyYXRpb246IChlZGl0b3IsZSktPlxuICAgIGxhbmcgPSB1dGlsLmdldEZpcnN0Q3Vyc29yU291cmNlU2NvcGVMYW5nIGVkaXRvclxuICAgIHVubGVzcyBsYW5nXG4gICAgICBlLmFib3J0S2V5QmluZGluZygpXG4gICAgICByZXR1cm5cbiAgICBjb21tYW5kID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLmNsYW5nQ29tbWFuZFwiXG4gICAgZWRpdG9yLnNlbGVjdFdvcmRzQ29udGFpbmluZ0N1cnNvcnMoKTtcbiAgICB0ZXJtID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgYXJncyA9IEBidWlsZEdvRGVjbGFyYXRpb25Db21tYW5kQXJncyhlZGl0b3IsbGFuZyx0ZXJtKVxuICAgIG9wdGlvbnMgPVxuICAgICAgY3dkOiBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICAgIGlucHV0OiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUpID0+XG4gICAgICBhbGxPdXRwdXQgPSBbXVxuICAgICAgc3Rkb3V0ID0gKG91dHB1dCkgPT4gYWxsT3V0cHV0LnB1c2gob3V0cHV0KVxuICAgICAgc3RkZXJyID0gKG91dHB1dCkgPT4gY29uc29sZS5sb2cgb3V0cHV0XG4gICAgICBleGl0ID0gKGNvZGUpID0+XG4gICAgICAgIHJlc29sdmUoQGhhbmRsZUdvRGVjbGFyYXRpb25SZXN1bHQoZWRpdG9yLCB7b3V0cHV0OmFsbE91dHB1dC5qb2luKFwiXFxuXCIpLHRlcm06dGVybX0sIGNvZGUpKVxuICAgICAgYnVmZmVyZWRQcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzcyh7Y29tbWFuZCwgYXJncywgb3B0aW9ucywgc3Rkb3V0LCBzdGRlcnIsIGV4aXR9KVxuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4uc2V0RW5jb2RpbmcgPSAndXRmLTgnO1xuICAgICAgYnVmZmVyZWRQcm9jZXNzLnByb2Nlc3Muc3RkaW4ud3JpdGUoZWRpdG9yLmdldFRleHQoKSlcbiAgICAgIGJ1ZmZlcmVkUHJvY2Vzcy5wcm9jZXNzLnN0ZGluLmVuZCgpXG5cbiAgZW1pdFBjaDogKGVkaXRvciktPlxuICAgIGxhbmcgPSB1dGlsLmdldEZpcnN0Q3Vyc29yU291cmNlU2NvcGVMYW5nIGVkaXRvclxuICAgIHVubGVzcyBsYW5nXG4gICAgICBhbGVydCBcImF1dG9jb21wbGV0ZS1jbGFuZzplbWl0LXBjaFxcbkVycm9yOiBJbmNvbXBhdGlibGUgTGFuZ3VhZ2VcIlxuICAgICAgcmV0dXJuXG4gICAgY2xhbmdfY29tbWFuZCA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5jbGFuZ0NvbW1hbmRcIlxuICAgIGFyZ3MgPSBAYnVpbGRFbWl0UGNoQ29tbWFuZEFyZ3MgZWRpdG9yLGxhbmdcbiAgICBlbWl0X3Byb2Nlc3MgPSBzcGF3biBjbGFuZ19jb21tYW5kLGFyZ3NcbiAgICBlbWl0X3Byb2Nlc3Mub24gXCJleGl0XCIsIChjb2RlKSA9PiBAaGFuZGxlRW1pdFBjaFJlc3VsdCBjb2RlXG4gICAgZW1pdF9wcm9jZXNzLnN0ZG91dC5vbiAnZGF0YScsIChkYXRhKS0+IGNvbnNvbGUubG9nIFwib3V0OlxcblwiK2RhdGEudG9TdHJpbmcoKVxuICAgIGVtaXRfcHJvY2Vzcy5zdGRlcnIub24gJ2RhdGEnLCAoZGF0YSktPiBjb25zb2xlLmxvZyBcImVycjpcXG5cIitkYXRhLnRvU3RyaW5nKClcbiAgICBoZWFkZXJzID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnByZUNvbXBpbGVkSGVhZGVycyAje2xhbmd9XCJcbiAgICBoZWFkZXJzSW5wdXQgPSAoXCIjaW5jbHVkZSA8I3tofT5cIiBmb3IgaCBpbiBoZWFkZXJzKS5qb2luIFwiXFxuXCJcbiAgICBlbWl0X3Byb2Nlc3Muc3RkaW4ud3JpdGUgaGVhZGVyc0lucHV0XG4gICAgZW1pdF9wcm9jZXNzLnN0ZGluLmVuZCgpXG5cbiAgYnVpbGRHb0RlY2xhcmF0aW9uQ29tbWFuZEFyZ3M6IChlZGl0b3IsbGFuZ3VhZ2UsdGVybSktPlxuICAgIHN0ZCA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5zdGQgI3tsYW5ndWFnZX1cIlxuICAgIGN1cnJlbnREaXIgPSBwYXRoLmRpcm5hbWUoZWRpdG9yLmdldFBhdGgoKSlcbiAgICBwY2hGaWxlUHJlZml4ID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnBjaEZpbGVQcmVmaXhcIlxuICAgIHBjaEZpbGUgPSBbcGNoRmlsZVByZWZpeCwgbGFuZ3VhZ2UsIFwicGNoXCJdLmpvaW4gJy4nXG4gICAgcGNoUGF0aCA9IHBhdGguam9pbihjdXJyZW50RGlyLCBwY2hGaWxlKVxuXG4gICAgYXJncyA9IFtcIi1mc3ludGF4LW9ubHlcIl1cbiAgICBhcmdzLnB1c2ggXCIteCN7bGFuZ3VhZ2V9XCJcbiAgICBhcmdzLnB1c2ggXCItc3RkPSN7c3RkfVwiIGlmIHN0ZFxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItYXN0LWR1bXBcIlxuICAgIGFyZ3MucHVzaCBcIi1YY2xhbmdcIiwgXCItYXN0LWR1bXAtZmlsdGVyXCJcbiAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiI3t0ZXJtfVwiXG4gICAgYXJncy5wdXNoKFwiLWluY2x1ZGUtcGNoXCIsIHBjaFBhdGgpIGlmIGV4aXN0c1N5bmMocGNoUGF0aClcbiAgICBhcmdzLnB1c2ggXCItSSN7aX1cIiBmb3IgaSBpbiBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaW5jbHVkZVBhdGhzXCJcbiAgICBhcmdzLnB1c2ggXCItSSN7Y3VycmVudERpcn1cIlxuXG4gICAgdHJ5XG4gICAgICBjbGFuZ2ZsYWdzID0gQ2xhbmdGbGFncy5nZXRDbGFuZ0ZsYWdzKGVkaXRvci5nZXRQYXRoKCkpXG4gICAgICBhcmdzID0gYXJncy5jb25jYXQgY2xhbmdmbGFncyBpZiBjbGFuZ2ZsYWdzXG4gICAgY2F0Y2ggZXJyb3JcbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG5cbiAgICBhcmdzLnB1c2ggXCItXCJcbiAgICBhcmdzXG5cbiAgYnVpbGRFbWl0UGNoQ29tbWFuZEFyZ3M6IChlZGl0b3IsbGFuZyktPlxuICAgIGRpciA9IHBhdGguZGlybmFtZSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgcGNoX2ZpbGVfcHJlZml4ID0gYXRvbS5jb25maWcuZ2V0IFwiYXV0b2NvbXBsZXRlLWNsYW5nLnBjaEZpbGVQcmVmaXhcIlxuICAgIGZpbGUgPSBbcGNoX2ZpbGVfcHJlZml4LCBsYW5nLCBcInBjaFwiXS5qb2luICcuJ1xuICAgIHBjaCA9IHBhdGguam9pbiBkaXIsZmlsZVxuICAgIHN0ZCA9IGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5zdGQgI3tsYW5nfVwiXG4gICAgYXJncyA9IFtcIi14I3tsYW5nfS1oZWFkZXJcIiwgXCItWGNsYW5nXCIsICctZW1pdC1wY2gnLCAnLW8nLCBwY2hdXG4gICAgYXJncyA9IGFyZ3MuY29uY2F0IFtcIi1zdGQ9I3tzdGR9XCJdIGlmIHN0ZFxuICAgIGluY2x1ZGVfcGF0aHMgPSBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaW5jbHVkZVBhdGhzXCJcbiAgICBhcmdzID0gYXJncy5jb25jYXQgKFwiLUkje2l9XCIgZm9yIGkgaW4gaW5jbHVkZV9wYXRocylcblxuICAgIGlmIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlRG9jdW1lbnRhdGlvblwiXG4gICAgICBhcmdzLnB1c2ggXCItWGNsYW5nXCIsIFwiLWNvZGUtY29tcGxldGlvbi1icmllZi1jb21tZW50c1wiXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQgXCJhdXRvY29tcGxldGUtY2xhbmcuaW5jbHVkZU5vbkRveHlnZW5Db21tZW50c0FzRG9jdW1lbnRhdGlvblwiXG4gICAgICAgIGFyZ3MucHVzaCBcIi1mcGFyc2UtYWxsLWNvbW1lbnRzXCJcbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pbmNsdWRlU3lzdGVtSGVhZGVyc0RvY3VtZW50YXRpb25cIlxuICAgICAgICBhcmdzLnB1c2ggXCItZnJldGFpbi1jb21tZW50cy1mcm9tLXN5c3RlbS1oZWFkZXJzXCJcblxuICAgIGFyZ3MgPSBhcmdzLmNvbmNhdCBbXCItXCJdXG4gICAgcmV0dXJuIGFyZ3NcblxuICBoYW5kbGVHb0RlY2xhcmF0aW9uUmVzdWx0OiAoZWRpdG9yLCByZXN1bHQsIHJldHVybkNvZGUpLT5cbiAgICBpZiByZXR1cm5Db2RlIGlzIG5vdCAwXG4gICAgICByZXR1cm4gdW5sZXNzIGF0b20uY29uZmlnLmdldCBcImF1dG9jb21wbGV0ZS1jbGFuZy5pZ25vcmVDbGFuZ0Vycm9yc1wiXG4gICAgcGxhY2VzID0gQHBhcnNlQXN0RHVtcCByZXN1bHRbJ291dHB1dCddLCByZXN1bHRbJ3Rlcm0nXVxuICAgIGlmIHBsYWNlcy5sZW5ndGggaXMgMVxuICAgICAgICBAZ29Ub0xvY2F0aW9uIGVkaXRvciwgcGxhY2VzLnBvcCgpXG4gICAgZWxzZSBpZiBwbGFjZXMubGVuZ3RoID4gMVxuICAgICAgICBsaXN0ID0gbmV3IExvY2F0aW9uU2VsZWN0TGlzdChlZGl0b3IsIEBnb1RvTG9jYXRpb24pXG4gICAgICAgIGxpc3Quc2V0SXRlbXMocGxhY2VzKVxuXG4gIGdvVG9Mb2NhdGlvbjogKGVkaXRvciwgW2ZpbGUsbGluZSxjb2xdKSAtPlxuICAgIGlmIGZpbGUgaXMgJzxzdGRpbj4nXG4gICAgICByZXR1cm4gZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIFtsaW5lLTEsY29sLTFdXG4gICAgZmlsZSA9IHBhdGguam9pbiBlZGl0b3IuZ2V0RGlyZWN0b3J5UGF0aCgpLCBmaWxlIGlmIGZpbGUuc3RhcnRzV2l0aChcIi5cIilcbiAgICBmID0gbmV3IEZpbGUgZmlsZVxuICAgIGYuZXhpc3RzKCkudGhlbiAocmVzdWx0KSAtPlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBmaWxlLCB7aW5pdGlhbExpbmU6bGluZS0xLCBpbml0aWFsQ29sdW1uOmNvbC0xfSBpZiByZXN1bHRcblxuICBwYXJzZUFzdER1bXA6IChhc3RzdHJpbmcsIHRlcm0pLT5cbiAgICBjYW5kaWRhdGVzID0gYXN0c3RyaW5nLnNwbGl0ICdcXG5cXG4nXG4gICAgcGxhY2VzID0gW11cbiAgICBmb3IgY2FuZGlkYXRlIGluIGNhbmRpZGF0ZXNcbiAgICAgIG1hdGNoID0gY2FuZGlkYXRlLm1hdGNoIC8vL15EdW1waW5nXFxzKD86W0EtWmEtel9dKjo6KSo/I3t0ZXJtfTovLy9cbiAgICAgIGlmIG1hdGNoIGlzbnQgbnVsbFxuICAgICAgICBsaW5lcyA9IGNhbmRpZGF0ZS5zcGxpdCAnXFxuJ1xuICAgICAgICBjb250aW51ZSBpZiBsaW5lcy5sZW5ndGggPCAyXG4gICAgICAgIGRlY2xUZXJtcyA9IGxpbmVzWzFdLnNwbGl0ICcgJ1xuICAgICAgICBbXyxfLGRlY2xSYW5nZVN0cixfLHBvc1N0ciwuLi5dID0gZGVjbFRlcm1zXG4gICAgICAgIFtfLF8sXyxfLGRlY2xSYW5nZVN0cixfLHBvc1N0ciwuLi5dID0gZGVjbFRlcm1zIGlmIGRlY2xSYW5nZVN0ciBpcyBcInByZXZcIlxuICAgICAgICBbZmlsZSxsaW5lLGNvbF0gPSBkZWNsUmFuZ2VTdHJbMS4uLTJdLnNwbGl0ICc6J1xuICAgICAgICBwb3NpdGlvbnMgPSBwb3NTdHIubWF0Y2ggLyhsaW5lfGNvbCk6KFswLTldKykoPzo6KFswLTldKykpPy9cbiAgICAgICAgaWYgcG9zaXRpb25zXG4gICAgICAgICAgaWYgcG9zaXRpb25zWzFdIGlzICdsaW5lJ1xuICAgICAgICAgICAgW2xpbmUsY29sXSA9IFtwb3NpdGlvbnNbMl0sIHBvc2l0aW9uc1szXV1cbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBjb2wgPSBwb3NpdGlvbnNbMl1cbiAgICAgICAgcGxhY2VzLnB1c2ggW2ZpbGUsKE51bWJlciBsaW5lKSwoTnVtYmVyIGNvbCldXG4gICAgcmV0dXJuIHBsYWNlc1xuXG4gIGhhbmRsZUVtaXRQY2hSZXN1bHQ6IChjb2RlKS0+XG4gICAgdW5sZXNzIGNvZGVcbiAgICAgIGFsZXJ0IFwiRW1pdGluZyBwcmVjb21waWxlZCBoZWFkZXIgaGFzIHN1Y2Nlc3NmdWxseSBmaW5pc2hlZFwiXG4gICAgICByZXR1cm5cbiAgICBhbGVydCBcIkVtaXRpbmcgcHJlY29tcGlsZWQgaGVhZGVyIGV4aXQgd2l0aCAje2NvZGV9XFxuXCIrXG4gICAgICBcIlNlZSBjb25zb2xlIGZvciBkZXRhaWxlZCBlcnJvciBtZXNzYWdlXCJcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBkZWFjdGl2YXRpb25EaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBjb25zb2xlLmxvZyBcImF1dG9jb21wbGV0ZS1jbGFuZyBkZWFjdGl2YXRlZFwiXG5cbiAgcHJvdmlkZTogLT5cbiAgICBDbGFuZ1Byb3ZpZGVyID89IHJlcXVpcmUoJy4vY2xhbmctcHJvdmlkZXInKVxuICAgIG5ldyBDbGFuZ1Byb3ZpZGVyKClcbiJdfQ==
