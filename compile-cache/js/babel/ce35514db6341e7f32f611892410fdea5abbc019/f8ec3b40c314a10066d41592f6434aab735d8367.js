Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';exports['default'] = {
  useBuiltinPlatformIO: {
    title: 'Use built-in PlatformIO Core',
    description: 'This package contains the latest stable PlatformIO Core tool ' + 'which is used by default. Uncheck this option to use own ' + 'version of installed PlatformIO Core (it should be located in the ' + 'system `PATH`).',
    type: 'boolean',
    'default': true,
    order: 40
  },
  useDevelopPlatformIO: {
    title: 'Use development version of PlatformIO Core',
    description: 'This option is valid if "Use built-in PlatformIO Core" enabled. ' + 'To upgrade to the latest development version please use ' + '`Menu: PlatformIO > Upgrade PlatformIO Core`.',
    type: 'boolean',
    'default': false,
    order: 50
  },
  customPATH: {
    title: 'Environment PATH to run `platformio`',
    description: 'Paste here the result of `echo $PATH` (Unix) / `echo %PATH%` ' + '(Windows) command by typing into your system terminal',
    type: 'string',
    'default': '',
    order: 100
  },
  showHomeScreen: {
    title: 'Show PlatformIO Home screen on startup',
    type: 'boolean',
    'default': true,
    order: 0
  },
  highlightActiveProject: {
    title: 'Highlight active project',
    type: 'boolean',
    'default': true,
    order: 10
  },
  autoCloseSerialMonitor: {
    title: 'Automatically close Serial Port Monitor before uploading',
    description: '',
    type: 'boolean',
    'default': true,
    order: 20
  },
  autoRebuildAutocompleteIndex: {
    title: 'Automatically rebuild C/C++ Project Index',
    description: 'Rebuild C/C++ Project Index (Autocomplete, Linter) when new ' + 'libraries are added or `platformio.ini` is modified',
    type: 'boolean',
    'default': true,
    order: 30
  },
  showPlatformIOFiles: {
    title: 'Show PlatformIO service files',
    description: 'Do not hide in `Tree View` PlatformIO service files and ' + 'directories (`.pioenvs`, `.piolibdeps`, other configuration files)',
    type: 'boolean',
    'default': false,
    order: 60
  }
};
var IS_WINDOWS = Boolean(_os2['default'].platform().indexOf('win32') > -1);
exports.IS_WINDOWS = IS_WINDOWS;
var BASE_DIR = _path2['default'].resolve(_path2['default'].dirname(__filename), '..');
exports.BASE_DIR = BASE_DIR;
var ENV_DIR = _get_env_dir(_path2['default'].join(BASE_DIR, 'penv'));
exports.ENV_DIR = ENV_DIR;
var ENV_BIN_DIR = _path2['default'].join(ENV_DIR, IS_WINDOWS ? 'Scripts' : 'bin');
exports.ENV_BIN_DIR = ENV_BIN_DIR;
var CACHE_DIR = _path2['default'].join(BASE_DIR, '.cache');
exports.CACHE_DIR = CACHE_DIR;
var DEPENDENCIES = {
  'build': '>=0.56.0',
  'busy': '>=0.1.0',
  'autocomplete-clang': '>=0.8.9',
  'linter': '>=1.11.3',
  'linter-gcc': '>=0.6.5',
  'platformio-ide-terminal': '>=2.0.9',
  'language-ini': '>=1.14.0',
  'tool-bar': '>=0.2.0',
  'file-icons': '>=1.7',
  'minimap': '>=4'
};
exports.DEPENDENCIES = DEPENDENCIES;
var STALE_DEPENDENCIES = ['linter-clang', 'ult-terminal'];
exports.STALE_DEPENDENCIES = STALE_DEPENDENCIES;
var DEFAULT_PIO_ARGS = ['-f', '-c', 'atom'];
exports.DEFAULT_PIO_ARGS = DEFAULT_PIO_ARGS;
var POST_BUILD_DELAY = 1000;exports.POST_BUILD_DELAY = POST_BUILD_DELAY;
// ms, dalay before serial monitor restore
var AUTO_REBUILD_DELAY = 3000;exports.AUTO_REBUILD_DELAY = AUTO_REBUILD_DELAY;
// ms

