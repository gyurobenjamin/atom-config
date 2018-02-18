Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.command = command;

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

var _view = require('./view');

var _commandJoin = require('command-join');

var _commandJoin2 = _interopRequireDefault(_commandJoin);

var _maintenance = require('../maintenance');

var _utils = require('../utils');

'use babel';

var SETTINGS_KEY = 'platformio-ide:serial-monitor-settings';

var DEFAULT_SETTINGS = {
  baud: '9600',
  parity: 'N',
  filter: 'default',
  encoding: 'UTF-8',
  eol: 'CRLF',
  dtr: '-',
  rts: '-',
  raw: '-',
  echo: '-'
};

function command() {
  // Initialize view
  var view = new _view.SerialMonitorView();
  var panel = atom.workspace.addModalPanel({ item: view.getElement() });

  // Set buttons handlers
  view.handleCancel = function () {
    return panel.destroy();
  };
  view.handleOpen = function () {
    var command = ['pio', '-f', '-c', 'atom', 'serialports', 'monitor'];
    var settings = view.getAllSettings();
    var storedSettings = new Map();
    for (var key of Object.keys(settings)) {
      if (typeof DEFAULT_SETTINGS[key] === 'undefined' || DEFAULT_SETTINGS[key] !== settings[key]) {
        command.push('--' + key);
        command.push('' + settings[key]);
        storedSettings.set(key, settings[key]);
      }
    }

    (0, _maintenance.openTerminal)((0, _commandJoin2['default'])(command));
    panel.destroy();
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(Array.from(storedSettings.entries())));
  };

  return (0, _utils.spawnPio)(['serialports', 'list', '--json-output']).then(function onSuccess(output) {
    view.setPorts(JSON.parse(output));
  }, function onFailure(reason) {
    var title = 'PlaftormIO: Unable to get a list of serial ports.';
    atom.notifications.addError(title, { dismissable: true });
    console.error(title);
    return Promise.reject(reason);
  }).then(function () {
    var restoredSettings = null;
    try {
      restoredSettings = new Map(JSON.parse(localStorage.getItem(SETTINGS_KEY)));
    } catch (e) {
      console.warn('Error restoring Serial Monitor settings: ' + e);
      restoredSettings = new Map();
    }

    restoredSettings.forEach(function (value, key) {
      return view.setOption(key, value);
    });
  });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9zZXJpYWwtbW9uaXRvci9jb21tYW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztvQkFtQmdDLFFBQVE7OzJCQUNoQixjQUFjOzs7OzJCQUNYLGdCQUFnQjs7cUJBQ3BCLFVBQVU7O0FBdEJqQyxXQUFXLENBQUM7O0FBd0JaLElBQU0sWUFBWSxHQUFHLHdDQUF3QyxDQUFDOztBQUU5RCxJQUFNLGdCQUFnQixHQUFHO0FBQ3ZCLE1BQUksRUFBRSxNQUFNO0FBQ1osUUFBTSxFQUFFLEdBQUc7QUFDWCxRQUFNLEVBQUUsU0FBUztBQUNqQixVQUFRLEVBQUUsT0FBTztBQUNqQixLQUFHLEVBQUUsTUFBTTtBQUNYLEtBQUcsRUFBRSxHQUFHO0FBQ1IsS0FBRyxFQUFFLEdBQUc7QUFDUixLQUFHLEVBQUUsR0FBRztBQUNSLE1BQUksRUFBRSxHQUFHO0NBQ1YsQ0FBQzs7QUFFSyxTQUFTLE9BQU8sR0FBRzs7QUFFeEIsTUFBSSxJQUFJLEdBQUcsNkJBQXVCLENBQUM7QUFDbkMsTUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFDLENBQUMsQ0FBQzs7O0FBR3BFLE1BQUksQ0FBQyxZQUFZLEdBQUc7V0FBTSxLQUFLLENBQUMsT0FBTyxFQUFFO0dBQUEsQ0FBQztBQUMxQyxNQUFJLENBQUMsVUFBVSxHQUFHLFlBQU07QUFDdEIsUUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3RFLFFBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztBQUN2QyxRQUFNLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2pDLFNBQUssSUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtBQUN2QyxVQUFJLE9BQU8sZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssV0FBVyxJQUFJLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxLQUFLLFFBQVEsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUMzRixlQUFPLENBQUMsSUFBSSxRQUFNLEdBQUcsQ0FBRyxDQUFDO0FBQ3pCLGVBQU8sQ0FBQyxJQUFJLE1BQUksUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFHLENBQUM7QUFDakMsc0JBQWMsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQ3hDO0tBQ0Y7O0FBRUQsbUNBQWEsOEJBQVksT0FBTyxDQUFDLENBQUMsQ0FBQztBQUNuQyxTQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDaEIsZ0JBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDMUYsQ0FBQzs7QUFFRixTQUFPLHFCQUFTLENBQUMsYUFBYSxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUN0RCxJQUFJLENBQUMsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQy9CLFFBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0dBQ25DLEVBQUUsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzVCLFFBQU0sS0FBSyxHQUFHLG1EQUFtRCxDQUFDO0FBQ2xFLFFBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO0FBQ3hELFdBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDckIsV0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQy9CLENBQUMsQ0FDRCxJQUFJLENBQUMsWUFBTTtBQUNWLFFBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzVCLFFBQUk7QUFDRixzQkFBZ0IsR0FBRyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzVFLENBQUMsT0FBTSxDQUFDLEVBQUU7QUFDVCxhQUFPLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzlELHNCQUFnQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7S0FDOUI7O0FBRUQsb0JBQWdCLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSyxFQUFFLEdBQUc7YUFBSyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUM7S0FBQSxDQUFDLENBQUM7R0FDdEUsQ0FBQyxDQUFDO0NBQ04iLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUvbGliL3NlcmlhbC1tb25pdG9yL2NvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0IHtTZXJpYWxNb25pdG9yVmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCBjb21tYW5kSm9pbiBmcm9tICdjb21tYW5kLWpvaW4nO1xuaW1wb3J0IHtvcGVuVGVybWluYWx9IGZyb20gJy4uL21haW50ZW5hbmNlJztcbmltcG9ydCB7c3Bhd25QaW99IGZyb20gJy4uL3V0aWxzJztcblxuY29uc3QgU0VUVElOR1NfS0VZID0gJ3BsYXRmb3JtaW8taWRlOnNlcmlhbC1tb25pdG9yLXNldHRpbmdzJztcblxuY29uc3QgREVGQVVMVF9TRVRUSU5HUyA9IHtcbiAgYmF1ZDogJzk2MDAnLFxuICBwYXJpdHk6ICdOJyxcbiAgZmlsdGVyOiAnZGVmYXVsdCcsXG4gIGVuY29kaW5nOiAnVVRGLTgnLFxuICBlb2w6ICdDUkxGJyxcbiAgZHRyOiAnLScsXG4gIHJ0czogJy0nLFxuICByYXc6ICctJyxcbiAgZWNobzogJy0nXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY29tbWFuZCgpIHtcbiAgLy8gSW5pdGlhbGl6ZSB2aWV3XG4gIHZhciB2aWV3ID0gbmV3IFNlcmlhbE1vbml0b3JWaWV3KCk7XG4gIHZhciBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoe2l0ZW06IHZpZXcuZ2V0RWxlbWVudCgpfSk7XG5cbiAgLy8gU2V0IGJ1dHRvbnMgaGFuZGxlcnNcbiAgdmlldy5oYW5kbGVDYW5jZWwgPSAoKSA9PiBwYW5lbC5kZXN0cm95KCk7XG4gIHZpZXcuaGFuZGxlT3BlbiA9ICgpID0+IHtcbiAgICBjb25zdCBjb21tYW5kID0gWydwaW8nLCAnLWYnLCAnLWMnLCAnYXRvbScsICdzZXJpYWxwb3J0cycsICdtb25pdG9yJ107XG4gICAgY29uc3Qgc2V0dGluZ3MgPSB2aWV3LmdldEFsbFNldHRpbmdzKCk7XG4gICAgY29uc3Qgc3RvcmVkU2V0dGluZ3MgPSBuZXcgTWFwKCk7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoc2V0dGluZ3MpKSB7XG4gICAgICBpZiAodHlwZW9mIERFRkFVTFRfU0VUVElOR1Nba2V5XSA9PT0gJ3VuZGVmaW5lZCcgfHwgREVGQVVMVF9TRVRUSU5HU1trZXldICE9PSBzZXR0aW5nc1trZXldKSB7XG4gICAgICAgIGNvbW1hbmQucHVzaChgLS0ke2tleX1gKTtcbiAgICAgICAgY29tbWFuZC5wdXNoKGAke3NldHRpbmdzW2tleV19YCk7XG4gICAgICAgIHN0b3JlZFNldHRpbmdzLnNldChrZXksIHNldHRpbmdzW2tleV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIG9wZW5UZXJtaW5hbChjb21tYW5kSm9pbihjb21tYW5kKSk7XG4gICAgcGFuZWwuZGVzdHJveSgpO1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKFNFVFRJTkdTX0tFWSwgSlNPTi5zdHJpbmdpZnkoQXJyYXkuZnJvbShzdG9yZWRTZXR0aW5ncy5lbnRyaWVzKCkpKSk7XG4gIH07XG5cbiAgcmV0dXJuIHNwYXduUGlvKFsnc2VyaWFscG9ydHMnLCAnbGlzdCcsICctLWpzb24tb3V0cHV0J10pXG4gICAgLnRoZW4oZnVuY3Rpb24gb25TdWNjZXNzKG91dHB1dCkge1xuICAgICAgdmlldy5zZXRQb3J0cyhKU09OLnBhcnNlKG91dHB1dCkpO1xuICAgIH0sIGZ1bmN0aW9uIG9uRmFpbHVyZShyZWFzb24pIHtcbiAgICAgIGNvbnN0IHRpdGxlID0gJ1BsYWZ0b3JtSU86IFVuYWJsZSB0byBnZXQgYSBsaXN0IG9mIHNlcmlhbCBwb3J0cy4nO1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRpdGxlLCB7ZGlzbWlzc2FibGU6IHRydWV9KTtcbiAgICAgIGNvbnNvbGUuZXJyb3IodGl0bGUpO1xuICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KHJlYXNvbik7XG4gICAgfSlcbiAgICAudGhlbigoKSA9PiB7XG4gICAgICBsZXQgcmVzdG9yZWRTZXR0aW5ncyA9IG51bGw7XG4gICAgICB0cnkge1xuICAgICAgICByZXN0b3JlZFNldHRpbmdzID0gbmV3IE1hcChKU09OLnBhcnNlKGxvY2FsU3RvcmFnZS5nZXRJdGVtKFNFVFRJTkdTX0tFWSkpKTtcbiAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICBjb25zb2xlLndhcm4oJ0Vycm9yIHJlc3RvcmluZyBTZXJpYWwgTW9uaXRvciBzZXR0aW5nczogJyArIGUpO1xuICAgICAgICByZXN0b3JlZFNldHRpbmdzID0gbmV3IE1hcCgpO1xuICAgICAgfVxuXG4gICAgICByZXN0b3JlZFNldHRpbmdzLmZvckVhY2goKHZhbHVlLCBrZXkpID0+IHZpZXcuc2V0T3B0aW9uKGtleSwgdmFsdWUpKTtcbiAgICB9KTtcbn1cbiJdfQ==
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/serial-monitor/command.js
