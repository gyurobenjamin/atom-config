Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.cleanMiscCache = cleanMiscCache;
exports.setBusyRegistry = setBusyRegistry;
exports.getBusyRegistry = getBusyRegistry;
exports.command = command;
exports.initializeProject = initializeProject;
exports.installPlatformsForBoards = installPlatformsForBoards;

var rebuildIndex = _asyncToGenerator(function* (projectPath) {
  if (!projectPath) {
    atom.notifications.addError('PlatformIO: Please open the project directory.');
    return;
  }

  try {
    var iniPath = _path2['default'].join(projectPath, 'platformio.ini');
    if (!(yield utils.isFile(iniPath))) {
      atom.notifications.addError('PlatformIO: Please initialize new project first.');
      return;
    }

    var envNamePrefix = 'env:';
    var _config = _ini2['default'].parse((yield fsp.readFile(iniPath)).toString());
    var configSections = Object.keys(_config);
    var rebuildOccured = 0;
    for (var section of configSections) {
      if (section.indexOf(envNamePrefix) === 0 && _config[section].board) {
        startBusy();
        var args = ['init', '--ide', 'atom', '-b', _config[section].board];
        try {
          yield utils.spawnPio(args, { cwd: projectPath });
          atom.notifications.addSuccess('PlatformIO: C/C++ Project Index (for Autocomplete, Linter) has been successfully rebuilt.');
          rebuildOccured = 1;
        } catch (e) {
          rebuildOccured = 2;
          console.error(e);
          onFail(e);
        }
        stopBusy();
        break;
      }
    }

    if (rebuildOccured === 0) {
      atom.notifications.addWarning('PlatformIO: Rebuild operation has been skipped (empty project).');
    }
  } catch (e) {
    onFail(e);
  }

  function onFail(e) {
    atom.notifications.addError('PlatformIO: Failed to rebuild C/C++ Project Index (for Autocomplete, Linter).', { 'detail': e.toString(), dismissable: true });
  }

  function startBusy() {
    __BUSY_REGISTRY && __BUSY_REGISTRY.begin('platformio.index-rebuild-' + projectPath, 'PlatformIO: Rebuilding C/C++ Project Index for ' + projectPath);
  }

  function stopBusy() {
    __BUSY_REGISTRY && __BUSY_REGISTRY.end('platformio.index-rebuild-' + projectPath);
  }
});

exports.rebuildIndex = rebuildIndex;
exports.intendToPerformIndexRebuild = intendToPerformIndexRebuild;

var ensureProjectsInited = _asyncToGenerator(function* (projectPaths) {
  var force = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

  if (!atom.config.get('platformio-ide.autoRebuildAutocompleteIndex') && !force) {
    return;
  }

  var confFiles = ['.clang_complete', '.gcc-flags.json'];
  for (var projectPath of projectPaths) {
    try {
      var dirStat = yield fsp.stat(projectPath);
      if (!dirStat || !dirStat.isDirectory()) {
        continue;
      }
      var projectFiles = yield fsp.readdir(projectPath);
      if (projectFiles.indexOf('platformio.ini') === -1) {
        continue;
      }
      for (var file of confFiles) {
        if (projectFiles.indexOf(file) === -1) {
          intendToPerformIndexRebuild(projectPath);
          break;
        }
      }
    } catch (e) {
      console.warn('An error occured while processing project under ' + projectPath + ': ' + e.toString());
      continue;
    }
  }
}

/**
 * Setup watches on library paths of given project paths.
 *
 * Each project has a set of watches:
 *  - on local `lib` directory;
 *  - on global `lib` directory;
 *  - on `platformio.ini`;
 *
 * When `platformio.ini` content changes, checks a global `lib` dir. If it has
 * been changed, a corresponging watch of on old dir should be disposed, and
 * a watch on new dir should be created instead.
 *
 * WIP!
 */
);

exports.ensureProjectsInited = ensureProjectsInited;
exports.handleLibChanges = handleLibChanges;
exports.clearLibChangeWatchers = clearLibChangeWatchers;

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

var _config2 = require('../config');

var config = _interopRequireWildcard(_config2);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _view = require('./view');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _ini = require('ini');

var _ini2 = _interopRequireDefault(_ini);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

'use babel';

var fsp = (0, _promisifyNode2['default'])('fs');

var __TYPE_FILE = 'file';
var __TYPE_DIR = 'dir';
var __ALL_LIB_WATCHERS = new Map();
var __BUSY_REGISTRY = null;
var __INTENSIONS_CACHE = new Map();

function cleanMiscCache() {
  __ALL_LIB_WATCHERS = null;
  __INTENSIONS_CACHE = null;
  __BUSY_REGISTRY = null;
}

function setBusyRegistry(registry) {
  __BUSY_REGISTRY = registry;
}

function getBusyRegistry() {
  return __BUSY_REGISTRY;
}

function command() {
  // Initialize view
  var view = new _view.InitializeNewProjectView();
  var panel = atom.workspace.addModalPanel({ item: view.getElement() });

  // Set buttons handlers
  view.handleCancel = function () {
    return panel.destroy();
  };
  view.handleInit = function () {
    var projectPath = view.getDirectory();
    var selectedBoards = view.getSelectedBoards();
    return installPlatformsForBoards(selectedBoards, view).then(function () {
      return view.setStatus('Performing initialization...');
    }).then(function () {
      return initializeProject(selectedBoards, projectPath);
    }).then(function () {
      atom.notifications.addSuccess('PlatformIO: Project has been successfully initialized!', {
        detail: 'The next files/directories were created in "' + projectPath + '"\n' + '"platformio.ini" - Project Configuration File\n' + '"src" - Put your source code here\n' + '"lib" - Put here project specific (private) libraries'
      });
      utils.runAtomCommand('build:refresh-targets');
    }, function (reason) {
      var title = 'PlatformIO: Failed to initialize PlatformIO project!';
      atom.notifications.addError(title, { detail: reason, dismissable: true });
      console.error(title);
      console.error(reason);
    }).then(function () {
      if (-1 === atom.project.getPaths().indexOf(projectPath)) {
        atom.project.addPath(projectPath);
      }
      handleLibChanges([projectPath]);
    }).then(function () {
      return panel.destroy();
    }, function () {
      return panel.destroy();
    });
  };

  var paths = atom.project.getPaths();
  if (paths.length > 0) {
    view.addDirectories(paths, utils.getActiveProjectPath());
  }
}

