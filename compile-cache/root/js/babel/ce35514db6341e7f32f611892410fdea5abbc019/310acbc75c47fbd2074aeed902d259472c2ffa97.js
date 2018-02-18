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
            range = helpers.generateRange(textEditor, line, column);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1waHBjcy9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OzBCQUNqQixhQUFhOztJQUExQixPQUFPOztvQkFDRixNQUFNOzs7O3lCQUNELFdBQVc7Ozs7MEJBQ1YsYUFBYTs7Ozs7QUFQcEMsV0FBVyxDQUFDLEFBVVosSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ25DLElBQU0sYUFBYSxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7OztBQUdyQyxJQUFJLGNBQWMsWUFBQSxDQUFDO0FBQ25CLElBQUksb0JBQW9CLFlBQUEsQ0FBQztBQUN6QixJQUFJLHVCQUF1QixZQUFBLENBQUM7QUFDNUIsSUFBSSx3QkFBd0IsWUFBQSxDQUFDO0FBQzdCLElBQUksZ0JBQWdCLFlBQUEsQ0FBQztBQUNyQixJQUFJLGNBQWMsWUFBQSxDQUFDO0FBQ25CLElBQUksVUFBVSxZQUFBLENBQUM7QUFDZixJQUFJLGVBQWUsWUFBQSxDQUFDO0FBQ3BCLElBQUksUUFBUSxZQUFBLENBQUM7QUFDYixJQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsSUFBSSxxQkFBcUIsWUFBQSxDQUFDO0FBQzFCLElBQUksY0FBYyxZQUFBLENBQUM7O0FBRW5CLElBQU0sb0JBQW9CLHFCQUFHLFdBQU8sUUFBUSxFQUFLO0FBQy9DLE1BQU0sYUFBYSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ2xFLE1BQU0sY0FBYyxHQUFHLCtDQUErQyxDQUFDO0FBQ3ZFLE1BQU0sT0FBTyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEQsTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO0FBQ2YsTUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO0FBQ3BC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LENBQUMsSUFBSSxDQUFDLEVBQUU7QUFDM0Isa0JBQU0sR0FBRyxjQUFjLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztXQUNqRDtBQUNELGdCQUFNLElBQUksQ0FBQyxDQUFDOztBQUVaLGNBQUksS0FBSyxZQUFBLENBQUM7QUFDVixjQUFJO0FBQ0YsaUJBQUssR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7V0FDekQsQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFVixtQkFBTyxDQUFDLEtBQUssQ0FDWCxrRUFBa0UsRUFDbEU7QUFDRSxxQkFBTyxFQUFQLE9BQU87QUFDUCxvQkFBTSxFQUFFO0FBQ04sMEJBQVUsRUFBRSxRQUFRLENBQUMsTUFBTTtBQUMzQix3QkFBUSxFQUFSLFFBQVE7ZUFDVDthQUNGLENBQ0YsQ0FBQztBQUNGLGtCQUFNLEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1dBQ3BFOztBQUVELGNBQU0sR0FBRyxHQUFHO0FBQ1YsZ0JBQUksRUFBRSxPQUFPLENBQUMsSUFBSTtBQUNsQixvQkFBUSxFQUFSLFFBQVE7QUFDUixpQkFBSyxFQUFMLEtBQUs7V0FDTixDQUFDOztBQUVGLGNBQUksVUFBVSxFQUFFO0FBQ2QsZUFBRyxDQUFDLElBQUksNENBQXlDLE9BQU8sQ0FBQyxNQUFNLElBQUksU0FBUyxDQUFBLGFBQVUsQ0FBQztBQUN2RixlQUFHLENBQUMsSUFBSSxJQUFJLDZCQUFXLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztXQUN6QyxNQUFNO0FBQ0wsZUFBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1dBQzVCOztBQUVELGlCQUFPLEdBQUcsQ0FBQztTQUNaLENBQUMsQ0FBQztPQUNKLENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9saW50ZXItcGhwY3MvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGltcG9ydC9leHRlbnNpb25zLCBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXNcbmltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tICdhdG9tJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnYXRvbS1saW50ZXInO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgZXNjYXBlSHRtbCBmcm9tICdlc2NhcGUtaHRtbCc7XG5cbi8vIExvY2FsIHZhcmlhYmxlc1xuY29uc3QgZXhlY1BhdGhWZXJzaW9ucyA9IG5ldyBNYXAoKTtcbmNvbnN0IGdyYW1tYXJTY29wZXMgPSBbJ3NvdXJjZS5waHAnXTtcblxuLy8gU2V0dGluZ3NcbmxldCBleGVjdXRhYmxlUGF0aDtcbmxldCBhdXRvRXhlY3V0YWJsZVNlYXJjaDtcbmxldCBkaXNhYmxlV2hlbk5vQ29uZmlnRmlsZTtcbmxldCBjb2RlU3RhbmRhcmRPckNvbmZpZ0ZpbGU7XG5sZXQgYXV0b0NvbmZpZ1NlYXJjaDtcbmxldCBpZ25vcmVQYXR0ZXJucztcbmxldCBlcnJvcnNPbmx5O1xubGV0IHdhcm5pbmdTZXZlcml0eTtcbmxldCB0YWJXaWR0aDtcbmxldCBzaG93U291cmNlO1xubGV0IGRpc2FibGVFeGVjdXRlVGltZW91dDtcbmxldCBleGNsdWRlZFNuaWZmcztcblxuY29uc3QgZGV0ZXJtaW5lRXhlY1ZlcnNpb24gPSBhc3luYyAoZXhlY1BhdGgpID0+IHtcbiAgY29uc3QgdmVyc2lvblN0cmluZyA9IGF3YWl0IGhlbHBlcnMuZXhlYyhleGVjUGF0aCwgWyctLXZlcnNpb24nXSk7XG4gIGNvbnN0IHZlcnNpb25QYXR0ZXJuID0gL15QSFBfQ29kZVNuaWZmZXIgdmVyc2lvbiAoXFxkKylcXC4oXFxkKylcXC4oXFxkKykvaTtcbiAgY29uc3QgdmVyc2lvbiA9IHZlcnNpb25TdHJpbmcubWF0Y2godmVyc2lvblBhdHRlcm4pO1xuICBjb25zdCB2ZXIgPSB7fTtcbiAgaWYgKHZlcnNpb24gIT09IG51bGwpIHtcbiAgICB2ZXIubWFqb3IgPSBOdW1iZXIucGFyc2VJbnQodmVyc2lvblsxXSwgMTApO1xuICAgIHZlci5taW5vciA9IE51bWJlci5wYXJzZUludCh2ZXJzaW9uWzJdLCAxMCk7XG4gICAgdmVyLnBhdGNoID0gTnVtYmVyLnBhcnNlSW50KHZlcnNpb25bM10sIDEwKTtcbiAgfSBlbHNlIHtcbiAgICB2ZXIubWFqb3IgPSAwO1xuICAgIHZlci5taW5vciA9IDA7XG4gICAgdmVyLnBhdGNoID0gMDtcbiAgfVxuICBleGVjUGF0aFZlcnNpb25zLnNldChleGVjUGF0aCwgdmVyKTtcbn07XG5cbmNvbnN0IGdldFBIUENTVmVyc2lvbiA9IGFzeW5jIChleGVjUGF0aCkgPT4ge1xuICBpZiAoIWV4ZWNQYXRoVmVyc2lvbnMuaGFzKGV4ZWNQYXRoKSkge1xuICAgIGF3YWl0IGRldGVybWluZUV4ZWNWZXJzaW9uKGV4ZWNQYXRoKTtcbiAgfVxuICByZXR1cm4gZXhlY1BhdGhWZXJzaW9ucy5nZXQoZXhlY1BhdGgpO1xufTtcblxuY29uc3QgZml4UEhQQ1NDb2x1bW4gPSAobGluZVRleHQsIGxpbmUsIGdpdmVuQ29sKSA9PiB7XG4gIC8vIEFsbW9zdCBhbGwgUEhQQ1Mgc25pZmZzIGRlZmF1bHQgdG8gcmVwbGFjaW5nIHRhYnMgd2l0aCA0IHNwYWNlc1xuICAvLyBUaGlzIGlzIGhvcnJpYmx5IHdyb25nLCBidXQgdGhhdCdzIGhvdyBpdCB3b3JrcyBjdXJyZW50bHlcbiAgY29uc3QgdGFiTGVuZ3RoID0gdGFiV2lkdGggPiAwID8gdGFiV2lkdGggOiA0O1xuICBsZXQgY29sdW1uID0gZ2l2ZW5Db2w7XG4gIGxldCBzY3JlZW5Db2wgPSAwO1xuICBmb3IgKGxldCBjb2wgPSAwOyBjb2wgPCBsaW5lVGV4dC5sZW5ndGg7IGNvbCArPSAxKSB7XG4gICAgY29uc3QgY2hhciA9IGxpbmVUZXh0W2NvbF07XG4gICAgaWYgKGNoYXIgPT09ICdcXHQnKSB7XG4gICAgICBzY3JlZW5Db2wgKz0gdGFiTGVuZ3RoIC0gKHNjcmVlbkNvbCAlIHRhYkxlbmd0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNjcmVlbkNvbCArPSAxO1xuICAgIH1cbiAgICBpZiAoc2NyZWVuQ29sID49IGNvbHVtbikge1xuICAgICAgY29sdW1uID0gY29sICsgMTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gY29sdW1uO1xufTtcblxuY29uc3Qgc2NvcGVBdmFpbGFibGUgPSAoc2NvcGUsIGF2YWlsYWJsZSkgPT4ge1xuICBpZiAoYXZhaWxhYmxlID09PSBmYWxzZSAmJiBncmFtbWFyU2NvcGVzLmluY2x1ZGVzKHNjb3BlKSkge1xuICAgIGdyYW1tYXJTY29wZXMuc3BsaWNlKGdyYW1tYXJTY29wZXMuaW5kZXhPZihzY29wZSksIDEpO1xuICB9IGVsc2UgaWYgKGF2YWlsYWJsZSA9PT0gdHJ1ZSAmJiAhZ3JhbW1hclNjb3Blcy5pbmNsdWRlcyhzY29wZSkpIHtcbiAgICBncmFtbWFyU2NvcGVzLnB1c2goc2NvcGUpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHJlcXVpcmUoJ2F0b20tcGFja2FnZS1kZXBzJykuaW5zdGFsbCgnbGludGVyLXBocGNzJyk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5leGVjdXRhYmxlUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICBleGVjdXRhYmxlUGF0aCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocGNzLmF1dG9FeGVjdXRhYmxlU2VhcmNoJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGF1dG9FeGVjdXRhYmxlU2VhcmNoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3MuZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUnLCAodmFsdWUpID0+IHtcbiAgICAgICAgZGlzYWJsZVdoZW5Ob0NvbmZpZ0ZpbGUgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5jb2RlU3RhbmRhcmRPckNvbmZpZ0ZpbGUnLCAodmFsdWUpID0+IHtcbiAgICAgICAgY29kZVN0YW5kYXJkT3JDb25maWdGaWxlID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3MuYXV0b0NvbmZpZ1NlYXJjaCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICBhdXRvQ29uZmlnU2VhcmNoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3MuaWdub3JlUGF0dGVybnMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgaWdub3JlUGF0dGVybnMgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBjcy5kaXNwbGF5RXJyb3JzT25seScsICh2YWx1ZSkgPT4ge1xuICAgICAgICBlcnJvcnNPbmx5ID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3Mud2FybmluZ1NldmVyaXR5JywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHdhcm5pbmdTZXZlcml0eSA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocGNzLnRhYldpZHRoJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRhYldpZHRoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3Muc2hvd1NvdXJjZScsICh2YWx1ZSkgPT4ge1xuICAgICAgICBzaG93U291cmNlID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3MuZGlzYWJsZUV4ZWN1dGVUaW1lb3V0JywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGRpc2FibGVFeGVjdXRlVGltZW91dCA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocGNzLmV4Y2x1ZGVkU25pZmZzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGV4Y2x1ZGVkU25pZmZzID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3Mub3RoZXJMYW5ndWFnZXMudXNlQ1NTVG9vbHMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgc2NvcGVBdmFpbGFibGUoJ3NvdXJjZS5jc3MnLCB2YWx1ZSk7XG4gICAgICB9KSxcbiAgICApO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcGhwY3Mub3RoZXJMYW5ndWFnZXMudXNlSlNUb29scycsICh2YWx1ZSkgPT4ge1xuICAgICAgICBzY29wZUF2YWlsYWJsZSgnc291cmNlLmpzJywgdmFsdWUpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ1BIUENTJyxcbiAgICAgIGdyYW1tYXJTY29wZXMsXG4gICAgICBzY29wZTogJ2ZpbGUnLFxuICAgICAgbGludE9uRmx5OiB0cnVlLFxuICAgICAgbGludDogYXN5bmMgKHRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZVRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKTtcbiAgICAgICAgY29uc3QgZmlsZURpciA9IHBhdGguZGlybmFtZShmaWxlUGF0aCk7XG5cbiAgICAgICAgaWYgKGZpbGVUZXh0ID09PSAnJykge1xuICAgICAgICAgIC8vIEVtcHR5IGZpbGUsIGVtcHR5IHJlc3VsdHNcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwYXJhbWV0ZXJzID0gWyctLXJlcG9ydD1qc29uJ107XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgYSBsb2NhbCBQSFBDUyBleGVjdXRhYmxlIGlzIGF2YWlsYWJsZVxuICAgICAgICBpZiAoYXV0b0V4ZWN1dGFibGVTZWFyY2gpIHtcbiAgICAgICAgICBjb25zdCBleGVjdXRhYmxlID0gYXdhaXQgaGVscGVycy5maW5kQ2FjaGVkQXN5bmMoXG4gICAgICAgICAgICBmaWxlRGlyLCBbJ3ZlbmRvci9iaW4vcGhwY3MuYmF0JywgJ3ZlbmRvci9iaW4vcGhwY3MnXSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgaWYgKGV4ZWN1dGFibGUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGV4ZWN1dGFibGVQYXRoID0gZXhlY3V0YWJsZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBHZXQgdGhlIHZlcnNpb24gb2YgdGhlIGNob3NlbiBQSFBDU1xuICAgICAgICBjb25zdCB2ZXJzaW9uID0gYXdhaXQgZ2V0UEhQQ1NWZXJzaW9uKGV4ZWN1dGFibGVQYXRoKTtcblxuICAgICAgICAvLyAtcSAocXVpZXQpIG9wdGlvbiBpcyBhdmFpbGFibGUgc2luY2UgcGhwY3MgMi42LjJcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPiAyXG4gICAgICAgICAgfHwgKHZlcnNpb24ubWFqb3IgPT09IDIgJiYgdmVyc2lvbi5taW5vciA+IDYpXG4gICAgICAgICAgfHwgKHZlcnNpb24ubWFqb3IgPT09IDIgJiYgdmVyc2lvbi5taW5vciA9PT0gNiAmJiB2ZXJzaW9uLnBhdGNoID49IDIpXG4gICAgICAgICkge1xuICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLXEnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIC0tZW5jb2RpbmcgaXMgYXZhaWxhYmxlIHNpbmNlIDEuMy4wIChSQzEsIGJ1dCB3ZSBpZ25vcmUgdGhhdCBmb3Igc2ltcGxpY2l0eSlcbiAgICAgICAgaWYgKHZlcnNpb24ubWFqb3IgPiAxXG4gICAgICAgICAgfHwgKHZlcnNpb24ubWFqb3IgPT09IDEgJiYgdmVyc2lvbi5taW5vciA+PSAzKVxuICAgICAgICApIHtcbiAgICAgICAgICAvLyBhY3R1YWwgZmlsZSBlbmNvZGluZyBpcyBpcnJlbGV2YW50LCBhcyBQSFBDUyB3aWxsIGFsd2F5cyBnZXQgVVRGLTggYXMgaXRzIGlucHV0XG4gICAgICAgICAgLy8gc2VlIGFuYWx5c2lzIGhlcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9BdG9tTGludGVyL2xpbnRlci1waHBjcy9pc3N1ZXMvMjM1XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWVuY29kaW5nPVVURi04Jyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiBmaWxlIHNob3VsZCBiZSBpZ25vcmVkXG4gICAgICAgIGlmICh2ZXJzaW9uLm1ham9yID4gMikge1xuICAgICAgICAgIC8vIFBIUENTIHYzIGFuZCB1cCBzdXBwb3J0IHRoaXMgd2l0aCBTVERJTiBmaWxlc1xuICAgICAgICAgIHBhcmFtZXRlcnMucHVzaChgLS1pZ25vcmU9JHtpZ25vcmVQYXR0ZXJucy5qb2luKCcsJyl9YCk7XG4gICAgICAgIH0gZWxzZSBpZiAoaWdub3JlUGF0dGVybnMuc29tZShwYXR0ZXJuID0+IG1pbmltYXRjaChmaWxlUGF0aCwgcGF0dGVybikpKSB7XG4gICAgICAgICAgLy8gV2UgbXVzdCBkZXRlcm1pbmUgdGhpcyBvdXJzZWxmIGZvciBsb3dlciB2ZXJzaW9uc1xuICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENoZWNrIGlmIGEgY29uZmlnIGZpbGUgZXhpc3RzIGFuZCBoYW5kbGUgaXRcbiAgICAgICAgY29uc3QgY29uZkZpbGUgPSBhd2FpdCBoZWxwZXJzLmZpbmRBc3luYyhmaWxlRGlyLFxuICAgICAgICAgIFsncGhwY3MueG1sJywgJ3BocGNzLnhtbC5kaXN0JywgJ3BocGNzLnJ1bGVzZXQueG1sJywgJ3J1bGVzZXQueG1sJ10sXG4gICAgICAgICk7XG4gICAgICAgIGlmIChkaXNhYmxlV2hlbk5vQ29uZmlnRmlsZSAmJiAhY29uZkZpbGUpIHtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBzdGFuZGFyZCA9IGF1dG9Db25maWdTZWFyY2ggJiYgY29uZkZpbGUgPyBjb25mRmlsZSA6IGNvZGVTdGFuZGFyZE9yQ29uZmlnRmlsZTtcbiAgICAgICAgaWYgKHN0YW5kYXJkKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKGAtLXN0YW5kYXJkPSR7c3RhbmRhcmR9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1ldGVycy5wdXNoKGAtLXdhcm5pbmctc2V2ZXJpdHk9JHtlcnJvcnNPbmx5ID8gMCA6IHdhcm5pbmdTZXZlcml0eX1gKTtcbiAgICAgICAgaWYgKHRhYldpZHRoID4gMSkge1xuICAgICAgICAgIHBhcmFtZXRlcnMucHVzaChgLS10YWItd2lkdGg9JHt0YWJXaWR0aH1gKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc2hvd1NvdXJjZSkge1xuICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLXMnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElnbm9yZSBhbnkgcmVxdWVzdGVkIFNuaWZmc1xuICAgICAgICBpZiAoZXhjbHVkZWRTbmlmZnMubGVuZ3RoID4gMCAmJiAoXG4gICAgICAgICAgdmVyc2lvbi5tYWpvciA+IDIgfHxcbiAgICAgICAgICAodmVyc2lvbi5tYWpvciA9PT0gMiAmJiB2ZXJzaW9uLm1pbm9yID4gNikgfHxcbiAgICAgICAgICAodmVyc2lvbi5tYWpvciA9PT0gMiAmJiB2ZXJzaW9uLm1pbm9yID09PSA2ICYmIHZlcnNpb24ucGF0Y2ggPiAxKVxuICAgICAgICApKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKGAtLWV4Y2x1ZGU9JHtleGNsdWRlZFNuaWZmcy5qb2luKCcsJyl9YCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZXRlcm1pbmUgdGhlIG1ldGhvZCBvZiBzZXR0aW5nIHRoZSBmaWxlIG5hbWVcbiAgICAgICAgbGV0IHRleHQ7XG4gICAgICAgIGlmICh2ZXJzaW9uLm1ham9yID49IDMgfHwgKHZlcnNpb24ubWFqb3IgPT09IDIgJiYgdmVyc2lvbi5taW5vciA+PSA2KSkge1xuICAgICAgICAgIC8vIFBIUENTIDIuNiBhbmQgYWJvdmUgc3VwcG9ydCBzZW5kaW5nIHRoZSBmaWxlbmFtZSBpbiBhIGZsYWdcbiAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goYC0tc3RkaW4tcGF0aD1cIiR7ZmlsZVBhdGh9XCJgKTtcbiAgICAgICAgICB0ZXh0ID0gZmlsZVRleHQ7XG4gICAgICAgIH0gZWxzZSBpZiAodmVyc2lvbi5tYWpvciA9PT0gMiAmJiB2ZXJzaW9uLm1pbm9yIDwgNikge1xuICAgICAgICAgIC8vIFBIUENTIDIueC54IGJlZm9yZSAyLjYuMCBzdXBwb3J0cyBwdXR0aW5nIHRoZSBuYW1lIGluIHRoZSBzdGFydCBvZiB0aGUgc3RyZWFtXG4gICAgICAgICAgY29uc3QgZW9sQ2hhciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkubGluZUVuZGluZ0ZvclJvdygwKTtcbiAgICAgICAgICB0ZXh0ID0gYHBocGNzX2lucHV0X2ZpbGU6ICR7ZmlsZVBhdGh9JHtlb2xDaGFyfSR7ZmlsZVRleHR9YDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBQSFBDUyB2MSBzdXBwb3J0cyBzdGRpbiwgYnV0IGlnbm9yZXMgYWxsIGZpbGVuYW1lc1xuICAgICAgICAgIHRleHQgPSBmaWxlVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZpbmlzaCBvZmYgdGhlIHBhcmFtZXRlciBsaXN0XG4gICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLScpO1xuXG4gICAgICAgIC8vIFJ1biBQSFBDUyBmcm9tIHRoZSBwcm9qZWN0IHJvb3QsIG9yIGlmIG5vdCBpbiBhIHByb2plY3QgdGhlIGZpbGUgZGlyZWN0b3J5XG4gICAgICAgIGxldCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF07XG4gICAgICAgIGlmIChwcm9qZWN0UGF0aCA9PT0gbnVsbCkge1xuICAgICAgICAgIHByb2plY3RQYXRoID0gZmlsZURpcjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGV4ZWNPcHRpb25zID0ge1xuICAgICAgICAgIGN3ZDogcHJvamVjdFBhdGgsXG4gICAgICAgICAgc3RkaW46IHRleHQsXG4gICAgICAgICAgaWdub3JlRXhpdENvZGU6IHRydWUsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChkaXNhYmxlRXhlY3V0ZVRpbWVvdXQpIHtcbiAgICAgICAgICBleGVjT3B0aW9ucy50aW1lb3V0ID0gSW5maW5pdHk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbmZGaWxlKSB7XG4gICAgICAgICAgZXhlY09wdGlvbnMuY3dkID0gcGF0aC5kaXJuYW1lKGNvbmZGaWxlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGhlbHBlcnMuZXhlYyhleGVjdXRhYmxlUGF0aCwgcGFyYW1ldGVycywgZXhlY09wdGlvbnMpO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZSBmaWxlIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCBzaW5jZSB0aGUgbGludCB3YXMgdHJpZ2dlcmVkXG4gICAgICAgIGlmICh0ZXh0RWRpdG9yLmdldFRleHQoKSAhPT0gZmlsZVRleHQpIHtcbiAgICAgICAgICAvLyBDb250ZW50cyBoYXZlIGNoYW5nZWQsIHRlbGwgTGludGVyIG5vdCB0byB1cGRhdGUgcmVzdWx0c1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGRhdGE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UocmVzdWx0LnRvU3RyaW5nKCkudHJpbSgpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0Vycm9yIHBhcnNpbmcgUEhQQ1MgcmVzcG9uc2UnLCB7XG4gICAgICAgICAgICBkZXRhaWw6ICdTb21ldGhpbmcgd2VudCB3cm9uZyBhdHRlbXB0aW5nIHRvIHBhcnNlIHRoZSBQSFBDUyBvdXRwdXQuJyxcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5sb2coJ1BIUENTIFJlc3BvbnNlJywgcmVzdWx0KTtcbiAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbWVzc2FnZXM7XG4gICAgICAgIGlmICh2ZXJzaW9uLm1ham9yID49IDMgfHwgKHZlcnNpb24ubWFqb3IgPT09IDIgJiYgdmVyc2lvbi5taW5vciA+PSA2KSkge1xuICAgICAgICAgIGlmICghZGF0YS5maWxlc1tgXCIke2ZpbGVQYXRofVwiYF0pIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWVzc2FnZXMgPSBkYXRhLmZpbGVzW2BcIiR7ZmlsZVBhdGh9XCJgXS5tZXNzYWdlcztcbiAgICAgICAgfSBlbHNlIGlmICh2ZXJzaW9uLm1ham9yID09PSAyICYmIHZlcnNpb24ubWlub3IgPCA2KSB7XG4gICAgICAgICAgaWYgKCFkYXRhLmZpbGVzW2ZpbGVQYXRoXSkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXNzYWdlcyA9IGRhdGEuZmlsZXNbZmlsZVBhdGhdLm1lc3NhZ2VzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIFBIUENTIHYxIGNhbid0IGFzc29jaWF0ZSBhIGZpbGVuYW1lIHdpdGggU1RESU4gaW5wdXRcbiAgICAgICAgICBpZiAoIWRhdGEuZmlsZXMuU1RESU4pIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWVzc2FnZXMgPSBkYXRhLmZpbGVzLlNURElOLm1lc3NhZ2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzLm1hcCgobWVzc2FnZSkgPT4ge1xuICAgICAgICAgIC8vIGZpeCBjb2x1bW4gaW4gbGluZSB3aXRoIHRhYnNcbiAgICAgICAgICBsZXQgeyBsaW5lLCBjb2x1bW4gfSA9IG1lc3NhZ2U7XG4gICAgICAgICAgbGluZSAtPSAxO1xuICAgICAgICAgIGNvbnN0IGxpbmVUZXh0ID0gdGV4dEVkaXRvci5nZXRCdWZmZXIoKS5saW5lRm9yUm93KGxpbmUpO1xuXG4gICAgICAgICAgaWYgKGxpbmVUZXh0LmluY2x1ZGVzKCdcXHQnKSkge1xuICAgICAgICAgICAgY29sdW1uID0gZml4UEhQQ1NDb2x1bW4obGluZVRleHQsIGxpbmUsIGNvbHVtbik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbHVtbiAtPSAxO1xuXG4gICAgICAgICAgbGV0IHJhbmdlO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICByYW5nZSA9IGhlbHBlcnMuZ2VuZXJhdGVSYW5nZSh0ZXh0RWRpdG9yLCBsaW5lLCBjb2x1bW4pO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgICAnbGludGVyLXBocGNzOjogSW52YWxpZCBwb2ludCBlbmNvdW50ZXJlZCBpbiB0aGUgYXR0YWNoZWQgbWVzc2FnZScsXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlLFxuICAgICAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgICAgbGluZUxlbmd0aDogbGluZVRleHQubGVuZ3RoLFxuICAgICAgICAgICAgICAgICAgbGluZVRleHQsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcignSW52YWxpZCBwb2ludCBlbmNvdW50ZXJlZCEgU2VlIGNvbnNvbGUgZm9yIGRldGFpbHMuJyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgbXNnID0ge1xuICAgICAgICAgICAgdHlwZTogbWVzc2FnZS50eXBlLFxuICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICByYW5nZSxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHNob3dTb3VyY2UpIHtcbiAgICAgICAgICAgIG1zZy5odG1sID0gYDxzcGFuIGNsYXNzPVwiYmFkZ2UgYmFkZ2UtZmxleGlibGVcIj4ke21lc3NhZ2Uuc291cmNlIHx8ICdVbmtub3duJ308L3NwYW4+IGA7XG4gICAgICAgICAgICBtc2cuaHRtbCArPSBlc2NhcGVIdG1sKG1lc3NhZ2UubWVzc2FnZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1zZy50ZXh0ID0gbWVzc2FnZS5tZXNzYWdlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBtc2c7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==