Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.command = command;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

/**
 * Copyright (C) 2016 Ivan Kravets. All rights reserved.
 *
 * This source file is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License version 2
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

var _initCommand = require('../init/command');

var _view = require('./view');

var _stream = require('stream');

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _ini = require('ini');

var _ini2 = _interopRequireDefault(_ini);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

'use babel';
function command() {
  // Initialize view
  var view = new _view.ImportArduinoProjectView();
  var panel = atom.workspace.addModalPanel({ item: view.getElement() });

  // Set buttons handlers
  view.handleCancel = function () {
    return panel.destroy();
  };
  view.handleImport = function () {
    var copyWholeProject = _asyncToGenerator(function* () {
      var temporaryProjectCopyPath = yield copyExistingProjectFiles();
      yield removeExistingProjectFilesFromCurrentLocation();
      yield copyFilesIntoSubdir(temporaryProjectCopyPath);
      return;

      function copyExistingProjectFiles() {
        return new Promise(function (resolve, reject) {
          _temp2['default'].mkdir('pio-arduino-import', function (err, dirPath) {
            if (err) {
              reject(err);
            } else {
              _fsExtra2['default'].copy(projectPath, dirPath, { clobber: true, filter: skipVCS }, function (err) {
                if (err) {
                  reject(err);
                }
                resolve(dirPath);
              });
            }
          });
        });
      }

      function removeExistingProjectFilesFromCurrentLocation() {
        return new Promise(function (resolve, reject) {
          _fsExtra2['default'].readdir(projectPath, function (err, paths) {
            if (err) {
              reject(err);
            } else {
              for (var fileName of paths.filter(skipVCS)) {
                _fsExtra2['default'].remove(_path2['default'].join(projectPath, fileName));
              }
              resolve();
            }
          });
        });
      }

      function copyFilesIntoSubdir(copyPath) {
        return new Promise(function (resolve, reject) {
          var dstDir = _path2['default'].join(projectPath, _path2['default'].basename(projectPath));
          try {
            _fsExtra2['default'].copySync(copyPath, dstDir);
            resolve();
          } catch (e) {
            reject(e);
          }
        });
      }
    });

    var projectPath = view.getDirectory();
    var keepCompatible = view.getKeepCompatible();
    var useArduinoLibManager = view.getUseArduinoLibManager();

    var originalProjectFiles = [];

    var chain = Promise.resolve();
    if (keepCompatible) {
      chain = chain.then(copyWholeProject);
    } else {
      chain = chain.then(recordOriginalFilesNames);
      chain = chain.then(moveOriginalFilesToSrcDirectory);
    }

    chain = chain.then(function () {
      return (0, _initCommand.installPlatformsForBoards)(view.getSelectedBoards(), view);
    });

    chain = chain.then(function () {
      return view.setStatus('Performing initialization...');
    });
    chain = chain.then(function () {
      return (0, _initCommand.initializeProject)(view.getSelectedBoards(), projectPath);
    });

    chain = chain.then(modifyPlatformioIni);
    chain = chain.then(addIncludeToInoFiles);

    chain = chain.then(function () {
      return atom.project.addPath(projectPath);
    });
    chain = chain.then(function () {
      return (0, _initCommand.handleLibChanges)([projectPath]);
    });

    chain = chain.then(function () {
      var notifyMessage = 'The next files/directories were created in "' + projectPath + '"\n' + '"platformio.ini" - Project Configuration File';
      if (!keepCompatible) {
        notifyMessage += '\n"src" - Put your source code here';
      }
      atom.notifications.addSuccess('PlatformIO: Project has been successfully imported!', {
        detail: notifyMessage
      });
      (0, _utils.runAtomCommand)('build:refresh-targets');
      if (keepCompatible) {
        _fsExtra2['default'].remove(_path2['default'].join(projectPath, 'src'));
      }
      if (useArduinoLibManager) {
        _fsExtra2['default'].remove(_path2['default'].join(projectPath, 'lib'));
      }
    })['catch'](function (reason) {
      var title = 'PlatformIO: Failed to import an Arduino IDE project!';
      atom.notifications.addError(title, { detail: reason, dismissable: true });
      console.error(title);
      console.error(reason);
    }).then(function () {
      return panel.destroy();
    });
    return chain;

    function recordOriginalFilesNames() {
      return new Promise(function (resolve, reject) {
        _fsExtra2['default'].readdir(projectPath, function (err, files) {
          if (err) {
            reject(err);
          } else {
            originalProjectFiles = files.filter(skipVCS);
            resolve();
          }
        });
      });
    }

    function skipVCS(file) {
      var filesToKeep = ['.git'];
      return filesToKeep.indexOf(_path2['default'].basename(file)) === -1;
    }

    function moveOriginalFilesToSrcDirectory() {
      _fsExtra2['default'].mkdirsSync(_path2['default'].join(projectPath, 'src'));
      originalProjectFiles.forEach(function (fileName) {
        var oldPath = _path2['default'].join(projectPath, fileName);
        var newPath = _path2['default'].join(projectPath, 'src', fileName);
        _fsExtra2['default'].renameSync(oldPath, newPath);
      });
    }

    function modifyPlatformioIni() {
      if (!keepCompatible && !useArduinoLibManager) {
        return;
      }
      var iniPath = _path2['default'].join(projectPath, 'platformio.ini');

      var contentToPreserve = '';
      var fullConfig = _fsExtra2['default'].readFileSync(iniPath).toString();
      var envPosition = fullConfig.search(/^\[env:/m);
      if (envPosition > -1) {
        contentToPreserve = fullConfig.slice(0, envPosition);
      }

      var config = _ini2['default'].parse(fullConfig);
      if (!config.platformio) {
        config.platformio = {};
      }

      if (keepCompatible) {
        config.platformio.src_dir = _path2['default'].basename(projectPath);
      }
      if (useArduinoLibManager) {
        config.platformio.lib_dir = view.getLibManagerDirectory();
      }

      _fsExtra2['default'].writeFileSync(iniPath, contentToPreserve);
      _fsExtra2['default'].appendFileSync(iniPath, _ini2['default'].stringify(config));
    }

    function addIncludeToInoFiles() {
      var dirsToLookIn = [_path2['default'].join(projectPath, keepCompatible ? _path2['default'].basename(projectPath) : 'src')];
      var filesToProcess = [];
      while (dirsToLookIn.length > 0) {
        // Recursively look for *.ino files
        var dir = dirsToLookIn.splice(0, 1)[0];
        var content = _fsExtra2['default'].readdirSync(dir);
        for (var item of content) {
          var fullPath = _path2['default'].join(dir, item);
          var stat = _fsExtra2['default'].statSyncNoException(fullPath);
          if (!stat) {
            continue;
          }

          if (stat.isFile() && item.endsWith('.ino')) {
            filesToProcess.push(fullPath);
          } else if (stat.isDirectory()) {
            dirsToLookIn.push(fullPath);
          }
        }
      }

      var chain = Promise.resolve();
      for (var filePath of filesToProcess) {
        chain = chain.then(prependInclude(filePath));
      }
      return chain;

      function prependInclude(filePath) {
        return function () {
          var temporaryStream = _temp2['default'].createWriteStream();
          return new Promise(function (resolve) {
            var originStream = _fsExtra2['default'].createReadStream(filePath);
            var transform = new _stream.Transform({
              transform: function transform(chunk, encoding, callback) {
                if (!this.currentLineBuffer) {
                  this.currentLineBuffer = '';
                }

                var str = chunk.toString();
                for (var char of str) {
                  if ('\n' === char) {
                    if (/^#include\s+["<]Arduino\.h[">]/.test(this.currentLineBuffer)) {
                      // Abort copying process
                      resolve(false);
                      this.end();
                    }
                    this.currentLineBuffer = '';
                  } else {
                    this.currentLineBuffer += char;
                  }
                }

                callback(null, chunk);
              }
            });

            temporaryStream.on('finish', function () {
              return resolve(true);
            });

            originStream.pipe(transform).pipe(temporaryStream);
          }).then(function (editIsNeeded) {
            if (!editIsNeeded) {
              return;
            }
            return new Promise(function (resolve) {
              var stream = _fsExtra2['default'].createWriteStream(filePath);
              stream.write('#include <Arduino.h>\n\n');
              _fsExtra2['default'].createReadStream(temporaryStream.path).pipe(stream);
              stream.on('finish', function () {
                return resolve();
              });
            });
          }).then(function () {
            return new Promise(function (resolve, reject) {
              _fsExtra2['default'].unlink(temporaryStream.path, function (err) {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            });
          });
        };
      }
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbXBvcnQtYXJkdWluby1wcm9qZWN0L2NvbW1hbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MkJBbUI2RSxpQkFBaUI7O29CQUN2RCxRQUFROztzQkFDdkIsUUFBUTs7dUJBQ2pCLFVBQVU7Ozs7bUJBQ1QsS0FBSzs7OztvQkFDSixNQUFNOzs7O3FCQUNNLFVBQVU7O29CQUN0QixNQUFNOzs7O0FBMUJ2QixXQUFXLENBQUM7QUE0QkwsU0FBUyxPQUFPLEdBQUc7O0FBRXhCLE1BQUksSUFBSSxHQUFHLG9DQUE4QixDQUFDO0FBQzFDLE1BQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxDQUFDLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBQyxDQUFDLENBQUM7OztBQUdwRSxNQUFJLENBQUMsWUFBWSxHQUFHO1dBQU0sS0FBSyxDQUFDLE9BQU8sRUFBRTtHQUFBLENBQUM7QUFDMUMsTUFBSSxDQUFDLFlBQVksR0FBRyxZQUFNO1FBaUVULGdCQUFnQixxQkFBL0IsYUFBa0M7QUFDaEMsVUFBTSx3QkFBd0IsR0FBRyxNQUFNLHdCQUF3QixFQUFFLENBQUM7QUFDbEUsWUFBTSw2Q0FBNkMsRUFBRSxDQUFDO0FBQ3RELFlBQU0sbUJBQW1CLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNwRCxhQUFPOztBQUVQLGVBQVMsd0JBQXdCLEdBQUc7QUFDbEMsZUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsNEJBQUssS0FBSyxDQUFDLG9CQUFvQixFQUFFLFVBQUMsR0FBRyxFQUFFLE9BQU8sRUFBSztBQUNqRCxnQkFBSSxHQUFHLEVBQUU7QUFDUCxvQkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2IsTUFBTTtBQUNMLG1DQUFH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LFlBQVksRUFBSztBQUN4QixnQkFBSSxDQUFDLFlBQVksRUFBRTtBQUNqQixxQkFBTzthQUNSO0FBQ0QsbUJBQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUs7QUFDOUIsa0JBQU0sTUFBTSxHQUFHLHFCQUFHLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzlDLG9CQUFNLENBQUMsS0FBSyxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDekMsbUNBQUcsZ0JBQWdCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN2RCxvQkFBTSxDQUFDLEVBQUUsQ0FBQyxRQUFRLEVBQUU7dUJBQU0sT0FBTyxFQUFFO2VBQUEsQ0FBQyxDQUFDO2FBQ3RDLENBQUMsQ0FBQztXQUNKLENBQUMsQ0FBQyxJQUFJLENBQUMsWUFBTTtBQUNaLG1CQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN0QyxtQ0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksRUFBRSxVQUFDLEdBQUcsRUFBSztBQUN2QyxvQkFBSSxHQUFHLEVBQUU7QUFDUCx3QkFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUNiLE1BQU07QUFDTCx5QkFBTyxFQUFFLENBQUM7aUJBQ1g7ZUFDRixDQUFDLENBQUM7YUFDSixDQUFDLENBQUM7V0FDSixDQUFDLENBQUM7U0FDSixDQUFDO09BQ0g7S0FDRjtHQUNGLENBQUM7Q0FDSCIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS9saWIvaW1wb3J0LWFyZHVpbm8tcHJvamVjdC9jb21tYW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCB7aGFuZGxlTGliQ2hhbmdlcywgaW5pdGlhbGl6ZVByb2plY3QsIGluc3RhbGxQbGF0Zm9ybXNGb3JCb2FyZHN9IGZyb20gJy4uL2luaXQvY29tbWFuZCc7XG5pbXBvcnQge0ltcG9ydEFyZHVpbm9Qcm9qZWN0Vmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCB7VHJhbnNmb3JtfSBmcm9tICdzdHJlYW0nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBpbmkgZnJvbSAnaW5pJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtydW5BdG9tQ29tbWFuZH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHRlbXAgZnJvbSAndGVtcCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb21tYW5kKCkge1xuICAvLyBJbml0aWFsaXplIHZpZXdcbiAgdmFyIHZpZXcgPSBuZXcgSW1wb3J0QXJkdWlub1Byb2plY3RWaWV3KCk7XG4gIHZhciBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IHZpZXcuZ2V0RWxlbWVudCgpfSk7XG5cbiAgLy8gU2V0IGJ1dHRvbnMgaGFuZGxlcnNcbiAgdmlldy5oYW5kbGVDYW5jZWwgPSAoKSA9PiBwYW5lbC5kZXN0cm95KCk7XG4gIHZpZXcuaGFuZGxlSW1wb3J0ID0gKCkgPT4ge1xuICAgIGNvbnN0IHByb2plY3RQYXRoID0gdmlldy5nZXREaXJlY3RvcnkoKTtcbiAgICBjb25zdCBrZWVwQ29tcGF0aWJsZSA9IHZpZXcuZ2V0S2VlcENvbXBhdGlibGUoKTtcbiAgICBjb25zdCB1c2VBcmR1aW5vTGliTWFuYWdlciA9IHZpZXcuZ2V0VXNlQXJkdWlub0xpYk1hbmFnZXIoKTtcblxuICAgIGxldCBvcmlnaW5hbFByb2plY3RGaWxlcyA9IFtdO1xuXG4gICAgbGV0IGNoYWluID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgaWYgKGtlZXBDb21wYXRpYmxlKSB7XG4gICAgICBjaGFpbiA9IGNoYWluLnRoZW4oY29weVdob2xlUHJvamVjdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNoYWluID0gY2hhaW4udGhlbihyZWNvcmRPcmlnaW5hbEZpbGVzTmFtZXMpO1xuICAgICAgY2hhaW4gPSBjaGFpbi50aGVuKG1vdmVPcmlnaW5hbEZpbGVzVG9TcmNEaXJlY3RvcnkpO1xuICAgIH1cblxuICAgIGNoYWluID0gY2hhaW4udGhlbigoKSA9PiB7XG4gICAgICByZXR1cm4gaW5zdGFsbFBsYXRmb3Jtc0ZvckJvYXJkcyh2aWV3LmdldFNlbGVjdGVkQm9hcmRzKCksIHZpZXcpO1xuICAgIH0pO1xuXG4gICAgY2hhaW4gPSBjaGFpbi50aGVuKCgpID0+IHZpZXcuc2V0U3RhdHVzKCdQZXJmb3JtaW5nIGluaXRpYWxpemF0aW9uLi4uJykpO1xuICAgIGNoYWluID0gY2hhaW4udGhlbigoKSA9PiBpbml0aWFsaXplUHJvamVjdCh2aWV3LmdldFNlbGVjdGVkQm9hcmRzKCksIHByb2plY3RQYXRoKSk7XG5cbiAgICBjaGFpbiA9IGNoYWluLnRoZW4obW9kaWZ5UGxhdGZvcm1pb0luaSk7XG4gICAgY2hhaW4gPSBjaGFpbi50aGVuKGFkZEluY2x1ZGVUb0lub0ZpbGVzKTtcblxuICAgIGNoYWluID0gY2hhaW4udGhlbigoKSA9PiBhdG9tLnByb2plY3QuYWRkUGF0aChwcm9qZWN0UGF0aCkpO1xuICAgIGNoYWluID0gY2hhaW4udGhlbigoKSA9PiBoYW5kbGVMaWJDaGFuZ2VzKFtwcm9qZWN0UGF0aF0pKTtcblxuICAgIGNoYWluID0gY2hhaW4udGhlbigoKSA9PiB7XG4gICAgICBsZXQgbm90aWZ5TWVzc2FnZSA9ICdUaGUgbmV4dCBmaWxlcy9kaXJlY3RvcmllcyB3ZXJlIGNyZWF0ZWQgaW4gXCInICsgcHJvamVjdFBhdGggKyAnXCJcXG4nICtcbiAgICAgICAgJ1wicGxhdGZvcm1pby5pbmlcIiAtIFByb2plY3QgQ29uZmlndXJhdGlvbiBGaWxlJztcbiAgICAgIGlmICgha2VlcENvbXBhdGlibGUpIHtcbiAgICAgICAgbm90aWZ5TWVzc2FnZSArPSAnXFxuXCJzcmNcIiAtIFB1dCB5b3VyIHNvdXJjZSBjb2RlIGhlcmUnO1xuICAgICAgfVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoJ1BsYXRmb3JtSU86IFByb2plY3QgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGltcG9ydGVkIScsIHtcbiAgICAgICAgZGV0YWlsOiBub3RpZnlNZXNzYWdlXG4gICAgICB9KTtcbiAgICAgIHJ1bkF0b21Db21tYW5kKCdidWlsZDpyZWZyZXNoLXRhcmdldHMnKTtcbiAgICAgIGlmIChrZWVwQ29tcGF0aWJsZSkge1xuICAgICAgICBmcy5yZW1vdmUocGF0aC5qb2luKHByb2plY3RQYXRoLCAnc3JjJykpO1xuICAgICAgfVxuICAgICAgaWYgKHVzZUFyZHVpbm9MaWJNYW5hZ2VyKSB7XG4gICAgICAgIGZzLnJlbW92ZShwYXRoLmpvaW4ocHJvamVjdFBhdGgsICdsaWInKSk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goKHJlYXNvbikgPT4ge1xuICAgICAgY29uc3QgdGl0bGUgPSAnUGxhdGZvcm1JTzogRmFpbGVkIHRvIGltcG9ydCBhbiBBcmR1aW5vIElERSBwcm9qZWN0ISc7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IodGl0bGUsIHtkZXRhaWw6IHJlYXNvbiwgZGlzbWlzc2FibGU6IHRydWV9KTtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGl0bGUpO1xuICAgICAgY29uc29sZS5lcnJvcihyZWFzb24pO1xuICAgIH0pLnRoZW4oKCkgPT4gcGFuZWwuZGVzdHJveSgpKTtcbiAgICByZXR1cm4gY2hhaW47XG5cbiAgICBmdW5jdGlvbiByZWNvcmRPcmlnaW5hbEZpbGVzTmFtZXMoKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBmcy5yZWFkZGlyKHByb2plY3RQYXRoLCAoZXJyLCBmaWxlcykgPT4ge1xuICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBvcmlnaW5hbFByb2plY3RGaWxlcyA9IGZpbGVzLmZpbHRlcihza2lwVkNTKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYXN5bmMgZnVuY3Rpb24gY29weVdob2xlUHJvamVjdCgpIHtcbiAgICAgIGNvbnN0IHRlbXBvcmFyeVByb2plY3RDb3B5UGF0aCA9IGF3YWl0IGNvcHlFeGlzdGluZ1Byb2plY3RGaWxlcygpO1xuICAgICAgYXdhaXQgcmVtb3ZlRXhpc3RpbmdQcm9qZWN0RmlsZXNGcm9tQ3VycmVudExvY2F0aW9uKCk7XG4gICAgICBhd2FpdCBjb3B5RmlsZXNJbnRvU3ViZGlyKHRlbXBvcmFyeVByb2plY3RDb3B5UGF0aCk7XG4gICAgICByZXR1cm47XG5cbiAgICAgIGZ1bmN0aW9uIGNvcHlFeGlzdGluZ1Byb2plY3RGaWxlcygpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICB0ZW1wLm1rZGlyKCdwaW8tYXJkdWluby1pbXBvcnQnLCAoZXJyLCBkaXJQYXRoKSA9PiB7XG4gICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnMuY29weShwcm9qZWN0UGF0aCwgZGlyUGF0aCwge2Nsb2JiZXI6IHRydWUsIGZpbHRlcjogc2tpcFZDU30sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkaXJQYXRoKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiByZW1vdmVFeGlzdGluZ1Byb2plY3RGaWxlc0Zyb21DdXJyZW50TG9jYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgZnMucmVhZGRpcihwcm9qZWN0UGF0aCwgKGVyciwgcGF0aHMpID0+IHtcbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmb3IgKGNvbnN0IGZpbGVOYW1lIG9mIHBhdGhzLmZpbHRlcihza2lwVkNTKSkge1xuICAgICAgICAgICAgICAgIGZzLnJlbW92ZShwYXRoLmpvaW4ocHJvamVjdFBhdGgsIGZpbGVOYW1lKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY29weUZpbGVzSW50b1N1YmRpcihjb3B5UGF0aCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGRzdERpciA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgcGF0aC5iYXNlbmFtZShwcm9qZWN0UGF0aCkpO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmcy5jb3B5U3luYyhjb3B5UGF0aCwgZHN0RGlyKTtcbiAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNraXBWQ1MoZmlsZSkge1xuICAgICAgY29uc3QgZmlsZXNUb0tlZXAgPSBbJy5naXQnXTtcbiAgICAgIHJldHVybiBmaWxlc1RvS2VlcC5pbmRleE9mKHBhdGguYmFzZW5hbWUoZmlsZSkpID09PSAtMTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3ZlT3JpZ2luYWxGaWxlc1RvU3JjRGlyZWN0b3J5KCkge1xuICAgICAgZnMubWtkaXJzU3luYyhwYXRoLmpvaW4ocHJvamVjdFBhdGgsICdzcmMnKSk7XG4gICAgICBvcmlnaW5hbFByb2plY3RGaWxlcy5mb3JFYWNoKChmaWxlTmFtZSkgPT4ge1xuICAgICAgICBjb25zdCBvbGRQYXRoID0gcGF0aC5qb2luKHByb2plY3RQYXRoLCBmaWxlTmFtZSk7XG4gICAgICAgIGNvbnN0IG5ld1BhdGggPSBwYXRoLmpvaW4ocHJvamVjdFBhdGgsICdzcmMnLCBmaWxlTmFtZSk7XG4gICAgICAgIGZzLnJlbmFtZVN5bmMob2xkUGF0aCwgbmV3UGF0aCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb2RpZnlQbGF0Zm9ybWlvSW5pKCkge1xuICAgICAgaWYgKCFrZWVwQ29tcGF0aWJsZSAmJiAhdXNlQXJkdWlub0xpYk1hbmFnZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY29uc3QgaW5pUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgJ3BsYXRmb3JtaW8uaW5pJyk7XG5cbiAgICAgIGxldCBjb250ZW50VG9QcmVzZXJ2ZSA9ICcnO1xuICAgICAgY29uc3QgZnVsbENvbmZpZyA9IGZzLnJlYWRGaWxlU3luYyhpbmlQYXRoKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgZW52UG9zaXRpb24gPSBmdWxsQ29uZmlnLnNlYXJjaCgvXlxcW2VudjovbSk7XG4gICAgICBpZiAoZW52UG9zaXRpb24gPiAtMSkge1xuICAgICAgICBjb250ZW50VG9QcmVzZXJ2ZSA9IGZ1bGxDb25maWcuc2xpY2UoMCwgZW52UG9zaXRpb24pO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb25maWcgPSBpbmkucGFyc2UoZnVsbENvbmZpZyk7XG4gICAgICBpZiAoIWNvbmZpZy5wbGF0Zm9ybWlvKSB7XG4gICAgICAgIGNvbmZpZy5wbGF0Zm9ybWlvID0ge307XG4gICAgICB9XG5cbiAgICAgIGlmIChrZWVwQ29tcGF0aWJsZSkge1xuICAgICAgICBjb25maWcucGxhdGZvcm1pby5zcmNfZGlyID0gcGF0aC5iYXNlbmFtZShwcm9qZWN0UGF0aCk7XG4gICAgICB9XG4gICAgICBpZiAodXNlQXJkdWlub0xpYk1hbmFnZXIpIHtcbiAgICAgICAgY29uZmlnLnBsYXRmb3JtaW8ubGliX2RpciA9IHZpZXcuZ2V0TGliTWFuYWdlckRpcmVjdG9yeSgpO1xuICAgICAgfVxuXG4gICAgICBmcy53cml0ZUZpbGVTeW5jKGluaVBhdGgsIGNvbnRlbnRUb1ByZXNlcnZlKTtcbiAgICAgIGZzLmFwcGVuZEZpbGVTeW5jKGluaVBhdGgsIGluaS5zdHJpbmdpZnkoY29uZmlnKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkSW5jbHVkZVRvSW5vRmlsZXMoKSB7XG4gICAgICBjb25zdCBkaXJzVG9Mb29rSW4gPSBbcGF0aC5qb2luKHByb2plY3RQYXRoLCBrZWVwQ29tcGF0aWJsZSA/IHBhdGguYmFzZW5hbWUocHJvamVjdFBhdGgpIDogJ3NyYycpXTtcbiAgICAgIGNvbnN0IGZpbGVzVG9Qcm9jZXNzID0gW107XG4gICAgICB3aGlsZSAoZGlyc1RvTG9va0luLmxlbmd0aCA+IDApIHsgIC8vIFJlY3Vyc2l2ZWx5IGxvb2sgZm9yICouaW5vIGZpbGVzXG4gICAgICAgIGNvbnN0IGRpciA9IGRpcnNUb0xvb2tJbi5zcGxpY2UoMCwgMSlbMF07XG4gICAgICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkZGlyU3luYyhkaXIpO1xuICAgICAgICBmb3IgKGNvbnN0IGl0ZW0gb2YgY29udGVudCkge1xuICAgICAgICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKGRpciwgaXRlbSk7XG4gICAgICAgICAgY29uc3Qgc3RhdCA9IGZzLnN0YXRTeW5jTm9FeGNlcHRpb24oZnVsbFBhdGgpO1xuICAgICAgICAgIGlmICghc3RhdCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXQuaXNGaWxlKCkgJiYgaXRlbS5lbmRzV2l0aCgnLmlubycpKSB7XG4gICAgICAgICAgICBmaWxlc1RvUHJvY2Vzcy5wdXNoKGZ1bGxQYXRoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICAgICAgZGlyc1RvTG9va0luLnB1c2goZnVsbFBhdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBsZXQgY2hhaW4gPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgIGZvciAoY29uc3QgZmlsZVBhdGggb2YgZmlsZXNUb1Byb2Nlc3MpIHtcbiAgICAgICAgY2hhaW4gPSBjaGFpbi50aGVuKHByZXBlbmRJbmNsdWRlKGZpbGVQYXRoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hhaW47XG5cbiAgICAgIGZ1bmN0aW9uIHByZXBlbmRJbmNsdWRlKGZpbGVQYXRoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCB0ZW1wb3JhcnlTdHJlYW0gPSB0ZW1wLmNyZWF0ZVdyaXRlU3RyZWFtKCk7XG4gICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBvcmlnaW5TdHJlYW0gPSBmcy5jcmVhdGVSZWFkU3RyZWFtKGZpbGVQYXRoKTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybSA9IG5ldyBUcmFuc2Zvcm0oe1xuICAgICAgICAgICAgICB0cmFuc2Zvcm06IGZ1bmN0aW9uKGNodW5rLCBlbmNvZGluZywgY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY3VycmVudExpbmVCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudExpbmVCdWZmZXIgPSAnJztcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBzdHIgPSBjaHVuay50b1N0cmluZygpO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgY2hhciBvZiBzdHIpIHtcbiAgICAgICAgICAgICAgICAgIGlmICgnXFxuJyA9PT0gY2hhcikge1xuICAgICAgICAgICAgICAgICAgICBpZiAoL14jaW5jbHVkZVxccytbXCI8XUFyZHVpbm9cXC5oW1wiPl0vLnRlc3QodGhpcy5jdXJyZW50TGluZUJ1ZmZlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBBYm9ydCBjb3B5aW5nIHByb2Nlc3NcbiAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudExpbmVCdWZmZXIgPSAnJztcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudExpbmVCdWZmZXIgKz0gY2hhcjtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjYWxsYmFjayhudWxsLCBjaHVuayk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0ZW1wb3JhcnlTdHJlYW0ub24oJ2ZpbmlzaCcsICgpID0+IHJlc29sdmUodHJ1ZSkpO1xuXG4gICAgICAgICAgICBvcmlnaW5TdHJlYW0ucGlwZSh0cmFuc2Zvcm0pLnBpcGUodGVtcG9yYXJ5U3RyZWFtKTtcbiAgICAgICAgICB9KS50aGVuKChlZGl0SXNOZWVkZWQpID0+IHtcbiAgICAgICAgICAgIGlmICghZWRpdElzTmVlZGVkKSB7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBzdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbShmaWxlUGF0aCk7XG4gICAgICAgICAgICAgIHN0cmVhbS53cml0ZSgnI2luY2x1ZGUgPEFyZHVpbm8uaD5cXG5cXG4nKTtcbiAgICAgICAgICAgICAgZnMuY3JlYXRlUmVhZFN0cmVhbSh0ZW1wb3JhcnlTdHJlYW0ucGF0aCkucGlwZShzdHJlYW0pO1xuICAgICAgICAgICAgICBzdHJlYW0ub24oJ2ZpbmlzaCcsICgpID0+IHJlc29sdmUoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICAgIGZzLnVubGluayh0ZW1wb3JhcnlTdHJlYW0ucGF0aCwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfTtcbn1cbiJdfQ==
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/import-arduino-project/command.js
