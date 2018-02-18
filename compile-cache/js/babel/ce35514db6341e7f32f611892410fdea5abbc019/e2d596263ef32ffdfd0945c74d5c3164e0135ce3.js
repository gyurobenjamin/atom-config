Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.clone = clone;
exports.runCommand = runCommand;
exports.getPythonExecutable = getPythonExecutable;
exports.useBuiltinPlatformIO = useBuiltinPlatformIO;
exports.getIDEVersion = getIDEVersion;
exports.findFileByName = findFileByName;
exports.runAtomCommand = runAtomCommand;
exports.removeChildrenOf = removeChildrenOf;
exports.getActiveProjectPath = getActiveProjectPath;
exports.getBoards = getBoards;
exports.extractTargz = extractTargz;
exports.resolveAtomPackagePath = resolveAtomPackagePath;
exports.spawnPio = spawnPio;
exports.isPioProject = isPioProject;

var isFile = _asyncToGenerator(function* (filePath) {
  try {
    var stat = yield fsp.stat(filePath);
    return stat.isFile();
  } catch (e) {
    return false;
  }
}

/**
 * Annotates a view with a path to a template.
 *
 * Usage:
 *     @withTemplate(__dirname)
 *     class SomeView extends BaseView {}
 */
);

exports.isFile = isFile;
exports.withTemplate = withTemplate;
exports.cleanMiscCache = cleanMiscCache;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

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

var _config = require('./config');

var config = _interopRequireWildcard(_config);

var _atom = require('atom');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

var _tar = require('tar');

var _tar2 = _interopRequireDefault(_tar);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

'use babel';

var fsp = (0, _promisifyNode2['default'])('fs');

var __PYTHON_EXE_CACHE = null;
var __BOARDS_CACHE = null;

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function runCommand(cmd, args, callback) {
  var spawnOptions = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

  var outputLines = [],
      errorLines = [];
  new _atom.BufferedProcess({
    command: cmd,
    args: args,
    options: spawnOptions,
    stdout: function stdout(line) {
      return outputLines.push(line);
    },
    stderr: function stderr(line) {
      return errorLines.push(line);
    },
    exit: function exit(code) {
      callback(code, outputLines.join('\n'), errorLines.join('\n'));
    }
  });
}

// Get the system executable

function getPythonExecutable() {
  if (!__PYTHON_EXE_CACHE) {
    var possibleExecutables = [];
    if (useBuiltinPlatformIO()) {
      possibleExecutables.push(_path2['default'].join(config.ENV_BIN_DIR, 'python'));
    }

    if (config.IS_WINDOWS) {
      possibleExecutables.push('python.exe');
      possibleExecutables.push('C:\\Python27\\python.exe');
    } else {
      possibleExecutables.push('python2.7');
      possibleExecutables.push('python');
    }

    for (var executable of possibleExecutables) {
      if (isPython2(executable)) {
        __PYTHON_EXE_CACHE = executable;
        break;
      }
    }

    if (!__PYTHON_EXE_CACHE) {
      throw new Error('Python 2.7 could not be found.');
    }
  }
  return __PYTHON_EXE_CACHE;
}

function isPython2(executable) {
  var args = ['-c', 'import sys; print \'.\'.join(str(v) for v in sys.version_info[:2])'];
  try {
    var result = _child_process2['default'].spawnSync(executable, args);
    return 0 === result.status && result.stdout.toString().startsWith('2.7');
  } catch (e) {
    return false;
  }
}

function useBuiltinPlatformIO() {
  return atom.config.get('platformio-ide.useBuiltinPlatformIO');
}

function getIDEVersion() {
  return require(_path2['default'].join(config.BASE_DIR, 'package.json')).version;
}

// Recursively find directory with given name

