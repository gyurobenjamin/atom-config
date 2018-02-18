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

var _utils = require('../utils');

'use babel';
var InstallPlatformIOView = (function (_BaseView) {
  _inherits(InstallPlatformIOView, _BaseView);

  function InstallPlatformIOView() {
    _classCallCheck(this, _InstallPlatformIOView);

    _get(Object.getPrototypeOf(_InstallPlatformIOView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(InstallPlatformIOView, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      // Find important nodes
      this.progress = this.element.querySelector('progress');
      this.cancelButton = this.element.querySelector('.cancel');

      // Set handlers
      this.cancelButton.onclick = function () {
        _this.handleCancel();
        _this.cancelButton.textContent = 'Canceling...';
        _this.cancelButton.disabled = true;
      };
    }
  }, {
    key: 'handleCancel',
    value: function handleCancel() {}
  }, {
    key: 'setProgress',
    value: function setProgress(value) {
      this.progress.value = value;
    }
  }]);

  var _InstallPlatformIOView = InstallPlatformIOView;
  InstallPlatformIOView = (0, _utils.withTemplate)(__dirname)(InstallPlatformIOView) || InstallPlatformIOView;
  return InstallPlatformIOView;
})(_baseView2['default']);

exports.InstallPlatformIOView = InstallPlatformIOView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbnN0YWxsL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFtQnFCLGNBQWM7Ozs7cUJBQ1IsVUFBVTs7QUFwQnJDLFdBQVcsQ0FBQztJQXVCQyxxQkFBcUI7WUFBckIscUJBQXFCOztXQUFyQixxQkFBcUI7Ozs7OztlQUFyQixxQkFBcUI7O1dBRXRCLHNCQUFHOzs7O0FBRVgsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN2RCxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUFDOzs7QUFHMUQsVUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUcsWUFBTTtBQUNoQyxjQUFLLFlBQVksRUFBRSxDQUFDO0FBQ3BCLGNBQUssWUFBWSxDQUFDLFdBQVcsR0FBRyxjQUFjLENBQUM7QUFDL0MsY0FBSyxZQUFZLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztPQUNuQyxDQUFDO0tBQ0g7OztXQUVXLHdCQUFFLEVBQUU7OztXQUVMLHFCQUFDLEtBQUssRUFBRTtBQUNqQixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDN0I7OzsrQkFuQlUscUJBQXFCO0FBQXJCLHVCQUFxQixHQURqQyx5QkFBYSxTQUFTLENBQUMsQ0FDWCxxQkFBcUIsS0FBckIscUJBQXFCO1NBQXJCLHFCQUFxQiIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS9saWIvaW5zdGFsbC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCBCYXNlVmlldyBmcm9tICcuLi9iYXNlLXZpZXcnO1xuaW1wb3J0IHt3aXRoVGVtcGxhdGV9IGZyb20gJy4uL3V0aWxzJztcblxuQHdpdGhUZW1wbGF0ZShfX2Rpcm5hbWUpXG5leHBvcnQgY2xhc3MgSW5zdGFsbFBsYXRmb3JtSU9WaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgLy8gRmluZCBpbXBvcnRhbnQgbm9kZXNcbiAgICB0aGlzLnByb2dyZXNzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3Byb2dyZXNzJyk7XG4gICAgdGhpcy5jYW5jZWxCdXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNhbmNlbCcpO1xuXG4gICAgLy8gU2V0IGhhbmRsZXJzXG4gICAgdGhpcy5jYW5jZWxCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgIHRoaXMuaGFuZGxlQ2FuY2VsKCk7XG4gICAgICB0aGlzLmNhbmNlbEJ1dHRvbi50ZXh0Q29udGVudCA9ICdDYW5jZWxpbmcuLi4nO1xuICAgICAgdGhpcy5jYW5jZWxCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgIH07XG4gIH1cblxuICBoYW5kbGVDYW5jZWwoKXt9XG5cbiAgc2V0UHJvZ3Jlc3ModmFsdWUpIHtcbiAgICB0aGlzLnByb2dyZXNzLnZhbHVlID0gdmFsdWU7XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/install/view.js