var NO_ELIGIBLE_PROJECTS_FOUND = '<$NO_ELIGIBLE_PROJECTS_FOUND$>';

exports.NO_ELIGIBLE_PROJECTS_FOUND = NO_ELIGIBLE_PROJECTS_FOUND;
function _get_env_dir(defaultEnvDir) {
  if (IS_WINDOWS) {
    // Put the env directory to the root of the current local disk when
    // default path contains non-ASCII characters. Virtualenv will fail to
    for (var char of defaultEnvDir) {
      if (char.charCodeAt(0) > 127) {
        var defaultEnvDirFormat = _path2['default'].parse(defaultEnvDir);
        return _path2['default'].format({
          root: defaultEnvDirFormat.root,
          dir: defaultEnvDirFormat.root,
          base: '.pioidepenv',
          name: '.pioidepenv'
        });
      }
    }
  }

  return defaultEnvDir;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7a0JBbUJlLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztBQXBCdkIsV0FBVyxDQUFDLHFCQXNCRztBQUNiLHNCQUFvQixFQUFFO0FBQ3BCLFNBQUssRUFBRSw4QkFBOEI7QUFDckMsZUFBVyxFQUFFLCtEQUErRCxHQUMvRCwyREFBMkQsR0FDM0Qsb0VBQW9FLEdBQ3BFLGlCQUFpQjtBQUM5QixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxzQkFBb0IsRUFBRTtBQUNwQixTQUFLLEVBQUUsNENBQTRDO0FBQ25ELGVBQVcsRUFBRSxrRUFBa0UsR0FDbEUsMERBQTBELEdBQzFELCtDQUErQztBQUM1RCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsc0NBQXNDO0FBQzdDLGVBQVcsRUFBRSwrREFBK0QsR0FDL0QsdURBQXVEO0FBQ3BFLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxFQUFFO0FBQ1gsU0FBSyxFQUFFLEdBQUc7R0FDWDtBQUNELGdCQUFjLEVBQUU7QUFDZCxTQUFLLEVBQUUsd0NBQXdDO0FBQy9DLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELHdCQUFzQixFQUFFO0FBQ3RCLFNBQUssRUFBRSwwQkFBMEI7QUFDakMsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0Qsd0JBQXNCLEVBQUU7QUFDdEIsU0FBSyxFQUFFLDBEQUEwRDtBQUNqRSxlQUFXLEVBQUUsRUFBRTtBQUNmLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLEVBQUU7R0FDVjtBQUNELDhCQUE0QixFQUFFO0FBQzVCLFNBQUssRUFBRSwyQ0FBMkM7QUFDbEQsZUFBVyxFQUFFLDhEQUE4RCxHQUM5RCxxREFBcUQ7QUFDbEUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0QscUJBQW1CLEVBQUU7QUFDbkIsU0FBSyxFQUFFLCtCQUErQjtBQUN0QyxlQUFXLEVBQUUsMERBQTBELEdBQzFELG9FQUFvRTtBQUNqRixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxFQUFFO0dBQ1Y7Q0FDRjtBQUVNLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQyxnQkFBRyxRQUFRLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7QUFDaEUsSUFBTSxRQUFRLEdBQUcsa0JBQUssT0FBTyxDQUFDLGtCQUFLLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzs7QUFDOUQsSUFBTSxPQUFPLEdBQUcsWUFBWSxDQUFDLGtCQUFLLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQzs7QUFDMUQsSUFBTSxXQUFXLEdBQUcsa0JBQUssSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQyxDQUFDOztBQUN2RSxJQUFNLFNBQVMsR0FBRyxrQkFBSyxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztBQUNoRCxJQUFNLFlBQVksR0FBRztBQUMxQixTQUFPLEVBQUUsVUFBVTtBQUNuQixRQUFNLEVBQUUsU0FBUztBQUNqQixzQkFBb0IsRUFBRSxTQUFTO0FBQy9CLFVBQVEsRUFBRSxVQUFVO0FBQ3BCLGNBQVksRUFBRSxTQUFTO0FBQ3ZCLDJCQUF5QixFQUFFLFNBQVM7QUFDcEMsZ0JBQWMsRUFBRSxVQUFVO0FBQzFCLFlBQVUsRUFBRSxTQUFTO0FBQ3JCLGNBQVksRUFBRSxPQUFPO0FBQ3JCLFdBQVMsRUFBRSxLQUFLO0NBQ2pCLENBQUM7O0FBQ0ssSUFBTSxrQkFBa0IsR0FBRyxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQzs7QUFDNUQsSUFBTSxnQkFBZ0IsR0FBRyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7O0FBQzlDLElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDOztBQUM5QixJQUFNLGtCQUFrQixHQUFHLElBQUksQ0FBQzs7O0FBRWhDLElBQU0sMEJBQTBCLEdBQUcsZ0NBQWdDLENBQUM7OztBQUczRSxTQUFTLFlBQVksQ0FBQyxhQUFhLEVBQUU7QUFDbkMsTUFBSSxVQUFVLEVBQUU7OztBQUdkLFNBQUssSUFBTSxJQUFJLElBQUksYUFBYSxFQUFFO0FBQ2hDLFVBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUU7QUFDNUIsWUFBTSxtQkFBbUIsR0FBRyxrQkFBSyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEQsZUFBTyxrQkFBSyxNQUFNLENBQUM7QUFDakIsY0FBSSxFQUFFLG1CQUFtQixDQUFDLElBQUk7QUFDOUIsYUFBRyxFQUFFLG1CQUFtQixDQUFDLElBQUk7QUFDN0IsY0FBSSxFQUFFLGFBQWE7QUFDbkIsY0FBSSxFQUFFLGFBQWE7U0FDcEIsQ0FBQyxDQUFDO09BQ0o7S0FDRjtHQUNGOztBQUVELFNBQU8sYUFBYSxDQUFDO0NBQ3RCIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9jb25maWcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHVzZUJ1aWx0aW5QbGF0Zm9ybUlPOiB7XG4gICAgdGl0bGU6ICdVc2UgYnVpbHQtaW4gUGxhdGZvcm1JTyBDb3JlJyxcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgcGFja2FnZSBjb250YWlucyB0aGUgbGF0ZXN0IHN0YWJsZSBQbGF0Zm9ybUlPIENvcmUgdG9vbCAnICtcbiAgICAgICAgICAgICAgICAgJ3doaWNoIGlzIHVzZWQgYnkgZGVmYXVsdC4gVW5jaGVjayB0aGlzIG9wdGlvbiB0byB1c2Ugb3duICcgK1xuICAgICAgICAgICAgICAgICAndmVyc2lvbiBvZiBpbnN0YWxsZWQgUGxhdGZvcm1JTyBDb3JlIChpdCBzaG91bGQgYmUgbG9jYXRlZCBpbiB0aGUgJyArXG4gICAgICAgICAgICAgICAgICdzeXN0ZW0gYFBBVEhgKS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA0MFxuICB9LFxuICB1c2VEZXZlbG9wUGxhdGZvcm1JTzoge1xuICAgIHRpdGxlOiAnVXNlIGRldmVsb3BtZW50IHZlcnNpb24gb2YgUGxhdGZvcm1JTyBDb3JlJyxcbiAgICBkZXNjcmlwdGlvbjogJ1RoaXMgb3B0aW9uIGlzIHZhbGlkIGlmIFwiVXNlIGJ1aWx0LWluIFBsYXRmb3JtSU8gQ29yZVwiIGVuYWJsZWQuICcgK1xuICAgICAgICAgICAgICAgICAnVG8gdXBncmFkZSB0byB0aGUgbGF0ZXN0IGRldmVsb3BtZW50IHZlcnNpb24gcGxlYXNlIHVzZSAnICtcbiAgICAgICAgICAgICAgICAgJ2BNZW51OiBQbGF0Zm9ybUlPID4gVXBncmFkZSBQbGF0Zm9ybUlPIENvcmVgLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiA1MFxuICB9LFxuICBjdXN0b21QQVRIOiB7XG4gICAgdGl0bGU6ICdFbnZpcm9ubWVudCBQQVRIIHRvIHJ1biBgcGxhdGZvcm1pb2AnLFxuICAgIGRlc2NyaXB0aW9uOiAnUGFzdGUgaGVyZSB0aGUgcmVzdWx0IG9mIGBlY2hvICRQQVRIYCAoVW5peCkgLyBgZWNobyAlUEFUSCVgICcgK1xuICAgICAgICAgICAgICAgICAnKFdpbmRvd3MpIGNvbW1hbmQgYnkgdHlwaW5nIGludG8geW91ciBzeXN0ZW0gdGVybWluYWwnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICcnLFxuICAgIG9yZGVyOiAxMDBcbiAgfSxcbiAgc2hvd0hvbWVTY3JlZW46IHtcbiAgICB0aXRsZTogJ1Nob3cgUGxhdGZvcm1JTyBIb21lIHNjcmVlbiBvbiBzdGFydHVwJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogMFxuICB9LFxuICBoaWdobGlnaHRBY3RpdmVQcm9qZWN0OiB7XG4gICAgdGl0bGU6ICdIaWdobGlnaHQgYWN0aXZlIHByb2plY3QnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAxMFxuICB9LFxuICBhdXRvQ2xvc2VTZXJpYWxNb25pdG9yOiB7XG4gICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IGNsb3NlIFNlcmlhbCBQb3J0IE1vbml0b3IgYmVmb3JlIHVwbG9hZGluZycsXG4gICAgZGVzY3JpcHRpb246ICcnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAyMFxuICB9LFxuICBhdXRvUmVidWlsZEF1dG9jb21wbGV0ZUluZGV4OiB7XG4gICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IHJlYnVpbGQgQy9DKysgUHJvamVjdCBJbmRleCcsXG4gICAgZGVzY3JpcHRpb246ICdSZWJ1aWxkIEMvQysrIFByb2plY3QgSW5kZXggKEF1dG9jb21wbGV0ZSwgTGludGVyKSB3aGVuIG5ldyAnICtcbiAgICAgICAgICAgICAgICAgJ2xpYnJhcmllcyBhcmUgYWRkZWQgb3IgYHBsYXRmb3JtaW8uaW5pYCBpcyBtb2RpZmllZCcsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDMwXG4gIH0sXG4gIHNob3dQbGF0Zm9ybUlPRmlsZXM6IHtcbiAgICB0aXRsZTogJ1Nob3cgUGxhdGZvcm1JTyBzZXJ2aWNlIGZpbGVzJyxcbiAgICBkZXNjcmlwdGlvbjogJ0RvIG5vdCBoaWRlIGluIGBUcmVlIFZpZXdgIFBsYXRmb3JtSU8gc2VydmljZSBmaWxlcyBhbmQgJyArXG4gICAgICAgICAgICAgICAgICdkaXJlY3RvcmllcyAoYC5waW9lbnZzYCwgYC5waW9saWJkZXBzYCwgb3RoZXIgY29uZmlndXJhdGlvbiBmaWxlcyknLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogNjBcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IElTX1dJTkRPV1MgPSBCb29sZWFuKG9zLnBsYXRmb3JtKCkuaW5kZXhPZignd2luMzInKSA+IC0xKTtcbmV4cG9ydCBjb25zdCBCQVNFX0RJUiA9IHBhdGgucmVzb2x2ZShwYXRoLmRpcm5hbWUoX19maWxlbmFtZSksICcuLicpO1xuZXhwb3J0IGNvbnN0IEVOVl9ESVIgPSBfZ2V0X2Vudl9kaXIocGF0aC5qb2luKEJBU0VfRElSLCAncGVudicpKTtcbmV4cG9ydCBjb25zdCBFTlZfQklOX0RJUiA9IHBhdGguam9pbihFTlZfRElSLCBJU19XSU5ET1dTID8gJ1NjcmlwdHMnIDogJ2JpbicpO1xuZXhwb3J0IGNvbnN0IENBQ0hFX0RJUiA9IHBhdGguam9pbihCQVNFX0RJUiwgJy5jYWNoZScpO1xuZXhwb3J0IGNvbnN0IERFUEVOREVOQ0lFUyA9IHtcbiAgJ2J1aWxkJzogJz49MC41Ni4wJyxcbiAgJ2J1c3knOiAnPj0wLjEuMCcsXG4gICdhdXRvY29tcGxldGUtY2xhbmcnOiAnPj0wLjguOScsXG4gICdsaW50ZXInOiAnPj0xLjExLjMnLFxuICAnbGludGVyLWdjYyc6ICc+PTAuNi41JyxcbiAgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsJzogJz49Mi4wLjknLFxuICAnbGFuZ3VhZ2UtaW5pJzogJz49MS4xNC4wJyxcbiAgJ3Rvb2wtYmFyJzogJz49MC4yLjAnLFxuICAnZmlsZS1pY29ucyc6ICc+PTEuNycsXG4gICdtaW5pbWFwJzogJz49NCdcbn07XG5leHBvcnQgY29uc3QgU1RBTEVfREVQRU5ERU5DSUVTID0gWydsaW50ZXItY2xhbmcnLCAndWx0LXRlcm1pbmFsJ107XG5leHBvcnQgY29uc3QgREVGQVVMVF9QSU9fQVJHUyA9IFsnLWYnLCAnLWMnLCAnYXRvbSddO1xuZXhwb3J0IGNvbnN0IFBPU1RfQlVJTERfREVMQVkgPSAxMDAwOyAgLy8gbXMsIGRhbGF5IGJlZm9yZSBzZXJpYWwgbW9uaXRvciByZXN0b3JlXG5leHBvcnQgY29uc3QgQVVUT19SRUJVSUxEX0RFTEFZID0gMzAwMDsgIC8vIG1zXG5cbmV4cG9ydCBjb25zdCBOT19FTElHSUJMRV9QUk9KRUNUU19GT1VORCA9ICc8JE5PX0VMSUdJQkxFX1BST0pFQ1RTX0ZPVU5EJD4nO1xuXG5cbmZ1bmN0aW9uIF9nZXRfZW52X2RpcihkZWZhdWx0RW52RGlyKSB7XG4gIGlmIChJU19XSU5ET1dTKSB7XG4gICAgLy8gUHV0IHRoZSBlbnYgZGlyZWN0b3J5IHRvIHRoZSByb290IG9mIHRoZSBjdXJyZW50IGxvY2FsIGRpc2sgd2hlblxuICAgIC8vIGRlZmF1bHQgcGF0aCBjb250YWlucyBub24tQVNDSUkgY2hhcmFjdGVycy4gVmlydHVhbGVudiB3aWxsIGZhaWwgdG9cbiAgICBmb3IgKGNvbnN0IGNoYXIgb2YgZGVmYXVsdEVudkRpcikge1xuICAgICAgaWYgKGNoYXIuY2hhckNvZGVBdCgwKSA+IDEyNykge1xuICAgICAgICBjb25zdCBkZWZhdWx0RW52RGlyRm9ybWF0ID0gcGF0aC5wYXJzZShkZWZhdWx0RW52RGlyKTtcbiAgICAgICAgcmV0dXJuIHBhdGguZm9ybWF0KHtcbiAgICAgICAgICByb290OiBkZWZhdWx0RW52RGlyRm9ybWF0LnJvb3QsXG4gICAgICAgICAgZGlyOiBkZWZhdWx0RW52RGlyRm9ybWF0LnJvb3QsXG4gICAgICAgICAgYmFzZTogJy5waW9pZGVwZW52JyxcbiAgICAgICAgICBuYW1lOiAnLnBpb2lkZXBlbnYnLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdEVudkRpcjtcbn1cbiJdfQ==
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/config.js