function findFileByName(desiredFileName, where) {
  var queue = [where];
  var content, item, fullPath, stat;
  while (queue) {
    item = queue.splice(0, 1)[0]; // take the first element from the queue
    content = _fs2['default'].readdirSync(item);
    for (var i = 0; i < content.length; i++) {
      fullPath = _path2['default'].join(item, content[i]);
      stat = _fs2['default'].statSyncNoException(fullPath);
      if (!stat) {
        continue;
      }

      if (stat.isFile() && content[i] === desiredFileName) {
        return fullPath;
      } else if (stat.isDirectory()) {
        queue.push(fullPath);
      }
    }
  }
  return -1;
}

function runAtomCommand(commandName) {
  return atom.commands.dispatch(atom.views.getView(atom.workspace), commandName);
}

function removeChildrenOf(node) {
  if (!node) {
    return;
  }
  while (node.firstChild) {
    node.removeChild(node.firstChild);
  }
}

/**
 * Determines an active project.
 *
 * @returns {String|Boolean} either a path of an active project,
 *  or `false` when project does not have any open projects,
 *  or NO_ELIGIBLE_PROJECTS_FOUND value, when none of open projects are proper PlatformIO projects.
 */

function getActiveProjectPath() {
  var paths = atom.project.getPaths().map(function (p) {
    try {
      return _fs2['default'].realpathSync(p);
    } catch (e) {
      return p;
    }
  });
  if (0 === paths.length) {
    return false;
  }

  var editor = atom.workspace.getActiveTextEditor();
  if (!editor) {
    if (1 === paths.length && isPioProject(paths[0])) {
      return paths[0];
    } else {
      return _firstPioProjectInAList(paths);
    }
  }

  var filePath = editor.getPath();
  if (!filePath) {
    return _firstPioProjectInAList(paths);
  }

  paths.sort(function (a, b) {
    return b.length - a.length;
  });
  for (var p of paths) {
    if (filePath.startsWith(p + _path2['default'].sep) && isPioProject(p)) {
      return p;
    }
  }

  return _firstPioProjectInAList(paths);
}

function _firstPioProjectInAList(list) {
  for (var p of list) {
    if (isPioProject(p)) {
      return p;
    }
  }
  return config.NO_ELIGIBLE_PROJECTS_FOUND;
}

function getBoards() {
  if (!__BOARDS_CACHE) {
    var child = _child_process2['default'].spawnSync('pio', config.DEFAULT_PIO_ARGS.concat(['boards', '--json-output']));
    if (0 !== child.status) {
      throw new Error('Failed to get boards');
    }
    __BOARDS_CACHE = JSON.parse(child.stdout);
  }
  return __BOARDS_CACHE;
}

function extractTargz(source, destination) {
  return new Promise(function (resolve, reject) {
    _fs2['default'].createReadStream(source).pipe(_zlib2['default'].createGunzip()).on('error', onError).pipe(_tar2['default'].Extract({ path: destination })).on('error', onError).on('end', function () {
      return resolve();
    });

    function onError(err) {
      reject(err);
    }
  });
}

/*
 * Locate a package in atom package directories.
 *
 * atom.packages.resolvePackagePath() works incorrectly when provided name is
 * an existing directory. When there is package named pkg atom.packages.resolvePackagePath('pkg')
 * and there is a directory named 'pkg' in current working directory, returned value
 * will be 'pkg', which is basically a releative path to the 'pkg' directory form CWD.
 */

function resolveAtomPackagePath(name) {
  for (var dir of atom.packages.getPackageDirPaths()) {
    var fullPath = _path2['default'].join(dir, name);
    if (_fs2['default'].statSyncNoException(fullPath)) {
      return fullPath;
    }
  }
}