function initializeProject(boardIds, projectPath) {
  var boards = utils.getBoards();
  var args = ['init', '--ide', 'atom'];
  boardIds.forEach(function (boardId) {
    args.push('--board');
    if ('id' in boards[boardId]) {
      args.push(boards[boardId].id);
    } else {
      args.push(boardId);
    }
  });
  args.push('--project-dir');
  args.push(projectPath);

  return utils.spawnPio(args);
}

function getPlatforms(boardIds) {
  var boards = utils.getBoards();
  var result = new Set();
  for (var boardId of boardIds) {
    result.add(boards[boardId].platform);
  }
  return result;
}

function installPlatformsForBoards(boardIds, view) {
  var p = Promise.resolve();
  for (var platform of getPlatforms(boardIds)) {
    p = p.then(_setStatus(platform)).then(_installPlatform(platform));
  }
  return p;

  function _setStatus(platform) {
    return function () {
      return view.setStatus('Installing platform: ' + platform);
    };
  }

  function _installPlatform(platform) {
    return function () {
      return utils.spawnPio(['platforms', 'install', platform]);
    };
  }
}

function intendToPerformIndexRebuild(p) {
  var firstRun = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];
  var recursionDepth = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

  if (!__INTENSIONS_CACHE.has(p)) {
    __INTENSIONS_CACHE.set(p, []);
  }
  var intensions = __INTENSIONS_CACHE.get(p);
  if (firstRun && intensions.length === 0) {
    atom.notifications.addInfo('PlatformIO: C/C++ Project Index will be rebuilt shortly.', {
      detail: 'Libraries or configuration of project "' + p + '" have been changed. ' + 'C/C++ Project Index (Autocomplete, Linter) will be rebuilt in order to make changes ' + 'available in the PlatformIO IDE.'
    });
  }

  var now = Date.now();
  intensions.sort();
  if (intensions[intensions.length - 1] + config.AUTO_REBUILD_DELAY < now) {
    // No new intensions were made in last AUTO_REBUILD_DELAY ms
    intensions.splice(0, intensions.length); // clear the array
    return rebuildIndex(p);
  } else if (firstRun) {
    intensions.push(now);
  }

  if (intensions.length > 0 && recursionDepth < 1000) {
    setTimeout(function () {
      return intendToPerformIndexRebuild(p, false, recursionDepth + 1);
    }, config.AUTO_REBUILD_DELAY);
  }
}

function handleLibChanges(projectPaths) {
  var Directory = undefined,
      File = undefined;
  try {
    var pathwatcher = require(_path2['default'].join(process.resourcesPath, 'app.asar', 'node_modules', 'pathwatcher'));
    Directory = pathwatcher.Directory;
    File = pathwatcher.File;
  } catch (e) {
    console.warn('Unable to import the pathwatcher module. ' + 'Automatic index rebuild on libraries changes will not be available.');
    return;
  }

  // Stop watching removed paths
  var currentPaths = atom.project.getPaths();
  var removedPaths = Array.from(__ALL_LIB_WATCHERS.keys()).filter(function (p) {
    return currentPaths.indexOf(p) === -1;
  });
  clearLibChangeWatchers(removedPaths);

  // Update watches on open paths
  projectPaths.map(function (p) {
    if (!utils.isPioProject(p)) {
      return;
    }

    if (!__ALL_LIB_WATCHERS.has(p)) {
      __ALL_LIB_WATCHERS.set(p, []);
    }
    var existingWatches = __ALL_LIB_WATCHERS.get(p);

    var necessaryWatches = [{
      type: __TYPE_FILE,
      path: _path2['default'].join(p, 'platformio.ini')
    }];

    var warningMessage = 'Failed to get library directories for watching';
    try {
      var args = ['-c', 'from os.path import join; from platformio import VERSION,util; print ":".join([join(util.get_home_dir(), "lib"), util.get_projectlib_dir(), util.get_projectlibdeps_dir()]) if VERSION[0] == 3 else util.get_lib_dir()'];
      var child = _child_process2['default'].spawnSync(utils.getPythonExecutable(), args, { cwd: p });
      if (child.status === 0) {
        for (var libDir of child.stdout.toString().trim().split(':')) {
          necessaryWatches.push({
            type: __TYPE_DIR,
            path: libDir
          });
        }
      } else {
        console.warn(warningMessage);
      }
    } catch (e) {
      console.warn(warningMessage);
    }

    // Dispose the watches that are not necessary anymore (e.g., when global
    // lib dir changes, the old watch has to be disposed before a new one is
    // created).
    var necessaryWathPaths = necessaryWatches.map(function (x) {
      return x.path;
    });
    var i = existingWatches.length;
    while (i--) {
      // Iterating backwards in order to be able to delete the array elements
      // safely.
      var watch = existingWatches[i];
      if (!necessaryWathPaths.includes(watch.path)) {
        watch.disposable.dispose();
        existingWatches.splice(i, 1);
      }
    }

    var alreadyWatchedPaths = existingWatches.map(function (x) {
      return x.path;
    });
    var watchesToAdd = necessaryWatches.filter(function (x) {
      return !alreadyWatchedPaths.includes(x.path);
    });

    for (var watchConfig of watchesToAdd) {
      var pathwatcherInstance = null;
      switch (watchConfig.type) {

        case __TYPE_FILE:
          pathwatcherInstance = new File(watchConfig.path);
          watchConfig.disposable = pathwatcherInstance.onDidChange(function () {
            handleLibChanges([p]);
            intendToPerformIndexRebuild(p);
          });
          console.debug('File watch added: ' + watchConfig.path);
          break;

        case __TYPE_DIR:
          pathwatcherInstance = new Directory(watchConfig.path);
          setupLibDirWatch(watchConfig, pathwatcherInstance, p);
          console.debug('Directory watch added: ' + watchConfig.path);
          break;

        default:
          console.warn('Incorrect watch type specified: \'' + watchConfig.type + '\'; ' + ('whole config: ' + JSON.stringify(watchConfig)));
          continue;
      }
      existingWatches.push(watchConfig);
    }
  });
}

