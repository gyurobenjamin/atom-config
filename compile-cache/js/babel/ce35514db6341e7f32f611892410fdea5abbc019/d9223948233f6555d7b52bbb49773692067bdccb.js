Object.defineProperty(exports, '__esModule', {
  value: true
});

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

var _atom = require('atom');

var _quickLinks = require('./quick-links');

var _recentProjects = require('./recent-projects');

var _versionsView = require('../versions/view');

var _initCommand = require('../init/command');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _shell = require('shell');

var _shell2 = _interopRequireDefault(_shell);

'use babel';
var HomeView = (function (_BaseView) {
  _inherits(HomeView, _BaseView);

  function HomeView() {
    _classCallCheck(this, _HomeView);

    _get(Object.getPrototypeOf(_HomeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(HomeView, [{
    key: 'initialize',
    value: function initialize(uri) {
      var _this = this;

      this.uri = uri;

      this.subscriptions = new _atom.CompositeDisposable();

      this.checkbox = this.element.querySelector('.show-home-screen-checkbox');
      this.checkbox.onchange = function (e) {
        return atom.config.set('platformio-ide.showHomeScreen', e.target.checked);
      };
      this.subscriptions.add(atom.config.observe('platformio-ide.showHomeScreen', function (value) {
        return _this.checkbox.checked = value;
      }));

      this.versionsView = new _versionsView.VersionsView();
      this.element.querySelector('.versions').appendChild(this.versionsView.getElement());

      this.recentProjectsView = new _recentProjects.RecentProjectsView();
      this.element.querySelector('.recent-projects').appendChild(this.recentProjectsView.getElement());

      this.quickLinksView = new _quickLinks.QuickLinksView();
      this.element.querySelector('.quick-links').appendChild(this.quickLinksView.getElement());

      this.element.querySelector('.btn-pioide-20').onclick = function () {
        if (_semver2['default'].lt(atom.getVersion(), '1.12.2')) {
          atom.confirm({
            message: 'You have outdated version (v' + atom.getVersion() + ') of Atom Text Editor. PlatformIO IDE requires >= 1.12.2',
            buttons: {
              'Upgrade Atom': function UpgradeAtom() {
                return _shell2['default'].openExternal('https://atom.io');
              },
              'Cancel': function Cancel() {}
            }
          });
          return;
        }

        // check GIT
        (0, _utils.runCommand)('git', ['--version'], function (code) {
          if (code !== 0) {
            atom.confirm({
              message: 'You need to have Git installed in a system to try the latest development version of PlatformIO IDE 2.0. Please install it and re-start Atom.',
              buttons: {
                'Install Git': function InstallGit() {
                  return _shell2['default'].openExternal('https://git-scm.com');
                },
                'Cancel': function Cancel() {}
              }
            });
            return;
          }

          var busy = (0, _initCommand.getBusyRegistry)();
          var busyId = 'pio-ide20-installing';
          busy.begin(busyId, 'PlatformIO: Installing PlatformIO IDE 2.0...');
          atom.notifications.addInfo('Switching to PlatformIO IDE 2.0 Preview ...', {
            detail: 'Please be patient and let the installation complete (see status indicator in the bottom corner).',
            dismissable: true
          });

          (0, _utils.runCommand)(atom.packages.getApmPath(), ['install', '--production', 'platformio/platformio-atom-ide'], function (code, stdout, stderr) {
            busy.end(busyId, code === 0);
            if (code === 0) {
              console.debug(stdout);
              atom.confirm({
                message: 'Please re-start PlatformIO IDE to apply new changes',
                buttons: {
                  'Restart': function Restart() {
                    return atom.restartApplication();
                  },
                  'Restart later': function RestartLater() {}
                }
              });
            } else {
              console.error(stderr);
              atom.notifications.addError('Could not install PlatformIO IDE 2.0 Preview', {
                detail: stderr,
                dismissable: true
              });
            }
          });
        });
      };
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'PlatformIO Home';
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'home';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.uri;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.versionsView.destroy();
      this.quickLinksView.destroy();
      _get(Object.getPrototypeOf(_HomeView.prototype), 'destroy', this).call(this);
    }
  }]);

  var _HomeView = HomeView;
  HomeView = (0, _utils.withTemplate)(__dirname)(HomeView) || HomeView;
  return HomeView;
})(_baseView2['default']);

exports.HomeView = HomeView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9ob21lLXNjcmVlbi92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBbUJ5QyxVQUFVOzt3QkFDOUIsY0FBYzs7OztvQkFDRCxNQUFNOzswQkFDWCxlQUFlOzs4QkFDWCxtQkFBbUI7OzRCQUN6QixrQkFBa0I7OzJCQUNiLGlCQUFpQjs7c0JBQzlCLFFBQVE7Ozs7cUJBQ1QsT0FBTzs7OztBQTNCekIsV0FBVyxDQUFDO0lBOEJDLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7Ozs7OztlQUFSLFFBQVE7O1dBRVQsb0JBQUMsR0FBRyxFQUFFOzs7QUFDZCxVQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFZixVQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDOztBQUUvQyxVQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDekUsVUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEdBQUcsVUFBQSxDQUFDO2VBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7T0FBQSxDQUFDO0FBQ2pHLFVBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUN4QywrQkFBK0IsRUFDL0IsVUFBQSxLQUFLO2VBQUksTUFBSyxRQUFRLENBQUMsT0FBTyxHQUFHLEtBQUs7T0FBQSxDQUN2QyxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFlBQVksR0FBRyxnQ0FBa0IsQ0FBQztBQUN2QyxVQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxD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O0tBQ0g7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxpQkFBaUIsQ0FBQztLQUMxQjs7O1dBRVUsdUJBQUc7QUFDWixhQUFPLE1BQU0sQ0FBQztLQUNmOzs7V0FFSyxrQkFBRztBQUNQLGFBQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztLQUNqQjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzdCLFVBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDNUIsVUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM5QixtRkFBZ0I7S0FDakI7OztrQkF2R1UsUUFBUTtBQUFSLFVBQVEsR0FEcEIseUJBQWEsU0FBUyxDQUFDLENBQ1gsUUFBUSxLQUFSLFFBQVE7U0FBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9ob21lLXNjcmVlbi92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCB7IHJ1bkNvbW1hbmQsIHdpdGhUZW1wbGF0ZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBCYXNlVmlldyBmcm9tICcuLi9iYXNlLXZpZXcnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7UXVpY2tMaW5rc1ZpZXd9IGZyb20gJy4vcXVpY2stbGlua3MnO1xuaW1wb3J0IHtSZWNlbnRQcm9qZWN0c1ZpZXd9IGZyb20gJy4vcmVjZW50LXByb2plY3RzJztcbmltcG9ydCB7VmVyc2lvbnNWaWV3fSBmcm9tICcuLi92ZXJzaW9ucy92aWV3JztcbmltcG9ydCB7IGdldEJ1c3lSZWdpc3RyeSB9IGZyb20gJy4uL2luaXQvY29tbWFuZCc7XG5pbXBvcnQgc2VtdmVyIGZyb20gJ3NlbXZlcic7XG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGwnO1xuXG5Ad2l0aFRlbXBsYXRlKF9fZGlybmFtZSlcbmV4cG9ydCBjbGFzcyBIb21lVmlldyBleHRlbmRzIEJhc2VWaWV3IHtcblxuICBpbml0aWFsaXplKHVyaSkge1xuICAgIHRoaXMudXJpID0gdXJpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAgIHRoaXMuY2hlY2tib3ggPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNob3ctaG9tZS1zY3JlZW4tY2hlY2tib3gnKTtcbiAgICB0aGlzLmNoZWNrYm94Lm9uY2hhbmdlID0gZSA9PiBhdG9tLmNvbmZpZy5zZXQoJ3BsYXRmb3JtaW8taWRlLnNob3dIb21lU2NyZWVuJywgZS50YXJnZXQuY2hlY2tlZCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKFxuICAgICAgJ3BsYXRmb3JtaW8taWRlLnNob3dIb21lU2NyZWVuJyxcbiAgICAgIHZhbHVlID0+IHRoaXMuY2hlY2tib3guY2hlY2tlZCA9IHZhbHVlXG4gICAgKSk7XG5cbiAgICB0aGlzLnZlcnNpb25zVmlldyA9IG5ldyBWZXJzaW9uc1ZpZXcoKTtcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnZlcnNpb25zJykuYXBwZW5kQ2hpbGQodGhpcy52ZXJzaW9uc1ZpZXcuZ2V0RWxlbWVudCgpKTtcblxuICAgIHRoaXMucmVjZW50UHJvamVjdHNWaWV3ID0gbmV3IFJlY2VudFByb2plY3RzVmlldygpO1xuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucmVjZW50LXByb2plY3RzJykuYXBwZW5kQ2hpbGQodGhpcy5yZWNlbnRQcm9qZWN0c1ZpZXcuZ2V0RWxlbWVudCgpKTtcblxuICAgIHRoaXMucXVpY2tMaW5rc1ZpZXcgPSBuZXcgUXVpY2tMaW5rc1ZpZXcoKTtcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnF1aWNrLWxpbmtzJykuYXBwZW5kQ2hpbGQodGhpcy5xdWlja0xpbmtzVmlldy5nZXRFbGVtZW50KCkpO1xuXG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tcGlvaWRlLTIwJykub25jbGljayA9ICgpID0+IHtcbiAgICAgIGlmIChzZW12ZXIubHQoYXRvbS5nZXRWZXJzaW9uKCksICcxLjEyLjInKSkge1xuICAgICAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgICAgIG1lc3NhZ2U6IGBZb3UgaGF2ZSBvdXRkYXRlZCB2ZXJzaW9uICh2JHthdG9tLmdldFZlcnNpb24oKX0pIG9mIEF0b20gVGV4dCBFZGl0b3IuIFBsYXRmb3JtSU8gSURFIHJlcXVpcmVzID49IDEuMTIuMmAsXG4gICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgJ1VwZ3JhZGUgQXRvbSc6ICgpID0+IHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly9hdG9tLmlvJyksXG4gICAgICAgICAgICAnQ2FuY2VsJzogKCkgPT4ge31cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIC8vIGNoZWNrIEdJVFxuICAgICAgcnVuQ29tbWFuZCgnZ2l0JywgWyctLXZlcnNpb24nXSwgKGNvZGUpID0+IHtcbiAgICAgICAgaWYgKGNvZGUgIT09IDApIHtcbiAgICAgICAgICBhdG9tLmNvbmZpcm0oe1xuICAgICAgICAgICAgbWVzc2FnZTogJ1lvdSBuZWVkIHRvIGhhdmUgR2l0IGluc3RhbGxlZCBpbiBhIHN5c3RlbSB0byB0cnkgdGhlIGxhdGVzdCBkZXZlbG9wbWVudCB2ZXJzaW9uIG9mIFBsYXRmb3JtSU8gSURFIDIuMC4gUGxlYXNlIGluc3RhbGwgaXQgYW5kIHJlLXN0YXJ0IEF0b20uJyxcbiAgICAgICAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgICAgICAgJ0luc3RhbGwgR2l0JzogKCkgPT4gc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2dpdC1zY20uY29tJyksXG4gICAgICAgICAgICAgICdDYW5jZWwnOiAoKSA9PiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGJ1c3kgPSBnZXRCdXN5UmVnaXN0cnkoKTtcbiAgICAgICAgY29uc3QgYnVzeUlkID0gJ3Bpby1pZGUyMC1pbnN0YWxsaW5nJztcbiAgICAgICAgYnVzeS5iZWdpbihidXN5SWQsICdQbGF0Zm9ybUlPOiBJbnN0YWxsaW5nIFBsYXRmb3JtSU8gSURFIDIuMC4uLicpO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnU3dpdGNoaW5nIHRvIFBsYXRmb3JtSU8gSURFIDIuMCBQcmV2aWV3IC4uLicsIHtcbiAgICAgICAgICBkZXRhaWw6ICdQbGVhc2UgYmUgcGF0aWVudCBhbmQgbGV0IHRoZSBpbnN0YWxsYXRpb24gY29tcGxldGUgKHNlZSBzdGF0dXMgaW5kaWNhdG9yIGluIHRoZSBib3R0b20gY29ybmVyKS4nLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJ1bkNvbW1hbmQoXG4gICAgICAgICAgYXRvbS5wYWNrYWdlcy5nZXRBcG1QYXRoKCksXG4gICAgICAgICAgWydpbnN0YWxsJywgJy0tcHJvZHVjdGlvbicsICdwbGF0Zm9ybWlvL3BsYXRmb3JtaW8tYXRvbS1pZGUnXSxcbiAgICAgICAgICAoY29kZSwgc3Rkb3V0LCBzdGRlcnIpID0+IHtcbiAgICAgICAgICAgIGJ1c3kuZW5kKGJ1c3lJZCwgY29kZSA9PT0gMCk7XG4gICAgICAgICAgICBpZiAoY29kZSA9PT0gMCkge1xuICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKHN0ZG91dCk7XG4gICAgICAgICAgICAgIGF0b20uY29uZmlybSh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ1BsZWFzZSByZS1zdGFydCBQbGF0Zm9ybUlPIElERSB0byBhcHBseSBuZXcgY2hhbmdlcycsXG4gICAgICAgICAgICAgICAgYnV0dG9uczoge1xuICAgICAgICAgICAgICAgICAgJ1Jlc3RhcnQnOiAoKSA9PiBhdG9tLnJlc3RhcnRBcHBsaWNhdGlvbigpLFxuICAgICAgICAgICAgICAgICAgJ1Jlc3RhcnQgbGF0ZXInOiAoKSA9PiB7fVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihzdGRlcnIpO1xuICAgICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0NvdWxkIG5vdCBpbnN0YWxsIFBsYXRmb3JtSU8gSURFIDIuMCBQcmV2aWV3Jywge1xuICAgICAgICAgICAgICAgIGRldGFpbDogc3RkZXJyLFxuICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgKTtcblxuICAgICAgfSk7XG5cbiAgICB9O1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuICdQbGF0Zm9ybUlPIEhvbWUnO1xuICB9XG5cbiAgZ2V0SWNvbk5hbWUoKSB7XG4gICAgcmV0dXJuICdob21lJztcbiAgfVxuXG4gIGdldFVSSSgpIHtcbiAgICByZXR1cm4gdGhpcy51cmk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgdGhpcy52ZXJzaW9uc1ZpZXcuZGVzdHJveSgpO1xuICAgIHRoaXMucXVpY2tMaW5rc1ZpZXcuZGVzdHJveSgpO1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxufVxuIl19
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/home-screen/view.js