function spawnPio(args) {
  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return new Promise(function (resolve, reject) {
    var stdout = '',
        stderr = '';
    var child = _child_process2['default'].spawn('pio', config.DEFAULT_PIO_ARGS.concat(args), options);
    child.stdout.on('data', function (chunk) {
      return stdout += chunk;
    });
    child.stderr.on('data', function (chunk) {
      return stderr += chunk;
    });
    child.on('error', function (err) {
      return reject(err);
    });
    child.on('close', function (code) {
      if (0 !== code) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

function isPioProject(dir) {
  var stat = _fs2['default'].statSyncNoException(_path2['default'].join(dir, 'platformio.ini'));
  return stat && stat.isFile();
}

function withTemplate(templateDirectory) {
  var templateFilename = arguments.length <= 1 || arguments[1] === undefined ? 'template.html' : arguments[1];

  return function (target) {
    target.prototype.__template = _path2['default'].resolve(templateDirectory, templateFilename);
  };
}

function cleanMiscCache() {
  __BOARDS_CACHE = null;
  __PYTHON_EXE_CACHE = null;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFpUXNCLE1BQU0scUJBQXJCLFdBQXNCLFFBQVEsRUFBRTtBQUNyQyxNQUFJO0FBQ0YsUUFBTSxJQUFJLEdBQUcsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLFdBQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0dBQ3RCLENBQUMsT0FBTSxDQUFDLEVBQUU7QUFDVCxXQUFPLEtBQUssQ0FBQztHQUNkO0NBQ0Y7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQXJQdUIsVUFBVTs7SUFBdEIsTUFBTTs7b0JBQ1ksTUFBTTs7NkJBQ1YsZUFBZTs7OztrQkFDMUIsSUFBSTs7OztvQkFDRixNQUFNOzs7OzZCQUNELGdCQUFnQjs7OzttQkFDdEIsS0FBSzs7OztvQkFDSixNQUFNOzs7O0FBMUJ2QixXQUFXLENBQUM7O0FBNEJaLElBQU0sR0FBRyxHQUFHLGdDQUFVLElBQUksQ0FBQyxDQUFDOztBQUc1QixJQUFJLGtCQUFrQixHQUFHLElBQUksQ0FBQztBQUM5QixJQUFJLGNBQWMsR0FBRyxJQUFJLENBQUM7O0FBRW5CLFNBQVMsS0FBSyxDQUFDLEdBQUcsRUFBRTtBQUN6QixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ3hDOztBQUVNLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFxQjtNQUFuQixZQUFZLHlEQUFHLEVBQUU7O0FBQy9ELE1BQU0sV0FBVyxHQUFHLEVBQUU7TUFDcEIsVUFBVSxHQUFHLEVBQUUsQ0FBQztBQUNsQiw0QkFBb0I7QUFDbEIsV0FBTyxFQUFFLEdBQUc7QUFDWixRQUFJLEVB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QUFDLE1BQU0sQ0FBQyxDQUFDO09BQ2pCO0tBQ0YsQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDO0NBQ0o7O0FBRU0sU0FBUyxZQUFZLENBQUMsR0FBRyxFQUFFO0FBQ2hDLE1BQU0sSUFBSSxHQUFHLGdCQUFHLG1CQUFtQixDQUFDLGtCQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLFNBQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztDQUM5Qjs7QUFrQk0sU0FBUyxZQUFZLENBQUMsaUJBQWlCLEVBQW9DO01BQWxDLGdCQUFnQix5REFBQyxlQUFlOztBQUM5RSxTQUFPLFVBQVMsTUFBTSxFQUFFO0FBQ3RCLFVBQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLGtCQUFLLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0dBQ2pGLENBQUM7Q0FDSDs7QUFFTSxTQUFTLGNBQWMsR0FBRztBQUMvQixnQkFBYyxHQUFHLElBQUksQ0FBQztBQUN0QixvQkFBa0IsR0FBRyxJQUFJLENBQUM7Q0FDM0IiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUvbGliL3V0aWxzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge0J1ZmZlcmVkUHJvY2Vzc30gZnJvbSAnYXRvbSc7XG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBwcm9taXNpZnkgZnJvbSAncHJvbWlzaWZ5LW5vZGUnO1xuaW1wb3J0IHRhciBmcm9tICd0YXInO1xuaW1wb3J0IHpsaWIgZnJvbSAnemxpYic7XG5cbmNvbnN0IGZzcCA9IHByb21pc2lmeSgnZnMnKTtcblxuXG5sZXQgX19QWVRIT05fRVhFX0NBQ0hFID0gbnVsbDtcbmxldCBfX0JPQVJEU19DQUNIRSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZShvYmopIHtcbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5Db21tYW5kKGNtZCwgYXJncywgY2FsbGJhY2ssIHNwYXduT3B0aW9ucyA9IHt9KSB7XG4gIGNvbnN0IG91dHB1dExpbmVzID0gW10sXG4gICAgZXJyb3JMaW5lcyA9IFtdO1xuICBuZXcgQnVmZmVyZWRQcm9jZXNzKHtcbiAgICBjb21tYW5kOiBjbWQsXG4gICAgYXJnczogYXJncyxcbiAgICBvcHRpb25zOiBzcGF3bk9wdGlvbnMsXG4gICAgc3Rkb3V0OiAobGluZSkgPT4gb3V0cHV0TGluZXMucHVzaChsaW5lKSxcbiAgICBzdGRlcnI6IChsaW5lKSA9PiBlcnJvckxpbmVzLnB1c2gobGluZSksXG4gICAgZXhpdDogKGNvZGUpID0+IHtcbiAgICAgIGNhbGxiYWNrKGNvZGUsIG91dHB1dExpbmVzLmpvaW4oJ1xcbicpLCBlcnJvckxpbmVzLmpvaW4oJ1xcbicpKTtcbiAgICB9XG4gIH0pO1xufVxuXG4vLyBHZXQgdGhlIHN5c3RlbSBleGVjdXRhYmxlXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHl0aG9uRXhlY3V0YWJsZSgpIHtcbiAgaWYgKCFfX1BZVEhPTl9FWEVfQ0FDSEUpIHtcbiAgICBjb25zdCBwb3NzaWJsZUV4ZWN1dGFibGVzID0gW107XG4gICAgaWYgKHVzZUJ1aWx0aW5QbGF0Zm9ybUlPKCkpIHtcbiAgICAgIHBvc3NpYmxlRXhlY3V0YWJsZXMucHVzaChwYXRoLmpvaW4oY29uZmlnLkVOVl9CSU5fRElSLCAncHl0aG9uJykpO1xuICAgIH1cblxuICAgIGlmIChjb25maWcuSVNfV0lORE9XUykge1xuICAgICAgcG9zc2libGVFeGVjdXRhYmxlcy5wdXNoKCdweXRob24uZXhlJyk7XG4gICAgICBwb3NzaWJsZUV4ZWN1dGFibGVzLnB1c2goJ0M6XFxcXFB5dGhvbjI3XFxcXHB5dGhvbi5leGUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcG9zc2libGVFeGVjdXRhYmxlcy5wdXNoKCdweXRob24yLjcnKTtcbiAgICAgIHBvc3NpYmxlRXhlY3V0YWJsZXMucHVzaCgncHl0aG9uJyk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBleGVjdXRhYmxlIG9mIHBvc3NpYmxlRXhlY3V0YWJsZXMpIHtcbiAgICAgIGlmIChpc1B5dGhvbjIoZXhlY3V0YWJsZSkpIHtcbiAgICAgICAgX19QWVRIT05fRVhFX0NBQ0hFID0gZXhlY3V0YWJsZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFfX1BZVEhPTl9FWEVfQ0FDSEUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignUHl0aG9uIDIuNyBjb3VsZCBub3QgYmUgZm91bmQuJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBfX1BZVEhPTl9FWEVfQ0FDSEU7XG59XG5cbmZ1bmN0aW9uIGlzUHl0aG9uMihleGVjdXRhYmxlKSB7XG4gIGNvbnN0IGFyZ3MgPSBbJy1jJywgJ2ltcG9ydCBzeXM7IHByaW50IFxcJy5cXCcuam9pbihzdHIodikgZm9yIHYgaW4gc3lzLnZlcnNpb25faW5mb1s6Ml0pJ107XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzdWx0ID0gY2hpbGRfcHJvY2Vzcy5zcGF3blN5bmMoZXhlY3V0YWJsZSwgYXJncyk7XG4gICAgcmV0dXJuIDAgPT09IHJlc3VsdC5zdGF0dXMgJiYgcmVzdWx0LnN0ZG91dC50b1N0cmluZygpLnN0YXJ0c1dpdGgoJzIuNycpO1xuICB9IGNhdGNoKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUJ1aWx0aW5QbGF0Zm9ybUlPKCkge1xuICByZXR1cm4gYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS51c2VCdWlsdGluUGxhdGZvcm1JTycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SURFVmVyc2lvbigpIHtcbiAgcmV0dXJuIHJlcXVpcmUocGF0aC5qb2luKGNvbmZpZy5CQVNFX0RJUiwgJ3BhY2thZ2UuanNvbicpKS52ZXJzaW9uO1xufVxuXG4vLyBSZWN1cnNpdmVseSBmaW5kIGRpcmVjdG9yeSB3aXRoIGdpdmVuIG5hbWVcbmV4cG9ydCBmdW5jdGlvbiBmaW5kRmlsZUJ5TmFtZShkZXNpcmVkRmlsZU5hbWUsIHdoZXJlKSB7XG4gIHZhciBxdWV1ZSA9IFt3aGVyZV07XG4gIHZhciBjb250ZW50LCBpdGVtLCBmdWxsUGF0aCwgc3RhdDtcbiAgd2hpbGUgKHF1ZXVlKSB7XG4gICAgaXRlbSA9IHF1ZXVlLnNwbGljZSgwLCAxKVswXTsgIC8vIHRha2UgdGhlIGZpcnN0IGVsZW1lbnQgZnJvbSB0aGUgcXVldWVcbiAgICBjb250ZW50ID0gZnMucmVhZGRpclN5bmMoaXRlbSk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb250ZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBmdWxsUGF0aCA9IHBhdGguam9pbihpdGVtLCBjb250ZW50W2ldKTtcbiAgICAgIHN0YXQgPSBmcy5zdGF0U3luY05vRXhjZXB0aW9uKGZ1bGxQYXRoKTtcbiAgICAgIGlmICghc3RhdCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXQuaXNGaWxlKCkgJiYgY29udGVudFtpXSA9PT0gZGVzaXJlZEZpbGVOYW1lKSB7XG4gICAgICAgIHJldHVybiBmdWxsUGF0aDtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHF1ZXVlLnB1c2goZnVsbFBhdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBydW5BdG9tQ29tbWFuZChjb21tYW5kTmFtZSkge1xuICByZXR1cm4gYXRvbS5jb21tYW5kcy5kaXNwYXRjaChcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLCBjb21tYW5kTmFtZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVDaGlsZHJlbk9mKG5vZGUpIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHdoaWxlKG5vZGUuZmlyc3RDaGlsZCkge1xuICAgIG5vZGUucmVtb3ZlQ2hpbGQobm9kZS5maXJzdENoaWxkKTtcbiAgfVxufVxuXG4vKipcbiAqIERldGVybWluZXMgYW4gYWN0aXZlIHByb2plY3QuXG4gKlxuICogQHJldHVybnMge1N0cmluZ3xCb29sZWFufSBlaXRoZXIgYSBwYXRoIG9mIGFuIGFjdGl2ZSBwcm9qZWN0LFxuICogIG9yIGBmYWxzZWAgd2hlbiBwcm9qZWN0IGRvZXMgbm90IGhhdmUgYW55IG9wZW4gcHJvamVjdHMsXG4gKiAgb3IgTk9fRUxJR0lCTEVfUFJPSkVDVFNfRk9VTkQgdmFsdWUsIHdoZW4gbm9uZSBvZiBvcGVuIHByb2plY3RzIGFyZSBwcm9wZXIgUGxhdGZvcm1JTyBwcm9qZWN0cy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFjdGl2ZVByb2plY3RQYXRoKCkge1xuICBjb25zdCBwYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpLm1hcCgocCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gZnMucmVhbHBhdGhTeW5jKHApO1xuICAgIH1cbiAgICBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9KTtcbiAgaWYgKDAgPT09IHBhdGhzLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgaWYgKCFlZGl0b3IpIHtcbiAgICBpZiAoMSA9PT0gcGF0aHMubGVuZ3RoICYmIGlzUGlvUHJvamVjdChwYXRoc1swXSkpIHtcbiAgICAgIHJldHVybiBwYXRoc1swXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIF9maXJzdFBpb1Byb2plY3RJbkFMaXN0KHBhdGhzKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gIGlmICghZmlsZVBhdGgpIHtcbiAgICByZXR1cm4gX2ZpcnN0UGlvUHJvamVjdEluQUxpc3QocGF0aHMpO1xuICB9XG5cbiAgcGF0aHMuc29ydCgoYSwgYikgPT4gYi5sZW5ndGggLSBhLmxlbmd0aCk7XG4gIGZvciAoY29uc3QgcCBvZiBwYXRocykge1xuICAgIGlmIChmaWxlUGF0aC5zdGFydHNXaXRoKHAgKyBwYXRoLnNlcCkgJiYgaXNQaW9Qcm9qZWN0KHApKSB7XG4gICAgICByZXR1cm4gcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gX2ZpcnN0UGlvUHJvamVjdEluQUxpc3QocGF0aHMpO1xufVxuXG5mdW5jdGlvbiBfZmlyc3RQaW9Qcm9qZWN0SW5BTGlzdChsaXN0KSB7XG4gIGZvciAoY29uc3QgcCBvZiBsaXN0KSB7XG4gICAgaWYgKGlzUGlvUHJvamVjdChwKSkge1xuICAgICAgcmV0dXJuIHA7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcuTk9fRUxJR0lCTEVfUFJPSkVDVFNfRk9VTkQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRCb2FyZHMoKSB7XG4gIGlmICghX19CT0FSRFNfQ0FDSEUpIHtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd25TeW5jKCdwaW8nLCBjb25maWcuREVGQVVMVF9QSU9fQVJHUy5jb25jYXQoWydib2FyZHMnLCAnLS1qc29uLW91dHB1dCddKSk7XG4gICAgaWYgKDAgIT09IGNoaWxkLnN0YXR1cykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gZ2V0IGJvYXJkcycpO1xuICAgIH1cbiAgICBfX0JPQVJEU19DQUNIRSA9IEpTT04ucGFyc2UoY2hpbGQuc3Rkb3V0KTtcbiAgfVxuICByZXR1cm4gX19CT0FSRFNfQ0FDSEU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0VGFyZ3ooc291cmNlLCBkZXN0aW5hdGlvbikge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGZzLmNyZWF0ZVJlYWRTdHJlYW0oc291cmNlKVxuICAgICAgLnBpcGUoemxpYi5jcmVhdGVHdW56aXAoKSlcbiAgICAgIC5vbignZXJyb3InLCBvbkVycm9yKVxuICAgICAgLnBpcGUodGFyLkV4dHJhY3QoeyBwYXRoOiBkZXN0aW5hdGlvbn0pKVxuICAgICAgLm9uKCdlcnJvcicsIG9uRXJyb3IpXG4gICAgICAub24oJ2VuZCcsICgpID0+IHJlc29sdmUoKSk7XG5cbiAgICBmdW5jdGlvbiBvbkVycm9yKGVycikge1xuICAgICAgcmVqZWN0KGVycik7XG4gICAgfVxuICB9KTtcbn1cblxuLypcbiAqIExvY2F0ZSBhIHBhY2thZ2UgaW4gYXRvbSBwYWNrYWdlIGRpcmVjdG9yaWVzLlxuICpcbiAqIGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKCkgd29ya3MgaW5jb3JyZWN0bHkgd2hlbiBwcm92aWRlZCBuYW1lIGlzXG4gKiBhbiBleGlzdGluZyBkaXJlY3RvcnkuIFdoZW4gdGhlcmUgaXMgcGFja2FnZSBuYW1lZCBwa2cgYXRvbS5wYWNrYWdlcy5yZXNvbHZlUGFja2FnZVBhdGgoJ3BrZycpXG4gKiBhbmQgdGhlcmUgaXMgYSBkaXJlY3RvcnkgbmFtZWQgJ3BrZycgaW4gY3VycmVudCB3b3JraW5nIGRpcmVjdG9yeSwgcmV0dXJuZWQgdmFsdWVcbiAqIHdpbGwgYmUgJ3BrZycsIHdoaWNoIGlzIGJhc2ljYWxseSBhIHJlbGVhdGl2ZSBwYXRoIHRvIHRoZSAncGtnJyBkaXJlY3RvcnkgZm9ybSBDV0QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlQXRvbVBhY2thZ2VQYXRoKG5hbWUpIHtcbiAgZm9yIChjb25zdCBkaXIgb2YgYXRvbS5wYWNrYWdlcy5nZXRQYWNrYWdlRGlyUGF0aHMoKSkge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKGRpciwgbmFtZSk7XG4gICAgaWYgKGZzLnN0YXRTeW5jTm9FeGNlcHRpb24oZnVsbFBhdGgpKSB7XG4gICAgICByZXR1cm4gZnVsbFBhdGg7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzcGF3blBpbyhhcmdzLCBvcHRpb25zPXt9KSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgbGV0IHN0ZG91dCA9ICcnLCBzdGRlcnIgPSAnJztcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ3BpbycsIGNvbmZpZy5ERUZBVUxUX1BJT19BUkdTLmNvbmNhdChhcmdzKSwgb3B0aW9ucyk7XG4gICAgY2hpbGQuc3Rkb3V0Lm9uKCdkYXRhJywgY2h1bmsgPT4gc3Rkb3V0ICs9IGNodW5rKTtcbiAgICBjaGlsZC5zdGRlcnIub24oJ2RhdGEnLCBjaHVuayA9PiBzdGRlcnIgKz0gY2h1bmspO1xuICAgIGNoaWxkLm9uKCdlcnJvcicsIChlcnIpID0+IHJlamVjdChlcnIpKTtcbiAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xuICAgICAgaWYgKDAgIT09IGNvZGUpIHtcbiAgICAgICAgcmVqZWN0KHN0ZGVycik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHN0ZG91dCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQaW9Qcm9qZWN0KGRpcikge1xuICBjb25zdCBzdGF0ID0gZnMuc3RhdFN5bmNOb0V4Y2VwdGlvbihwYXRoLmpvaW4oZGlyLCAncGxhdGZvcm1pby5pbmknKSk7XG4gIHJldHVybiBzdGF0ICYmIHN0YXQuaXNGaWxlKCk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0ZpbGUoZmlsZVBhdGgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBzdGF0ID0gYXdhaXQgZnNwLnN0YXQoZmlsZVBhdGgpO1xuICAgIHJldHVybiBzdGF0LmlzRmlsZSgpO1xuICB9IGNhdGNoKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuLyoqXG4gKiBBbm5vdGF0ZXMgYSB2aWV3IHdpdGggYSBwYXRoIHRvIGEgdGVtcGxhdGUuXG4gKlxuICogVXNhZ2U6XG4gKiAgICAgQHdpdGhUZW1wbGF0ZShfX2Rpcm5hbWUpXG4gKiAgICAgY2xhc3MgU29tZVZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7fVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aFRlbXBsYXRlKHRlbXBsYXRlRGlyZWN0b3J5LCB0ZW1wbGF0ZUZpbGVuYW1lPSd0ZW1wbGF0ZS5odG1sJykge1xuICByZXR1cm4gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdGFyZ2V0LnByb3RvdHlwZS5fX3RlbXBsYXRlID0gcGF0aC5yZXNvbHZlKHRlbXBsYXRlRGlyZWN0b3J5LCB0ZW1wbGF0ZUZpbGVuYW1lKTtcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuTWlzY0NhY2hlKCkge1xuICBfX0JPQVJEU19DQUNIRSA9IG51bGw7XG4gIF9fUFlUSE9OX0VYRV9DQUNIRSA9IG51bGw7XG59XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/utils.js
