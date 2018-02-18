Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _escapeHtml = require('escape-html');

var _escapeHtml2 = _interopRequireDefault(_escapeHtml);

// Local variables
'use babel';var execPathVersions = new Map();
var grammarScopes = ['source.php'];

// Settings
var executablePath = undefined;
var autoExecutableSearch = undefined;
var disableWhenNoConfigFile = undefined;
var codeStandardOrConfigFile = undefined;
var autoConfigSearch = undefined;
var ignorePatterns = undefined;
var errorsOnly = undefined;
var warningSeverity = undefined;
var tabWidth = undefined;
var showSource = undefined;
var disableExecuteTimeout = undefined;
var excludedSniffs = undefined;

var determineExecVersion = _asyncToGenerator(function* (execPath) {
  var versionString = yield helpers.exec(execPath, ['--version']);
  var versionPattern = /^PHP_CodeSniffer version (\d+)\.(\d+)\.(\d+)/i;
  var version = versionString.match(versionPattern);
  var ver = {};
  if (version !== null) {
    ver.major = Number.parseInt(version[1], 10);
    ver.minor = Number.parseInt(version[2], 10);
    ver.patch = Number.parseInt(version[3], 10);
  } else {
    ver.major = 0;
    ver.minor = 0;
    ver.patch = 0;
  }
  execPathVersions.set(execPath, ver);
});

var getPHPCSVersion = _asyncToGenerator(function* (execPath) {
  if (!execPathVersions.has(execPath)) {
    yield determineExecVersion(execPath);
  }
  return execPathVersions.get(execPath);
});

var fixPHPCSColumn = function fixPHPCSColumn(lineText, line, givenCol) {
  // Almost all PHPCS sniffs default to replacing tabs with 4 spaces
  // This is horribly wrong, but that's how it works currently
  var tabLength = tabWidth > 0 ? tabWidth : 4;
  var column = givenCol;
  var screenCol = 0;
  for (var col = 0; col < lineText.length; col += 1) {
    var char = lineText[col];
    if (char === '\t') {
      screenCol += tabLength - screenCol % tabLength;
    } else {
      screenCol += 1;
    }
    if (screenCol >= column) {
      column = col + 1;
      break;
    }
  }
  return column;
};

var scopeAvailable = function scopeAvailable(scope, available) {
  if (available === false && grammarScopes.includes(scope)) {
    grammarScopes.splice(grammarScopes.indexOf(scope), 1);
  } else if (available === true && !grammarScopes.includes(scope)) {
    grammarScopes.push(scope);
  }
};

exports['default'] = {
  activate: function activate() {
    require('atom-package-deps').install('linter-phpcs');

    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.config.observe('linter-phpcs.executablePath', function (value) {
      executablePath = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.autoExecutableSearch', function (value) {
      autoExecutableSearch = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.disableWhenNoConfigFile', function (value) {
      disableWhenNoConfigFile = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.codeStandardOrConfigFile', function (value) {
      codeStandardOrConfigFile = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.autoConfigSearch', function (value) {
      autoConfigSearch = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.ignorePatterns', function (value) {
      ignorePatterns = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.displayErrorsOnly', function (value) {
      errorsOnly = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.warningSeverity', function (value) {
      warningSeverity = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.tabWidth', function (value) {
      tabWidth = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.showSource', function (value) {
      showSource = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.disableExecuteTimeout', function (value) {
      disableExecuteTimeout = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.excludedSniffs', function (value) {
      excludedSniffs = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.otherLanguages.useCSSTools', function (value) {
      scopeAvailable('source.css', value);
    }));
    this.subscriptions.add(atom.config.observe('linter-phpcs.otherLanguages.useJSTools', function (value) {
      scopeAvailable('source.js', value);
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    return {
      name: 'PHPCS',
      grammarScopes: grammarScopes,
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();
        var fileDir = _path2['default'].dirname(filePath);

        if (fileText === '') {
          // Empty file, empty results
          return [];
        }

        var parameters = ['--report=json'];

        // Check if a local PHPCS executable is available
        if (autoExecutableSearch) {
          var executable = yield helpers.findCachedAsync(fileDir, ['vendor/bin/phpcs.bat', 'vendor/bin/phpcs']);

          if (executable !== null) {
            executablePath = executable;
          }
        }

        // Get the version of the chosen PHPCS
        var version = yield getPHPCSVersion(executablePath);

        // -q (quiet) option is available since phpcs 2.6.2
        if (version.major > 2 || version.major === 2 && version.minor > 6 || version.major === 2 && version.minor === 6 && version.patch >= 2) {
          parameters.push('-q');
        }

        // --encoding is available since 1.3.0 (RC1, but we ignore that for simplicity)
        if (version.major > 1 || version.major === 1 && version.minor >= 3) {
          // actual file encoding is irrelevant, as PHPCS will always get UTF-8 as its input
          // see analysis here: https://github.com/AtomLinter/linter-phpcs/issues/235
          parameters.push('--encoding=UTF-8');
        }

        // Check if file should be ignored
        if (version.major > 2) {
          // PHPCS v3 and up support this with STDIN files
          parameters.push('--ignore=' + ignorePatterns.join(','));
        } else if (ignorePatterns.some(function (pattern) {
          return (0, _minimatch2['default'])(filePath, pattern);
        })) {
          // We must determine this ourself for lower versions
          return [];
        }

        // Check if a config file exists and handle it
        var confFile = yield helpers.findAsync(fileDir, ['phpcs.xml', 'phpcs.xml.dist', 'phpcs.ruleset.xml', 'ruleset.xml']);
        if (disableWhenNoConfigFile && !confFile) {
          return [];
        }

        var standard = autoConfigSearch && confFile ? confFile : codeStandardOrConfigFile;
        if (standard) {
          parameters.push('--standard=' + standard);
        }
        parameters.push('--warning-severity=' + (errorsOnly ? 0 : warningSeverity));
        if (tabWidth > 1) {
          parameters.push('--tab-width=' + tabWidth);
        }
        if (showSource) {
          parameters.push('-s');
        }

        // Ignore any requested Sniffs
        if (excludedSniffs.length > 0 && (version.major > 2 || version.major === 2 && version.minor > 6 || version.major === 2 && version.minor === 6 && version.patch > 1)) {
          parameters.push('--exclude=' + excludedSniffs.join(','));
        }

        // Determine the method of setting the file name
        var text = undefined;
        if (version.major >= 3 || version.major === 2 && version.minor >= 6) {
          // PHPCS 2.6 and above support sending the filename in a flag
          parameters.push('--stdin-path="' + filePath + '"');
          text = fileText;
        } else if (version.major === 2 && version.minor < 6) {
          // PHPCS 2.x.x before 2.6.0 supports putting the name in the start of the stream
          var eolChar = textEditor.getBuffer().lineEndingForRow(0);
          text = 'phpcs_input_file: ' + filePath + eolChar + fileText;
        } else {
          // PHPCS v1 supports stdin, but ignores all filenames
          text = fileText;
        }

        // Finish off the parameter list
        parameters.push('-');

        // Run PHPCS from the project root, or if not in a project the file directory
        var projectPath = atom.project.relativizePath(filePath)[0];
        if (projectPath === null) {
          projectPath = fileDir;
        }

        var execOptions = {
          cwd: projectPath,
          stdin: text,
          ignoreExitCode: true
        };
        if (disableExecuteTimeout) {
          execOptions.timeout = Infinity;
        }
        if (confFile) {
          execOptions.cwd = _path2['default'].dirname(confFile);
        }

        var result = yield helpers.exec(executablePath, parameters, execOptions);

        // Check if the file contents have changed since the lint was triggered
        if (textEditor.getText() !== fileText) {
          // Contents have changed, tell Linter not to update results
          return null;
        }

        var data = undefined;
        try {
          data = JSON.parse(result.toString().trim());
        } catch (error) {
          atom.notifications.addError('Error parsing PHPCS response', {
            detail: 'Something went wrong attempting to parse the PHPCS output.',
            dismissable: true
          });
          // eslint-disable-next-line no-console
          console.log('PHPCS Response', result);
          return [];
        }

        var messages = undefined;
        if (version.major >= 3 || version.major === 2 && version.minor >= 6) {
          if (!data.files['"' + filePath + '"']) {
            return [];
          }
          messages = data.files['"' + filePath + '"'].messages;
        } else if (version.major === 2 && version.minor < 6) {
          if (!data.files[filePath]) {
            return [];
          }
          messages = data.files[filePath].messages;
        } else {
          // PHPCS v1 can't associate a filename with STDIN input
          if (!data.files.STDIN) {
            return [];
          }
          messages = data.files.STDIN.messages;
        }

        return messages.map(function (message) {
          // fix column in line with tabs
          var line = message.line;
          var column = message.column;

          line -= 1;
          var lineText = textEditor.getBuffer().lineForRow(line);

          if (lineText.includes('\t')) {
            column = fixPHPCSColumn(lineText, line, column);
          }
          column -= 1;

          var range = undefined;
          try {
            range = helpers.rangeFromLineNumber(textEditor, line, column);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.error('linter-phpcs:: Invalid point encountered in the attached message', {
              message: message,
              source: {
                lineLength: lineText.length,
                lineText: lineText
              }
            });
            throw Error('Invalid point encountered! See console for details.');
          }

          var msg = {
            type: message.type,
            filePath: filePath,
            range: range
          };

          if (showSource) {
            msg.html = '<span class="badge badge-flexible">' + (message.source || 'Unknown') + '</span> ';
            msg.html += (0, _escapeHtml2['default'])(message.message);
          } else {
            msg.text = message.message;
          }

          return msg;
        });
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1waHBjcy9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OzBCQUNqQixhQUFhOztJQUExQixPQUFPOztvQkFDRixNQUFNOzs7O3lCQUNELFdBQVc7Ozs7MEJBQ1YsYUFBYTs7Ozs7QUFQcEMsV0FBVyxDQUFDLEFBVVosSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25DLElBQU0sYUFBYSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUdyQyxJQUFJLGNBQWMsWUFBQSxDQUFDO0FBQ25CLElBQUksb0JBQW9CLFlBQUEsQ0FBQztBQUN6QixJQUFJLHVCQUF1QixZQUFBLENBQUM7QUFDNUIsSUFBSSx3QkFBd0IsWUFBQSxDQUFDO0FBQzdCLElBQUksZ0JBQWdCLFlBQUEsQ0FBQztBQUNyQixJQUFJLGNBQWMsWUFBQSxDQUFDO0FBQ25CLElBQUksVUFBVSxZQUFBLENBQUM7QUFDZixJQUFJLGVBQWUsWUFBQSxDQUFDO0FBQ3BCLElBQUksUUFBUSxZQUFBLENBQUM7QUFDYixJQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsSUFBSSxxQkFBcUIsWUFBQSxDQUFDO0FBQzFCLElBQUksY0FBYyxZQUFBLENBQUM7O0FBRW5CLElBQU0sb0JBQW9CLHFCQUFHLFdBQU8sUUFBUSxFQUFLO0FBQy9DLE1BQU0sYUFBYSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLE1BQU0sY0FBYyxHQUFHLCtDQUErQyxDQUFDO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsTUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO0FBQ3BC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LENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDM0Isa0JBQU0sR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztXQUNqRDtBQUNELGdCQUFNLElBQUksQ0FBQyxDQUFDOztBQUVaLGNBQUksS0FBSyxZQUFBLENBQUM7QUFDVixjQUFJO0FBQ0YsaUJBQUssR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztXQUMvRCxDQUFDLE9BQU8sQ0FBQyxFQUFFOztBQUVWLG1CQUFPLENBQUMsS0FBSyxDQUNYLGtFQUFrRSxFQUNsRTtBQUNFLHFCQUFPLEVBQVAsT0FBTztBQUNQLG9CQUFNLEVBQUU7QUFDTiwwQkFBVSxFQUFFLFFBQVEsQ0FBQyxNQUFNO0FBQzNCLHdCQUFRLEVBQVIsUUFBUTtlQUNUO2FBQ0YsQ0FDRixDQUFDO0FBQ0Ysa0JBQU0sS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7V0FDcEU7O0FBRUQsY0FBTSxHQUFHLEdBQUc7QUFDVixnQkFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJO0FBQ2xCLG9CQUFRLEVBQVIsUUFBUTtBQUNSLGlCQUFLLEVBQUwsS0FBSztXQUNOLENBQUM7O0FBRUYsY0FBSSxVQUFVLEVBQUU7QUFDZCxlQUFHLENBQUMsSUFBSSw0Q0FBeUMsT0FBTyxDQUFDLE1BQU0sSUFBSSxTQUFTLENBQUEsYUFBVSxDQUFDO0FBQ3ZGLGVBQUcsQ0FBQyxJQUFJLElBQUksNkJBQVcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1dBQ3pDLE1BQU07QUFDTCxlQUFHLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUM7V0FDNUI7O0FBRUQsaUJBQU8sR0FBRyxDQUFDO1NBQ1osQ0FBQyxDQUFDO09BQ0osQ0FBQTtLQUNGLENBQUM7R0FDSDtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1waHBjcy9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0ICogYXMgaGVscGVycyBmcm9tICdhdG9tLWxpbnRlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBtaW5pbWF0Y2ggZnJvbSAnbWluaW1hdGNoJztcbmltcG9ydCBlc2NhcGVIdG1sIGZyb20gJ2VzY2FwZS1odG1sJztcblxuLy8gTG9jYWwgdmFyaWFibGVzXG5jb25zdCBleGVjUGF0aFZlcnNpb25zID0gbmV3IE1hcCgpO1xuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFsnc291cmNlLnBocCddO1xuXG4vLyBTZXR0aW5nc1xubGV0IGV4ZWN1dGFibGVQYXRoO1xubGV0IGF1dG9FeGVjdXRhYmxlU2VhcmNoO1xubGV0IGRpc2FibGVXaGVuTm9Db25maWdGaWxlO1xubGV0IGNvZGVTdGFuZGFyZE9yQ29uZmlnRmlsZTtcbmxldCBhdXRvQ29uZmlnU2VhcmNoO1xubGV0IGlnbm9yZVBhdHRlcm5zO1xubGV0IGVycm9yc09ubHk7XG5sZXQgd2FybmluZ1NldmVyaXR5O1xubGV0IHRhYldpZHRoO1xubGV0IHNob3dTb3VyY2U7XG5sZXQgZGlzYWJsZUV4ZWN1dGVUaW1lb3V0O1xubGV0IGV4Y2x1ZGVkU25pZmZzO1xuXG5jb25zdCBkZXRlcm1pbmVFeGVjVmVyc2lvbiA9IGFzeW5jIChleGVjUGF0aCkgPT4ge1xuICBjb25zdCB2ZXJzaW9uU3RyaW5nID0gYXdhaXQgaGVscGVycy5leGVjKGV4ZWNQYXRoLCBbJy0tdmVyc2lvbiddKTtcbiAgY29uc3QgdmVyc2lvblBhdHRlcm4gPSAvXlBIUF9Db2RlU25pZmZlciB2ZXJzaW9uIChcXGQrKVxcLihcXGQrKVxcLihcXGQrKS9pO1xuICBjb25zdCB2ZXJzaW9uID0gdmVyc2lvblN0cmluZy5tYXRjaCh2ZXJzaW9uUGF0dGVybik7XG4gIGNvbnN0IHZlciA9IHt9O1xuICBpZiAodmVyc2lvbiAhPT0gbnVsbCkge1xuICAgIHZlci5tYWpvciA9IE51bWJlci5wYXJzZUludCh2ZXJzaW9uWzFdLCAxMCk7XG4gICAgdmVyLm1pbm9yID0gTnVtYmVyLnBhcnNlSW50KHZlcnNpb25bMl0sIDEwKTtcbiAgICB2ZXIucGF0Y2ggPSBOdW1iZXIucGFyc2VJbnQodmVyc2lvblszXSwgMTApO1xuICB9IGVsc2Uge1xuICAgIHZlci5tYWpvciA9IDA7XG4gICAgdmVyLm1pbm9yID0gMDtcbiAgICB2ZXIucGF0Y2ggPSAwO1xuICB9XG4gIGV4ZWNQYXRoVmVyc2lvbnMuc2V0KGV4ZWNQYXRoLCB2ZXIpO1xufTtcblxuY29uc3QgZ2V0UEhQQ1NWZXJzaW9uID0gYXN5bmMgKGV4ZWNQYXRoKSA9PiB7XG4gIGlmICghZXhlY1BhdGhWZXJzaW9ucy5oYXMoZXhlY1BhdGgpKSB7XG4gICAgYXdhaXQgZGV0ZXJtaW5lRXhlY1ZlcnNpb24oZXhlY1BhdGgpO1xuICB9XG4gIHJldHVybiBleGVjUGF0aFZlcnNpb25zLmdldChleGVjUGF0aCk7XG59O1xuXG5jb25zdCBmaXhQSFBDU0NvbHVtbiA9IChsaW5lVGV4dCwgbGluZSwgZ2l2ZW5Db2wpID0+IHtcbiAgLy8gQWxtb3N0IGFsbCBQSFBDUyBzbmlmZnMgZGVmYXVsdCB0byByZXBsYWNpbmcgdGFicyB3aXRoIDQgc3BhY2VzXG4gIC8vIFRoaXMgaXMgaG9ycmlibHkgd3JvbmcsIGJ1dCB0aGF0J3MgaG93IGl0IHdvcmtzIGN1cnJlbnRseVxuICBjb25zdCB0YWJMZW5ndGggPSB0YWJXaWR0aCA+IDAgPyB0YWJXaWR0aCA6IDQ7XG4gIGxldCBjb2x1bW4gPSBnaXZlbkNvbDtcbiAgbGV0IHNjcmVlbkNvbCA9IDA7XG4gIGZvciAobGV0IGNvbCA9IDA7IGNvbCA8IGxpbmVUZXh0Lmxlbmd0aDsgY29sICs9IDEpIHtcbiAgICBjb25zdCBjaGFyID0gbGluZVRleHRbY29sXTtcbiAgICBpZiAoY2hhciA9PT0gJ1xcdCcpIHtcbiAgICAgIHNjcmVlbkNvbCArPSB0YWJMZW5ndGggLSAoc2NyZWVuQ29sICUgdGFiTGVuZ3RoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NyZWVuQ29sICs9IDE7XG4gICAgfVxuICAgIGlmIChzY3JlZW5Db2wgPj0gY29sdW1uKSB7XG4gICAgICBjb2x1bW4gPSBjb2wgKyAxO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2x1bW47XG59O1xuXG5jb25zdCBzY29wZUF2YWlsYWJsZSA9IChzY29wZSwgYXZhaWxhYmxlKSA9PiB7XG4gIGlmIChhdmFpbGFibGUgPT09IGZhbHNlICYmIGdyYW1tYXJTY29wZXMuaW5jbHVkZXMoc2NvcGUpKSB7XG4gICAgZ3JhbW1hclNjb3Blcy5zcGxpY2UoZ3JhbW1hclNjb3Blcy5pbmRleE9mKHNjb3BlKSwgMSk7XG4gIH0gZWxzZSBpZiAoYXZhaWxhYmxlID09PSB0cnVlICYmICFncmFtbWFyU2NvcGVzLmluY2x1ZGVzKHNjb3BlKSkge1xuICAgIGdyYW1tYXJTY29wZXMucHVzaChzY29wZSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItcGhwY3MnKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocGNzLmV4ZWN1dGFibGVQYXRoJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGV4ZWN1dGFibGVQYXRoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3MuYXV0b0V4ZWN1dGFibGVTZWFyY2gnLCAodmFsdWUpID0+IHtcbiAgICAgICAgYXV0b0V4ZWN1dGFibGVTZWFyY2ggPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5kaXNhYmxlV2hlbk5vQ29uZmlnRmlsZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICBkaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocGNzLmNvZGVTdGFuZGFyZE9yQ29uZmlnRmlsZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICBjb2RlU3RhbmRhcmRPckNvbmZpZ0ZpbGUgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5hdXRvQ29uZmlnU2VhcmNoJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGF1dG9Db25maWdTZWFyY2ggPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5pZ25vcmVQYXR0ZXJucycsICh2YWx1ZSkgPT4ge1xuICAgICAgICBpZ25vcmVQYXR0ZXJucyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocGNzLmRpc3BsYXlFcnJvcnNPbmx5JywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGVycm9yc09ubHkgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy53YXJuaW5nU2V2ZXJpdHknLCAodmFsdWUpID0+IHtcbiAgICAgICAgd2FybmluZ1NldmVyaXR5ID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3MudGFiV2lkdGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGFiV2lkdGggPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5zaG93U291cmNlJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHNob3dTb3VyY2UgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5kaXNhYmxlRXhlY3V0ZVRpbWVvdXQnLCAodmFsdWUpID0+IHtcbiAgICAgICAgZGlzYWJsZUV4ZWN1dGVUaW1lb3V0ID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3MuZXhjbHVkZWRTbmlmZnMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgZXhjbHVkZWRTbmlmZnMgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5vdGhlckxhbmd1YWdlcy51c2VDU1NUb29scycsICh2YWx1ZSkgPT4ge1xuICAgICAgICBzY29wZUF2YWlsYWJsZSgnc291cmNlLmNzcycsIHZhbHVlKTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5vdGhlckxhbmd1YWdlcy51c2VKU1Rvb2xzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHNjb3BlQXZhaWxhYmxlKCdzb3VyY2UuanMnLCB2YWx1ZSk7XG4gICAgICB9KSxcbiAgICApO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUEhQQ1MnLFxuICAgICAgZ3JhbW1hclNjb3BlcyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBmaWxlVGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuICAgICAgICBjb25zdCBmaWxlRGlyID0gcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcblxuICAgICAgICBpZiAoZmlsZVRleHQgPT09ICcnKSB7XG4gICAgICAgICAgLy8gRW1wdHkgZmlsZSwgZW1wdHkgcmVzdWx0c1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBbJy0tcmVwb3J0PWpzb24nXTtcblxuICAgICAgICAvLyBDaGVjayBpZiBhIGxvY2FsIFBIUENTIGV4ZWN1dGFibGUgaXMgYXZhaWxhYmxlXG4gICAgICAgIGlmIChhdXRvRXhlY3V0YWJsZVNlYXJjaCkge1xuICAgICAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBhd2FpdCBoZWxwZXJzLmZpbmRDYWNoZWRBc3luYyhcbiAgICAgICAgICAgIGZpbGVEaXIsIFsndmVuZG9yL2Jpbi9waHBjcy5iYXQnLCAndmVuZG9yL2Jpbi9waHBjcyddLFxuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAoZXhlY3V0YWJsZSAhPT0gbnVsbCkge1xuICAgICAgICAgICAgZXhlY3V0YWJsZVBhdGggPSBleGVjdXRhYmxlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEdldCB0aGUgdmVyc2lvbiBvZiB0aGUgY2hvc2VuIFBIUENTXG4gICAgICAgIGNvbnN0IHZlcnNpb24gPSBhd2FpdCBnZXRQSFBDU1ZlcnNpb24oZXhlY3V0YWJsZVBhdGgpO1xuXG4gICAgICAgIC8vIC1xIChxdWlldCkgb3B0aW9uIGlzIGF2YWlsYWJsZSBzaW5jZSBwaHBjcyAyLjYuMlxuICAgICAgICBpZiAodmVyc2lvbi5tYWpvciA+IDJcbiAgICAgICAgICB8fCAodmVyc2lvbi5tYWpvciA9PT0gMiAmJiB2ZXJzaW9uLm1pbm9yID4gNilcbiAgICAgICAgICB8fCAodmVyc2lvbi5tYWpvciA9PT0gMiAmJiB2ZXJzaW9uLm1pbm9yID09PSA2ICYmIHZlcnNpb24ucGF0Y2ggPj0gMilcbiAgICAgICAgKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctcScpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gLS1lbmNvZGluZyBpcyBhdmFpbGFibGUgc2luY2UgMS4zLjAgKFJDMSwgYnV0IHdlIGlnbm9yZSB0aGF0IGZvciBzaW1wbGljaXR5KVxuICAgICAgICBpZiAodmVyc2lvbi5tYWpvciA+IDFcbiAgICAgICAgICB8fCAodmVyc2lvbi5tYWpvciA9PT0gMSAmJiB2ZXJzaW9uLm1pbm9yID49IDMpXG4gICAgICAgICkge1xuICAgICAgICAgIC8vIGFjdHVhbCBmaWxlIGVuY29kaW5nIGlzIGlycmVsZXZhbnQsIGFzIFBIUENTIHdpbGwgYWx3YXlzIGdldCBVVEYtOCBhcyBpdHMgaW5wdXRcbiAgICAgICAgICAvLyBzZWUgYW5hbHlzaXMgaGVyZTogaHR0cHM6Ly9naXRodWIuY29tL0F0b21MaW50ZXIvbGludGVyLXBocGNzL2lzc3Vlcy8yMzVcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tZW5jb2Rpbmc9VVRGLTgnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIGZpbGUgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPiAyKSB7XG4gICAgICAgICAgLy8gUEhQQ1MgdjMgYW5kIHVwIHN1cHBvcnQgdGhpcyB3aXRoIFNURElOIGZpbGVzXG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKGAtLWlnbm9yZT0ke2lnbm9yZVBhdHRlcm5zLmpvaW4oJywnKX1gKTtcbiAgICAgICAgfSBlbHNlIGlmIChpZ25vcmVQYXR0ZXJucy5zb21lKHBhdHRlcm4gPT4gbWluaW1hdGNoKGZpbGVQYXRoLCBwYXR0ZXJuKSkpIHtcbiAgICAgICAgICAvLyBXZSBtdXN0IGRldGVybWluZSB0aGlzIG91cnNlbGYgZm9yIGxvd2VyIHZlcnNpb25zXG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgYSBjb25maWcgZmlsZSBleGlzdHMgYW5kIGhhbmRsZSBpdFxuICAgICAgICBjb25zdCBjb25mRmlsZSA9IGF3YWl0IGhlbHBlcnMuZmluZEFzeW5jKGZpbGVEaXIsXG4gICAgICAgICAgWydwaHBjcy54bWwnLCAncGhwY3MueG1sLmRpc3QnLCAncGhwY3MucnVsZXNldC54bWwnLCAncnVsZXNldC54bWwnXSxcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKGRpc2FibGVXaGVuTm9Db25maWdGaWxlICYmICFjb25mRmlsZSkge1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHN0YW5kYXJkID0gYXV0b0NvbmZpZ1NlYXJjaCAmJiBjb25mRmlsZSA/IGNvbmZGaWxlIDogY29kZVN0YW5kYXJkT3JDb25maWdGaWxlO1xuICAgICAgICBpZiAoc3RhbmRhcmQpIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goYC0tc3RhbmRhcmQ9JHtzdGFuZGFyZH1gKTtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbWV0ZXJzLnB1c2goYC0td2FybmluZy1zZXZlcml0eT0ke2Vycm9yc09ubHkgPyAwIDogd2FybmluZ1NldmVyaXR5fWApO1xuICAgICAgICBpZiAodGFiV2lkdGggPiAxKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKGAtLXRhYi13aWR0aD0ke3RhYldpZHRofWApO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzaG93U291cmNlKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctcycpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWdub3JlIGFueSByZXF1ZXN0ZWQgU25pZmZzXG4gICAgICAgIGlmIChleGNsdWRlZFNuaWZmcy5sZW5ndGggPiAwICYmIChcbiAgICAgICAgICB2ZXJzaW9uLm1ham9yID4gMiB8fFxuICAgICAgICAgICh2ZXJzaW9uLm1ham9yID09PSAyICYmIHZlcnNpb24ubWlub3IgPiA2KSB8fFxuICAgICAgICAgICh2ZXJzaW9uLm1ham9yID09PSAyICYmIHZlcnNpb24ubWlub3IgPT09IDYgJiYgdmVyc2lvbi5wYXRjaCA+IDEpXG4gICAgICAgICkpIHtcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goYC0tZXhjbHVkZT0ke2V4Y2x1ZGVkU25pZmZzLmpvaW4oJywnKX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIERldGVybWluZSB0aGUgbWV0aG9kIG9mIHNldHRpbmcgdGhlIGZpbGUgbmFtZVxuICAgICAgICBsZXQgdGV4dDtcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPj0gMyB8fCAodmVyc2lvbi5tYWpvciA9PT0gMiAmJiB2ZXJzaW9uLm1pbm9yID49IDYpKSB7XG4gICAgICAgICAgLy8gUEhQQ1MgMi42IGFuZCBhYm92ZSBzdXBwb3J0IHNlbmRpbmcgdGhlIGZpbGVuYW1lIGluIGEgZmxhZ1xuICAgICAgICAgIHBhcmFtZXRlcnMucHVzaChgLS1zdGRpbi1wYXRoPVwiJHtmaWxlUGF0aH1cImApO1xuICAgICAgICAgIHRleHQgPSBmaWxlVGV4dDtcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJzaW9uLm1ham9yID09PSAyICYmIHZlcnNpb24ubWlub3IgPCA2KSB7XG4gICAgICAgICAgLy8gUEhQQ1MgMi54LnggYmVmb3JlIDIuNi4wIHN1cHBvcnRzIHB1dHRpbmcgdGhlIG5hbWUgaW4gdGhlIHN0YXJ0IG9mIHRoZSBzdHJlYW1cbiAgICAgICAgICBjb25zdCBlb2xDaGFyID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKS5saW5lRW5kaW5nRm9yUm93KDApO1xuICAgICAgICAgIHRleHQgPSBgcGhwY3NfaW5wdXRfZmlsZTogJHtmaWxlUGF0aH0ke2VvbENoYXJ9JHtmaWxlVGV4dH1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFBIUENTIHYxIHN1cHBvcnRzIHN0ZGluLCBidXQgaWdub3JlcyBhbGwgZmlsZW5hbWVzXG4gICAgICAgICAgdGV4dCA9IGZpbGVUZXh0O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRmluaXNoIG9mZiB0aGUgcGFyYW1ldGVyIGxpc3RcbiAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctJyk7XG5cbiAgICAgICAgLy8gUnVuIFBIUENTIGZyb20gdGhlIHByb2plY3Qgcm9vdCwgb3IgaWYgbm90IGluIGEgcHJvamVjdCB0aGUgZmlsZSBkaXJlY3RvcnlcbiAgICAgICAgbGV0IHByb2plY3RQYXRoID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVQYXRoKVswXTtcbiAgICAgICAgaWYgKHByb2plY3RQYXRoID09PSBudWxsKSB7XG4gICAgICAgICAgcHJvamVjdFBhdGggPSBmaWxlRGlyO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZXhlY09wdGlvbnMgPSB7XG4gICAgICAgICAgY3dkOiBwcm9qZWN0UGF0aCxcbiAgICAgICAgICBzdGRpbjogdGV4dCxcbiAgICAgICAgICBpZ25vcmVFeGl0Q29kZTogdHJ1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKGRpc2FibGVFeGVjdXRlVGltZW91dCkge1xuICAgICAgICAgIGV4ZWNPcHRpb25zLnRpbWVvdXQgPSBJbmZpbml0eTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uZkZpbGUpIHtcbiAgICAgICAgICBleGVjT3B0aW9ucy5jd2QgPSBwYXRoLmRpcm5hbWUoY29uZkZpbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgaGVscGVycy5leGVjKGV4ZWN1dGFibGVQYXRoLCBwYXJhbWV0ZXJzLCBleGVjT3B0aW9ucyk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGZpbGUgY29udGVudHMgaGF2ZSBjaGFuZ2VkIHNpbmNlIHRoZSBsaW50IHdhcyB0cmlnZ2VyZWRcbiAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSBmaWxlVGV4dCkge1xuICAgICAgICAgIC8vIENvbnRlbnRzIGhhdmUgY2hhbmdlZCwgdGVsbCBMaW50ZXIgbm90IHRvIHVwZGF0ZSByZXN1bHRzXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgZGF0YTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkYXRhID0gSlNPTi5wYXJzZShyZXN1bHQudG9TdHJpbmcoKS50cmltKCkpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignRXJyb3IgcGFyc2luZyBQSFBDUyByZXNwb25zZScsIHtcbiAgICAgICAgICAgIGRldGFpbDogJ1NvbWV0aGluZyB3ZW50IHdyb25nIGF0dGVtcHRpbmcgdG8gcGFyc2UgdGhlIFBIUENTIG91dHB1dC4nLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLmxvZygnUEhQQ1MgUmVzcG9uc2UnLCByZXN1bHQpO1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBtZXNzYWdlcztcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPj0gMyB8fCAodmVyc2lvbi5tYWpvciA9PT0gMiAmJiB2ZXJzaW9uLm1pbm9yID49IDYpKSB7XG4gICAgICAgICAgaWYgKCFkYXRhLmZpbGVzW2BcIiR7ZmlsZVBhdGh9XCJgXSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXNzYWdlcyA9IGRhdGEuZmlsZXNbYFwiJHtmaWxlUGF0aH1cImBdLm1lc3NhZ2VzO1xuICAgICAgICB9IGVsc2UgaWYgKHZlcnNpb24ubWFqb3IgPT09IDIgJiYgdmVyc2lvbi5taW5vciA8IDYpIHtcbiAgICAgICAgICBpZiAoIWRhdGEuZmlsZXNbZmlsZVBhdGhdKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgfVxuICAgICAgICAgIG1lc3NhZ2VzID0gZGF0YS5maWxlc1tmaWxlUGF0aF0ubWVzc2FnZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gUEhQQ1MgdjEgY2FuJ3QgYXNzb2NpYXRlIGEgZmlsZW5hbWUgd2l0aCBTVERJTiBpbnB1dFxuICAgICAgICAgIGlmICghZGF0YS5maWxlcy5TVERJTikge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXNzYWdlcyA9IGRhdGEuZmlsZXMuU1RESU4ubWVzc2FnZXM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVzc2FnZXMubWFwKChtZXNzYWdlKSA9PiB7XG4gICAgICAgICAgLy8gZml4IGNvbHVtbiBpbiBsaW5lIHdpdGggdGFic1xuICAgICAgICAgIGxldCB7IGxpbmUsIGNvbHVtbiB9ID0gbWVzc2FnZTtcbiAgICAgICAgICBsaW5lIC09IDE7XG4gICAgICAgICAgY29uc3QgbGluZVRleHQgPSB0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmxpbmVGb3JSb3cobGluZSk7XG5cbiAgICAgICAgICBpZiAobGluZVRleHQuaW5jbHVkZXMoJ1xcdCcpKSB7XG4gICAgICAgICAgICBjb2x1bW4gPSBmaXhQSFBDU0NvbHVtbihsaW5lVGV4dCwgbGluZSwgY29sdW1uKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29sdW1uIC09IDE7XG5cbiAgICAgICAgICBsZXQgcmFuZ2U7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJhbmdlID0gaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKHRleHRFZGl0b3IsIGxpbmUsIGNvbHVtbik7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAgICdsaW50ZXItcGhwY3M6OiBJbnZhbGlkIHBvaW50IGVuY291bnRlcmVkIGluIHRoZSBhdHRhY2hlZCBtZXNzYWdlJyxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgc291cmNlOiB7XG4gICAgICAgICAgICAgICAgICBsaW5lTGVuZ3RoOiBsaW5lVGV4dC5sZW5ndGgsXG4gICAgICAgICAgICAgICAgICBsaW5lVGV4dCxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRocm93IEVycm9yKCdJbnZhbGlkIHBvaW50IGVuY291bnRlcmVkISBTZWUgY29uc29sZSBmb3IgZGV0YWlscy4nKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zdCBtc2cgPSB7XG4gICAgICAgICAgICB0eXBlOiBtZXNzYWdlLnR5cGUsXG4gICAgICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgICAgIHJhbmdlLFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoc2hvd1NvdXJjZSkge1xuICAgICAgICAgICAgbXNnLmh0bWwgPSBgPHNwYW4gY2xhc3M9XCJiYWRnZSBiYWRnZS1mbGV4aWJsZVwiPiR7bWVzc2FnZS5zb3VyY2UgfHwgJ1Vua25vd24nfTwvc3Bhbj4gYDtcbiAgICAgICAgICAgIG1zZy5odG1sICs9IGVzY2FwZUh0bWwobWVzc2FnZS5tZXNzYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbXNnLnRleHQgPSBtZXNzYWdlLm1lc3NhZ2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIG1zZztcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19