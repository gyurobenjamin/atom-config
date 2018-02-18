Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.updateOSEnviron = updateOSEnviron;
exports.setupActivationHooks = setupActivationHooks;
exports.handleShowPlatformIOFiles = handleShowPlatformIOFiles;
exports.checkClang = checkClang;
exports.notifyLinterDisabledforArduino = notifyLinterDisabledforArduino;
exports.installCommands = installCommands;
exports.openTerminal = openTerminal;
exports.handleCustomPATH = handleCustomPATH;
exports.highlightActiveProject = highlightActiveProject;

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

var _config = require('./config');

var config = _interopRequireWildcard(_config);

var _utils = require('./utils');

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _terminal = require('./terminal');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _shell = require('shell');

var _shell2 = _interopRequireDefault(_shell);

'use babel';
function updateOSEnviron() {
  // Fix for https://github.com/atom/atom/issues/11302
  if ('Path' in process.env) {
    if ('PATH' in process.env) {
      process.env.PATH += _path2['default'].delimiter + process.env.Path;
    } else {
      process.env.PATH = process.env.Path;
    }
  }

  // Fix for platformio-atom-ide/issues/112
  process.env.LC_ALL = 'en_US.UTF-8';

  if ((0, _utils.useBuiltinPlatformIO)()) {
    // Insert bin directory into PATH
    if (process.env.PATH.indexOf(config.ENV_BIN_DIR) < 0) {
      process.env.PATH = config.ENV_BIN_DIR + _path2['default'].delimiter + process.env.PATH;
    }
  } else {
    // Remove bin directory from PATH
    process.env.PATH = process.env.PATH.replace(config.ENV_BIN_DIR + _path2['default'].delimiter, '');
    process.env.PATH = process.env.PATH.replace(_path2['default'].delimiter + config.ENV_BIN_DIR, '');
  }

  handleCustomPATH(atom.config.get('platformio-ide.customPATH'));

  // export PATH to PlatformIO IDE Terminal
  var terminal_autorun_key = 'platformio-ide-terminal.core.autoRunCommand';
  if (!config.IS_WINDOWS && atom.config.get(terminal_autorun_key) === undefined) {
    if (process.env.SHELL && process.env.SHELL.indexOf('fish') !== -1) {
      atom.config.set(terminal_autorun_key, 'set -gx PATH ' + process.env.PATH.replace(/\:/g, ' '));
    } else {
      atom.config.set(terminal_autorun_key, 'export PATH=' + process.env.PATH);
    }
  }

  // copy PATH to Path (Windows issue)
  if ('Path' in process.env) {
    process.env.Path = process.env.PATH;
  }

  process.env.PLATFORMIO_CALLER = 'atom';
  process.env.PLATFORMIO_DISABLE_PROGRESSBAR = 'true';
  process.env.PLATFORMIO_IDE = (0, _utils.getIDEVersion)();
}

function setupActivationHooks() {
  if (_semver2['default'].satisfies(atom.getVersion(), '<1.12.2')) {
    return;
  }

  package_json_path = _path2['default'].join(config.BASE_DIR, 'package.json');
  package_json = require(package_json_path);
  if ('activationHooks' in package_json) {
    return;
  }
  package_json['activationHooks'] = ['core:loaded-shell-environment'];
  _fs2['default'].writeFile(package_json_path, JSON.stringify(package_json, null, 2), function (err) {
    if (err) {
      return console.log(err);
    }
  });
}

function handleShowPlatformIOFiles() {
  var ignoredNames = atom.config.get('core.ignoredNames');
  for (var _name of ['.pioenvs', '.piolibdeps', '.clang_complete', '.gcc-flags.json']) {
    if (ignoredNames.indexOf(_name) === -1) {
      ignoredNames.push(_name);
    }
  }
  atom.config.set('core.ignoredNames', ignoredNames);
  atom.config.set('tree-view.hideIgnoredNames', !atom.config.get('platformio-ide.showPlatformIOFiles'));
}

function checkClang() {
  if (localStorage.getItem('platformio-ide:clang-checked') === '2') {
    return;
  }
  var result = _child_process2['default'].spawnSync('clang', ['--version']);
  if (result.status !== 0) {
    atom.confirm({
      message: 'PlatformIO: Clang is not installed in your system!',
      detailedMessage: 'PlatformIO IDE uses "Clang" for the Intelligent Code Completion.\n' + 'Please install it otherwise this feature will be disabled.',
      buttons: {
        'Install Clang': function InstallClang() {
          _shell2['default'].openExternal('http://docs.platformio.org/page/ide/atom.html#ide-atom-installation-clang');
        },
        'Remind Later': function RemindLater() {},
        'Disable Code Completion': function DisableCodeCompletion() {
          localStorage.setItem('platformio-ide:clang-checked', 2);
        }
      }
    });
  } else {
    localStorage.setItem('platformio-ide:clang-checked', 2);
  }
}

function notifyLinterDisabledforArduino() {
  if (localStorage.getItem('platformio-ide:linter-warned') === '2') {
    return;
  }

  atom.confirm({
    message: 'PlatformIO: Smart Code Linter',
    detailedMessage: 'Smart Code Linter (checking the C/C++ code on-the-fly) ' + 'is disabled by default for Arduino files ("*.ino" and "*.pde").\n' + 'Please use "*.cpp" instead or enable it manually.',
    buttons: {
      'Enable': function Enable() {
        localStorage.setItem('platformio-ide:linter-warned', 2);
        _shell2['default'].openExternal('http://docs.platformio.org/page/ide/atom.html#smart-code-linter-is-disabled-for-arduino-files');
      },
      'Remind Later': function RemindLater() {},
      'Disable': function Disable() {
        localStorage.setItem('platformio-ide:linter-warned', 2);
      }
    }
  });
}

function installCommands() {
  if (config.IS_WINDOWS) {
    var winCheckResult = _child_process2['default'].spawnSync('platformio', ['--version']);
    if (0 !== winCheckResult.status) {
      var addResult = _child_process2['default'].spawnSync((0, _utils.getPythonExecutable)(), [_path2['default'].join(config.BASE_DIR, 'misc', 'add_path_to_envpath.py'), config.ENV_BIN_DIR]);
      if (0 !== addResult.status) {
        atom.notifications.addError('PlatformIO: Failed to install PlatformIO commands!', {
          detail: addResult.stderr
        });
        console.error('' + addResult.stderr);
      } else {
        atom.notifications.addSuccess('PlatformIO: Commands have been successfully installed');
      }
    }
  } else {
    var args = ['-c', 'command -v platformio --version'];
    // Passing empty env, because "process.env" may contain a path to the
    // "penv/bin", which makes the check always pass.
    var options = { env: {} };
    var checkResult = _child_process2['default'].spawnSync('/bin/sh', args, options);
    if (0 !== checkResult.status) {
      var map = [[_path2['default'].join(config.ENV_BIN_DIR, 'platformio'), '/usr/local/bin/platformio'], [_path2['default'].join(config.ENV_BIN_DIR, 'pio'), '/usr/local/bin/pio']];
      try {
        for (var item of map) {
          _fs2['default'].symlinkSync(item[0], item[1]);
        }
      } catch (e) {
        var msg = 'Please install shell commands manually. Open system ' + 'Terminal and paste commands below:\n';
        for (var item of map) {
          msg += '\n$ sudo ln -s ' + item[0] + ' ' + item[1];
        }
        atom.notifications.addError('PlatformIO: Failed to install commands', {
          detail: msg,
          dismissable: true
        });
      }
    } else {
      atom.notifications.addInfo('PlatformIO: Shell Commands installation skipped.', {
        detail: 'Commands are already available in your shell.'
      });
    }
  }
}

function openTerminal(cmd) {
  var status = (0, _terminal.runInTerminal)([cmd]);
  if (-1 === status) {
    atom.notifications.addError('PlatformIO: Terminal service is not registered.', {
      detail: 'Make sure that "platformio-ide-terminal" package is installed.',
      dismissable: true
    });
  }
  return status;
}

function handleCustomPATH(newValue, oldValue) {
  if (oldValue) {
    process.env.PATH = process.env.PATH.replace(oldValue + _path2['default'].delimiter, '');
    process.env.PATH = process.env.PATH.replace(_path2['default'].delimiter + oldValue, '');
  }
  if (newValue && process.env.PATH.indexOf(newValue) < 0) {
    process.env.PATH = newValue + _path2['default'].delimiter + process.env.PATH;
  }
}