function setupLibDirWatch(libObj, dir, projectPath) {
  if (!dir.existsSync()) {
    return;
  }

  var subdirectories = new Set();
  dir.getEntriesSync().forEach(function (entry) {
    if (entry.isDirectory()) {
      subdirectories.add(entry.getPath());
    }
  });

  libObj.disposable = dir.onDidChange(function () {
    var libAdded = false;
    var currentSubdirectories = new Set();

    var entries = dir.getEntriesSync();
    entries.forEach(function (entry) {
      if (entry.isDirectory()) {
        var p = entry.getPath();
        currentSubdirectories.add(p);
        if (!subdirectories.has(p)) {
          libAdded = true;
        }
      }
    });
    subdirectories = currentSubdirectories;

    if (libAdded) {
      intendToPerformIndexRebuild(projectPath);
    }
  });
}

function clearLibChangeWatchers(paths) {
  paths = typeof paths === 'undefined' ? atom.project.getPaths() : paths;
  for (var p of paths) {
    if (__ALL_LIB_WATCHERS.has(p)) {
      __ALL_LIB_WATCHERS.get(p).map(function (item) {
        item.path = null;
        if (item.disposable && typeof item.disposable.dispose === 'function') {
          item.disposable.dispose();
        }
        item.disposable = null;
      });
      __ALL_LIB_WATCHERS['delete'](p);
    }
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbml0L2NvbW1hbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztJQTRJc0IsWUFBWSxxQkFBM0IsV0FBNEIsV0FBVyxFQUFFO0FBQzlDLE1BQUksQ0FBQyxXQUFXLEVBQUU7QUFDaEIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQ3pCLGdEQUFnRCxDQUFDLENBQUM7QUFDcEQsV0FBTztHQUNSOztBQUVELE1BQUk7QUFDRixRQUFNLE9BQU8sR0FBRyxrQkFBSyxJQUFJLENBQUMsV0FBVyxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDekQsUUFBSSxFQUFDLE1BQU0sS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQSxFQUFFO0FBQ2hDLFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLGtEQUFrRCxDQUFDLENBQUM7QUFDaEYsYUFBTztLQUNSOztBQUVELFFBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQztBQUM3QixRQUFNLE9BQU0sR0FBRyxpQkFBSSxLQUFLLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUEsQ0FBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBQ25FLFFBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTSxDQUFDLENBQUM7QUFDM0MsUUFBSSxjQUFjLEdBQUcsQ0FBQyxDQUFDO0FBQ3ZCLFNBQUssSUFBTSxPQUFPLElBQUksY0FBYyxFQUFFO0FBQ3BDLFVBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssRUFBRTtBQUNqRSxpQkFBUyxFQUFFLENBQUM7QUFDWixZQUFNLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUks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S0FBSyxFQUFFO0FBQzVDLE9BQUssR0FBRyxPQUFPLEtBQUssS0FBSyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsR0FBRyxLQUFLLENBQUM7QUFDdkUsT0FBSyxJQUFNLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDckIsUUFBSSxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDN0Isd0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFTLElBQUksRUFBRTtBQUMzQyxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixZQUFJLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUU7QUFDcEUsY0FBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUMzQjtBQUNELFlBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO09BQ3hCLENBQUMsQ0FBQztBQUNILHdCQUFrQixVQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUI7R0FDRjtDQUNGIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbml0L2NvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0luaXRpYWxpemVOZXdQcm9qZWN0Vmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IGluaSBmcm9tICdpbmknO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgcHJvbWlzaWZ5IGZyb20gJ3Byb21pc2lmeS1ub2RlJztcblxuY29uc3QgZnNwID0gcHJvbWlzaWZ5KCdmcycpO1xuXG5cbmNvbnN0IF9fVFlQRV9GSUxFID0gJ2ZpbGUnO1xuY29uc3QgX19UWVBFX0RJUiA9ICdkaXInO1xubGV0IF9fQUxMX0xJQl9XQVRDSEVSUyA9IG5ldyBNYXAoKTtcbmxldCBfX0JVU1lfUkVHSVNUUlkgPSBudWxsO1xubGV0IF9fSU5URU5TSU9OU19DQUNIRSA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuTWlzY0NhY2hlKCkge1xuICBfX0FMTF9MSUJfV0FUQ0hFUlMgPSBudWxsO1xuICBfX0lOVEVOU0lPTlNfQ0FDSEUgPSBudWxsO1xuICBfX0JVU1lfUkVHSVNUUlkgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0QnVzeVJlZ2lzdHJ5KHJlZ2lzdHJ5KSB7XG4gIF9fQlVTWV9SRUdJU1RSWSA9IHJlZ2lzdHJ5O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnVzeVJlZ2lzdHJ5KCkge1xuICByZXR1cm4gX19CVVNZX1JFR0lTVFJZO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tbWFuZCgpIHtcbiAgLy8gSW5pdGlhbGl6ZSB2aWV3XG4gIHZhciB2aWV3ID0gbmV3IEluaXRpYWxpemVOZXdQcm9qZWN0VmlldygpO1xuICB2YXIgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtpdGVtOiB2aWV3LmdldEVsZW1lbnQoKX0pO1xuXG4gIC8vIFNldCBidXR0b25zIGhhbmRsZXJzXG4gIHZpZXcuaGFuZGxlQ2FuY2VsID0gKCkgPT4gcGFuZWwuZGVzdHJveSgpO1xuICB2aWV3LmhhbmRsZUluaXQgPSAoKSA9PiB7XG4gICAgY29uc3QgcHJvamVjdFBhdGggPSB2aWV3LmdldERpcmVjdG9yeSgpO1xuICAgIGNvbnN0IHNlbGVjdGVkQm9hcmRzID0gdmlldy5nZXRTZWxlY3RlZEJvYXJkcygpO1xuICAgIHJldHVybiBpbnN0YWxsUGxhdGZvcm1zRm9yQm9hcmRzKHNlbGVjdGVkQm9hcmRzLCB2aWV3KVxuICAgICAgLnRoZW4oKCkgPT4gdmlldy5zZXRTdGF0dXMoJ1BlcmZvcm1pbmcgaW5pdGlhbGl6YXRpb24uLi4nKSlcbiAgICAgIC50aGVuKCgpID0+IGluaXRpYWxpemVQcm9qZWN0KHNlbGVjdGVkQm9hcmRzLCBwcm9qZWN0UGF0aCkpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKCdQbGF0Zm9ybUlPOiBQcm9qZWN0IGhhcyBiZWVuIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZCEnLCB7XG4gICAgICAgICAgZGV0YWlsOiAnVGhlIG5leHQgZmlsZXMvZGlyZWN0b3JpZXMgd2VyZSBjcmVhdGVkIGluIFwiJyArIHByb2plY3RQYXRoICsgJ1wiXFxuJyArXG4gICAgICAgICAgJ1wicGxhdGZvcm1pby5pbmlcIiAtIFByb2plY3QgQ29uZmlndXJhdGlvbiBGaWxlXFxuJyArXG4gICAgICAgICAgJ1wic3JjXCIgLSBQdXQgeW91ciBzb3VyY2UgY29kZSBoZXJlXFxuJyArXG4gICAgICAgICAgJ1wibGliXCIgLSBQdXQgaGVyZSBwcm9qZWN0IHNwZWNpZmljIChwcml2YXRlKSBsaWJyYXJpZXMnXG4gICAgICAgIH0pO1xuICAgICAgICB1dGlscy5ydW5BdG9tQ29tbWFuZCgnYnVpbGQ6cmVmcmVzaC10YXJnZXRzJyk7XG4gICAgICB9LCAocmVhc29uKSA9PiB7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gJ1BsYXRmb3JtSU86IEZhaWxlZCB0byBpbml0aWFsaXplIFBsYXRmb3JtSU8gcHJvamVjdCEnO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IodGl0bGUsIHtkZXRhaWw6IHJlYXNvbiwgZGlzbWlzc2FibGU6IHRydWV9KTtcbiAgICAgICAgY29uc29sZS5lcnJvcih0aXRsZSk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IocmVhc29uKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIGlmICgtMSA9PT0gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkuaW5kZXhPZihwcm9qZWN0UGF0aCkpIHtcbiAgICAgICAgICBhdG9tLnByb2plY3QuYWRkUGF0aChwcm9qZWN0UGF0aCk7XG4gICAgICAgIH1cbiAgICAgICAgaGFuZGxlTGliQ2hhbmdlcyhbcHJvamVjdFBhdGhdKTtcbiAgICAgIH0pXG4gICAgICAudGhlbigoKSA9PiBwYW5lbC5kZXN0cm95KCksICgpID0+IHBhbmVsLmRlc3Ryb3koKSk7XG4gIH07XG5cbiAgY29uc3QgcGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKTtcbiAgaWYgKHBhdGhzLmxlbmd0aCA+IDApIHtcbiAgICB2aWV3LmFkZERpcmVjdG9yaWVzKHBhdGhzLCB1dGlscy5nZXRBY3RpdmVQcm9qZWN0UGF0aCgpKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZVByb2plY3QoYm9hcmRJZHMsIHByb2plY3RQYXRoKSB7XG4gIGNvbnN0IGJvYXJkcyA9IHV0aWxzLmdldEJvYXJkcygpO1xuICBjb25zdCBhcmdzID0gWydpbml0JywgJy0taWRlJywgJ2F0b20nXTtcbiAgYm9hcmRJZHMuZm9yRWFjaCgoYm9hcmRJZCkgPT4ge1xuICAgIGFyZ3MucHVzaCgnLS1ib2FyZCcpO1xuICAgIGlmICgnaWQnIGluIGJvYXJkc1tib2FyZElkXSkge1xuICAgICAgYXJncy5wdXNoKGJvYXJkc1tib2FyZElkXS5pZCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgYXJncy5wdXNoKGJvYXJkSWQpO1xuICAgIH1cbiAgfSk7XG4gIGFyZ3MucHVzaCgnLS1wcm9qZWN0LWRpcicpO1xuICBhcmdzLnB1c2gocHJvamVjdFBhdGgpO1xuXG4gIHJldHVybiB1dGlscy5zcGF3blBpbyhhcmdzKTtcbn1cblxuZnVuY3Rpb24gZ2V0UGxhdGZvcm1zKGJvYXJkSWRzKSB7XG4gIGNvbnN0IGJvYXJkcyA9IHV0aWxzLmdldEJvYXJkcygpO1xuICBjb25zdCByZXN1bHQgPSBuZXcgU2V0KCk7XG4gIGZvciAoY29uc3QgYm9hcmRJZCBvZiBib2FyZElkcykge1xuICAgIHJlc3VsdC5hZGQoYm9hcmRzW2JvYXJkSWRdLnBsYXRmb3JtKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbFBsYXRmb3Jtc0ZvckJvYXJkcyhib2FyZElkcywgdmlldykge1xuICBsZXQgcCA9IFByb21pc2UucmVzb2x2ZSgpO1xuICBmb3IgKGNvbnN0IHBsYXRmb3JtIG9mIGdldFBsYXRmb3Jtcyhib2FyZElkcykpIHtcbiAgICBwID0gcC50aGVuKF9zZXRTdGF0dXMocGxhdGZvcm0pKVxuICAgICAgICAgLnRoZW4oX2luc3RhbGxQbGF0Zm9ybShwbGF0Zm9ybSkpO1xuICB9XG4gIHJldHVybiBwO1xuXG4gIGZ1bmN0aW9uIF9zZXRTdGF0dXMocGxhdGZvcm0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdmlldy5zZXRTdGF0dXMoYEluc3RhbGxpbmcgcGxhdGZvcm06ICR7cGxhdGZvcm19YCk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9pbnN0YWxsUGxhdGZvcm0ocGxhdGZvcm0pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gdXRpbHMuc3Bhd25QaW8oWydwbGF0Zm9ybXMnLCAnaW5zdGFsbCcsIHBsYXRmb3JtXSk7XG4gICAgfTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVidWlsZEluZGV4KHByb2plY3RQYXRoKSB7XG4gIGlmICghcHJvamVjdFBhdGgpIHtcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAnUGxhdGZvcm1JTzogUGxlYXNlIG9wZW4gdGhlIHByb2plY3QgZGlyZWN0b3J5LicpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHRyeSB7XG4gICAgY29uc3QgaW5pUGF0aCA9IHBhdGguam9pbihwcm9qZWN0UGF0aCwgJ3BsYXRmb3JtaW8uaW5pJyk7XG4gICAgaWYgKCFhd2FpdCB1dGlscy5pc0ZpbGUoaW5pUGF0aCkpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUGxhdGZvcm1JTzogUGxlYXNlIGluaXRpYWxpemUgbmV3IHByb2plY3QgZmlyc3QuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgZW52TmFtZVByZWZpeCA9ICdlbnY6JztcbiAgICBjb25zdCBjb25maWcgPSBpbmkucGFyc2UoKGF3YWl0IGZzcC5yZWFkRmlsZShpbmlQYXRoKSkudG9TdHJpbmcoKSk7XG4gICAgY29uc3QgY29uZmlnU2VjdGlvbnMgPSBPYmplY3Qua2V5cyhjb25maWcpO1xuICAgIGxldCByZWJ1aWxkT2NjdXJlZCA9IDA7XG4gICAgZm9yIChjb25zdCBzZWN0aW9uIG9mIGNvbmZpZ1NlY3Rpb25zKSB7XG4gICAgICBpZiAoc2VjdGlvbi5pbmRleE9mKGVudk5hbWVQcmVmaXgpID09PSAwICYmIGNvbmZpZ1tzZWN0aW9uXS5ib2FyZCkge1xuICAgICAgICBzdGFydEJ1c3koKTtcbiAgICAgICAgY29uc3QgYXJncyA9IFsnaW5pdCcsICctLWlkZScsICdhdG9tJywgJy1iJywgY29uZmlnW3NlY3Rpb25dLmJvYXJkXTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBhd2FpdCB1dGlscy5zcGF3blBpbyhhcmdzLCB7Y3dkOiBwcm9qZWN0UGF0aH0pO1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFxuICAgICAgICAgICAgJ1BsYXRmb3JtSU86IEMvQysrIFByb2plY3QgSW5kZXggKGZvciBBdXRvY29tcGxldGUsIExpbnRlcikgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IHJlYnVpbHQuJ1xuICAgICAgICAgICk7XG4gICAgICAgICAgcmVidWlsZE9jY3VyZWQgPSAxO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICByZWJ1aWxkT2NjdXJlZCA9IDI7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTtcbiAgICAgICAgICBvbkZhaWwoZSk7XG4gICAgICAgIH1cbiAgICAgICAgc3RvcEJ1c3koKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlYnVpbGRPY2N1cmVkID09PSAwKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgJ1BsYXRmb3JtSU86IFJlYnVpbGQgb3BlcmF0aW9uIGhhcyBiZWVuIHNraXBwZWQgKGVtcHR5IHByb2plY3QpLidcbiAgICAgICk7XG4gICAgfVxuICB9IGNhdGNoKGUpIHtcbiAgICBvbkZhaWwoZSk7XG4gIH1cblxuICBmdW5jdGlvbiBvbkZhaWwoZSkge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICdQbGF0Zm9ybUlPOiBGYWlsZWQgdG8gcmVidWlsZCBDL0MrKyBQcm9qZWN0IEluZGV4IChmb3IgQXV0b2NvbXBsZXRlLCBMaW50ZXIpLicsXG4gICAgICB7J2RldGFpbCc6IGUudG9TdHJpbmcoKSwgZGlzbWlzc2FibGU6IHRydWV9XG4gICAgKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0QnVzeSAoKSB7XG4gICAgX19CVVNZX1JFR0lTVFJZICYmIF9fQlVTWV9SRUdJU1RSWS5iZWdpbihcbiAgICAgICdwbGF0Zm9ybWlvLmluZGV4LXJlYnVpbGQtJyArIHByb2plY3RQYXRoLFxuICAgICAgYFBsYXRmb3JtSU86IFJlYnVpbGRpbmcgQy9DKysgUHJvamVjdCBJbmRleCBmb3IgJHtwcm9qZWN0UGF0aH1gKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BCdXN5ICgpIHtcbiAgICBfX0JVU1lfUkVHSVNUUlkgJiYgX19CVVNZX1JFR0lTVFJZLmVuZChcbiAgICAgICdwbGF0Zm9ybWlvLmluZGV4LXJlYnVpbGQtJyArIHByb2plY3RQYXRoKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW50ZW5kVG9QZXJmb3JtSW5kZXhSZWJ1aWxkKHAsIGZpcnN0UnVuPXRydWUsIHJlY3Vyc2lvbkRlcHRoPTApIHtcbiAgaWYgKCFfX0lOVEVOU0lPTlNfQ0FDSEUuaGFzKHApKSB7XG4gICAgX19JTlRFTlNJT05TX0NBQ0hFLnNldChwLCBbXSk7XG4gIH1cbiAgY29uc3QgaW50ZW5zaW9ucyA9IF9fSU5URU5TSU9OU19DQUNIRS5nZXQocCk7XG4gIGlmIChmaXJzdFJ1biAmJiBpbnRlbnNpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKCdQbGF0Zm9ybUlPOiBDL0MrKyBQcm9qZWN0IEluZGV4IHdpbGwgYmUgcmVidWlsdCBzaG9ydGx5LicsIHtcbiAgICAgIGRldGFpbDogYExpYnJhcmllcyBvciBjb25maWd1cmF0aW9uIG9mIHByb2plY3QgXCIke3B9XCIgaGF2ZSBiZWVuIGNoYW5nZWQuIGAgK1xuICAgICAgICAgICAgICAnQy9DKysgUHJvamVjdCBJbmRleCAoQXV0b2NvbXBsZXRlLCBMaW50ZXIpIHdpbGwgYmUgcmVidWlsdCBpbiBvcmRlciB0byBtYWtlIGNoYW5nZXMgJyArXG4gICAgICAgICAgICAgICdhdmFpbGFibGUgaW4gdGhlIFBsYXRmb3JtSU8gSURFLicsXG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBub3cgPSBEYXRlLm5vdygpO1xuICBpbnRlbnNpb25zLnNvcnQoKTtcbiAgaWYgKGludGVuc2lvbnNbaW50ZW5zaW9ucy5sZW5ndGggLSAxXSArIGNvbmZpZy5BVVRPX1JFQlVJTERfREVMQVkgPCBub3cpIHtcbiAgICAvLyBObyBuZXcgaW50ZW5zaW9ucyB3ZXJlIG1hZGUgaW4gbGFzdCBBVVRPX1JFQlVJTERfREVMQVkgbXNcbiAgICBpbnRlbnNpb25zLnNwbGljZSgwLCBpbnRlbnNpb25zLmxlbmd0aCk7ICAvLyBjbGVhciB0aGUgYXJyYXlcbiAgICByZXR1cm4gcmVidWlsZEluZGV4KHApO1xuICB9IGVsc2UgaWYgKGZpcnN0UnVuKSB7XG4gICAgaW50ZW5zaW9ucy5wdXNoKG5vdyk7XG4gIH1cblxuICBpZiAoaW50ZW5zaW9ucy5sZW5ndGggPiAwICYmIHJlY3Vyc2lvbkRlcHRoIDwgMTAwMCkge1xuICAgIHNldFRpbWVvdXQoXG4gICAgICAoKSA9PiBpbnRlbmRUb1BlcmZvcm1JbmRleFJlYnVpbGQocCwgZmFsc2UsIHJlY3Vyc2lvbkRlcHRoICsgMSksXG4gICAgICBjb25maWcuQVVUT19SRUJVSUxEX0RFTEFZXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZW5zdXJlUHJvamVjdHNJbml0ZWQocHJvamVjdFBhdGhzLCBmb3JjZT1mYWxzZSkge1xuICBpZiAoIWF0b20uY29uZmlnLmdldCgncGxhdGZvcm1pby1pZGUuYXV0b1JlYnVpbGRBdXRvY29tcGxldGVJbmRleCcpICYmICFmb3JjZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNvbmZGaWxlcyA9IFsnLmNsYW5nX2NvbXBsZXRlJywgJy5nY2MtZmxhZ3MuanNvbiddO1xuICBmb3IgKGNvbnN0IHByb2plY3RQYXRoIG9mIHByb2plY3RQYXRocykge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBkaXJTdGF0ID0gYXdhaXQgZnNwLnN0YXQocHJvamVjdFBhdGgpO1xuICAgICAgaWYgKCFkaXJTdGF0IHx8ICFkaXJTdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBjb25zdCBwcm9qZWN0RmlsZXMgPSBhd2FpdCBmc3AucmVhZGRpcihwcm9qZWN0UGF0aCk7XG4gICAgICBpZiAocHJvamVjdEZpbGVzLmluZGV4T2YoJ3BsYXRmb3JtaW8uaW5pJykgPT09IC0xKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGNvbmZGaWxlcykge1xuICAgICAgICBpZiAocHJvamVjdEZpbGVzLmluZGV4T2YoZmlsZSkgPT09IC0xKSB7XG4gICAgICAgICAgaW50ZW5kVG9QZXJmb3JtSW5kZXhSZWJ1aWxkKHByb2plY3RQYXRoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS53YXJuKGBBbiBlcnJvciBvY2N1cmVkIHdoaWxlIHByb2Nlc3NpbmcgcHJvamVjdCB1bmRlciAke3Byb2plY3RQYXRofTogYCArIGUudG9TdHJpbmcoKSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBTZXR1cCB3YXRjaGVzIG9uIGxpYnJhcnkgcGF0aHMgb2YgZ2l2ZW4gcHJvamVjdCBwYXRocy5cbiAqXG4gKiBFYWNoIHByb2plY3QgaGFzIGEgc2V0IG9mIHdhdGNoZXM6XG4gKiAgLSBvbiBsb2NhbCBgbGliYCBkaXJlY3Rvcnk7XG4gKiAgLSBvbiBnbG9iYWwgYGxpYmAgZGlyZWN0b3J5O1xuICogIC0gb24gYHBsYXRmb3JtaW8uaW5pYDtcbiAqXG4gKiBXaGVuIGBwbGF0Zm9ybWlvLmluaWAgY29udGVudCBjaGFuZ2VzLCBjaGVja3MgYSBnbG9iYWwgYGxpYmAgZGlyLiBJZiBpdCBoYXNcbiAqIGJlZW4gY2hhbmdlZCwgYSBjb3JyZXNwb25naW5nIHdhdGNoIG9mIG9uIG9sZCBkaXIgc2hvdWxkIGJlIGRpc3Bvc2VkLCBhbmRcbiAqIGEgd2F0Y2ggb24gbmV3IGRpciBzaG91bGQgYmUgY3JlYXRlZCBpbnN0ZWFkLlxuICpcbiAqIFdJUCFcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUxpYkNoYW5nZXMocHJvamVjdFBhdGhzKSB7XG4gIGxldCBEaXJlY3RvcnksIEZpbGU7XG4gIHRyeSB7XG4gICAgY29uc3QgcGF0aHdhdGNoZXIgPSByZXF1aXJlKHBhdGguam9pbihwcm9jZXNzLnJlc291cmNlc1BhdGgsICdhcHAuYXNhcicsICdub2RlX21vZHVsZXMnLCAncGF0aHdhdGNoZXInKSk7XG4gICAgRGlyZWN0b3J5ID0gcGF0aHdhdGNoZXIuRGlyZWN0b3J5O1xuICAgIEZpbGUgPSBwYXRod2F0Y2hlci5GaWxlO1xuICB9IGNhdGNoKGUpIHtcbiAgICBjb25zb2xlLndhcm4oJ1VuYWJsZSB0byBpbXBvcnQgdGhlIHBhdGh3YXRjaGVyIG1vZHVsZS4gJyArXG4gICAgICAgICAgICAgICAgICdBdXRvbWF0aWMgaW5kZXggcmVidWlsZCBvbiBsaWJyYXJpZXMgY2hhbmdlcyB3aWxsIG5vdCBiZSBhdmFpbGFibGUuJyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gU3RvcCB3YXRjaGluZyByZW1vdmVkIHBhdGhzXG4gIGNvbnN0IGN1cnJlbnRQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuICBjb25zdCByZW1vdmVkUGF0aHMgPSBBcnJheS5mcm9tKF9fQUxMX0xJQl9XQVRDSEVSUy5rZXlzKCkpLmZpbHRlcihwID0+IGN1cnJlbnRQYXRocy5pbmRleE9mKHApID09PSAtMSk7XG4gIGNsZWFyTGliQ2hhbmdlV2F0Y2hlcnMocmVtb3ZlZFBhdGhzKTtcblxuICAvLyBVcGRhdGUgd2F0Y2hlcyBvbiBvcGVuIHBhdGhzXG4gIHByb2plY3RQYXRocy5tYXAocCA9PiB7XG4gICAgaWYgKCF1dGlscy5pc1Bpb1Byb2plY3QocCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIV9fQUxMX0xJQl9XQVRDSEVSUy5oYXMocCkpIHtcbiAgICAgIF9fQUxMX0xJQl9XQVRDSEVSUy5zZXQocCwgW10pO1xuICAgIH1cbiAgICBjb25zdCBleGlzdGluZ1dhdGNoZXMgPSBfX0FMTF9MSUJfV0FUQ0hFUlMuZ2V0KHApO1xuXG4gICAgY29uc3QgbmVjZXNzYXJ5V2F0Y2hlcyA9IFtcbiAgICAgIHtcbiAgICAgICAgdHlwZTogX19UWVBFX0ZJTEUsXG4gICAgICAgIHBhdGg6IHBhdGguam9pbihwLCAncGxhdGZvcm1pby5pbmknKSxcbiAgICAgIH1cbiAgICBdO1xuXG4gICAgY29uc3Qgd2FybmluZ01lc3NhZ2UgPSAnRmFpbGVkIHRvIGdldCBsaWJyYXJ5IGRpcmVjdG9yaWVzIGZvciB3YXRjaGluZyc7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBbJy1jJywgJ2Zyb20gb3MucGF0aCBpbXBvcnQgam9pbjsgZnJvbSBwbGF0Zm9ybWlvIGltcG9ydCBWRVJTSU9OLHV0aWw7IHByaW50IFwiOlwiLmpvaW4oW2pvaW4odXRpbC5nZXRfaG9tZV9kaXIoKSwgXCJsaWJcIiksIHV0aWwuZ2V0X3Byb2plY3RsaWJfZGlyKCksIHV0aWwuZ2V0X3Byb2plY3RsaWJkZXBzX2RpcigpXSkgaWYgVkVSU0lPTlswXSA9PSAzIGVsc2UgdXRpbC5nZXRfbGliX2RpcigpJ107XG4gICAgICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd25TeW5jKHV0aWxzLmdldFB5dGhvbkV4ZWN1dGFibGUoKSwgYXJncywge2N3ZDogcH0pO1xuICAgICAgaWYgKGNoaWxkLnN0YXR1cyA9PT0gMCkge1xuICAgICAgICBmb3IgKGNvbnN0IGxpYkRpciBvZiBjaGlsZC5zdGRvdXQudG9TdHJpbmcoKS50cmltKCkuc3BsaXQoJzonKSkge1xuICAgICAgICAgIG5lY2Vzc2FyeVdhdGNoZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBfX1RZUEVfRElSLFxuICAgICAgICAgICAgcGF0aDogbGliRGlyLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4od2FybmluZ01lc3NhZ2UpO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge1xuICAgICAgY29uc29sZS53YXJuKHdhcm5pbmdNZXNzYWdlKTtcbiAgICB9XG5cbiAgICAvLyBEaXNwb3NlIHRoZSB3YXRjaGVzIHRoYXQgYXJlIG5vdCBuZWNlc3NhcnkgYW55bW9yZSAoZS5nLiwgd2hlbiBnbG9iYWxcbiAgICAvLyBsaWIgZGlyIGNoYW5nZXMsIHRoZSBvbGQgd2F0Y2ggaGFzIHRvIGJlIGRpc3Bvc2VkIGJlZm9yZSBhIG5ldyBvbmUgaXNcbiAgICAvLyBjcmVhdGVkKS5cbiAgICBjb25zdCBuZWNlc3NhcnlXYXRoUGF0aHMgPSBuZWNlc3NhcnlXYXRjaGVzLm1hcCh4ID0+IHgucGF0aCk7XG4gICAgbGV0IGkgPSBleGlzdGluZ1dhdGNoZXMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgIC8vIEl0ZXJhdGluZyBiYWNrd2FyZHMgaW4gb3JkZXIgdG8gYmUgYWJsZSB0byBkZWxldGUgdGhlIGFycmF5IGVsZW1lbnRzXG4gICAgICAvLyBzYWZlbHkuXG4gICAgICBjb25zdCB3YXRjaCA9IGV4aXN0aW5nV2F0Y2hlc1tpXTtcbiAgICAgIGlmICghbmVjZXNzYXJ5V2F0aFBhdGhzLmluY2x1ZGVzKHdhdGNoLnBhdGgpKSB7XG4gICAgICAgIHdhdGNoLmRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgICBleGlzdGluZ1dhdGNoZXMuc3BsaWNlKGksIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGFscmVhZHlXYXRjaGVkUGF0aHMgPSBleGlzdGluZ1dhdGNoZXMubWFwKHggPT4geC5wYXRoKTtcbiAgICBjb25zdCB3YXRjaGVzVG9BZGQgPSBuZWNlc3NhcnlXYXRjaGVzXG4gICAgICAuZmlsdGVyKHggPT4gIWFscmVhZHlXYXRjaGVkUGF0aHMuaW5jbHVkZXMoeC5wYXRoKSk7XG5cbiAgICBmb3IgKGNvbnN0IHdhdGNoQ29uZmlnIG9mIHdhdGNoZXNUb0FkZCkge1xuICAgICAgbGV0IHBhdGh3YXRjaGVySW5zdGFuY2UgPSBudWxsO1xuICAgICAgc3dpdGNoICh3YXRjaENvbmZpZy50eXBlKSB7XG5cbiAgICAgIGNhc2UgX19UWVBFX0ZJTEU6XG4gICAgICAgIHBhdGh3YXRjaGVySW5zdGFuY2UgPSBuZXcgRmlsZSh3YXRjaENvbmZpZy5wYXRoKTtcbiAgICAgICAgd2F0Y2hDb25maWcuZGlzcG9zYWJsZSA9IHBhdGh3YXRjaGVySW5zdGFuY2Uub25EaWRDaGFuZ2UoKCkgPT4ge1xuICAgICAgICAgIGhhbmRsZUxpYkNoYW5nZXMoW3BdKTtcbiAgICAgICAgICBpbnRlbmRUb1BlcmZvcm1JbmRleFJlYnVpbGQocCk7XG4gICAgICAgIH0pO1xuICAgICAgICBjb25zb2xlLmRlYnVnKGBGaWxlIHdhdGNoIGFkZGVkOiAke3dhdGNoQ29uZmlnLnBhdGh9YCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlIF9fVFlQRV9ESVI6XG4gICAgICAgIHBhdGh3YXRjaGVySW5zdGFuY2UgPSBuZXcgRGlyZWN0b3J5KHdhdGNoQ29uZmlnLnBhdGgpO1xuICAgICAgICBzZXR1cExpYkRpcldhdGNoKHdhdGNoQ29uZmlnLCBwYXRod2F0Y2hlckluc3RhbmNlLCBwKTtcbiAgICAgICAgY29uc29sZS5kZWJ1ZyhgRGlyZWN0b3J5IHdhdGNoIGFkZGVkOiAke3dhdGNoQ29uZmlnLnBhdGh9YCk7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgYEluY29ycmVjdCB3YXRjaCB0eXBlIHNwZWNpZmllZDogJyR7d2F0Y2hDb25maWcudHlwZX0nOyBgICtcbiAgICAgICAgICBgd2hvbGUgY29uZmlnOiAke0pTT04uc3RyaW5naWZ5KHdhdGNoQ29uZmlnKX1gXG4gICAgICAgICk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZXhpc3RpbmdXYXRjaGVzLnB1c2god2F0Y2hDb25maWcpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldHVwTGliRGlyV2F0Y2gobGliT2JqLCBkaXIsIHByb2plY3RQYXRoKSB7XG4gIGlmICghZGlyLmV4aXN0c1N5bmMoKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBzdWJkaXJlY3RvcmllcyA9IG5ldyBTZXQoKTtcbiAgZGlyLmdldEVudHJpZXNTeW5jKCkuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICBpZiAoZW50cnkuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgc3ViZGlyZWN0b3JpZXMuYWRkKGVudHJ5LmdldFBhdGgoKSk7XG4gICAgfVxuICB9KTtcblxuICBsaWJPYmouZGlzcG9zYWJsZSA9IGRpci5vbkRpZENoYW5nZSgoKSA9PiB7XG4gICAgbGV0IGxpYkFkZGVkID0gZmFsc2U7XG4gICAgY29uc3QgY3VycmVudFN1YmRpcmVjdG9yaWVzID0gbmV3IFNldCgpO1xuXG4gICAgY29uc3QgZW50cmllcyA9IGRpci5nZXRFbnRyaWVzU3luYygpO1xuICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcbiAgICAgIGlmIChlbnRyeS5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIGNvbnN0IHAgPSBlbnRyeS5nZXRQYXRoKCk7XG4gICAgICAgIGN1cnJlbnRTdWJkaXJlY3Rvcmllcy5hZGQocCk7XG4gICAgICAgIGlmICghc3ViZGlyZWN0b3JpZXMuaGFzKHApKSB7XG4gICAgICAgICAgbGliQWRkZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gICAgc3ViZGlyZWN0b3JpZXMgPSBjdXJyZW50U3ViZGlyZWN0b3JpZXM7XG5cbiAgICBpZiAobGliQWRkZWQpIHtcbiAgICAgIGludGVuZFRvUGVyZm9ybUluZGV4UmVidWlsZChwcm9qZWN0UGF0aCk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyTGliQ2hhbmdlV2F0Y2hlcnMocGF0aHMpIHtcbiAgcGF0aHMgPSB0eXBlb2YgcGF0aHMgPT09ICd1bmRlZmluZWQnID8gYXRvbS5wcm9qZWN0LmdldFBhdGhzKCkgOiBwYXRocztcbiAgZm9yIChjb25zdCBwIG9mIHBhdGhzKSB7XG4gICAgaWYgKF9fQUxMX0xJQl9XQVRDSEVSUy5oYXMocCkpIHtcbiAgICAgIF9fQUxMX0xJQl9XQVRDSEVSUy5nZXQocCkubWFwKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgaXRlbS5wYXRoID0gbnVsbDtcbiAgICAgICAgaWYgKGl0ZW0uZGlzcG9zYWJsZSAmJiB0eXBlb2YgaXRlbS5kaXNwb3NhYmxlLmRpc3Bvc2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpdGVtLmRpc3Bvc2FibGUuZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIGl0ZW0uZGlzcG9zYWJsZSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIF9fQUxMX0xJQl9XQVRDSEVSUy5kZWxldGUocCk7XG4gICAgfVxuICB9XG59XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/init/command.js
