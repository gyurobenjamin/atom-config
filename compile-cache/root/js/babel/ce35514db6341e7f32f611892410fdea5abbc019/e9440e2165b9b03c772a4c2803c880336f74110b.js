Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var _utils = require('../utils');

var _baseView = require('../base-view');

var _baseView2 = _interopRequireDefault(_baseView);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

'use babel';
var VersionsView = (function (_BaseView) {
  _inherits(VersionsView, _BaseView);

  function VersionsView() {
    _classCallCheck(this, _VersionsView);

    _get(Object.getPrototypeOf(_VersionsView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(VersionsView, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.wrapper = this.element.querySelector('.version-wrapper');
      this.copy = this.element.querySelector('.version-copy');

      this.copy.onclick = function () {
        var versions = _this.wrapper.textContent.trim().replace(/\s+/g, ' ');
        atom.clipboard.write(versions);
      };
      this.copyTooltip = atom.tooltips.add(this.copy, { title: 'Copy versions' });

      Promise.all([this.retrieveIDEVersion(), this.retrieveCLIVersion()]).then(this.checkPlatformIOVersion.bind(this));
    }
  }, {
    key: 'retrieveIDEVersion',
    value: function retrieveIDEVersion() {
      var version = (0, _utils.getIDEVersion)();
      this.setVersion(version, '.ide-version');
      return version;
    }
  }, {
    key: 'retrieveCLIVersion',
    value: function retrieveCLIVersion() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        var onError = function onError() {
          _this2.setVersion('Failed to retrieve', '.cli-version');
          reject();
        };
        var stdout = '';
        var result = _child_process2['default'].spawn('platformio', ['--version']);
        result.on('error', onError);
        result.stdout.on('data', function (chunk) {
          return stdout += chunk;
        });
        result.on('close', function (code) {
          if (0 !== code) {
            onError();
          } else {
            var version = stdout.trim().match(/[\d+\.]+.*$/)[0];
            _this2.setVersion(version, '.cli-version');
            resolve(version);
          }
        });
      });
    }
  }, {
    key: 'checkPlatformIOVersion',
    value: function checkPlatformIOVersion(_ref) {
      var _this3 = this;

      var _ref2 = _slicedToArray(_ref, 2);

      var ideVersion = _ref2[0];
      var cliVersion = _ref2[1];

      var options = {
        url: 'https://pypi.python.org/pypi/platformio/json',
        headers: {
          'User-Agent': 'PlatformIOIDE/' + ideVersion
        }
      };

      (0, _request2['default'])(options, function (err, response, body) {
        if (err) {
          console.warn(err);
        } else if (response.statusCode != 200) {
          console.warn('PyPI returned HTTP status code ' + response.statusCode);
        } else {
          (function () {
            var latestVersion = JSON.parse(body).info.version;
            var stdout = '';
            var args = ['-c', 'from pkg_resources import parse_version; print parse_version(\'' + cliVersion + '\') < parse_version(\'' + latestVersion + '\')'];
            var child = _child_process2['default'].spawn((0, _utils.getPythonExecutable)(), args);
            child.on('error', onError);
            child.stdout.on('data', function (chunk) {
              return stdout += chunk;
            });
            child.on('close', function (code) {
              if (0 !== code) {
                onError();
              } else if (stdout.startsWith('True')) {
                var wrapper = _this3.element.querySelector('.upgrade-wrapper');
                wrapper.querySelector('.new-version').textContent = latestVersion;
                wrapper.querySelector('.do-upgrade').onclick = function () {
                  (0, _utils.runAtomCommand)('platformio-ide:maintenance.upgrade-platformio');
                };
                wrapper.style.display = 'block';
              }
            });
          })();
        }

        function onError() {
          console.warn('Failed to determine if upgrade is available');
        }
      });
    }
  }, {
    key: 'setVersion',
    value: function setVersion(string, parentClass) {
      var element = this.element.querySelector(parentClass + ' .version-string');
      element.textContent = string;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.copyTooltip.dispose();
      _get(Object.getPrototypeOf(_VersionsView.prototype), 'destroy', this).call(this);
    }
  }]);

  var _VersionsView = VersionsView;
  VersionsView = (0, _utils.withTemplate)(__dirname)(VersionsView) || VersionsView;
  return VersionsView;
})(_baseView2['default']);