function highlightActiveProject() {
  var isEnabled = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];
  var retries = arguments.length <= 1 || arguments[1] === undefined ? 3 : arguments[1];

  var p = (0, _utils.getActiveProjectPath)();
  var dirs = [].slice.call(document.querySelectorAll('ol.tree-view > li'));

  dirs.forEach(function (dir) {
    dir.classList.remove('pio-active-directory');
    if (!dir.dataset.pioRealpath) {
      var span = dir.querySelector('.header > span[data-path]');
      try {
        dir.dataset.pioRealpath = _fs2['default'].realpathSync(span.dataset.path);
      } catch (e) {
        dir.dataset.pioRealpath = span.dataset.path;
      }
    }
  });
  if (dirs.length < 2 || !isEnabled || !p || p === config.NO_ELIGIBLE_PROJECTS_FOUND) {
    return;
  }

  var done = false;
  for (var dir of dirs) {
    if (dir.dataset.pioRealpath === p.toString()) {
      dir.classList.add('pio-active-directory');
      done = true;
      break;
    }
  }
  // When running from `atom.project.onDidChangePaths()` or when Atom just starts,
  // an active project directory may not exist in tree-view yet. We should wait
  // for a while and repeat a search, or else user won't be able to recognize
  // a currently active project.
  if (!done && retries > 0) {
    setTimeout(function () {
      return highlightActiveProject(isEnabled, retries - 1);
    }, 100);
  }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9tYWludGVuYW5jZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3NCQW1Cd0IsVUFBVTs7SUFBdEIsTUFBTTs7cUJBQzJFLFNBQVM7OzZCQUM1RSxlQUFlOzs7O2tCQUMxQixJQUFJOzs7O29CQUNGLE1BQU07Ozs7d0JBQ0ssWUFBWTs7c0JBQ3JCLFFBQVE7Ozs7cUJBQ1QsT0FBTzs7OztBQTFCekIsV0FBVyxDQUFDO0FBNEJMLFNBQVMsZUFBZSxHQUFHOztBQUVoQyxNQUFJLE1BQU0sSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ3pCLFFBQUksTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUU7QUFDekIsYUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksa0JBQUssU0FBUyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDO0tBQ3ZELE1BQ0k7QUFDSCxhQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQztLQUNyQztHQUNGOzs7QUFHRCxTQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUM7O0FBRW5DLE1BQUksa0NBQXNCLEVBQUU7O0FBQzFCLFFBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLEVBQUU7QUFDcEQsYUFBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsR0FBRyxrQkFBSyxTQUFTLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUM7S0FDM0U7R0FDRixNQUFNOztBQUNMLFdBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMs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LElBQUksT0FBTyxHQUFHLENBQUMsRUFBRTtBQUN4QixjQUFVLENBQUM7YUFBTSxzQkFBc0IsQ0FBQyxTQUFTLEVBQUUsT0FBTyxHQUFHLENBQUMsQ0FBQztLQUFBLEVBQUUsR0FBRyxDQUFDLENBQUM7R0FDdkU7Q0FDRiIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS9saWIvbWFpbnRlbmFuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7Z2V0QWN0aXZlUHJvamVjdFBhdGgsIGdldElERVZlcnNpb24sIGdldFB5dGhvbkV4ZWN1dGFibGUsIHVzZUJ1aWx0aW5QbGF0Zm9ybUlPfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHtydW5JblRlcm1pbmFsfSBmcm9tICcuL3Rlcm1pbmFsJztcbmltcG9ydCBzZW12ZXIgZnJvbSAnc2VtdmVyJztcbmltcG9ydCBzaGVsbCBmcm9tICdzaGVsbCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGVPU0Vudmlyb24oKSB7XG4gIC8vIEZpeCBmb3IgaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9pc3N1ZXMvMTEzMDJcbiAgaWYgKCdQYXRoJyBpbiBwcm9jZXNzLmVudikge1xuICAgIGlmICgnUEFUSCcgaW4gcHJvY2Vzcy5lbnYpIHtcbiAgICAgIHByb2Nlc3MuZW52LlBBVEggKz0gcGF0aC5kZWxpbWl0ZXIgKyBwcm9jZXNzLmVudi5QYXRoO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHByb2Nlc3MuZW52LlBBVEggPSBwcm9jZXNzLmVudi5QYXRoO1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpeCBmb3IgcGxhdGZvcm1pby1hdG9tLWlkZS9pc3N1ZXMvMTEyXG4gIHByb2Nlc3MuZW52LkxDX0FMTCA9ICdlbl9VUy5VVEYtOCc7XG5cbiAgaWYgKHVzZUJ1aWx0aW5QbGF0Zm9ybUlPKCkpIHsgIC8vIEluc2VydCBiaW4gZGlyZWN0b3J5IGludG8gUEFUSFxuICAgIGlmIChwcm9jZXNzLmVudi5QQVRILmluZGV4T2YoY29uZmlnLkVOVl9CSU5fRElSKSA8IDApIHtcbiAgICAgIHByb2Nlc3MuZW52LlBBVEggPSBjb25maWcuRU5WX0JJTl9ESVIgKyBwYXRoLmRlbGltaXRlciArIHByb2Nlc3MuZW52LlBBVEg7XG4gICAgfVxuICB9IGVsc2UgeyAgLy8gUmVtb3ZlIGJpbiBkaXJlY3RvcnkgZnJvbSBQQVRIXG4gICAgcHJvY2Vzcy5lbnYuUEFUSCA9IHByb2Nlc3MuZW52LlBBVEgucmVwbGFjZShjb25maWcuRU5WX0JJTl9ESVIgKyBwYXRoLmRlbGltaXRlciwgJycpO1xuICAgIHByb2Nlc3MuZW52LlBBVEggPSBwcm9jZXNzLmVudi5QQVRILnJlcGxhY2UocGF0aC5kZWxpbWl0ZXIgKyBjb25maWcuRU5WX0JJTl9ESVIsICcnKTtcbiAgfVxuXG4gIGhhbmRsZUN1c3RvbVBBVEgoYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS5jdXN0b21QQVRIJykpO1xuXG4gIC8vIGV4cG9ydCBQQVRIIHRvIFBsYXRmb3JtSU8gSURFIFRlcm1pbmFsXG4gIGNvbnN0IHRlcm1pbmFsX2F1dG9ydW5fa2V5ID0gJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsLmNvcmUuYXV0b1J1bkNvbW1hbmQnO1xuICBpZiAoIWNvbmZpZy5JU19XSU5ET1dTICYmIGF0b20uY29uZmlnLmdldCh0ZXJtaW5hbF9hdXRvcnVuX2tleSkgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChwcm9jZXNzLmVudi5TSEVMTCAmJiBwcm9jZXNzLmVudi5TSEVMTC5pbmRleE9mKCdmaXNoJykgIT09IC0xKSB7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXG4gICAgICAgIHRlcm1pbmFsX2F1dG9ydW5fa2V5LFxuICAgICAgICAnc2V0IC1neCBQQVRIICcgKyBwcm9jZXNzLmVudi5QQVRILnJlcGxhY2UoL1xcOi9nLCAnICcpXG4gICAgICApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCh0ZXJtaW5hbF9hdXRvcnVuX2tleSwgJ2V4cG9ydCBQQVRIPScgKyBwcm9jZXNzLmVudi5QQVRIKTtcbiAgICB9XG4gIH1cblxuICAvLyBjb3B5IFBBVEggdG8gUGF0aCAoV2luZG93cyBpc3N1ZSlcbiAgaWYgKCdQYXRoJyBpbiBwcm9jZXNzLmVudikge1xuICAgIHByb2Nlc3MuZW52LlBhdGggPSBwcm9jZXNzLmVudi5QQVRIO1xuICB9XG5cbiAgcHJvY2Vzcy5lbnYuUExBVEZPUk1JT19DQUxMRVIgPSAnYXRvbSc7XG4gIHByb2Nlc3MuZW52LlBMQVRGT1JNSU9fRElTQUJMRV9QUk9HUkVTU0JBUiA9ICd0cnVlJztcbiAgcHJvY2Vzcy5lbnYuUExBVEZPUk1JT19JREUgPSBnZXRJREVWZXJzaW9uKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXR1cEFjdGl2YXRpb25Ib29rcygpIHtcbiAgaWYgKHNlbXZlci5zYXRpc2ZpZXMoYXRvbS5nZXRWZXJzaW9uKCksICc8MS4xMi4yJykpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBwYWNrYWdlX2pzb25fcGF0aCA9IHBhdGguam9pbihjb25maWcuQkFTRV9ESVIsICdwYWNrYWdlLmpzb24nKVxuICBwYWNrYWdlX2pzb24gPSByZXF1aXJlKHBhY2thZ2VfanNvbl9wYXRoKVxuICBpZiAoJ2FjdGl2YXRpb25Ib29rcycgaW4gcGFja2FnZV9qc29uKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHBhY2thZ2VfanNvblsnYWN0aXZhdGlvbkhvb2tzJ10gPSBbJ2NvcmU6bG9hZGVkLXNoZWxsLWVudmlyb25tZW50J11cbiAgZnMud3JpdGVGaWxlKHBhY2thZ2VfanNvbl9wYXRoLCBKU09OLnN0cmluZ2lmeShwYWNrYWdlX2pzb24sIG51bGwsIDIpLCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgaWYgKGVycikge1xuICAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGVycik7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZVNob3dQbGF0Zm9ybUlPRmlsZXMoKSB7XG4gIGNvbnN0IGlnbm9yZWROYW1lcyA9IGF0b20uY29uZmlnLmdldCgnY29yZS5pZ25vcmVkTmFtZXMnKTtcbiAgZm9yIChjb25zdCBuYW1lIG9mIFsnLnBpb2VudnMnLCAnLnBpb2xpYmRlcHMnLCAnLmNsYW5nX2NvbXBsZXRlJywgJy5nY2MtZmxhZ3MuanNvbiddKSB7XG4gICAgaWYgKGlnbm9yZWROYW1lcy5pbmRleE9mKG5hbWUpID09PSAtMSkge1xuICAgICAgaWdub3JlZE5hbWVzLnB1c2gobmFtZSk7XG4gICAgfVxuICB9XG4gIGF0b20uY29uZmlnLnNldCgnY29yZS5pZ25vcmVkTmFtZXMnLCBpZ25vcmVkTmFtZXMpO1xuICBhdG9tLmNvbmZpZy5zZXQoJ3RyZWUtdmlldy5oaWRlSWdub3JlZE5hbWVzJywgIWF0b20uY29uZmlnLmdldCgncGxhdGZvcm1pby1pZGUuc2hvd1BsYXRmb3JtSU9GaWxlcycpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrQ2xhbmcoKSB7XG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncGxhdGZvcm1pby1pZGU6Y2xhbmctY2hlY2tlZCcpID09PSAnMicpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcmVzdWx0ID0gY2hpbGRfcHJvY2Vzcy5zcGF3blN5bmMoJ2NsYW5nJywgWyctLXZlcnNpb24nXSk7XG4gIGlmIChyZXN1bHQuc3RhdHVzICE9PSAwKSB7XG4gICAgYXRvbS5jb25maXJtKHtcbiAgICAgIG1lc3NhZ2U6ICdQbGF0Zm9ybUlPOiBDbGFuZyBpcyBub3QgaW5zdGFsbGVkIGluIHlvdXIgc3lzdGVtIScsXG4gICAgICBkZXRhaWxlZE1lc3NhZ2U6ICdQbGF0Zm9ybUlPIElERSB1c2VzIFwiQ2xhbmdcIiBmb3IgdGhlIEludGVsbGlnZW50IENvZGUgQ29tcGxldGlvbi5cXG4nICtcbiAgICAgICdQbGVhc2UgaW5zdGFsbCBpdCBvdGhlcndpc2UgdGhpcyBmZWF0dXJlIHdpbGwgYmUgZGlzYWJsZWQuJyxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgJ0luc3RhbGwgQ2xhbmcnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHA6Ly9kb2NzLnBsYXRmb3JtaW8ub3JnL3BhZ2UvaWRlL2F0b20uaHRtbCNpZGUtYXRvbS1pbnN0YWxsYXRpb24tY2xhbmcnKTtcbiAgICAgICAgfSxcbiAgICAgICAgJ1JlbWluZCBMYXRlcic6IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICdEaXNhYmxlIENvZGUgQ29tcGxldGlvbic6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdwbGF0Zm9ybWlvLWlkZTpjbGFuZy1jaGVja2VkJywgMik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGxhdGZvcm1pby1pZGU6Y2xhbmctY2hlY2tlZCcsIDIpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBub3RpZnlMaW50ZXJEaXNhYmxlZGZvckFyZHVpbm8oKSB7XG4gIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgncGxhdGZvcm1pby1pZGU6bGludGVyLXdhcm5lZCcpID09PSAnMicpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBhdG9tLmNvbmZpcm0oe1xuICAgIG1lc3NhZ2U6ICdQbGF0Zm9ybUlPOiBTbWFydCBDb2RlIExpbnRlcicsXG4gICAgZGV0YWlsZWRNZXNzYWdlOiAnU21hcnQgQ29kZSBMaW50ZXIgKGNoZWNraW5nIHRoZSBDL0MrKyBjb2RlIG9uLXRoZS1mbHkpICcgK1xuICAgICdpcyBkaXNhYmxlZCBieSBkZWZhdWx0IGZvciBBcmR1aW5vIGZpbGVzIChcIiouaW5vXCIgYW5kIFwiKi5wZGVcIikuXFxuJyArXG4gICAgJ1BsZWFzZSB1c2UgXCIqLmNwcFwiIGluc3RlYWQgb3IgZW5hYmxlIGl0IG1hbnVhbGx5LicsXG4gICAgYnV0dG9uczoge1xuICAgICAgJ0VuYWJsZSc6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgncGxhdGZvcm1pby1pZGU6bGludGVyLXdhcm5lZCcsIDIpO1xuICAgICAgICBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHA6Ly9kb2NzLnBsYXRmb3JtaW8ub3JnL3BhZ2UvaWRlL2F0b20uaHRtbCNzbWFydC1jb2RlLWxpbnRlci1pcy1kaXNhYmxlZC1mb3ItYXJkdWluby1maWxlcycpO1xuICAgICAgfSxcbiAgICAgICdSZW1pbmQgTGF0ZXInOiBmdW5jdGlvbigpIHt9LFxuICAgICAgJ0Rpc2FibGUnOiBmdW5jdGlvbigpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ3BsYXRmb3JtaW8taWRlOmxpbnRlci13YXJuZWQnLCAyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFsbENvbW1hbmRzKCkge1xuICBpZiAoY29uZmlnLklTX1dJTkRPV1MpIHtcbiAgICBjb25zdCB3aW5DaGVja1Jlc3VsdCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd25TeW5jKCdwbGF0Zm9ybWlvJywgWyctLXZlcnNpb24nXSk7XG4gICAgaWYgKDAgIT09IHdpbkNoZWNrUmVzdWx0LnN0YXR1cykge1xuICAgICAgY29uc3QgYWRkUmVzdWx0ID0gY2hpbGRfcHJvY2Vzcy5zcGF3blN5bmMoXG4gICAgICAgIGdldFB5dGhvbkV4ZWN1dGFibGUoKSxcbiAgICAgICAgW3BhdGguam9pbihjb25maWcuQkFTRV9ESVIsICdtaXNjJywgJ2FkZF9wYXRoX3RvX2VudnBhdGgucHknKSwgY29uZmlnLkVOVl9CSU5fRElSXSk7XG4gICAgICBpZiAoMCAhPT0gYWRkUmVzdWx0LnN0YXR1cykge1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1BsYXRmb3JtSU86IEZhaWxlZCB0byBpbnN0YWxsIFBsYXRmb3JtSU8gY29tbWFuZHMhJywge1xuICAgICAgICAgIGRldGFpbDogYWRkUmVzdWx0LnN0ZGVyclxuICAgICAgICB9KTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJyArIGFkZFJlc3VsdC5zdGRlcnIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXG4gICAgICAgICAgJ1BsYXRmb3JtSU86IENvbW1hbmRzIGhhdmUgYmVlbiBzdWNjZXNzZnVsbHkgaW5zdGFsbGVkJ1xuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBhcmdzID0gWyctYycsICdjb21tYW5kIC12IHBsYXRmb3JtaW8gLS12ZXJzaW9uJ107XG4gICAgLy8gUGFzc2luZyBlbXB0eSBlbnYsIGJlY2F1c2UgXCJwcm9jZXNzLmVudlwiIG1heSBjb250YWluIGEgcGF0aCB0byB0aGVcbiAgICAvLyBcInBlbnYvYmluXCIsIHdoaWNoIG1ha2VzIHRoZSBjaGVjayBhbHdheXMgcGFzcy5cbiAgICBjb25zdCBvcHRpb25zID0ge2Vudjoge319O1xuICAgIGNvbnN0IGNoZWNrUmVzdWx0ID0gY2hpbGRfcHJvY2Vzcy5zcGF3blN5bmMoJy9iaW4vc2gnLCBhcmdzLCBvcHRpb25zKTtcbiAgICBpZiAoMCAhPT0gY2hlY2tSZXN1bHQuc3RhdHVzKSB7XG4gICAgICBjb25zdCBtYXAgPSBbXG4gICAgICAgIFtwYXRoLmpvaW4oY29uZmlnLkVOVl9CSU5fRElSLCAncGxhdGZvcm1pbycpLCAnL3Vzci9sb2NhbC9iaW4vcGxhdGZvcm1pbyddLFxuICAgICAgICBbcGF0aC5qb2luKGNvbmZpZy5FTlZfQklOX0RJUiwgJ3BpbycpLCAnL3Vzci9sb2NhbC9iaW4vcGlvJ10sXG4gICAgICBdO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm9yIChjb25zdCBpdGVtIG9mIG1hcCkge1xuICAgICAgICAgIGZzLnN5bWxpbmtTeW5jKGl0ZW1bMF0sIGl0ZW1bMV0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgbGV0IG1zZyA9ICdQbGVhc2UgaW5zdGFsbCBzaGVsbCBjb21tYW5kcyBtYW51YWxseS4gT3BlbiBzeXN0ZW0gJyArXG4gICAgICAgICAgICAgICAgICAnVGVybWluYWwgYW5kIHBhc3RlIGNvbW1hbmRzIGJlbG93Olxcbic7XG4gICAgICAgIGZvciAoY29uc3QgaXRlbSBvZiBtYXApIHtcbiAgICAgICAgICBtc2cgKz0gYFxcbiQgc3VkbyBsbiAtcyAke2l0ZW1bMF19ICR7aXRlbVsxXX1gO1xuICAgICAgICB9XG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignUGxhdGZvcm1JTzogRmFpbGVkIHRvIGluc3RhbGwgY29tbWFuZHMnLCB7XG4gICAgICAgICAgZGV0YWlsOiBtc2csXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnUGxhdGZvcm1JTzogU2hlbGwgQ29tbWFuZHMgaW5zdGFsbGF0aW9uIHNraXBwZWQuJywge1xuICAgICAgICBkZXRhaWw6ICdDb21tYW5kcyBhcmUgYWxyZWFkeSBhdmFpbGFibGUgaW4geW91ciBzaGVsbC4nXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG9wZW5UZXJtaW5hbChjbWQpIHtcbiAgY29uc3Qgc3RhdHVzID0gcnVuSW5UZXJtaW5hbChbY21kXSk7XG4gIGlmICgtMSA9PT0gc3RhdHVzKSB7XG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdQbGF0Zm9ybUlPOiBUZXJtaW5hbCBzZXJ2aWNlIGlzIG5vdCByZWdpc3RlcmVkLicsIHtcbiAgICAgIGRldGFpbDogJ01ha2Ugc3VyZSB0aGF0IFwicGxhdGZvcm1pby1pZGUtdGVybWluYWxcIiBwYWNrYWdlIGlzIGluc3RhbGxlZC4nLFxuICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgfSk7XG4gIH1cbiAgcmV0dXJuIHN0YXR1cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhhbmRsZUN1c3RvbVBBVEgobmV3VmFsdWUsIG9sZFZhbHVlKSB7XG4gIGlmIChvbGRWYWx1ZSkge1xuICAgIHByb2Nlc3MuZW52LlBBVEggPSBwcm9jZXNzLmVudi5QQVRILnJlcGxhY2Uob2xkVmFsdWUgKyBwYXRoLmRlbGltaXRlciwgJycpO1xuICAgIHByb2Nlc3MuZW52LlBBVEggPSBwcm9jZXNzLmVudi5QQVRILnJlcGxhY2UocGF0aC5kZWxpbWl0ZXIgKyBvbGRWYWx1ZSwgJycpO1xuICB9XG4gIGlmIChuZXdWYWx1ZSAmJiBwcm9jZXNzLmVudi5QQVRILmluZGV4T2YobmV3VmFsdWUpIDwgMCkge1xuICAgIHByb2Nlc3MuZW52LlBBVEggPSBuZXdWYWx1ZSArIHBhdGguZGVsaW1pdGVyICsgcHJvY2Vzcy5lbnYuUEFUSDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlnaGxpZ2h0QWN0aXZlUHJvamVjdChpc0VuYWJsZWQ9dHJ1ZSwgcmV0cmllcz0zKSB7XG4gIGNvbnN0IHAgPSBnZXRBY3RpdmVQcm9qZWN0UGF0aCgpO1xuICBjb25zdCBkaXJzID0gW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdvbC50cmVlLXZpZXcgPiBsaScpKTtcblxuICBkaXJzLmZvckVhY2goKGRpcikgPT4ge1xuICAgIGRpci5jbGFzc0xpc3QucmVtb3ZlKCdwaW8tYWN0aXZlLWRpcmVjdG9yeScpO1xuICAgIGlmICghZGlyLmRhdGFzZXQucGlvUmVhbHBhdGgpIHtcbiAgICAgIGNvbnN0IHNwYW4gPSBkaXIucXVlcnlTZWxlY3RvcignLmhlYWRlciA+IHNwYW5bZGF0YS1wYXRoXScpO1xuICAgICAgdHJ5IHtcbiAgICAgICAgZGlyLmRhdGFzZXQucGlvUmVhbHBhdGggPSBmcy5yZWFscGF0aFN5bmMoc3Bhbi5kYXRhc2V0LnBhdGgpO1xuICAgICAgfVxuICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgZGlyLmRhdGFzZXQucGlvUmVhbHBhdGggPSBzcGFuLmRhdGFzZXQucGF0aDtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICBpZiAoZGlycy5sZW5ndGggPCAyIHx8ICFpc0VuYWJsZWQgfHwgIXAgfHwgcCA9PT0gY29uZmlnLk5PX0VMSUdJQkxFX1BST0pFQ1RTX0ZPVU5EKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IGRvbmUgPSBmYWxzZTtcbiAgZm9yIChjb25zdCBkaXIgb2YgZGlycykge1xuICAgIGlmIChkaXIuZGF0YXNldC5waW9SZWFscGF0aCA9PT0gcC50b1N0cmluZygpKSB7XG4gICAgICBkaXIuY2xhc3NMaXN0LmFkZCgncGlvLWFjdGl2ZS1kaXJlY3RvcnknKTtcbiAgICAgIGRvbmUgPSB0cnVlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIC8vIFdoZW4gcnVubmluZyBmcm9tIGBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocygpYCBvciB3aGVuIEF0b20ganVzdCBzdGFydHMsXG4gIC8vIGFuIGFjdGl2ZSBwcm9qZWN0IGRpcmVjdG9yeSBtYXkgbm90IGV4aXN0IGluIHRyZWUtdmlldyB5ZXQuIFdlIHNob3VsZCB3YWl0XG4gIC8vIGZvciBhIHdoaWxlIGFuZCByZXBlYXQgYSBzZWFyY2gsIG9yIGVsc2UgdXNlciB3b24ndCBiZSBhYmxlIHRvIHJlY29nbml6ZVxuICAvLyBhIGN1cnJlbnRseSBhY3RpdmUgcHJvamVjdC5cbiAgaWYgKCFkb25lICYmIHJldHJpZXMgPiAwKSB7XG4gICAgc2V0VGltZW91dCgoKSA9PiBoaWdobGlnaHRBY3RpdmVQcm9qZWN0KGlzRW5hYmxlZCwgcmV0cmllcyAtIDEpLCAxMDApO1xuICB9XG59XG4iXX0=