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

'use babel';
var QuickLinksView = (function (_BaseView) {
  _inherits(QuickLinksView, _BaseView);

  function QuickLinksView() {
    _classCallCheck(this, _QuickLinksView);

    _get(Object.getPrototypeOf(_QuickLinksView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(QuickLinksView, [{
    key: 'buildElement',
    value: function buildElement() {
      var element = document.createElement('div');
      element.classList.add('pio-home-quick-access');
      return element;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      this.populateQuickLinks();
    }
  }, {
    key: 'populateQuickLinks',
    value: function populateQuickLinks() {
      var buttonsConfigs = [{
        text: 'New Project',
        icon: 'plus',
        callback: function callback() {
          return (0, _utils.runAtomCommand)('platformio-ide:initialize-new-project');
        }
      }, {
        text: 'Import Arduino Project',
        icon: 'repo',
        callback: function callback() {
          return (0, _utils.runAtomCommand)('platformio-ide:import-arduino-ide-project');
        }
      }, {
        text: 'Open Project',
        icon: 'file-directory',
        callback: function callback() {
          return (0, _utils.runAtomCommand)('application:add-project-folder');
        }
      }, {
        text: 'Project Examples',
        icon: 'code',
        callback: function callback() {
          return (0, _utils.runAtomCommand)('platformio-ide:project-examples');
        }
      }];

      for (var config of buttonsConfigs) {
        var link = document.createElement('a');
        link.classList.add('btn');
        link.classList.add('icon');
        link.classList.add('icon-' + (config.icon || 'repo'));

        link.href = '#';
        link.textContent = config.text;

        if (config.href) {
          link.href = config.href;
        } else if (config.callback) {
          link.onclick = config.callback;
        }

        this.element.appendChild(link);
      }
    }
  }]);

  var _QuickLinksView = QuickLinksView;
  QuickLinksView = (0, _utils.withTemplate)(__dirname)(QuickLinksView) || QuickLinksView;
  return QuickLinksView;
})(_baseView2['default']);

exports.QuickLinksView = QuickLinksView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9ob21lLXNjcmVlbi9xdWljay1saW5rcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3FCQW1CMkMsVUFBVTs7d0JBQ2hDLGNBQWM7Ozs7QUFwQm5DLFdBQVcsQ0FBQztJQXVCQyxjQUFjO1lBQWQsY0FBYzs7V0FBZCxjQUFjOzs7Ozs7ZUFBZCxjQUFjOztXQUViLHdCQUFHO0FBQ2IsVUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxhQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBQy9DLGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0tBQzNCOzs7V0FFaUIsOEJBQUc7QUFDbkIsVUFBTSxjQUFjLEdBQUcsQ0FDckI7QUFDRSxZQUFJLEVBQUUsYUFBYTtBQUNuQixZQUFJLEVBQUUsTUFBTTtBQUNaLGdCQUFRLEVBQUU7aUJBQU0sMkJBQWUsdUNBQXVDLENBQUM7U0FBQTtPQUN4RSxFQUNEO0FBQ0UsWUFBSSxFQUFFLHdCQUF3QjtBQUM5QixZQUFJLEVBQUUsTUFBTTtBQUNaLGdCQUFRLEVBQUU7aUJBQU0sMkJBQWUsMkNBQTJDLENBQUM7U0FBQTtPQUM1RSxFQUNEO0FBQ0UsWUFBSSxFQUFFLGNBQWM7QUFDcEIsWUFBSSxFQUFFLGdCQUFnQjtBQUN0QixnQkFBUSxFQUFFO2lCQUFNLDJCQUFlLGdDQUFnQyxDQUFDO1NBQUE7T0FDakUsRUFDRDtBQUNFLFlBQUksRUFBRSxrQkFBa0I7QUFDeEIsWUFBSSxFQUFFLE1BQU07QUFDWixnQkFBUSxFQUFFO2lCQUFNLDJCQUFlLGlDQUFpQyxDQUFDO1NBQUE7T0FDbEUsQ0FDRixDQUFDOztBQUVGLFdBQUssSUFBTSxNQUFNLElBQUksY0FBYyxFQUFFO0FBQ25DLFlBQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDekMsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDM0IsWUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLFlBQVMsTUFBTSxDQUFDLElBQUksSUFBSSxNQUFNLENBQUEsQ0FBRyxDQUFDOztBQUVwRCxZQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztBQUNoQixZQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7O0FBRS9CLFlBQUksTUFBTSxDQUFDLElBQUksRUFBRTtBQUNmLGNBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztTQUN6QixNQUFNLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRTtBQUMxQixjQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUM7U0FDaEM7O0FBRUQsWUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDaEM7S0FDRjs7O3dCQXJEVSxjQUFjO0FBQWQsZ0JBQWMsR0FEMUIseUJBQWEsU0FBUyxDQUFDLENBQ1gsY0FBYyxLQUFkLGNBQWM7U0FBZCxjQUFjIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9ob21lLXNjcmVlbi9xdWljay1saW5rcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKipcbiAqIENvcHlyaWdodCAoQykgMjAxNiBJdmFuIEtyYXZldHMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgZmlsZSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3JcbiAqIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMlxuICogYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nXG4gKiB3aXRoIHRoaXMgcHJvZ3JhbTsgaWYgbm90LCB3cml0ZSB0byB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBJbmMuLFxuICogNTEgRnJhbmtsaW4gU3RyZWV0LCBGaWZ0aCBGbG9vciwgQm9zdG9uLCBNQSAwMjExMC0xMzAxIFVTQS5cbiAqL1xuXG5pbXBvcnQge3J1bkF0b21Db21tYW5kLCB3aXRoVGVtcGxhdGV9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBCYXNlVmlldyBmcm9tICcuLi9iYXNlLXZpZXcnO1xuXG5Ad2l0aFRlbXBsYXRlKF9fZGlybmFtZSlcbmV4cG9ydCBjbGFzcyBRdWlja0xpbmtzVmlldyBleHRlbmRzIEJhc2VWaWV3IHtcblxuICBidWlsZEVsZW1lbnQoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsZW1lbnQuY2xhc3NMaXN0LmFkZCgncGlvLWhvbWUtcXVpY2stYWNjZXNzJyk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMucG9wdWxhdGVRdWlja0xpbmtzKCk7XG4gIH1cblxuICBwb3B1bGF0ZVF1aWNrTGlua3MoKSB7XG4gICAgY29uc3QgYnV0dG9uc0NvbmZpZ3MgPSBbXG4gICAgICB7XG4gICAgICAgIHRleHQ6ICdOZXcgUHJvamVjdCcsXG4gICAgICAgIGljb246ICdwbHVzJyxcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHJ1bkF0b21Db21tYW5kKCdwbGF0Zm9ybWlvLWlkZTppbml0aWFsaXplLW5ldy1wcm9qZWN0JyksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnSW1wb3J0IEFyZHVpbm8gUHJvamVjdCcsXG4gICAgICAgIGljb246ICdyZXBvJyxcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHJ1bkF0b21Db21tYW5kKCdwbGF0Zm9ybWlvLWlkZTppbXBvcnQtYXJkdWluby1pZGUtcHJvamVjdCcpLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGV4dDogJ09wZW4gUHJvamVjdCcsXG4gICAgICAgIGljb246ICdmaWxlLWRpcmVjdG9yeScsXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiBydW5BdG9tQ29tbWFuZCgnYXBwbGljYXRpb246YWRkLXByb2plY3QtZm9sZGVyJyksXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0ZXh0OiAnUHJvamVjdCBFeGFtcGxlcycsXG4gICAgICAgIGljb246ICdjb2RlJyxcbiAgICAgICAgY2FsbGJhY2s6ICgpID0+IHJ1bkF0b21Db21tYW5kKCdwbGF0Zm9ybWlvLWlkZTpwcm9qZWN0LWV4YW1wbGVzJyksXG4gICAgICB9LFxuICAgIF07XG5cbiAgICBmb3IgKGNvbnN0IGNvbmZpZyBvZiBidXR0b25zQ29uZmlncykge1xuICAgICAgY29uc3QgbGluayA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICAgIGxpbmsuY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG4gICAgICBsaW5rLmNsYXNzTGlzdC5hZGQoJ2ljb24nKTtcbiAgICAgIGxpbmsuY2xhc3NMaXN0LmFkZChgaWNvbi0ke2NvbmZpZy5pY29uIHx8ICdyZXBvJ31gKTtcblxuICAgICAgbGluay5ocmVmID0gJyMnO1xuICAgICAgbGluay50ZXh0Q29udGVudCA9IGNvbmZpZy50ZXh0O1xuXG4gICAgICBpZiAoY29uZmlnLmhyZWYpIHtcbiAgICAgICAgbGluay5ocmVmID0gY29uZmlnLmhyZWY7XG4gICAgICB9IGVsc2UgaWYgKGNvbmZpZy5jYWxsYmFjaykge1xuICAgICAgICBsaW5rLm9uY2xpY2sgPSBjb25maWcuY2FsbGJhY2s7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZChsaW5rKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/home-screen/quick-links.js
