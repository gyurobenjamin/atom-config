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
var DonateView = (function (_BaseView) {
  _inherits(DonateView, _BaseView);

  function DonateView() {
    _classCallCheck(this, _DonateView);

    _get(Object.getPrototypeOf(_DonateView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DonateView, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      this.alreadyDonated = this.element.querySelector('.already-donated');
      this.remindLater = this.element.querySelector('.remind-later');
      this.noThanks = this.element.querySelector('.no-thanks');

      this.alreadyDonated.onclick = function () {
        _this.alreadyDonatedHandler();
        _this.onDone();
      };
      this.remindLater.onclick = function () {
        _this.remindLaterHandler();
        _this.onDone();
      };
      this.noThanks.onclick = function () {
        _this.noThanksHandler();
        _this.onDone();
      };
    }
  }, {
    key: 'alreadyDonatedHandler',
    value: function alreadyDonatedHandler() {}
  }, {
    key: 'remindLaterHandler',
    value: function remindLaterHandler() {}
  }, {
    key: 'noThanksHandler',
    value: function noThanksHandler() {}
  }, {
    key: 'onDone',
    value: function onDone() {}
  }]);

  var _DonateView = DonateView;
  DonateView = (0, _utils.withTemplate)(__dirname)(DonateView) || DonateView;
  return DonateView;
})(_baseView2['default']);

exports.DonateView = DonateView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9kb25hdGUvdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3dCQW1CcUIsY0FBYzs7OztxQkFDUixVQUFVOztBQXBCckMsV0FBVyxDQUFDO0lBdUJDLFVBQVU7WUFBVixVQUFVOztXQUFWLFVBQVU7Ozs7OztlQUFWLFVBQVU7O1dBRVgsc0JBQUc7OztBQUNYLFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNyRSxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQy9ELFVBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7O0FBRXpELFVBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFHLFlBQU07QUFDbEMsY0FBSyxxQkFBcUIsRUFBRSxDQUFDO0FBQzdCLGNBQUssTUFBTSxFQUFFLENBQUM7T0FDZixDQUFDO0FBQ0YsVUFBSSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEdBQUcsWUFBTTtBQUMvQixjQUFLLGtCQUFrQixFQUFFLENBQUM7QUFDMUIsY0FBSyxNQUFNLEVBQUUsQ0FBQztPQUNmLENBQUM7QUFDRixVQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sR0FBRyxZQUFNO0FBQzVCLGNBQUssZUFBZSxFQUFFLENBQUM7QUFDdkIsY0FBSyxNQUFNLEVBQUUsQ0FBQztPQUNmLENBQUM7S0FDSDs7O1dBRW9CLGlDQUFHLEVBQUU7OztXQUNSLDhCQUFHLEVBQUU7OztXQUNSLDJCQUFHLEVBQUU7OztXQUNkLGtCQUFHLEVBQUU7OztvQkF4QkEsVUFBVTtBQUFWLFlBQVUsR0FEdEIseUJBQWEsU0FBUyxDQUFDLENBQ1gsVUFBVSxLQUFWLFVBQVU7U0FBVixVQUFVIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9kb25hdGUvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKipcbiAqIENvcHlyaWdodCAoQykgMjAxNiBJdmFuIEtyYXZldHMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgZmlsZSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3JcbiAqIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMlxuICogYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nXG4gKiB3aXRoIHRoaXMgcHJvZ3JhbTsgaWYgbm90LCB3cml0ZSB0byB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBJbmMuLFxuICogNTEgRnJhbmtsaW4gU3RyZWV0LCBGaWZ0aCBGbG9vciwgQm9zdG9uLCBNQSAwMjExMC0xMzAxIFVTQS5cbiAqL1xuXG5pbXBvcnQgQmFzZVZpZXcgZnJvbSAnLi4vYmFzZS12aWV3JztcbmltcG9ydCB7d2l0aFRlbXBsYXRlfSBmcm9tICcuLi91dGlscyc7XG5cbkB3aXRoVGVtcGxhdGUoX19kaXJuYW1lKVxuZXhwb3J0IGNsYXNzIERvbmF0ZVZpZXcgZXh0ZW5kcyBCYXNlVmlldyB7XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmFscmVhZHlEb25hdGVkID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hbHJlYWR5LWRvbmF0ZWQnKTtcbiAgICB0aGlzLnJlbWluZExhdGVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZW1pbmQtbGF0ZXInKTtcbiAgICB0aGlzLm5vVGhhbmtzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uby10aGFua3MnKTtcblxuICAgIHRoaXMuYWxyZWFkeURvbmF0ZWQub25jbGljayA9ICgpID0+IHtcbiAgICAgIHRoaXMuYWxyZWFkeURvbmF0ZWRIYW5kbGVyKCk7XG4gICAgICB0aGlzLm9uRG9uZSgpO1xuICAgIH07XG4gICAgdGhpcy5yZW1pbmRMYXRlci5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgdGhpcy5yZW1pbmRMYXRlckhhbmRsZXIoKTtcbiAgICAgIHRoaXMub25Eb25lKCk7XG4gICAgfTtcbiAgICB0aGlzLm5vVGhhbmtzLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICB0aGlzLm5vVGhhbmtzSGFuZGxlcigpO1xuICAgICAgdGhpcy5vbkRvbmUoKTtcbiAgICB9O1xuICB9XG5cbiAgYWxyZWFkeURvbmF0ZWRIYW5kbGVyKCkge31cbiAgcmVtaW5kTGF0ZXJIYW5kbGVyKCkge31cbiAgbm9UaGFua3NIYW5kbGVyKCkge31cbiAgb25Eb25lKCkge31cbn1cbiJdfQ==