exports.VersionsView = VersionsView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi92ZXJzaW9ucy92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQitFLFVBQVU7O3dCQUNwRSxjQUFjOzs7OzZCQUNULGVBQWU7Ozs7dUJBQ3JCLFNBQVM7Ozs7QUF0QjdCLFdBQVcsQ0FBQztJQXlCQyxZQUFZO1lBQVosWUFBWTs7V0FBWixZQUFZOzs7Ozs7ZUFBWixZQUFZOztXQUViLHNCQUFHOzs7QUFDWCxVQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDOUQsVUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFeEQsVUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBTTtBQUN4QixZQUFNLFFBQVEsR0FBRyxNQUFLLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN0RSxZQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNoQyxDQUFDO0FBQ0YsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7O0FBRTFFLGFBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsa0JBQWtCLEVBQUUsRUFBRSxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxDQUFDLENBQ2hFLElBQUksQ0FBRyxJQUFJLENBQUMsc0JBQXNCLE1BQTNCLElBQUksRUFBd0IsQ0FBQztLQUN4Qzs7O1dB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QUFFO0FBQ3BDLG9CQUFNLE9BQU8sR0FBRyxPQUFLLE9BQU8sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUMvRCx1QkFBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDO0FBQ2xFLHVCQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDLE9BQU8sR0FBRyxZQUFXO0FBQ3hELDZDQUFlLCtDQUErQyxDQUFDLENBQUM7aUJBQ2pFLENBQUM7QUFDRix1QkFBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO2VBQ2pDO2FBQ0YsQ0FBQyxDQUFDOztTQUNKOztBQUVELGlCQUFTLE9BQU8sR0FBRztBQUNqQixpQkFBTyxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO1NBQzdEO09BQ0YsQ0FBQyxDQUFDO0tBQ0o7OztXQUVTLG9CQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUU7QUFDOUIsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFFLGtCQUFrQixDQUFDLENBQUM7QUFDNUUsYUFBTyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUM7S0FDOUI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUMzQix1RkFBZ0I7S0FDakI7OztzQkE1RlUsWUFBWTtBQUFaLGNBQVksR0FEeEIseUJBQWEsU0FBUyxDQUFDLENBQ1gsWUFBWSxLQUFaLFlBQVk7U0FBWixZQUFZIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi92ZXJzaW9ucy92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCB7Z2V0SURFVmVyc2lvbiwgZ2V0UHl0aG9uRXhlY3V0YWJsZSwgcnVuQXRvbUNvbW1hbmQsIHdpdGhUZW1wbGF0ZX0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEJhc2VWaWV3IGZyb20gJy4uL2Jhc2Utdmlldyc7XG5pbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCByZXF1ZXN0IGZyb20gJ3JlcXVlc3QnO1xuXG5Ad2l0aFRlbXBsYXRlKF9fZGlybmFtZSlcbmV4cG9ydCBjbGFzcyBWZXJzaW9uc1ZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLndyYXBwZXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnZlcnNpb24td3JhcHBlcicpO1xuICAgIHRoaXMuY29weSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudmVyc2lvbi1jb3B5Jyk7XG5cbiAgICB0aGlzLmNvcHkub25jbGljayA9ICgpID0+IHtcbiAgICAgIGNvbnN0IHZlcnNpb25zID0gdGhpcy53cmFwcGVyLnRleHRDb250ZW50LnRyaW0oKS5yZXBsYWNlKC9cXHMrL2csICcgJyk7XG4gICAgICBhdG9tLmNsaXBib2FyZC53cml0ZSh2ZXJzaW9ucyk7XG4gICAgfTtcbiAgICB0aGlzLmNvcHlUb29sdGlwID0gYXRvbS50b29sdGlwcy5hZGQodGhpcy5jb3B5LCB7dGl0bGU6ICdDb3B5IHZlcnNpb25zJ30pO1xuXG4gICAgUHJvbWlzZS5hbGwoW3RoaXMucmV0cmlldmVJREVWZXJzaW9uKCksIHRoaXMucmV0cmlldmVDTElWZXJzaW9uKCldKVxuICAgICAgLnRoZW4oOjp0aGlzLmNoZWNrUGxhdGZvcm1JT1ZlcnNpb24pO1xuICB9XG5cbiAgcmV0cmlldmVJREVWZXJzaW9uKCkge1xuICAgIGNvbnN0IHZlcnNpb24gPSBnZXRJREVWZXJzaW9uKCk7XG4gICAgdGhpcy5zZXRWZXJzaW9uKHZlcnNpb24sICcuaWRlLXZlcnNpb24nKTtcbiAgICByZXR1cm4gdmVyc2lvbjtcbiAgfVxuXG4gIHJldHJpZXZlQ0xJVmVyc2lvbigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgY29uc3Qgb25FcnJvciA9ICgpID0+IHtcbiAgICAgICAgdGhpcy5zZXRWZXJzaW9uKCdGYWlsZWQgdG8gcmV0cmlldmUnLCAnLmNsaS12ZXJzaW9uJyk7XG4gICAgICAgIHJlamVjdCgpO1xuICAgICAgfTtcbiAgICAgIGxldCBzdGRvdXQgPSAnJztcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oJ3BsYXRmb3JtaW8nLCBbJy0tdmVyc2lvbiddKTtcbiAgICAgIHJlc3VsdC5vbignZXJyb3InLCBvbkVycm9yKTtcbiAgICAgIHJlc3VsdC5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bmspID0+IHN0ZG91dCArPSBjaHVuayk7XG4gICAgICByZXN1bHQub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcbiAgICAgICAgaWYgKDAgIT09IGNvZGUpIHtcbiAgICAgICAgICBvbkVycm9yKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3QgdmVyc2lvbiA9IHN0ZG91dC50cmltKCkubWF0Y2goL1tcXGQrXFwuXSsuKiQvKVswXTtcbiAgICAgICAgICB0aGlzLnNldFZlcnNpb24odmVyc2lvbiwgJy5jbGktdmVyc2lvbicpO1xuICAgICAgICAgIHJlc29sdmUodmVyc2lvbik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY2hlY2tQbGF0Zm9ybUlPVmVyc2lvbihbaWRlVmVyc2lvbiwgY2xpVmVyc2lvbl0pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgdXJsOiAnaHR0cHM6Ly9weXBpLnB5dGhvbi5vcmcvcHlwaS9wbGF0Zm9ybWlvL2pzb24nLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnVXNlci1BZ2VudCc6IGBQbGF0Zm9ybUlPSURFLyR7aWRlVmVyc2lvbn1gXG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlcXVlc3Qob3B0aW9ucywgKGVyciwgcmVzcG9uc2UsIGJvZHkpID0+IHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgY29uc29sZS53YXJuKGVycik7XG4gICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT0gMjAwKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgUHlQSSByZXR1cm5lZCBIVFRQIHN0YXR1cyBjb2RlICR7cmVzcG9uc2Uuc3RhdHVzQ29kZX1gKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGxhdGVzdFZlcnNpb24gPSBKU09OLnBhcnNlKGJvZHkpLmluZm8udmVyc2lvbjtcbiAgICAgICAgbGV0IHN0ZG91dCA9ICcnO1xuICAgICAgICBjb25zdCBhcmdzID0gWyctYycsIGBmcm9tIHBrZ19yZXNvdXJjZXMgaW1wb3J0IHBhcnNlX3ZlcnNpb247IHByaW50IHBhcnNlX3ZlcnNpb24oJyR7Y2xpVmVyc2lvbn0nKSA8IHBhcnNlX3ZlcnNpb24oJyR7bGF0ZXN0VmVyc2lvbn0nKWBdO1xuICAgICAgICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oZ2V0UHl0aG9uRXhlY3V0YWJsZSgpLCBhcmdzKTtcbiAgICAgICAgY2hpbGQub24oJ2Vycm9yJywgb25FcnJvcik7XG4gICAgICAgIGNoaWxkLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT4gc3Rkb3V0ICs9IGNodW5rKTtcbiAgICAgICAgY2hpbGQub24oJ2Nsb3NlJywgKGNvZGUpID0+IHtcbiAgICAgICAgICBpZiAoMCAhPT0gY29kZSkge1xuICAgICAgICAgICAgb25FcnJvcigpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3Rkb3V0LnN0YXJ0c1dpdGgoJ1RydWUnKSkge1xuICAgICAgICAgICAgY29uc3Qgd3JhcHBlciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudXBncmFkZS13cmFwcGVyJyk7XG4gICAgICAgICAgICB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5uZXctdmVyc2lvbicpLnRleHRDb250ZW50ID0gbGF0ZXN0VmVyc2lvbjtcbiAgICAgICAgICAgIHdyYXBwZXIucXVlcnlTZWxlY3RvcignLmRvLXVwZ3JhZGUnKS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJ1bkF0b21Db21tYW5kKCdwbGF0Zm9ybWlvLWlkZTptYWludGVuYW5jZS51cGdyYWRlLXBsYXRmb3JtaW8nKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB3cmFwcGVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG9uRXJyb3IoKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignRmFpbGVkIHRvIGRldGVybWluZSBpZiB1cGdyYWRlIGlzIGF2YWlsYWJsZScpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgc2V0VmVyc2lvbihzdHJpbmcsIHBhcmVudENsYXNzKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKHBhcmVudENsYXNzICsnIC52ZXJzaW9uLXN0cmluZycpO1xuICAgIGVsZW1lbnQudGV4dENvbnRlbnQgPSBzdHJpbmc7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY29weVRvb2x0aXAuZGlzcG9zZSgpO1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxufVxuIl19