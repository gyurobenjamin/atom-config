Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

var _utils = require('./utils');

var _config = require('./config');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _terminal = require('./terminal');

var _ini = require('ini');

var _ini2 = _interopRequireDefault(_ini);

var _maintenance = require('./maintenance');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';

var ENV_NAME_PREFIX = 'env:';

var PlatformIOBuildProvider = (function () {
  function PlatformIOBuildProvider(cwd) {
    _classCallCheck(this, PlatformIOBuildProvider);

    try {
      this.cwd = _fs2['default'].realpathSync(cwd);
    } catch (e) {
      this.cwd = cwd;
    }

    this.platformioIniPath = _path2['default'].join(this.cwd, 'platformio.ini');
    this.title = 'PlatformIO';
    this.targetNamePrefix = this.title + ': ';

    this.targetsBaseSettings = [{
      name: 'Build',
      args: ['run'],
      keymap: 'ctrl-alt-b'
    }, {
      name: 'Clean',
      args: ['run', '--target', 'clean'],
      keymap: 'ctrl-alt-c'
    }, {
      name: 'Test',
      args: ['test'],
      keymap: 'ctrl-alt-shift-t'
    }, {
      name: 'Upload',
      args: ['run', '--target', 'upload'],
      keymap: 'ctrl-alt-u'
    }, {
      name: 'Upload using Programmer',
      args: ['run', '--target', 'program']
    }, {
      name: 'Upload SPIFFS image',
      args: ['run', '--target', 'uploadfs']
    }];
  }

  _createClass(PlatformIOBuildProvider, [{
    key: 'getNiceName',
    value: function getNiceName() {
      return this.title;
    }
  }, {
    key: 'isEligible',
    value: function isEligible() {
      return (0, _utils.isPioProject)(this.cwd);
    }
  }, {
    key: 'settings',
    value: function settings() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _fs2['default'].readFile(_this.platformioIniPath, function (err, data) {
          if (err) {
            reject(err);
          }
          var settings = _this.prepareSettings(_this.targetsBaseSettings);

          var envs = [];
          var boards = {};
          var config = _ini2['default'].parse(data.toString());
          for (var section of Object.keys(config)) {
            if (section.startsWith(ENV_NAME_PREFIX)) {
              var envName = section.slice(ENV_NAME_PREFIX.length);
              envs.push(envName);
              boards[envName] = config[section].board;
            }
          }

          if (envs.length > 0) {
            var espressifFound = false;
            var atmelavrFound = false;
            for (var env of envs) {
              var platform = config[ENV_NAME_PREFIX + env].platform;
              if (platform.startsWith('espressif')) {
                espressifFound = true;
              }
              if ('atmelavr' === platform) {
                atmelavrFound = true;
              }
            }
            if (!espressifFound) {
              settings = settings.filter(argsDoNotContain('uploadfs'));
            }
            if (!atmelavrFound) {
              settings = settings.filter(argsDoNotContain('program'));
            }
          }

          if (envs.length > 1) {
            for (var env of envs) {
              var envSettings = _this.prepareSettings(_this.targetsBaseSettings).map(makeEnvSpecificTarget(env));
              var platform = config[ENV_NAME_PREFIX + env].platform;
              if (!platform.startsWith('espressif')) {
                envSettings = envSettings.filter(argsDoNotContain('uploadfs'));
              }
              if ('atmelavr' !== platform) {
                envSettings = envSettings.filter(argsDoNotContain('program'));
              }

              settings = settings.concat(envSettings);
            }
          }

          if (atom.config.get('platformio-ide.autoCloseSerialMonitor')) {
            settings = settings.map(assignHooks);
          }

          resolve(settings);
        });
      });

      function makeEnvSpecificTarget(env) {
        return function (base) {
          var item = (0, _utils.clone)(base);
          item.name += ' (env:' + env + ')';
          item.args.push('--environment');
          item.args.push(env);
          delete item.keymap;
          delete item.atomCommandName;
          return item;
        };
      }

      function argsDoNotContain(arg) {
        return function (item) {
          return item.args.indexOf(arg) === -1;
        };
      }
    }
  }, {
    key: 'prepareSettings',
    value: function prepareSettings(baseSettings) {
      var _this2 = this;

      return baseSettings.map(function (base) {
        var item = (0, _utils.clone)(base);
        item.name = _this2.targetNamePrefix + base.name;
        item.exec = 'platformio';
        item.sh = false;
        item.env = Object.create(process.env);
        item.env.PLATFORMIO_FORCE_COLOR = 'true';
        item.env.PLATFORMIO_DISABLE_PROGRESSBAR = 'true';
        item.env.PLATFORMIO_SETTING_ENABLE_PROMPTS = 'false';
        item.errorMatch = ['\n\\x1B\\[31m(?<file>src[\\/0-9a-zA-Z\\._\\\\]+):(?<line>\\d+):(?<col>\\d+)'];
        item.atomCommandName = 'platformio-ide:target:' + base.name.toLowerCase() + '-' + _this2.cwd;
        return item;
      });
    }
  }]);

  return PlatformIOBuildProvider;
})();

exports.PlatformIOBuildProvider = PlatformIOBuildProvider;

function isViewCreatedBySerialportsMonitorCommand(view) {
  return view.autoRun.length > 0 && view.autoRun[0].includes('serialports monitor');
}

function assignHooks(item) {
  if (item.args.indexOf('upload') === -1 && item.args.indexOf('program') === -1 && item.args.indexOf('uploadfs') === -1) {
    return item;
  }
  item.terminalsToRestore = [];
  item.preBuild = function () {
    var terminalViews = (0, _terminal.getTerminalViews)();
    if (-1 === terminalViews) {
      return;
    }
    for (var view of terminalViews) {
      if (isViewCreatedBySerialportsMonitorCommand(view)) {
        this.terminalsToRestore.push(view.autoRun[0]);
        view.destroy();
      }
    }
  };
  item.postBuild = function (succeded) {
    var _this3 = this;

    if (!succeded) {
      return;
    }
    setTimeout(function () {
      while (_this3.terminalsToRestore.length > 0) {
        (0, _maintenance.openTerminal)(_this3.terminalsToRestore.splice(0, 1)[0]);
      }
    }, _config.POST_BUILD_DELAY);
  };
  return item;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9idWlsZC1wcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBbUJrQyxTQUFTOztzQkFDWixVQUFVOztrQkFDMUIsSUFBSTs7Ozt3QkFDWSxZQUFZOzttQkFDM0IsS0FBSzs7OzsyQkFDTSxlQUFlOztvQkFDekIsTUFBTTs7OztBQXpCdkIsV0FBVyxDQUFDOztBQTJCWixJQUFNLGVBQWUsR0FBRyxNQUFNLENBQUM7O0lBRWxCLHVCQUF1QjtBQUN2QixXQURBLHVCQUF1QixDQUN0QixHQUFHLEVBQUU7MEJBRE4sdUJBQXVCOztBQUVoQyxRQUFJO0FBQ0YsVUFBSSxDQUFDLEdBQUcsR0FBRyxnQkFBRyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDakMsQ0FDRCxPQUFPLENBQUMsRUFBRTtBQUNSLFVBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0tBQ2hCOztBQUVELFFBQUksQ0FBQyxpQkFBaUIsR0FBRyxrQkFBSyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO0FBQy9ELFFBQUksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFMUMsUUFBSSxDQUFDLG1CQUFtQixHQUFHLENBQ3pCO0FBQ0UsVUFBSSxFQUFFLE9BQU87QUFDYixVQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7QUFDYixZQUFNLEVBQUUsWUFBWTtLQUNyQixFQUNEO0FBQ0UsVUFBSSxFQUFFLE9BQU87QUFDYixVQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQztBQUNsQyxZQUFNLEVBQUUsWUFBWTtLQUNyQixFQUNEO0FBQ0UsVUFBSSxFQUFFLE1B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QUssa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ3ZEO0tBQ0YsMkJBQW1CLENBQUM7R0FDdEIsQ0FBQztBQUNGLFNBQU8sSUFBSSxDQUFDO0NBQ2IiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUvbGliL2J1aWxkLXByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCB7Y2xvbmUsIGlzUGlvUHJvamVjdH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQge1BPU1RfQlVJTERfREVMQVl9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQge2dldFRlcm1pbmFsVmlld3N9IGZyb20gJy4vdGVybWluYWwnO1xuaW1wb3J0IGluaSBmcm9tICdpbmknO1xuaW1wb3J0IHtvcGVuVGVybWluYWx9IGZyb20gJy4vbWFpbnRlbmFuY2UnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5cbmNvbnN0IEVOVl9OQU1FX1BSRUZJWCA9ICdlbnY6JztcblxuZXhwb3J0IGNsYXNzIFBsYXRmb3JtSU9CdWlsZFByb3ZpZGVyIHtcbiAgY29uc3RydWN0b3IoY3dkKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuY3dkID0gZnMucmVhbHBhdGhTeW5jKGN3ZCk7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmN3ZCA9IGN3ZDtcbiAgICB9XG5cbiAgICB0aGlzLnBsYXRmb3JtaW9JbmlQYXRoID0gcGF0aC5qb2luKHRoaXMuY3dkLCAncGxhdGZvcm1pby5pbmknKTtcbiAgICB0aGlzLnRpdGxlID0gJ1BsYXRmb3JtSU8nO1xuICAgIHRoaXMudGFyZ2V0TmFtZVByZWZpeCA9IHRoaXMudGl0bGUgKyAnOiAnO1xuXG4gICAgdGhpcy50YXJnZXRzQmFzZVNldHRpbmdzID0gW1xuICAgICAge1xuICAgICAgICBuYW1lOiAnQnVpbGQnLFxuICAgICAgICBhcmdzOiBbJ3J1biddLFxuICAgICAgICBrZXltYXA6ICdjdHJsLWFsdC1iJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdDbGVhbicsXG4gICAgICAgIGFyZ3M6IFsncnVuJywgJy0tdGFyZ2V0JywgJ2NsZWFuJ10sXG4gICAgICAgIGtleW1hcDogJ2N0cmwtYWx0LWMnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ1Rlc3QnLFxuICAgICAgICBhcmdzOiBbJ3Rlc3QnXSxcbiAgICAgICAga2V5bWFwOiAnY3RybC1hbHQtc2hpZnQtdCcsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBuYW1lOiAnVXBsb2FkJyxcbiAgICAgICAgYXJnczogWydydW4nLCAnLS10YXJnZXQnLCAndXBsb2FkJ10sXG4gICAgICAgIGtleW1hcDogJ2N0cmwtYWx0LXUnLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ1VwbG9hZCB1c2luZyBQcm9ncmFtbWVyJyxcbiAgICAgICAgYXJnczogWydydW4nLCAnLS10YXJnZXQnLCAncHJvZ3JhbSddLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ1VwbG9hZCBTUElGRlMgaW1hZ2UnLFxuICAgICAgICBhcmdzOiBbJ3J1bicsICctLXRhcmdldCcsICd1cGxvYWRmcyddLFxuICAgICAgfVxuICAgIF07XG4gIH1cblxuICBnZXROaWNlTmFtZSgpIHtcbiAgICByZXR1cm4gdGhpcy50aXRsZTtcbiAgfVxuXG4gIGlzRWxpZ2libGUoKSB7XG4gICAgcmV0dXJuIGlzUGlvUHJvamVjdCh0aGlzLmN3ZCk7XG4gIH1cblxuICBzZXR0aW5ncygpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgZnMucmVhZEZpbGUodGhpcy5wbGF0Zm9ybWlvSW5pUGF0aCwgKGVyciwgZGF0YSkgPT4ge1xuICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNldHRpbmdzID0gdGhpcy5wcmVwYXJlU2V0dGluZ3ModGhpcy50YXJnZXRzQmFzZVNldHRpbmdzKTtcblxuICAgICAgICBjb25zdCBlbnZzID0gW107XG4gICAgICAgIGNvbnN0IGJvYXJkcyA9IHt9O1xuICAgICAgICBjb25zdCBjb25maWcgPSBpbmkucGFyc2UoZGF0YS50b1N0cmluZygpKTtcbiAgICAgICAgZm9yIChjb25zdCBzZWN0aW9uIG9mIE9iamVjdC5rZXlzKGNvbmZpZykpIHtcbiAgICAgICAgICBpZiAoc2VjdGlvbi5zdGFydHNXaXRoKEVOVl9OQU1FX1BSRUZJWCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGVudk5hbWUgPSBzZWN0aW9uLnNsaWNlKEVOVl9OQU1FX1BSRUZJWC5sZW5ndGgpO1xuICAgICAgICAgICAgZW52cy5wdXNoKGVudk5hbWUpO1xuICAgICAgICAgICAgYm9hcmRzW2Vudk5hbWVdID0gY29uZmlnW3NlY3Rpb25dLmJvYXJkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnZzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBsZXQgZXNwcmVzc2lmRm91bmQgPSBmYWxzZTtcbiAgICAgICAgICBsZXQgYXRtZWxhdnJGb3VuZCA9IGZhbHNlO1xuICAgICAgICAgIGZvciAoY29uc3QgZW52IG9mIGVudnMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBsYXRmb3JtID0gY29uZmlnW0VOVl9OQU1FX1BSRUZJWCArIGVudl0ucGxhdGZvcm07XG4gICAgICAgICAgICBpZiAocGxhdGZvcm0uc3RhcnRzV2l0aCgnZXNwcmVzc2lmJykpIHtcbiAgICAgICAgICAgICAgZXNwcmVzc2lmRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCdhdG1lbGF2cicgPT09IHBsYXRmb3JtKSB7XG4gICAgICAgICAgICAgIGF0bWVsYXZyRm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoIWVzcHJlc3NpZkZvdW5kKSB7XG4gICAgICAgICAgICBzZXR0aW5ncyA9IHNldHRpbmdzLmZpbHRlcihhcmdzRG9Ob3RDb250YWluKCd1cGxvYWRmcycpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFhdG1lbGF2ckZvdW5kKSB7XG4gICAgICAgICAgICBzZXR0aW5ncyA9IHNldHRpbmdzLmZpbHRlcihhcmdzRG9Ob3RDb250YWluKCdwcm9ncmFtJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChlbnZzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICBmb3IgKGNvbnN0IGVudiBvZiBlbnZzKSB7XG4gICAgICAgICAgICBsZXQgZW52U2V0dGluZ3MgPSB0aGlzXG4gICAgICAgICAgICAgIC5wcmVwYXJlU2V0dGluZ3ModGhpcy50YXJnZXRzQmFzZVNldHRpbmdzKVxuICAgICAgICAgICAgICAubWFwKG1ha2VFbnZTcGVjaWZpY1RhcmdldChlbnYpKTtcbiAgICAgICAgICAgIGNvbnN0IHBsYXRmb3JtID0gY29uZmlnW0VOVl9OQU1FX1BSRUZJWCArIGVudl0ucGxhdGZvcm07XG4gICAgICAgICAgICBpZiAoIXBsYXRmb3JtLnN0YXJ0c1dpdGgoJ2VzcHJlc3NpZicpKSB7XG4gICAgICAgICAgICAgIGVudlNldHRpbmdzID0gZW52U2V0dGluZ3MuZmlsdGVyKGFyZ3NEb05vdENvbnRhaW4oJ3VwbG9hZGZzJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCdhdG1lbGF2cicgIT09IHBsYXRmb3JtKSB7XG4gICAgICAgICAgICAgIGVudlNldHRpbmdzID0gZW52U2V0dGluZ3MuZmlsdGVyKGFyZ3NEb05vdENvbnRhaW4oJ3Byb2dyYW0nKSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNldHRpbmdzID0gc2V0dGluZ3MuY29uY2F0KGVudlNldHRpbmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS5hdXRvQ2xvc2VTZXJpYWxNb25pdG9yJykpIHtcbiAgICAgICAgICBzZXR0aW5ncyA9IHNldHRpbmdzLm1hcChhc3NpZ25Ib29rcyk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKHNldHRpbmdzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZnVuY3Rpb24gbWFrZUVudlNwZWNpZmljVGFyZ2V0KGVudikge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGJhc2UpIHtcbiAgICAgICAgY29uc3QgaXRlbSA9IGNsb25lKGJhc2UpO1xuICAgICAgICBpdGVtLm5hbWUgKz0gYCAoZW52OiR7ZW52fSlgO1xuICAgICAgICBpdGVtLmFyZ3MucHVzaCgnLS1lbnZpcm9ubWVudCcpO1xuICAgICAgICBpdGVtLmFyZ3MucHVzaChlbnYpO1xuICAgICAgICBkZWxldGUgaXRlbS5rZXltYXA7XG4gICAgICAgIGRlbGV0ZSBpdGVtLmF0b21Db21tYW5kTmFtZTtcbiAgICAgICAgcmV0dXJuIGl0ZW07XG4gICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFyZ3NEb05vdENvbnRhaW4oYXJnKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICByZXR1cm4gaXRlbS5hcmdzLmluZGV4T2YoYXJnKSA9PT0gLTE7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHByZXBhcmVTZXR0aW5ncyhiYXNlU2V0dGluZ3MpIHtcbiAgICByZXR1cm4gYmFzZVNldHRpbmdzLm1hcChiYXNlID0+IHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBjbG9uZShiYXNlKTtcbiAgICAgIGl0ZW0ubmFtZSA9IHRoaXMudGFyZ2V0TmFtZVByZWZpeCArIGJhc2UubmFtZTtcbiAgICAgIGl0ZW0uZXhlYyA9ICdwbGF0Zm9ybWlvJztcbiAgICAgIGl0ZW0uc2ggPSBmYWxzZTtcbiAgICAgIGl0ZW0uZW52ID0gT2JqZWN0LmNyZWF0ZShwcm9jZXNzLmVudik7XG4gICAgICBpdGVtLmVudi5QTEFURk9STUlPX0ZPUkNFX0NPTE9SID0gJ3RydWUnO1xuICAgICAgaXRlbS5lbnYuUExBVEZPUk1JT19ESVNBQkxFX1BST0dSRVNTQkFSID0gJ3RydWUnO1xuICAgICAgaXRlbS5lbnYuUExBVEZPUk1JT19TRVRUSU5HX0VOQUJMRV9QUk9NUFRTID0gJ2ZhbHNlJztcbiAgICAgIGl0ZW0uZXJyb3JNYXRjaCA9IFtcbiAgICAgICAgJ1xcblxcXFx4MUJcXFxcWzMxbSg/PGZpbGU+c3JjW1xcXFwvMC05YS16QS1aXFxcXC5fXFxcXFxcXFxdKyk6KD88bGluZT5cXFxcZCspOig/PGNvbD5cXFxcZCspJ1xuICAgICAgXTtcbiAgICAgIGl0ZW0uYXRvbUNvbW1hbmROYW1lID0gYHBsYXRmb3JtaW8taWRlOnRhcmdldDoke2Jhc2UubmFtZS50b0xvd2VyQ2FzZSgpfS0ke3RoaXMuY3dkfWA7XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc1ZpZXdDcmVhdGVkQnlTZXJpYWxwb3J0c01vbml0b3JDb21tYW5kKHZpZXcpIHtcbiAgcmV0dXJuIHZpZXcuYXV0b1J1bi5sZW5ndGggPiAwICYmIHZpZXcuYXV0b1J1blswXS5pbmNsdWRlcygnc2VyaWFscG9ydHMgbW9uaXRvcicpO1xufVxuXG5mdW5jdGlvbiBhc3NpZ25Ib29rcyhpdGVtKSB7XG4gIGlmIChpdGVtLmFyZ3MuaW5kZXhPZigndXBsb2FkJykgPT09IC0xICYmXG4gICAgICBpdGVtLmFyZ3MuaW5kZXhPZigncHJvZ3JhbScpID09PSAtMSAmJlxuICAgICAgaXRlbS5hcmdzLmluZGV4T2YoJ3VwbG9hZGZzJykgPT09IC0xKSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cbiAgaXRlbS50ZXJtaW5hbHNUb1Jlc3RvcmUgPSBbXTtcbiAgaXRlbS5wcmVCdWlsZCA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHRlcm1pbmFsVmlld3MgPSBnZXRUZXJtaW5hbFZpZXdzKCk7XG4gICAgaWYgKC0xID09PSB0ZXJtaW5hbFZpZXdzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAoY29uc3QgdmlldyBvZiB0ZXJtaW5hbFZpZXdzKSB7XG4gICAgICBpZiAoaXNWaWV3Q3JlYXRlZEJ5U2VyaWFscG9ydHNNb25pdG9yQ29tbWFuZCh2aWV3KSkge1xuICAgICAgICB0aGlzLnRlcm1pbmFsc1RvUmVzdG9yZS5wdXNoKHZpZXcuYXV0b1J1blswXSk7XG4gICAgICAgIHZpZXcuZGVzdHJveSgpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcbiAgaXRlbS5wb3N0QnVpbGQgPSBmdW5jdGlvbihzdWNjZWRlZCkge1xuICAgIGlmICghc3VjY2VkZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB3aGlsZSAodGhpcy50ZXJtaW5hbHNUb1Jlc3RvcmUubGVuZ3RoID4gMCkge1xuICAgICAgICBvcGVuVGVybWluYWwodGhpcy50ZXJtaW5hbHNUb1Jlc3RvcmUuc3BsaWNlKDAsIDEpWzBdKTtcbiAgICAgIH1cbiAgICB9LCBQT1NUX0JVSUxEX0RFTEFZKTtcbiAgfTtcbiAgcmV0dXJuIGl0ZW07XG59XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/build-provider.js
