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

var _baseView = require('../base-view');

var _baseView2 = _interopRequireDefault(_baseView);

var _maintenance = require('../maintenance');

var _utils = require('../utils');

'use babel';
var LibrariesView = (function (_BaseView) {
  _inherits(LibrariesView, _BaseView);

  function LibrariesView() {
    _classCallCheck(this, _LibrariesView);

    _get(Object.getPrototypeOf(_LibrariesView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(LibrariesView, [{
    key: 'initialize',
    value: function initialize(uri) {
      this.uri = uri;
      this.element.querySelector('.btn-cmd-lib').onclick = function () {
        (0, _maintenance.openTerminal)('pio lib --help');
      };
      this.element.querySelector('.btn-cmd-lib-search').onclick = function () {
        (0, _maintenance.openTerminal)('pio lib search --help');
      };
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'Library Manager';
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'code';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.uri;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      _get(Object.getPrototypeOf(_LibrariesView.prototype), 'destroy', this).call(this);
    }
  }]);

  var _LibrariesView = LibrariesView;
  LibrariesView = (0, _utils.withTemplate)(__dirname)(LibrariesView) || LibrariesView;
  return LibrariesView;
})(_baseView2['default']);

exports.LibrariesView = LibrariesView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9saWJyYXJpZXMvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQW1CcUIsY0FBYzs7OzsyQkFDUixnQkFBZ0I7O3FCQUNoQixVQUFVOztBQXJCckMsV0FBVyxDQUFDO0lBd0JDLGFBQWE7WUFBYixhQUFhOztXQUFiLGFBQWE7Ozs7OztlQUFiLGFBQWE7O1dBRWQsb0JBQUMsR0FBRyxFQUFFO0FBQ2QsVUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDZixVQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLEdBQUcsWUFBTTtBQUN6RCx1Q0FBYSxnQkFBZ0IsQ0FBQyxDQUFDO09BQ2hDLENBQUM7QUFDRixVQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLE9BQU8sR0FBRyxZQUFNO0FBQ2hFLHVDQUFhLHVCQUF1QixDQUFDLENBQUM7T0FDdkMsQ0FBQztLQUNIOzs7V0FFTyxvQkFBRztBQUNULGFBQU8saUJBQWlCLENBQUM7S0FDMUI7OztXQUVVLHVCQUFHO0FBQ1osYUFBTyxNQUFNLENBQUM7S0FDZjs7O1dBRUssa0JBQUc7QUFDUCxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDakI7OztXQUVNLG1CQUFHO0FBQ1Isd0ZBQWdCO0tBQ2pCOzs7dUJBMUJVLGFBQWE7QUFBYixlQUFhLEdBRHpCLHlCQUFhLFNBQVMsQ0FBQyxDQUNYLGFBQWEsS0FBYixhQUFhO1NBQWIsYUFBYSIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS9saWIvbGlicmFyaWVzL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0IEJhc2VWaWV3IGZyb20gJy4uL2Jhc2Utdmlldyc7XG5pbXBvcnQge29wZW5UZXJtaW5hbH0gZnJvbSAnLi4vbWFpbnRlbmFuY2UnO1xuaW1wb3J0IHt3aXRoVGVtcGxhdGV9IGZyb20gJy4uL3V0aWxzJztcblxuQHdpdGhUZW1wbGF0ZShfX2Rpcm5hbWUpXG5leHBvcnQgY2xhc3MgTGlicmFyaWVzVmlldyBleHRlbmRzIEJhc2VWaWV3e1xuXG4gIGluaXRpYWxpemUodXJpKSB7XG4gICAgdGhpcy51cmkgPSB1cmk7XG4gICAgdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5idG4tY21kLWxpYicpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBvcGVuVGVybWluYWwoJ3BpbyBsaWIgLS1oZWxwJyk7XG4gICAgfTtcbiAgICB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJ0bi1jbWQtbGliLXNlYXJjaCcpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBvcGVuVGVybWluYWwoJ3BpbyBsaWIgc2VhcmNoIC0taGVscCcpO1xuICAgIH07XG4gIH1cblxuICBnZXRUaXRsZSgpIHtcbiAgICByZXR1cm4gJ0xpYnJhcnkgTWFuYWdlcic7XG4gIH1cblxuICBnZXRJY29uTmFtZSgpIHtcbiAgICByZXR1cm4gJ2NvZGUnO1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLnVyaTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgc3VwZXIuZGVzdHJveSgpO1xuICB9XG59XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/libraries/view.js
