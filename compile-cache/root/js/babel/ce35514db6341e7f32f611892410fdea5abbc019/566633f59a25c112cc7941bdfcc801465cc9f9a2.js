Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.command = command;
exports.reinstallPlatformIO = reinstallPlatformIO;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

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

var _config = require('../config');

var config = _interopRequireWildcard(_config);

var _utils = require('../utils');

var utils = _interopRequireWildcard(_utils);

var _view = require('./view');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fsExtra = require('fs-extra');

var _fsExtra2 = _interopRequireDefault(_fsExtra);

var _lockfile = require('lockfile');

var _lockfile2 = _interopRequireDefault(_lockfile);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _shell = require('shell');

var _shell2 = _interopRequireDefault(_shell);

var _temp = require('temp');

var _temp2 = _interopRequireDefault(_temp);

'use babel';

var STATE_KEY = 'platformio-ide:install-state';
var PROGRESS_STEPS = 9;
var LOCKFILE_PATH = _path2['default'].join(config.BASE_DIR, 'install.lock');
var LOCKFILE_TIMEOUT = 5 * 60 * 1000;

// Install PlatformIO

function command() {
  // cleanup dead lock file
  var stats = _fsExtra2['default'].statSyncNoException(LOCKFILE_PATH);
  if (stats) {
    if (new Date().getTime() - new Date(stats.mtime).getTime() > LOCKFILE_TIMEOUT) {
      _fsExtra2['default'].unlinkSync(LOCKFILE_PATH);
    }
  }

  var chain = Promise.resolve().then(initializeState).then(ensureThatCacheDirectoryExists).then(checkIfVirtualenvShouldBeCreated).then(checkIfPackageManagmentIsNecessary).then(checkIfExamplesHaveToBeDownloaded).then(function (state) {
    if (!timeConsumingOperationsRequired(state)) {
      return activateInactiveDependencies()['catch'](function (err) {
        atom.notifications.addError('An error occured during a PlatformIO dependencies installation.', {
          detail: err.toString(),
          dismissable: true
        });
      });
    }
    return new Promise(function (resolve) {
      _lockfile2['default'].lock(LOCKFILE_PATH, function (err) {
        if (err) {
          atom.notifications.addInfo('PlatformIO IDE installation suspended.', {
            detail: 'Seems like PlatformIO IDE is already being installed in ' + 'another window.',
            dismissable: true
          });
          resolve();
        } else {
          var promise = performInstall(state).then(releaseLock, releaseLock);
          resolve(promise);
        }

        function releaseLock() {
          return _lockfile2['default'].unlock(LOCKFILE_PATH, function (err) {
            if (err) {
              console.warn('Failed to release the lock: ' + err.toString());
            }
          });
        }
      });
    });
  });
  return chain;
}

function performInstall(state) {
  var panel = undefined;
  var chain = Promise.resolve(state).then(function initializeView(state) {
    if (timeConsumingOperationsRequired(state)) {
      // Make view and panel accessible from outside of the tasks, so they can
      // be destroyed correctly even when error happens during some step.
      state.view = new _view.InstallPlatformIOView();
      state.view.handleCancel = function () {
        return state.canceled = true;
      };
      state.panel = panel = atom.workspace.addModalPanel({ item: state.view.getElement() });
    }
    return state;
  }).then(wrap(ensurePythonIsAvailable)).then(wrap(installPlatformIO)).then(wrap(installDependenciesFirstTime)).then(wrap(uninstallStaleDependencies)).then(wrap(installNewDependencies)).then(wrap(upgradeOutdatedDependencies)).then(wrap(activateInactiveDependencies)).then(wrap(adjustToolbarPosition)).then(wrap(getExamples)).then(notifyUser)['catch'](function (err) {
    return cleanup().then(function () {
      return console.error(err);
    });
  }).then(cleanupIfCanceled).then(function destroyViewAndSaveState(state) {
    if (panel) {
      panel.destroy();
    }
    if (state && state.panel) {
      delete state.panel;
    }
    if (state && state.view) {
      delete state.view;
    }

    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }).then(checkIfPlatformIOCanBeExecuted);

  return chain;
}

function reinstallPlatformIO(useDevelop) {
  var executable = _path2['default'].join(config.ENV_BIN_DIR, 'pip');
  var notifocation = atom.notifications.addInfo('PlatformIO: Reinstalling initiated.', {
    dismissable: true,
    detail: 'Please wait.'
  });
  return Promise.resolve().then(function () {
    return new Promise(function (resolve, reject) {
      // try to uninstall previous PlatformIO if exists
      var child = _child_process2['default'].spawn(executable, ['uninstall', '-y', 'platformio']);
      child.on('error', function (e) {
        return reject(e);
      });
      child.on('close', function () {
        return resolve();
      });
    });
  }).then(function () {
    return new Promise(function (resolve, reject) {
      var args = ['install'];
      if (useDevelop) {
        args.push('https://github.com/platformio/platformio/archive/develop.zip');
      } else {
        args.push('platformio');
      }

      var stderr = '';
      var child = _child_process2['default'].spawn(executable, args);
      child.on('error', onError);
      child.stderr.on('data', function (chunk) {
        return stderr += chunk;
      });
      child.on('close', function (code) {
        if (0 !== code) {
          onError(stderr);
          return;
        }
        resolve();
      });

      function onError(err) {
        var title = 'PlatformIO: Failed to install PlatformIO!';
        atom.notifications.addError(title, { detail: err, dismissable: true });
        console.error(title);
        console.error(err);
        reject();
      }
    });
  }).then(function () {
    return notifocation.dismiss();
  })['catch'](function (err) {
    notifocation.dismiss();
    throw err;
  });
}

// Tasks below are installation steps. Each task must accept a state as an
// argument and eventually return a modified state (directly or via promise).

function initializeState() {
  return new Promise(function (resolve) {
    // Retrieve the state object from localStorage
    var state = undefined;
    try {
      state = JSON.parse(localStorage.getItem(STATE_KEY));
      if (state instanceof Object) {
        state.restored = true;
      } else {
        state = {};
      }
    } catch (err) {
      console.error(err);
      state = {};
    }

    // Necessary for progress display
    state.step = 0;
    state.total = PROGRESS_STEPS;

    resolve(state);
  });
}

function ensureThatCacheDirectoryExists(state) {
  return new Promise(function (resolve) {
    _fsExtra2['default'].stat(config.CACHE_DIR, function (err) {
      if (err) {
        _fsExtra2['default'].mkdir(config.CACHE_DIR, function (err) {
          if (err) {
            throw new Error('Cannot create cache directory');
          }
          resolve(state);
        });
      }
      resolve(state);
    });
  });
}

function checkIfVirtualenvShouldBeCreated(state) {
  return new Promise(function (resolve) {
    _fsExtra2['default'].stat(config.ENV_BIN_DIR, function (err) {
      state.envShouldBeCreated = utils.useBuiltinPlatformIO() && err;
      resolve(state);
    });
  });
}

function checkIfPackageManagmentIsNecessary(state) {
  var availablePackages = atom.packages.getAvailablePackageNames();

  state.packagesToRemove = config.STALE_DEPENDENCIES.filter(function (name) {
    return availablePackages.indexOf(name) > 0;
  });
  state.packagesToInstall = Object.keys(config.DEPENDENCIES).filter(function (name) {
    return availablePackages.indexOf(name) === -1;
  });
  state.packagesToUpgrade = Object.keys(config.DEPENDENCIES).filter(function (name) {
    var packagePath = utils.resolveAtomPackagePath(name);
    if (!packagePath) {
      // Package is not even installed.
      return false;
    }

    var metadata = atom.packages.loadPackageMetadata(packagePath);
    if (!metadata) {
      return false;
    }

    var installedVersion = metadata.version;
    var requiredVersion = config.DEPENDENCIES[name];
    return !_semver2['default'].satisfies(installedVersion, requiredVersion);
  });

  state.packageManagementIsNecessary = Boolean(state.packagesToRemove.length || state.packagesToInstall.length || state.packagesToUpgrade.length);
  return state;
}

function checkIfExamplesHaveToBeDownloaded(state) {
  return new Promise(function (resolve) {
    var archive_path = _path2['default'].join(config.CACHE_DIR, 'examples.tar.gz');
    _fsExtra2['default'].stat(archive_path, function (err) {
      state.examplesHaveToBeDownloaded = err ? true : false;
      if (!state.examplesHaveToBeDownloaded) {
        state.examplesHaveToBeDownloaded = _fsExtra2['default'].statSync(archive_path)['size'] == 0;
      }
      resolve(state);
    });
  });
}

function getExamples(state) {
  var url = 'https://github.com/platformio/platformio-examples/tarball/master';
  var folder = _path2['default'].join(config.BASE_DIR, 'project-examples');
  return new Promise(function (resolve) {
    _fsExtra2['default'].stat(folder, function (err, stat) {
      if (stat && stat.isDirectory()) {
        _fsExtra2['default'].remove(folder);
      }
      resolve();
    });
  }).then(function () {
    return getCachedArchive(url, 'examples.tar.gz');
  }).then(function (archivePath) {
    return new Promise(function (resolve, reject) {
      _fsExtra2['default'].readdir(archivePath, function (err, files) {
        if (files.length !== 1) {
          reject('Examples archive must contain single directory');
          return;
        }
        try {
          _fsExtra2['default'].copySync(_path2['default'].join(archivePath, files[0]), folder);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }).then(function () {
    return state;
  });
}

function ensurePythonIsAvailable(state) {
  return new Promise(function (resolve) {
    state.pythonWorks = false;
    var msg = 'PlatformIO is written in Python and depends on it.' + ' However, "python" command has not been found in ' + 'your system PATH. Please install Python 2.7 (PYTHON 3 IS NOT SUPPORTED YET)';
    if (config.IS_WINDOWS) {
      msg += ' and don\'t forget to "Add python.exe to Path" on the "Customize" stage.';
    }

    var confirmOptions = {
      message: 'PlatformIO: Unable to run python.',
      detailedMessage: msg,
      buttons: {
        'Install Python 2.7': goToPythonDownloadsPage,
        'Try again': doNothing,
        'Abort PlatformIO IDE Installation': cancel
      }
    };
    while (!state.pythonWorks && !state.canceled) {
      try {
        utils.getPythonExecutable();
        state.pythonWorks = true;
      } catch (e) {
        state.pythonWorks = false;
      }
      if (!state.pythonWorks) {
        atom.confirm(confirmOptions);
      }
    }
    resolve(state);
  });

  function goToPythonDownloadsPage() {
    return _shell2['default'].openExternal('https://www.python.org/downloads/');
  }

  function doNothing() {}

  function cancel() {
    state.canceled = true;
  }
}

function extractArchiveIntoTemporaryDirectory(archivePath) {
  var tmpDirPath = _temp2['default'].mkdirSync();
  return utils.extractTargz(archivePath, tmpDirPath).then(function () {
    return tmpDirPath;
  });
}

function getCachedArchive(downloadUrl, fileName) {
  return checkIfFileIsCached(fileName)['catch'](function (archivePath) {
    // skipped unless archive is not cached
    return download(downloadUrl, archivePath);
  }).then(extractArchiveIntoTemporaryDirectory);
}

function checkIfFileIsCached(name) {
  return new Promise(function (resolve, reject) {
    var fullPath = _path2['default'].join(config.CACHE_DIR, name);
    _fsExtra2['default'].stat(fullPath, function (err) {
      if (err || _fsExtra2['default'].statSync(fullPath)['size'] == 0) {
        reject(fullPath);
      }
      resolve(fullPath);
    });
  });
}

function download(source, target) {
  return new Promise(function (resolve, reject) {
    var file = _fsExtra2['default'].createWriteStream(target);
    var options = { url: source };

    var child = _child_process2['default'].spawnSync(atom.packages.getApmPath(), ['config', 'get', 'https-proxy']);
    var proxy = child.stdout.toString().trim();
    if (0 === child.status && 'null' !== proxy) {
      options.proxy = proxy;
    }

    _request2['default'].get(options).on('error', function (err) {
      return reject(err);
    }).pipe(file);
    file.on('error', function (err) {
      return reject(err);
    });
    file.on('finish', function () {
      return resolve(target);
    });
  });
}

function makePenv(virtualenvSrc) {
  return new Promise(function (resolve, reject) {
    var virtualenvScript = utils.findFileByName('virtualenv.py', virtualenvSrc);
    if (-1 === virtualenvScript) {
      var title = 'PlatformIO: Cannot find the virtualenv.py script.';
      atom.notifications.addError(title, { dismissable: true });
      console.error(title);
      reject();
    }
    var args = [virtualenvScript, config.ENV_DIR];
    var makeEnvProcess = _child_process2['default'].spawn(utils.getPythonExecutable(), args);
    makeEnvProcess.on('error', onError);
    var makeEnvProcessStderr = '';
    makeEnvProcess.stderr.on('data', function (chunk) {
      return makeEnvProcessStderr += chunk;
    });
    makeEnvProcess.on('close', function (code) {
      if (0 !== code) {
        onError(makeEnvProcessStderr);
        return;
      }
      resolve();
    });

    function onError(err) {
      var title = 'PlatformIO: Unable to create a virtualenv.';
      atom.notifications.addError(title, { detail: err, dismissable: true });
      console.error(title);
      console.error('' + err);
      reject();
    }
  });
}

function installPlatformIO(state) {
  if (!state.envShouldBeCreated) {
    return state;
  }

  var vitrualenvUrl = 'https://pypi.python.org/packages/source/v/' + 'virtualenv/virtualenv-14.0.6.tar.gz';
  return getCachedArchive(vitrualenvUrl, 'virtualenv.tar.gz').then(makePenv).then(function () {
    return new Promise(function (resolve) {
      var executable = _path2['default'].join(config.ENV_BIN_DIR, 'pip');
      var args = ['install', '-U', 'platformio'];
      var child = _child_process2['default'].spawn(executable, args);
      var stderr = '';
      child.stderr.on('data', function (chunk) {
        return stderr += chunk;
      });
      child.on('close', function (code) {
        state.platformioInstalled = 0 === code;
        if (!state.platformioInstalled) {
          atom.notifications.addError('Failed to install PlatformIO!', {
            detail: stderr,
            dismissable: true
          });
          console.error(stderr);
        }
        resolve(state);
      });
    });
  });
}

function installDependenciesFirstTime(state) {
  if (state.restored) {
    return state;
  }

  var depsUrl = 'http://dl.platformio.org/ide-bundles/platformio-atom-ide-deps.tar.gz';
  return getCachedArchive(depsUrl, 'deps.tar.gz').then(function (extractedPackagesDir) {
    var packagesCopied = [];
    var packagesDir = atom.packages.getPackageDirPaths()[0];
    for (var packageName of state.packagesToInstall) {
      var source = _path2['default'].join(extractedPackagesDir, packageName);
      var sourceStat = _fsExtra2['default'].statSyncNoException(source);
      var target = _path2['default'].join(packagesDir, packageName);
      var targetStat = _fsExtra2['default'].statSyncNoException(target);
      if (sourceStat && sourceStat.isDirectory() && !targetStat) {
        _fsExtra2['default'].copySync(source, target);
        packagesCopied.push(packageName);
      }
    }
    state.packagesToInstall = state.packagesToInstall.filter(function (name) {
      return packagesCopied.indexOf(name) === -1;
    });
  })['catch'](function (reason) {
    console.warn('Failed to install dependencies from archive.');
    console.warn(reason);
  }).then(function () {
    return state;
  });
}

function uninstallStaleDependencies(state) {
  if (state.packagesToRemove.length) {
    return apm('uninstall', state.packagesToRemove).then(function () {
      return state;
    });
  } else {
    return state;
  }
}

function installNewDependencies(state) {
  if (state.packagesToInstall.length) {
    return apm('install', state.packagesToInstall).then(function () {
      return state;
    });
  } else {
    return state;
  }
}

function upgradeOutdatedDependencies(state) {
  if (state.packagesToUpgrade.length) {
    return apm('upgrade', state.packagesToUpgrade, '--no-confirm').then(function () {
      return state;
    });
  } else {
    return state;
  }
}

function activateInactiveDependencies(state) {
  var packagesToEnable = Object.keys(config.DEPENDENCIES).filter(function (name) {
    return !atom.packages.isPackageActive(name);
  });

  var p = Promise.resolve();
  for (var packageName of packagesToEnable) {
    p = p.then(activatePackage(packageName));
  }
  return p.then(function () {
    return state;
  });

  function activatePackage(packageName) {
    return function () {
      return atom.packages.activatePackage(packageName);
    };
  }
}

function notifyUser(state) {
  if (!state.canceled && timeConsumingOperationsRequired(state)) {
    atom.confirm({
      message: 'PlatformIO IDE has been successfully installed!',
      detailedMessage: 'However, some of its components will be ' + 'available after Atom window reload. You can ' + 'click "Reload now" button below to perform reload ' + 'immediately or click "Reload later" and perform reload' + ' yourself with "View > Developer > Reload Window" command whenever ' + 'you\'re ready.',
      buttons: {
        'Reload now': function ReloadNow() {
          return utils.runAtomCommand('window:reload');
        },
        'Reload later': function ReloadLater() {}
      }
    });
  }
  return state;
}

function adjustToolbarPosition(state) {
  var key = 'platformio-ide.defaultToolbarPositionHasBeenSet';
  if (!localStorage.getItem(key) && atom.packages.getActivePackage('tool-bar')) {
    atom.config.set('tool-bar.position', 'Left');
    localStorage.setItem(key, 'true');
  }
  return state;
}

function cleanupIfCanceled(state) {
  if (state && state.canceled) {
    delete state.canceled;
    return cleanup(state);
  } else {
    return state;
  }
}

function cleanup() {
  var _arguments = arguments;

  return new Promise(function (resolve) {
    _fsExtra2['default'].remove(config.ENV_DIR, function () {
      return resolve.apply(undefined, _arguments);
    });
  });
}

function apm(action, packages) {
  for (var _len = arguments.length, additionalArgs = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    additionalArgs[_key - 2] = arguments[_key];
  }

  return new Promise(function (resolve, reject) {
    var executable = atom.packages.getApmPath();
    var args = [action].concat(packages).concat(additionalArgs);
    var child = _child_process2['default'].spawn(executable, args);
    var stderr = '';
    child.stderr.on('data', function (chunk) {
      return stderr += chunk;
    });
    child.on('error', function (err) {
      atom.notifications.addError(err, { dismissable: true });
    });
    child.on('close', function (code) {
      if (0 !== code) {
        var msg = 'PlatformIO: Failed to ' + action + ' the following ' + ('packages: ' + packages.join(', ') + '.');
        atom.notifications.addError(msg, {
          detail: stderr,
          dismissable: true
        });
        reject();
      }
      resolve();
    });
  });
}

function wrap(task) {
  return function (state) {
    state.step += 1;
    if (state.view) {
      state.view.setProgress(Math.floor(state.step / state.total * 100));
    }
    if (state.canceled) {
      // Skip task, return the state right away
      return state;
    }
    return task(state);
  };
}

function timeConsumingOperationsRequired(state) {
  return !state.restored || state.envShouldBeCreated || state.packageManagementIsNecessary || state.examplesHaveToBeDownloaded;
}

function checkIfPlatformIOCanBeExecuted() {
  return new Promise(function (resolve, reject) {
    var pioVersionProcessStderr = '';
    var pioVersionProcess = _child_process2['default'].spawn('platformio');
    pioVersionProcess.on('error', onError);
    pioVersionProcess.stderr.on('data', function (chunk) {
      return pioVersionProcessStderr += chunk;
    });
    pioVersionProcess.on('close', function (code) {
      if (0 !== code) {
        onError(pioVersionProcessStderr);
        return;
      }
      resolve();
    });

    function onError(err) {
      var title = 'PlatformIO tool is not available.';
      var msg = 'Can not find `platformio` command. Please install it' + ' using `pip install platformio` or enable built-in PlatformIO tool in' + ' `Menu: PlatformIO > Settings > platformio-ide` package.\nDetails:\n' + pioVersionProcessStderr;
      atom.notifications.addError(title, { detail: msg, dismissable: true });
      console.error(title);
      console.error(err);
      reject();
    }
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbnN0YWxsL2NvbW1hbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQW1Cd0IsV0FBVzs7SUFBdkIsTUFBTTs7cUJBQ0ssVUFBVTs7SUFBckIsS0FBSzs7b0JBQ21CLFFBQVE7OzZCQUNsQixlQUFlOzs7O3VCQUMxQixVQUFVOzs7O3dCQUNKLFVBQVU7Ozs7b0JBQ2QsTUFBTTs7Ozt1QkFDSCxTQUFTOzs7O3NCQUNWLFFBQVE7Ozs7cUJBQ1QsT0FBTzs7OztvQkFDUixNQUFNOzs7O0FBN0J2QixXQUFXLENBQUM7O0FBK0JaLElBQU0sU0FBUyxHQUFHLDhCQUE4QixDQUFDO0FBQ2pELElBQU0sY0FBYyxHQUFHLENBQUMsQ0FBQztBQUN6QixJQUFNLGFBQWEsR0FBRyxrQkFBSyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNqRSxJQUFNLGdCQUFnQixHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDOzs7O0FBR2hDLFNBQVMsT0FBTyxHQUFHOztBQUV4QixNQUFJLEtBQUssR0FBRyxxQkFBRyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNsRCxNQUFJLEtBQUssRUFBRTtBQUNULFFBQUksQUFBQyxJQUFJLElBQUksRUFBRSxDQUFDLE9BQU8sRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsR0FBSSxnQkFBZ0IsRUFBRTtBQUMvRSwyQkFBRyxVQUFVLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDOUI7R0FDRjs7QUFFRCxNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQzVCLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FDckIsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQ3BD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QUFjLEtBQUssQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUM1RCxxQkFBaUIsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3ZDLHFCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSzthQUFLLHVCQUF1QixJQUFJLEtBQUs7S0FBQSxDQUFDLENBQUM7QUFDakYscUJBQWlCLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLElBQUksRUFBSztBQUN0QyxVQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7QUFDZCxlQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUNqQyxlQUFPO09BQ1I7QUFDRCxhQUFPLEVBQUUsQ0FBQztLQUNYLENBQUMsQ0FBQzs7QUFFSCxhQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDcEIsVUFBTSxLQUFLLEdBQUcsbUNBQW1DLENBQUM7QUFDbEQsVUFBTSxHQUFHLEdBQUcsc0RBQXNELEdBQ3RELHVFQUF1RSxHQUN2RSxzRUFBc0UsR0FDdEUsdUJBQXVCLENBQUM7QUFDcEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQztBQUNyRSxhQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ3JCLGFBQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsWUFBTSxFQUFFLENBQUM7S0FDVjtHQUNGLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbnN0YWxsL2NvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJy4uL2NvbmZpZyc7XG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQge0luc3RhbGxQbGF0Zm9ybUlPVmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBsb2NrZmlsZSBmcm9tICdsb2NrZmlsZSc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuaW1wb3J0IHNlbXZlciBmcm9tICdzZW12ZXInO1xuaW1wb3J0IHNoZWxsIGZyb20gJ3NoZWxsJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuXG5jb25zdCBTVEFURV9LRVkgPSAncGxhdGZvcm1pby1pZGU6aW5zdGFsbC1zdGF0ZSc7XG5jb25zdCBQUk9HUkVTU19TVEVQUyA9IDk7XG5jb25zdCBMT0NLRklMRV9QQVRIID0gcGF0aC5qb2luKGNvbmZpZy5CQVNFX0RJUiwgJ2luc3RhbGwubG9jaycpO1xuY29uc3QgTE9DS0ZJTEVfVElNRU9VVCA9IDUgKiA2MCAqIDEwMDA7XG5cbi8vIEluc3RhbGwgUGxhdGZvcm1JT1xuZXhwb3J0IGZ1bmN0aW9uIGNvbW1hbmQoKSB7XG4gIC8vIGNsZWFudXAgZGVhZCBsb2NrIGZpbGVcbiAgdmFyIHN0YXRzID0gZnMuc3RhdFN5bmNOb0V4Y2VwdGlvbihMT0NLRklMRV9QQVRIKTtcbiAgaWYgKHN0YXRzKSB7XG4gICAgaWYgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIG5ldyBEYXRlKHN0YXRzLm10aW1lKS5nZXRUaW1lKCkpID4gTE9DS0ZJTEVfVElNRU9VVCkge1xuICAgICAgZnMudW5saW5rU3luYyhMT0NLRklMRV9QQVRIKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBjaGFpbiA9IFByb21pc2UucmVzb2x2ZSgpXG4gICAgLnRoZW4oaW5pdGlhbGl6ZVN0YXRlKVxuICAgIC50aGVuKGVuc3VyZVRoYXRDYWNoZURpcmVjdG9yeUV4aXN0cylcbiAgICAudGhlbihjaGVja0lmVmlydHVhbGVudlNob3VsZEJlQ3JlYXRlZClcbiAgICAudGhlbihjaGVja0lmUGFja2FnZU1hbmFnbWVudElzTmVjZXNzYXJ5KVxuICAgIC50aGVuKGNoZWNrSWZFeGFtcGxlc0hhdmVUb0JlRG93bmxvYWRlZClcbiAgICAudGhlbihmdW5jdGlvbiAoc3RhdGUpIHtcbiAgICAgIGlmICghdGltZUNvbnN1bWluZ09wZXJhdGlvbnNSZXF1aXJlZChzdGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIGFjdGl2YXRlSW5hY3RpdmVEZXBlbmRlbmNpZXMoKVxuICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0FuIGVycm9yIG9jY3VyZWQgZHVyaW5nIGEgUGxhdGZvcm1JTyBkZXBlbmRlbmNpZXMgaW5zdGFsbGF0aW9uLicsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiBlcnIudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICBsb2NrZmlsZS5sb2NrKExPQ0tGSUxFX1BBVEgsIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnUGxhdGZvcm1JTyBJREUgaW5zdGFsbGF0aW9uIHN1c3BlbmRlZC4nLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogJ1NlZW1zIGxpa2UgUGxhdGZvcm1JTyBJREUgaXMgYWxyZWFkeSBiZWluZyBpbnN0YWxsZWQgaW4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgJ2Fub3RoZXIgd2luZG93LicsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHByb21pc2UgPSBwZXJmb3JtSW5zdGFsbChzdGF0ZSlcbiAgICAgICAgICAgICAgLnRoZW4ocmVsZWFzZUxvY2ssIHJlbGVhc2VMb2NrKTtcbiAgICAgICAgICAgIHJlc29sdmUocHJvbWlzZSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZnVuY3Rpb24gcmVsZWFzZUxvY2soKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9ja2ZpbGUudW5sb2NrKExPQ0tGSUxFX1BBVEgsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIHJlbGVhc2UgdGhlIGxvY2s6ICcgKyBlcnIudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgcmV0dXJuIGNoYWluO1xufVxuXG5mdW5jdGlvbiBwZXJmb3JtSW5zdGFsbChzdGF0ZSkge1xuICBsZXQgcGFuZWw7XG4gIGNvbnN0IGNoYWluID0gUHJvbWlzZS5yZXNvbHZlKHN0YXRlKVxuICAgIC50aGVuKGZ1bmN0aW9uIGluaXRpYWxpemVWaWV3KHN0YXRlKSB7XG4gICAgICBpZiAodGltZUNvbnN1bWluZ09wZXJhdGlvbnNSZXF1aXJlZChzdGF0ZSkpIHtcbiAgICAgICAgLy8gTWFrZSB2aWV3IGFuZCBwYW5lbCBhY2Nlc3NpYmxlIGZyb20gb3V0c2lkZSBvZiB0aGUgdGFza3MsIHNvIHRoZXkgY2FuXG4gICAgICAgIC8vIGJlIGRlc3Ryb3llZCBjb3JyZWN0bHkgZXZlbiB3aGVuIGVycm9yIGhhcHBlbnMgZHVyaW5nIHNvbWUgc3RlcC5cbiAgICAgICAgc3RhdGUudmlldyA9IG5ldyBJbnN0YWxsUGxhdGZvcm1JT1ZpZXcoKTtcbiAgICAgICAgc3RhdGUudmlldy5oYW5kbGVDYW5jZWwgPSAoKSA9PiBzdGF0ZS5jYW5jZWxlZCA9IHRydWU7XG4gICAgICAgIHN0YXRlLnBhbmVsID0gcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKHtpdGVtOiBzdGF0ZS52aWV3LmdldEVsZW1lbnQoKX0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH0pXG4gICAgLnRoZW4od3JhcChlbnN1cmVQeXRob25Jc0F2YWlsYWJsZSkpXG5cbiAgICAudGhlbih3cmFwKGluc3RhbGxQbGF0Zm9ybUlPKSlcblxuICAgIC50aGVuKHdyYXAoaW5zdGFsbERlcGVuZGVuY2llc0ZpcnN0VGltZSkpXG4gICAgLnRoZW4od3JhcCh1bmluc3RhbGxTdGFsZURlcGVuZGVuY2llcykpXG4gICAgLnRoZW4od3JhcChpbnN0YWxsTmV3RGVwZW5kZW5jaWVzKSlcbiAgICAudGhlbih3cmFwKHVwZ3JhZGVPdXRkYXRlZERlcGVuZGVuY2llcykpXG4gICAgLnRoZW4od3JhcChhY3RpdmF0ZUluYWN0aXZlRGVwZW5kZW5jaWVzKSlcbiAgICAudGhlbih3cmFwKGFkanVzdFRvb2xiYXJQb3NpdGlvbikpXG5cbiAgICAudGhlbih3cmFwKGdldEV4YW1wbGVzKSlcblxuICAgIC50aGVuKG5vdGlmeVVzZXIpXG5cbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgcmV0dXJuIGNsZWFudXAoKVxuICAgICAgICAudGhlbigoKSA9PiBjb25zb2xlLmVycm9yKGVycikpO1xuICAgIH0pXG5cbiAgICAudGhlbihjbGVhbnVwSWZDYW5jZWxlZClcbiAgICAudGhlbihmdW5jdGlvbiBkZXN0cm95Vmlld0FuZFNhdmVTdGF0ZShzdGF0ZSkge1xuICAgICAgaWYgKHBhbmVsKSB7XG4gICAgICAgIHBhbmVsLmRlc3Ryb3koKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdGF0ZSAmJiBzdGF0ZS5wYW5lbCkge1xuICAgICAgICBkZWxldGUgc3RhdGUucGFuZWw7XG4gICAgICB9XG4gICAgICBpZiAoc3RhdGUgJiYgc3RhdGUudmlldykge1xuICAgICAgICBkZWxldGUgc3RhdGUudmlldztcbiAgICAgIH1cblxuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oU1RBVEVfS0VZLCBKU09OLnN0cmluZ2lmeShzdGF0ZSkpO1xuICAgIH0pXG4gICAgLnRoZW4oY2hlY2tJZlBsYXRmb3JtSU9DYW5CZUV4ZWN1dGVkKTtcblxuICByZXR1cm4gY2hhaW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWluc3RhbGxQbGF0Zm9ybUlPKHVzZURldmVsb3ApIHtcbiAgY29uc3QgZXhlY3V0YWJsZSA9IHBhdGguam9pbihjb25maWcuRU5WX0JJTl9ESVIsICdwaXAnKTtcbiAgY29uc3Qgbm90aWZvY2F0aW9uID0gYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ1BsYXRmb3JtSU86IFJlaW5zdGFsbGluZyBpbml0aWF0ZWQuJyx7XG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgZGV0YWlsOiAnUGxlYXNlIHdhaXQuJyxcbiAgfSk7XG4gIHJldHVybiBQcm9taXNlLnJlc29sdmUoKVxuICAgIC50aGVuKCgpID0+IHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIC8vIHRyeSB0byB1bmluc3RhbGwgcHJldmlvdXMgUGxhdGZvcm1JTyBpZiBleGlzdHNcbiAgICAgICAgY29uc3QgY2hpbGQgPSBjaGlsZF9wcm9jZXNzLnNwYXduKGV4ZWN1dGFibGUsIFsndW5pbnN0YWxsJywgJy15JyAsJ3BsYXRmb3JtaW8nXSk7XG4gICAgICAgIGNoaWxkLm9uKCdlcnJvcicsIGUgPT4gcmVqZWN0KGUpKTtcbiAgICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgIH0pO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgY29uc3QgYXJncyA9IFsnaW5zdGFsbCddO1xuICAgICAgICBpZiAodXNlRGV2ZWxvcCkge1xuICAgICAgICAgIGFyZ3MucHVzaCgnaHR0cHM6Ly9naXRodWIuY29tL3BsYXRmb3JtaW8vcGxhdGZvcm1pby9hcmNoaXZlL2RldmVsb3AuemlwJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYXJncy5wdXNoKCdwbGF0Zm9ybWlvJyk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc3RkZXJyID0gJyc7XG4gICAgICAgIGNvbnN0IGNoaWxkID0gY2hpbGRfcHJvY2Vzcy5zcGF3bihleGVjdXRhYmxlLCBhcmdzKTtcbiAgICAgICAgY2hpbGQub24oJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIGNodW5rID0+IHN0ZGVyciArPSBjaHVuayk7XG4gICAgICAgIGNoaWxkLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICAgICAgaWYgKDAgIT09IGNvZGUpIHtcbiAgICAgICAgICAgIG9uRXJyb3Ioc3RkZXJyKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBvbkVycm9yKGVycikge1xuICAgICAgICAgIGNvbnN0IHRpdGxlID0gJ1BsYXRmb3JtSU86IEZhaWxlZCB0byBpbnN0YWxsIFBsYXRmb3JtSU8hJztcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IodGl0bGUsIHtkZXRhaWw6IGVyciwgZGlzbWlzc2FibGU6IHRydWV9KTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKHRpdGxlKTtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgcmVqZWN0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4gbm90aWZvY2F0aW9uLmRpc21pc3MoKSlcbiAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgbm90aWZvY2F0aW9uLmRpc21pc3MoKTtcbiAgICAgIHRocm93IGVycjtcbiAgICB9KTtcbn1cblxuXG4vLyBUYXNrcyBiZWxvdyBhcmUgaW5zdGFsbGF0aW9uIHN0ZXBzLiBFYWNoIHRhc2sgbXVzdCBhY2NlcHQgYSBzdGF0ZSBhcyBhblxuLy8gYXJndW1lbnQgYW5kIGV2ZW50dWFsbHkgcmV0dXJuIGEgbW9kaWZpZWQgc3RhdGUgKGRpcmVjdGx5IG9yIHZpYSBwcm9taXNlKS5cblxuZnVuY3Rpb24gaW5pdGlhbGl6ZVN0YXRlKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAvLyBSZXRyaWV2ZSB0aGUgc3RhdGUgb2JqZWN0IGZyb20gbG9jYWxTdG9yYWdlXG4gICAgbGV0IHN0YXRlO1xuICAgIHRyeSB7XG4gICAgICBzdGF0ZSA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oU1RBVEVfS0VZKSk7XG4gICAgICBpZiAoc3RhdGUgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgc3RhdGUucmVzdG9yZWQgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgc3RhdGUgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBOZWNlc3NhcnkgZm9yIHByb2dyZXNzIGRpc3BsYXlcbiAgICBzdGF0ZS5zdGVwID0gMDtcbiAgICBzdGF0ZS50b3RhbCA9IFBST0dSRVNTX1NURVBTO1xuXG4gICAgcmVzb2x2ZShzdGF0ZSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBlbnN1cmVUaGF0Q2FjaGVEaXJlY3RvcnlFeGlzdHMoc3RhdGUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgZnMuc3RhdChjb25maWcuQ0FDSEVfRElSLCAoZXJyKSA9PiB7XG4gICAgICBpZiAoZXJyKSB7XG4gICAgICAgIGZzLm1rZGlyKGNvbmZpZy5DQUNIRV9ESVIsIChlcnIpID0+IHtcbiAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgY2FjaGUgZGlyZWN0b3J5Jyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoc3RhdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoc3RhdGUpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gY2hlY2tJZlZpcnR1YWxlbnZTaG91bGRCZUNyZWF0ZWQoc3RhdGUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgZnMuc3RhdChjb25maWcuRU5WX0JJTl9ESVIsIChlcnIpID0+IHtcbiAgICAgIHN0YXRlLmVudlNob3VsZEJlQ3JlYXRlZCA9IHV0aWxzLnVzZUJ1aWx0aW5QbGF0Zm9ybUlPKCkgJiYgZXJyO1xuICAgICAgcmVzb2x2ZShzdGF0ZSk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjaGVja0lmUGFja2FnZU1hbmFnbWVudElzTmVjZXNzYXJ5KHN0YXRlKSB7XG4gIGNvbnN0IGF2YWlsYWJsZVBhY2thZ2VzID0gYXRvbS5wYWNrYWdlcy5nZXRBdmFpbGFibGVQYWNrYWdlTmFtZXMoKTtcblxuICBzdGF0ZS5wYWNrYWdlc1RvUmVtb3ZlID0gY29uZmlnLlNUQUxFX0RFUEVOREVOQ0lFU1xuICAgIC5maWx0ZXIoKG5hbWUpID0+IGF2YWlsYWJsZVBhY2thZ2VzLmluZGV4T2YobmFtZSkgPiAwKTtcbiAgc3RhdGUucGFja2FnZXNUb0luc3RhbGwgPSBPYmplY3Qua2V5cyhjb25maWcuREVQRU5ERU5DSUVTKVxuICAgIC5maWx0ZXIoKG5hbWUpID0+IGF2YWlsYWJsZVBhY2thZ2VzLmluZGV4T2YobmFtZSkgPT09IC0xKTtcbiAgc3RhdGUucGFja2FnZXNUb1VwZ3JhZGUgPSBPYmplY3Qua2V5cyhjb25maWcuREVQRU5ERU5DSUVTKVxuICAgIC5maWx0ZXIoKG5hbWUpID0+IHtcbiAgICAgIGNvbnN0IHBhY2thZ2VQYXRoID0gdXRpbHMucmVzb2x2ZUF0b21QYWNrYWdlUGF0aChuYW1lKTtcbiAgICAgIGlmICghcGFja2FnZVBhdGgpIHtcbiAgICAgICAgLy8gUGFja2FnZSBpcyBub3QgZXZlbiBpbnN0YWxsZWQuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgbWV0YWRhdGEgPSBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlTWV0YWRhdGEocGFja2FnZVBhdGgpO1xuICAgICAgaWYgKCFtZXRhZGF0YSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGluc3RhbGxlZFZlcnNpb24gPSBtZXRhZGF0YS52ZXJzaW9uO1xuICAgICAgY29uc3QgcmVxdWlyZWRWZXJzaW9uID0gY29uZmlnLkRFUEVOREVOQ0lFU1tuYW1lXTtcbiAgICAgIHJldHVybiAhc2VtdmVyLnNhdGlzZmllcyhpbnN0YWxsZWRWZXJzaW9uLCByZXF1aXJlZFZlcnNpb24pO1xuICAgIH0pO1xuXG4gIHN0YXRlLnBhY2thZ2VNYW5hZ2VtZW50SXNOZWNlc3NhcnkgPSBCb29sZWFuKFxuICAgIHN0YXRlLnBhY2thZ2VzVG9SZW1vdmUubGVuZ3RoIHx8XG4gICAgc3RhdGUucGFja2FnZXNUb0luc3RhbGwubGVuZ3RoIHx8XG4gICAgc3RhdGUucGFja2FnZXNUb1VwZ3JhZGUubGVuZ3RoXG4gICk7XG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZnVuY3Rpb24gY2hlY2tJZkV4YW1wbGVzSGF2ZVRvQmVEb3dubG9hZGVkKHN0YXRlKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgIGNvbnN0IGFyY2hpdmVfcGF0aCA9IHBhdGguam9pbihjb25maWcuQ0FDSEVfRElSLCAnZXhhbXBsZXMudGFyLmd6Jyk7XG4gICAgZnMuc3RhdChhcmNoaXZlX3BhdGgsIChlcnIpID0+IHtcbiAgICAgIHN0YXRlLmV4YW1wbGVzSGF2ZVRvQmVEb3dubG9hZGVkID0gZXJyPyB0cnVlIDogZmFsc2U7XG4gICAgICBpZiAoIXN0YXRlLmV4YW1wbGVzSGF2ZVRvQmVEb3dubG9hZGVkKSB7XG4gICAgICAgIHN0YXRlLmV4YW1wbGVzSGF2ZVRvQmVEb3dubG9hZGVkID0gZnMuc3RhdFN5bmMoYXJjaGl2ZV9wYXRoKVsnc2l6ZSddID09IDA7XG4gICAgICB9XG4gICAgICByZXNvbHZlKHN0YXRlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldEV4YW1wbGVzKHN0YXRlKSB7XG4gIGNvbnN0IHVybCA9ICdodHRwczovL2dpdGh1Yi5jb20vcGxhdGZvcm1pby9wbGF0Zm9ybWlvLWV4YW1wbGVzL3RhcmJhbGwvbWFzdGVyJztcbiAgY29uc3QgZm9sZGVyID0gcGF0aC5qb2luKGNvbmZpZy5CQVNFX0RJUiwgJ3Byb2plY3QtZXhhbXBsZXMnKTtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgIGZzLnN0YXQoZm9sZGVyLCAoZXJyLCBzdGF0KSA9PiB7XG4gICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRGlyZWN0b3J5KCkpIHtcbiAgICAgICAgZnMucmVtb3ZlKGZvbGRlcik7XG4gICAgICB9XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG4gIH0pLnRoZW4oKCkgPT4gZ2V0Q2FjaGVkQXJjaGl2ZSh1cmwsICdleGFtcGxlcy50YXIuZ3onKSlcbiAgICAudGhlbigoYXJjaGl2ZVBhdGgpID0+IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIGZzLnJlYWRkaXIoYXJjaGl2ZVBhdGgsIChlcnIsIGZpbGVzKSA9PiB7XG4gICAgICAgIGlmIChmaWxlcy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgICByZWplY3QoJ0V4YW1wbGVzIGFyY2hpdmUgbXVzdCBjb250YWluIHNpbmdsZSBkaXJlY3RvcnknKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBmcy5jb3B5U3luYyhwYXRoLmpvaW4oYXJjaGl2ZVBhdGgsIGZpbGVzWzBdKSwgZm9sZGVyKTtcbiAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSkpXG4gICAgLnRoZW4oKCkgPT4gc3RhdGUpO1xufVxuXG5mdW5jdGlvbiBlbnN1cmVQeXRob25Jc0F2YWlsYWJsZShzdGF0ZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzdGF0ZS5weXRob25Xb3JrcyA9IGZhbHNlO1xuICAgIGxldCBtc2cgPSAnUGxhdGZvcm1JTyBpcyB3cml0dGVuIGluIFB5dGhvbiBhbmQgZGVwZW5kcyBvbiBpdC4nICtcbiAgICAgICAgICAgICAgICAnIEhvd2V2ZXIsIFwicHl0aG9uXCIgY29tbWFuZCBoYXMgbm90IGJlZW4gZm91bmQgaW4gJyArXG4gICAgICAgICAgICAgICAgJ3lvdXIgc3lzdGVtIFBBVEguIFBsZWFzZSBpbnN0YWxsIFB5dGhvbiAyLjcgKFBZVEhPTiAzIElTIE5PVCBTVVBQT1JURUQgWUVUKSc7XG4gICAgaWYgKGNvbmZpZy5JU19XSU5ET1dTKSB7XG4gICAgICBtc2cgKz0gJyBhbmQgZG9uXFwndCBmb3JnZXQgdG8gXCJBZGQgcHl0aG9uLmV4ZSB0byBQYXRoXCIgb24gdGhlIFwiQ3VzdG9taXplXCIgc3RhZ2UuJztcbiAgICB9XG5cbiAgICBjb25zdCBjb25maXJtT3B0aW9ucyA9IHtcbiAgICAgIG1lc3NhZ2U6ICdQbGF0Zm9ybUlPOiBVbmFibGUgdG8gcnVuIHB5dGhvbi4nLFxuICAgICAgZGV0YWlsZWRNZXNzYWdlOiBtc2csXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgICdJbnN0YWxsIFB5dGhvbiAyLjcnOiBnb1RvUHl0aG9uRG93bmxvYWRzUGFnZSxcbiAgICAgICAgJ1RyeSBhZ2Fpbic6IGRvTm90aGluZyxcbiAgICAgICAgJ0Fib3J0IFBsYXRmb3JtSU8gSURFIEluc3RhbGxhdGlvbic6IGNhbmNlbCxcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlICghc3RhdGUucHl0aG9uV29ya3MgJiYgIXN0YXRlLmNhbmNlbGVkKSB7XG4gICAgICB0cnkge1xuICAgICAgICB1dGlscy5nZXRQeXRob25FeGVjdXRhYmxlKCk7XG4gICAgICAgIHN0YXRlLnB5dGhvbldvcmtzID0gdHJ1ZTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBzdGF0ZS5weXRob25Xb3JrcyA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCFzdGF0ZS5weXRob25Xb3Jrcykge1xuICAgICAgICBhdG9tLmNvbmZpcm0oY29uZmlybU9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXNvbHZlKHN0YXRlKTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gZ29Ub1B5dGhvbkRvd25sb2Fkc1BhZ2UoKSB7XG4gICAgcmV0dXJuIHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly93d3cucHl0aG9uLm9yZy9kb3dubG9hZHMvJyk7XG4gIH1cblxuICBmdW5jdGlvbiBkb05vdGhpbmcoKSB7fVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBzdGF0ZS5jYW5jZWxlZCA9IHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXh0cmFjdEFyY2hpdmVJbnRvVGVtcG9yYXJ5RGlyZWN0b3J5KGFyY2hpdmVQYXRoKSB7XG4gIGNvbnN0IHRtcERpclBhdGggPSB0ZW1wLm1rZGlyU3luYygpO1xuICByZXR1cm4gdXRpbHMuZXh0cmFjdFRhcmd6KGFyY2hpdmVQYXRoLCB0bXBEaXJQYXRoKVxuICAgIC50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRtcERpclBhdGg7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIGdldENhY2hlZEFyY2hpdmUoZG93bmxvYWRVcmwsIGZpbGVOYW1lKSB7XG4gIHJldHVybiBjaGVja0lmRmlsZUlzQ2FjaGVkKGZpbGVOYW1lKVxuICAgIC5jYXRjaCgoYXJjaGl2ZVBhdGgpID0+IHsgLy8gc2tpcHBlZCB1bmxlc3MgYXJjaGl2ZSBpcyBub3QgY2FjaGVkXG4gICAgICByZXR1cm4gZG93bmxvYWQoZG93bmxvYWRVcmwsIGFyY2hpdmVQYXRoKTtcbiAgICB9KVxuICAgIC50aGVuKGV4dHJhY3RBcmNoaXZlSW50b1RlbXBvcmFyeURpcmVjdG9yeSk7XG59XG5cbmZ1bmN0aW9uIGNoZWNrSWZGaWxlSXNDYWNoZWQobmFtZSkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGZ1bGxQYXRoID0gcGF0aC5qb2luKGNvbmZpZy5DQUNIRV9ESVIsIG5hbWUpO1xuICAgIGZzLnN0YXQoZnVsbFBhdGgsIChlcnIpID0+IHtcbiAgICAgIGlmIChlcnIgfHwgZnMuc3RhdFN5bmMoZnVsbFBhdGgpWydzaXplJ10gPT0gMCkge1xuICAgICAgICByZWplY3QoZnVsbFBhdGgpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShmdWxsUGF0aCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkb3dubG9hZChzb3VyY2UsIHRhcmdldCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IGZpbGUgPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh0YXJnZXQpO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB7dXJsOiBzb3VyY2V9O1xuXG4gICAgY29uc3QgY2hpbGQgPSBjaGlsZF9wcm9jZXNzLnNwYXduU3luYyhhdG9tLnBhY2thZ2VzLmdldEFwbVBhdGgoKSwgWydjb25maWcnLCAnZ2V0JywgJ2h0dHBzLXByb3h5J10pO1xuICAgIGNvbnN0IHByb3h5ID0gY2hpbGQuc3Rkb3V0LnRvU3RyaW5nKCkudHJpbSgpO1xuICAgIGlmICgwID09PSBjaGlsZC5zdGF0dXMgJiYgJ251bGwnICE9PSBwcm94eSkge1xuICAgICAgb3B0aW9ucy5wcm94eSA9IHByb3h5O1xuICAgIH1cblxuICAgIHJlcXVlc3QuZ2V0KG9wdGlvbnMpXG4gICAgICAub24oJ2Vycm9yJywgKGVycikgPT4gcmVqZWN0KGVycikpXG4gICAgICAucGlwZShmaWxlKTtcbiAgICBmaWxlLm9uKCdlcnJvcicsIChlcnIpID0+IHJlamVjdChlcnIpKTtcbiAgICBmaWxlLm9uKCdmaW5pc2gnLCAoKSA9PiByZXNvbHZlKHRhcmdldCkpO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gbWFrZVBlbnYodmlydHVhbGVudlNyYykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHZpcnR1YWxlbnZTY3JpcHQgPSB1dGlscy5maW5kRmlsZUJ5TmFtZSgndmlydHVhbGVudi5weScsIHZpcnR1YWxlbnZTcmMpO1xuICAgIGlmICgtMSA9PT0gdmlydHVhbGVudlNjcmlwdCkge1xuICAgICAgY29uc3QgdGl0bGUgPSAnUGxhdGZvcm1JTzogQ2Fubm90IGZpbmQgdGhlIHZpcnR1YWxlbnYucHkgc2NyaXB0Lic7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IodGl0bGUsIHtkaXNtaXNzYWJsZTogdHJ1ZX0pO1xuICAgICAgY29uc29sZS5lcnJvcih0aXRsZSk7XG4gICAgICByZWplY3QoKTtcbiAgICB9XG4gICAgY29uc3QgYXJncyA9IFt2aXJ0dWFsZW52U2NyaXB0LCBjb25maWcuRU5WX0RJUl07XG4gICAgY29uc3QgbWFrZUVudlByb2Nlc3MgPSBjaGlsZF9wcm9jZXNzLnNwYXduKHV0aWxzLmdldFB5dGhvbkV4ZWN1dGFibGUoKSwgYXJncyk7XG4gICAgbWFrZUVudlByb2Nlc3Mub24oJ2Vycm9yJywgb25FcnJvcik7XG4gICAgdmFyIG1ha2VFbnZQcm9jZXNzU3RkZXJyID0gJyc7XG4gICAgbWFrZUVudlByb2Nlc3Muc3RkZXJyLm9uKCdkYXRhJywgKGNodW5rKSA9PiBtYWtlRW52UHJvY2Vzc1N0ZGVyciArPSBjaHVuayk7XG4gICAgbWFrZUVudlByb2Nlc3Mub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcbiAgICAgIGlmICgwICE9PSBjb2RlKSB7XG4gICAgICAgIG9uRXJyb3IobWFrZUVudlByb2Nlc3NTdGRlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXNvbHZlKCk7XG4gICAgfSk7XG5cbiAgICBmdW5jdGlvbiBvbkVycm9yKGVycikge1xuICAgICAgY29uc3QgdGl0bGUgPSAnUGxhdGZvcm1JTzogVW5hYmxlIHRvIGNyZWF0ZSBhIHZpcnR1YWxlbnYuJztcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcih0aXRsZSwge2RldGFpbDogZXJyLCBkaXNtaXNzYWJsZTogdHJ1ZX0pO1xuICAgICAgY29uc29sZS5lcnJvcih0aXRsZSk7XG4gICAgICBjb25zb2xlLmVycm9yKCcnICsgZXJyKTtcbiAgICAgIHJlamVjdCgpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluc3RhbGxQbGF0Zm9ybUlPKHN0YXRlKSB7XG4gIGlmICghc3RhdGUuZW52U2hvdWxkQmVDcmVhdGVkKSB7XG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgY29uc3Qgdml0cnVhbGVudlVybCA9ICdodHRwczovL3B5cGkucHl0aG9uLm9yZy9wYWNrYWdlcy9zb3VyY2Uvdi8nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICd2aXJ0dWFsZW52L3ZpcnR1YWxlbnYtMTQuMC42LnRhci5neic7XG4gIHJldHVybiBnZXRDYWNoZWRBcmNoaXZlKHZpdHJ1YWxlbnZVcmwsICd2aXJ0dWFsZW52LnRhci5neicpXG4gICAgLnRoZW4obWFrZVBlbnYpXG4gICAgLnRoZW4oKCkgPT4ge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgIGNvbnN0IGV4ZWN1dGFibGUgPSBwYXRoLmpvaW4oY29uZmlnLkVOVl9CSU5fRElSLCAncGlwJyk7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBbJ2luc3RhbGwnLCAnLVUnLCAncGxhdGZvcm1pbyddO1xuICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oZXhlY3V0YWJsZSwgYXJncyk7XG4gICAgICAgIGxldCBzdGRlcnIgPSAnJztcbiAgICAgICAgY2hpbGQuc3RkZXJyLm9uKCdkYXRhJywgKGNodW5rKSA9PiBzdGRlcnIgKz0gY2h1bmspO1xuICAgICAgICBjaGlsZC5vbignY2xvc2UnLCAoY29kZSkgPT4ge1xuICAgICAgICAgIHN0YXRlLnBsYXRmb3JtaW9JbnN0YWxsZWQgPSAwID09PSBjb2RlO1xuICAgICAgICAgIGlmICghc3RhdGUucGxhdGZvcm1pb0luc3RhbGxlZCkge1xuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdGYWlsZWQgdG8gaW5zdGFsbCBQbGF0Zm9ybUlPIScsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiBzdGRlcnIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKHN0ZGVycik7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlc29sdmUoc3RhdGUpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBpbnN0YWxsRGVwZW5kZW5jaWVzRmlyc3RUaW1lKHN0YXRlKSB7XG4gIGlmIChzdGF0ZS5yZXN0b3JlZCkge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIGNvbnN0IGRlcHNVcmwgPSAnaHR0cDovL2RsLnBsYXRmb3JtaW8ub3JnL2lkZS1idW5kbGVzL3BsYXRmb3JtaW8tYXRvbS1pZGUtZGVwcy50YXIuZ3onO1xuICByZXR1cm4gZ2V0Q2FjaGVkQXJjaGl2ZShkZXBzVXJsLCAnZGVwcy50YXIuZ3onKVxuICAgIC50aGVuKChleHRyYWN0ZWRQYWNrYWdlc0RpcikgPT4ge1xuICAgICAgY29uc3QgcGFja2FnZXNDb3BpZWQgPSBbXTtcbiAgICAgIGNvbnN0IHBhY2thZ2VzRGlyID0gYXRvbS5wYWNrYWdlcy5nZXRQYWNrYWdlRGlyUGF0aHMoKVswXTtcbiAgICAgIGZvciAoY29uc3QgcGFja2FnZU5hbWUgb2Ygc3RhdGUucGFja2FnZXNUb0luc3RhbGwpIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gcGF0aC5qb2luKGV4dHJhY3RlZFBhY2thZ2VzRGlyLCBwYWNrYWdlTmFtZSk7XG4gICAgICAgIGNvbnN0IHNvdXJjZVN0YXQgPSBmcy5zdGF0U3luY05vRXhjZXB0aW9uKHNvdXJjZSk7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHBhdGguam9pbihwYWNrYWdlc0RpciwgcGFja2FnZU5hbWUpO1xuICAgICAgICBjb25zdCB0YXJnZXRTdGF0ID0gZnMuc3RhdFN5bmNOb0V4Y2VwdGlvbih0YXJnZXQpO1xuICAgICAgICBpZiAoc291cmNlU3RhdCAmJiBzb3VyY2VTdGF0LmlzRGlyZWN0b3J5KCkgJiYgIXRhcmdldFN0YXQpIHtcbiAgICAgICAgICBmcy5jb3B5U3luYyhzb3VyY2UsIHRhcmdldCk7XG4gICAgICAgICAgcGFja2FnZXNDb3BpZWQucHVzaChwYWNrYWdlTmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN0YXRlLnBhY2thZ2VzVG9JbnN0YWxsID0gc3RhdGUucGFja2FnZXNUb0luc3RhbGxcbiAgICAgICAgLmZpbHRlcigobmFtZSkgPT4gcGFja2FnZXNDb3BpZWQuaW5kZXhPZihuYW1lKSA9PT0gLTEpO1xuICAgIH0pXG4gICAgLmNhdGNoKChyZWFzb24pID0+IHtcbiAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGluc3RhbGwgZGVwZW5kZW5jaWVzIGZyb20gYXJjaGl2ZS4nKTtcbiAgICAgIGNvbnNvbGUud2FybihyZWFzb24pO1xuICAgIH0pXG4gICAgLnRoZW4oKCkgPT4gc3RhdGUpO1xufVxuXG5mdW5jdGlvbiB1bmluc3RhbGxTdGFsZURlcGVuZGVuY2llcyhzdGF0ZSkge1xuICBpZiAoc3RhdGUucGFja2FnZXNUb1JlbW92ZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gYXBtKCd1bmluc3RhbGwnLCBzdGF0ZS5wYWNrYWdlc1RvUmVtb3ZlKS50aGVuKCgpID0+IHN0YXRlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5zdGFsbE5ld0RlcGVuZGVuY2llcyhzdGF0ZSkge1xuICBpZiAoc3RhdGUucGFja2FnZXNUb0luc3RhbGwubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGFwbSgnaW5zdGFsbCcsIHN0YXRlLnBhY2thZ2VzVG9JbnN0YWxsKS50aGVuKCgpID0+IHN0YXRlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gdXBncmFkZU91dGRhdGVkRGVwZW5kZW5jaWVzKHN0YXRlKSB7XG4gIGlmIChzdGF0ZS5wYWNrYWdlc1RvVXBncmFkZS5sZW5ndGgpIHtcbiAgICByZXR1cm4gYXBtKCd1cGdyYWRlJywgc3RhdGUucGFja2FnZXNUb1VwZ3JhZGUsICctLW5vLWNvbmZpcm0nKS50aGVuKCgpID0+IHN0YXRlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cbn1cblxuZnVuY3Rpb24gYWN0aXZhdGVJbmFjdGl2ZURlcGVuZGVuY2llcyhzdGF0ZSkge1xuICBjb25zdCBwYWNrYWdlc1RvRW5hYmxlID0gT2JqZWN0LmtleXMoY29uZmlnLkRFUEVOREVOQ0lFUylcbiAgICAuZmlsdGVyKChuYW1lKSA9PiAhYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VBY3RpdmUobmFtZSkpO1xuXG4gIGxldCBwID0gUHJvbWlzZS5yZXNvbHZlKCk7XG4gIGZvciAoY29uc3QgcGFja2FnZU5hbWUgb2YgcGFja2FnZXNUb0VuYWJsZSkge1xuICAgIHAgPSBwLnRoZW4oYWN0aXZhdGVQYWNrYWdlKHBhY2thZ2VOYW1lKSk7XG4gIH1cbiAgcmV0dXJuIHAudGhlbigoKSA9PiBzdGF0ZSk7XG5cbiAgZnVuY3Rpb24gYWN0aXZhdGVQYWNrYWdlKHBhY2thZ2VOYW1lKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIGF0b20ucGFja2FnZXMuYWN0aXZhdGVQYWNrYWdlKHBhY2thZ2VOYW1lKTtcbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG5vdGlmeVVzZXIoc3RhdGUpIHtcbiAgaWYgKCFzdGF0ZS5jYW5jZWxlZCAmJiB0aW1lQ29uc3VtaW5nT3BlcmF0aW9uc1JlcXVpcmVkKHN0YXRlKSkge1xuICAgIGF0b20uY29uZmlybSh7XG4gICAgICBtZXNzYWdlOiAnUGxhdGZvcm1JTyBJREUgaGFzIGJlZW4gc3VjY2Vzc2Z1bGx5IGluc3RhbGxlZCEnLFxuICAgICAgZGV0YWlsZWRNZXNzYWdlOiAnSG93ZXZlciwgc29tZSBvZiBpdHMgY29tcG9uZW50cyB3aWxsIGJlICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAnYXZhaWxhYmxlIGFmdGVyIEF0b20gd2luZG93IHJlbG9hZC4gWW91IGNhbiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ2NsaWNrIFwiUmVsb2FkIG5vd1wiIGJ1dHRvbiBiZWxvdyB0byBwZXJmb3JtIHJlbG9hZCAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ2ltbWVkaWF0ZWx5IG9yIGNsaWNrIFwiUmVsb2FkIGxhdGVyXCIgYW5kIHBlcmZvcm0gcmVsb2FkJyArXG4gICAgICAgICAgICAgICAgICAgICAgICcgeW91cnNlbGYgd2l0aCBcIlZpZXcgPiBEZXZlbG9wZXIgPiBSZWxvYWQgV2luZG93XCIgY29tbWFuZCB3aGVuZXZlciAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgJ3lvdVxcJ3JlIHJlYWR5LicsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgICdSZWxvYWQgbm93JzogKCkgPT4gdXRpbHMucnVuQXRvbUNvbW1hbmQoJ3dpbmRvdzpyZWxvYWQnKSxcbiAgICAgICAgJ1JlbG9hZCBsYXRlcic6ICgpID0+IHt9LFxuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZnVuY3Rpb24gYWRqdXN0VG9vbGJhclBvc2l0aW9uKHN0YXRlKSB7XG4gIGNvbnN0IGtleSA9ICdwbGF0Zm9ybWlvLWlkZS5kZWZhdWx0VG9vbGJhclBvc2l0aW9uSGFzQmVlblNldCc7XG4gIGlmICghbG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KSAmJiBhdG9tLnBhY2thZ2VzLmdldEFjdGl2ZVBhY2thZ2UoJ3Rvb2wtYmFyJykpIHtcbiAgICBhdG9tLmNvbmZpZy5zZXQoJ3Rvb2wtYmFyLnBvc2l0aW9uJywgJ0xlZnQnKTtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShrZXksICd0cnVlJyk7XG4gIH1cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5mdW5jdGlvbiBjbGVhbnVwSWZDYW5jZWxlZChzdGF0ZSkge1xuICBpZiAoc3RhdGUgJiYgc3RhdGUuY2FuY2VsZWQpIHtcbiAgICBkZWxldGUgc3RhdGUuY2FuY2VsZWQ7XG4gICAgcmV0dXJuIGNsZWFudXAoc3RhdGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjbGVhbnVwKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBmcy5yZW1vdmUoY29uZmlnLkVOVl9ESVIsICgpID0+IHJlc29sdmUoLi4uYXJndW1lbnRzKSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBhcG0oYWN0aW9uLCBwYWNrYWdlcywgLi4uYWRkaXRpb25hbEFyZ3MpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBleGVjdXRhYmxlID0gYXRvbS5wYWNrYWdlcy5nZXRBcG1QYXRoKCk7XG4gICAgY29uc3QgYXJncyA9IFthY3Rpb25dLmNvbmNhdChwYWNrYWdlcykuY29uY2F0KGFkZGl0aW9uYWxBcmdzKTtcbiAgICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oZXhlY3V0YWJsZSwgYXJncyk7XG4gICAgbGV0IHN0ZGVyciA9ICcnO1xuICAgIGNoaWxkLnN0ZGVyci5vbignZGF0YScsIGNodW5rID0+IHN0ZGVyciArPSBjaHVuayk7XG4gICAgY2hpbGQub24oJ2Vycm9yJywgKGVycikgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGVyciwge2Rpc21pc3NhYmxlOiB0cnVlfSk7XG4gICAgfSk7XG4gICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcbiAgICAgIGlmICgwICE9PSBjb2RlKSB7XG4gICAgICAgIGNvbnN0IG1zZyA9IGBQbGF0Zm9ybUlPOiBGYWlsZWQgdG8gJHthY3Rpb259IHRoZSBmb2xsb3dpbmcgYCArXG4gICAgICAgICAgICAgICAgICAgIGBwYWNrYWdlczogJHtwYWNrYWdlcy5qb2luKCcsICcpfS5gO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IobXNnLCB7XG4gICAgICAgICAgZGV0YWlsOiBzdGRlcnIsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgICByZWplY3QoKTtcbiAgICAgIH1cbiAgICAgIHJlc29sdmUoKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHdyYXAodGFzaykge1xuICByZXR1cm4gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICBzdGF0ZS5zdGVwICs9IDE7XG4gICAgaWYgKHN0YXRlLnZpZXcpIHtcbiAgICAgIHN0YXRlLnZpZXcuc2V0UHJvZ3Jlc3MoTWF0aC5mbG9vcihzdGF0ZS5zdGVwIC8gc3RhdGUudG90YWwgKiAxMDApKTtcbiAgICB9XG4gICAgaWYgKHN0YXRlLmNhbmNlbGVkKSB7XG4gICAgICAvLyBTa2lwIHRhc2ssIHJldHVybiB0aGUgc3RhdGUgcmlnaHQgYXdheVxuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgICByZXR1cm4gdGFzayhzdGF0ZSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRpbWVDb25zdW1pbmdPcGVyYXRpb25zUmVxdWlyZWQoc3RhdGUpIHtcbiAgcmV0dXJuICFzdGF0ZS5yZXN0b3JlZCB8fCBzdGF0ZS5lbnZTaG91bGRCZUNyZWF0ZWQgfHwgc3RhdGUucGFja2FnZU1hbmFnZW1lbnRJc05lY2Vzc2FyeSB8fCBzdGF0ZS5leGFtcGxlc0hhdmVUb0JlRG93bmxvYWRlZDtcbn1cblxuZnVuY3Rpb24gY2hlY2tJZlBsYXRmb3JtSU9DYW5CZUV4ZWN1dGVkKCkge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHZhciBwaW9WZXJzaW9uUHJvY2Vzc1N0ZGVyciA9ICcnO1xuICAgIGNvbnN0IHBpb1ZlcnNpb25Qcm9jZXNzID0gY2hpbGRfcHJvY2Vzcy5zcGF3bigncGxhdGZvcm1pbycpO1xuICAgIHBpb1ZlcnNpb25Qcm9jZXNzLm9uKCdlcnJvcicsIG9uRXJyb3IpO1xuICAgIHBpb1ZlcnNpb25Qcm9jZXNzLnN0ZGVyci5vbignZGF0YScsIChjaHVuaykgPT4gcGlvVmVyc2lvblByb2Nlc3NTdGRlcnIgKz0gY2h1bmspO1xuICAgIHBpb1ZlcnNpb25Qcm9jZXNzLm9uKCdjbG9zZScsIChjb2RlKSA9PiB7XG4gICAgICBpZiAoMCAhPT0gY29kZSkge1xuICAgICAgICBvbkVycm9yKHBpb1ZlcnNpb25Qcm9jZXNzU3RkZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZSgpO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gb25FcnJvcihlcnIpIHtcbiAgICAgIGNvbnN0IHRpdGxlID0gJ1BsYXRmb3JtSU8gdG9vbCBpcyBub3QgYXZhaWxhYmxlLic7XG4gICAgICBjb25zdCBtc2cgPSAnQ2FuIG5vdCBmaW5kIGBwbGF0Zm9ybWlvYCBjb21tYW5kLiBQbGVhc2UgaW5zdGFsbCBpdCcgK1xuICAgICAgICAgICAgICAgICAgJyB1c2luZyBgcGlwIGluc3RhbGwgcGxhdGZvcm1pb2Agb3IgZW5hYmxlIGJ1aWx0LWluIFBsYXRmb3JtSU8gdG9vbCBpbicgK1xuICAgICAgICAgICAgICAgICAgJyBgTWVudTogUGxhdGZvcm1JTyA+IFNldHRpbmdzID4gcGxhdGZvcm1pby1pZGVgIHBhY2thZ2UuXFxuRGV0YWlsczpcXG4nICtcbiAgICAgICAgICAgICAgICAgIHBpb1ZlcnNpb25Qcm9jZXNzU3RkZXJyO1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRpdGxlLCB7ZGV0YWlsOiBtc2csIGRpc21pc3NhYmxlOiB0cnVlfSk7XG4gICAgICBjb25zb2xlLmVycm9yKHRpdGxlKTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICAgIHJlamVjdCgpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=