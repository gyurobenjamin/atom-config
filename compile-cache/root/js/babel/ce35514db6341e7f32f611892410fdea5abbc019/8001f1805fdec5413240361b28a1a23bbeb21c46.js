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
var SerialMonitorView = (function (_BaseView) {
  _inherits(SerialMonitorView, _BaseView);

  function SerialMonitorView() {
    _classCallCheck(this, _SerialMonitorView);

    _get(Object.getPrototypeOf(_SerialMonitorView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SerialMonitorView, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      // Find important nodes
      this.portsSelect = this.element.querySelector('.port-select');
      this.baudrateInput = this.element.querySelector('.baudrate-input');
      this.toggleAdvancedSettings = this.element.querySelector('.toggle-advanced-settings');
      this.advancedSettings = this.element.querySelector('.advanced-settings');
      this.openButton = this.element.querySelector('.open');
      this.cancelButton = this.element.querySelector('.cancel');

      // Set handlers
      this.toggleAdvancedSettings.onclick = function () {
        var currentValue = _this.advancedSettings.style.display;
        if (!currentValue || 'none' === currentValue) {
          _this.advancedSettings.style.display = 'block';
        } else {
          _this.advancedSettings.style.display = 'none';
        }
      };
      this.openButton.onclick = function () {
        return _this.handleOpen();
      };
      this.cancelButton.onclick = function () {
        return _this.handleCancel();
      };
    }
  }, {
    key: 'setPorts',
    value: function setPorts(ports) {
      (0, _utils.removeChildrenOf)(this.portsSelect);

      for (var i = 0; i < ports.length; i++) {
        var option = document.createElement('option');
        option.value = ports[i].port;
        option.textContent = ports[i].description + ' at ' + ports[i].port;
        this.portsSelect.appendChild(option);
      }
    }
  }, {
    key: 'setOption',
    value: function setOption(optionName, optionValue) {
      var selector = '*[data-monitor-option="' + optionName + '"]';
      var inputElement = this.element.querySelector(selector);
      if (!inputElement) {
        console.warn('Element for option "' + optionName + '" not found.');
        return;
      }

      if (inputElement.type === 'select') {
        // Set value only if there is option with that value.
        // Usful for port option, because the port user connected once may not
        // be present all the time.
        for (var i = 0; i < inputElement.children.length; i++) {
          if (inputElement.children[i].value === optionValue) {
            inputElement.value = optionValue;
            break;
          }
        }
      } else {
        inputElement.value = optionValue;
      }
    }
  }, {
    key: 'getAllSettings',
    value: function getAllSettings() {
      var settings = {};
      var items = [].slice.call(this.element.querySelectorAll('.monitor-option'));
      for (var elem of items) {
        settings[elem.dataset.monitorOption] = elem.value;
      }
      return settings;
    }
  }, {
    key: 'handleOpen',
    value: function handleOpen() {}
  }, {
    key: 'handleCancel',
    value: function handleCancel() {}
  }]);

  var _SerialMonitorView = SerialMonitorView;
  SerialMonitorView = (0, _utils.withTemplate)(__dirname)(SerialMonitorView) || SerialMonitorView;
  return SerialMonitorView;
})(_baseView2['default']);

exports.SerialMonitorView = SerialMonitorView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9zZXJpYWwtbW9uaXRvci92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBbUI2QyxVQUFVOzt3QkFDbEMsY0FBYzs7OztBQXBCbkMsV0FBVyxDQUFDO0lBdUJDLGlCQUFpQjtZQUFqQixpQkFBaUI7O1dBQWpCLGlCQUFpQjs7Ozs7O2VBQWpCLGlCQUFpQjs7V0FFbEIsc0JBQUc7Ozs7QUFFWCxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQzlELFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNuRSxVQUFJLENBQUMsc0JBQXNCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN0RixVQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUN6RSxVQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3RELFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7OztBQUcxRCxVQUFJLENBQUMsc0JBQXNCLENBQUMsT0FBTyxHQUFHLFlBQU07QUFDMUMsWUFBTSxZQUFZLEdBQUcsTUFBSyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO0FBQ3pELFlBQUksQ0FBQyxZQUFZLElBQUksTUFBTSxLQUFLLFlBQVksRUFBRTtBQUM1QyxnQkFBSyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUMvQyxNQUFNO0FBQ0wsZ0JBQUssZ0JBQWdCLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7U0FDOUM7T0FDRixDQUFDO0FBQ0YsVUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUc7ZUFBTSxNQUFLLFVBQVUsRUFBRTtPQUFBLENBQUM7QUFDbEQsVUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEdBQUc7ZUFBTSxNQUFLLFlBQVksRUFBRTtPQUFBLENBQUM7S0FDdkQ7OztXQUVPLGtCQUFDLEtBQUssRUFBRTtBQUNkLG1DQUFpQixJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRW5DLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQ3JDLFlBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsY0FBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQzdCLGNBQU0sQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsR0FBRyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNuRSxZQUFJLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUN0QztLQUNGOzs7V0FFUSxtQkFBQyxVQUFVLEVBQUUsV0FBVyxFQUFFO0FBQ2pDLFVBQU0sUUFBUSwrQkFBNkIsVUFBVSxPQUFJLENBQUM7QUFDMUQsVUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDMUQsVUFBSSxDQUFDLFlBQVksRUFBRTtBQUNqQixlQUFPLENBQUMsSUFBSSwwQkFBd0IsVUFBVSxrQkFBZSxDQUFDO0FBQzlELGVBQU87T0FDUjs7QUFFRCxVQUFJLFlBQVksQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFOzs7O0FBSWxDLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxZQUFZLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNyRCxjQUFJLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtBQUNsRCx3QkFBWSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUM7QUFDakMsa0JBQU07V0FDUDtTQUNGO09BQ0YsTUFBTTtBQUNMLG9CQUFZLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztPQUNsQztLQUNGOzs7V0FFYSwwQkFBRztBQUNmLFVBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNwQixVQUFNLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztBQUM5RSxXQUFLLElBQU0sSUFBSSxJQUFJLEtBQUssRUFBRTtBQUN4QixnQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztPQUNuRDtBQUNELGFBQU8sUUFBUSxDQUFDO0tBQ2pCOzs7V0FFUyxzQkFBRyxFQUFFOzs7V0FDSCx3QkFBRyxFQUFFOzs7MkJBcEVOLGlCQUFpQjtBQUFqQixtQkFBaUIsR0FEN0IseUJBQWEsU0FBUyxDQUFDLENBQ1gsaUJBQWlCLEtBQWpCLGlCQUFpQjtTQUFqQixpQkFBaUIiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUvbGliL3NlcmlhbC1tb25pdG9yL3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0IHtyZW1vdmVDaGlsZHJlbk9mLCB3aXRoVGVtcGxhdGV9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBCYXNlVmlldyBmcm9tICcuLi9iYXNlLXZpZXcnO1xuXG5Ad2l0aFRlbXBsYXRlKF9fZGlybmFtZSlcbmV4cG9ydCBjbGFzcyBTZXJpYWxNb25pdG9yVmlldyBleHRlbmRzIEJhc2VWaWV3IHtcblxuICBpbml0aWFsaXplKCkge1xuICAgIC8vIEZpbmQgaW1wb3J0YW50IG5vZGVzXG4gICAgdGhpcy5wb3J0c1NlbGVjdCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucG9ydC1zZWxlY3QnKTtcbiAgICB0aGlzLmJhdWRyYXRlSW5wdXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJhdWRyYXRlLWlucHV0Jyk7XG4gICAgdGhpcy50b2dnbGVBZHZhbmNlZFNldHRpbmdzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2dnbGUtYWR2YW5jZWQtc2V0dGluZ3MnKTtcbiAgICB0aGlzLmFkdmFuY2VkU2V0dGluZ3MgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmFkdmFuY2VkLXNldHRpbmdzJyk7XG4gICAgdGhpcy5vcGVuQnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5vcGVuJyk7XG4gICAgdGhpcy5jYW5jZWxCdXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNhbmNlbCcpO1xuXG4gICAgLy8gU2V0IGhhbmRsZXJzXG4gICAgdGhpcy50b2dnbGVBZHZhbmNlZFNldHRpbmdzLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBjb25zdCBjdXJyZW50VmFsdWUgPSB0aGlzLmFkdmFuY2VkU2V0dGluZ3Muc3R5bGUuZGlzcGxheTtcbiAgICAgIGlmICghY3VycmVudFZhbHVlIHx8ICdub25lJyA9PT0gY3VycmVudFZhbHVlKSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZWRTZXR0aW5ncy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWR2YW5jZWRTZXR0aW5ncy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgIH07XG4gICAgdGhpcy5vcGVuQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmhhbmRsZU9wZW4oKTtcbiAgICB0aGlzLmNhbmNlbEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gdGhpcy5oYW5kbGVDYW5jZWwoKTtcbiAgfVxuXG4gIHNldFBvcnRzKHBvcnRzKSB7XG4gICAgcmVtb3ZlQ2hpbGRyZW5PZih0aGlzLnBvcnRzU2VsZWN0KTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9ydHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0aW9uLnZhbHVlID0gcG9ydHNbaV0ucG9ydDtcbiAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IHBvcnRzW2ldLmRlc2NyaXB0aW9uICsgJyBhdCAnICsgcG9ydHNbaV0ucG9ydDtcbiAgICAgIHRoaXMucG9ydHNTZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICB9XG4gIH1cblxuICBzZXRPcHRpb24ob3B0aW9uTmFtZSwgb3B0aW9uVmFsdWUpIHtcbiAgICBjb25zdCBzZWxlY3RvciA9IGAqW2RhdGEtbW9uaXRvci1vcHRpb249XCIke29wdGlvbk5hbWV9XCJdYDtcbiAgICBjb25zdCBpbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgaWYgKCFpbnB1dEVsZW1lbnQpIHtcbiAgICAgIGNvbnNvbGUud2FybihgRWxlbWVudCBmb3Igb3B0aW9uIFwiJHtvcHRpb25OYW1lfVwiIG5vdCBmb3VuZC5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaW5wdXRFbGVtZW50LnR5cGUgPT09ICdzZWxlY3QnKSB7XG4gICAgICAvLyBTZXQgdmFsdWUgb25seSBpZiB0aGVyZSBpcyBvcHRpb24gd2l0aCB0aGF0IHZhbHVlLlxuICAgICAgLy8gVXNmdWwgZm9yIHBvcnQgb3B0aW9uLCBiZWNhdXNlIHRoZSBwb3J0IHVzZXIgY29ubmVjdGVkIG9uY2UgbWF5IG5vdFxuICAgICAgLy8gYmUgcHJlc2VudCBhbGwgdGhlIHRpbWUuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0RWxlbWVudC5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoaW5wdXRFbGVtZW50LmNoaWxkcmVuW2ldLnZhbHVlID09PSBvcHRpb25WYWx1ZSkge1xuICAgICAgICAgIGlucHV0RWxlbWVudC52YWx1ZSA9IG9wdGlvblZhbHVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlucHV0RWxlbWVudC52YWx1ZSA9IG9wdGlvblZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIGdldEFsbFNldHRpbmdzKCkge1xuICAgIGNvbnN0IHNldHRpbmdzID0ge307XG4gICAgY29uc3QgaXRlbXMgPSBbXS5zbGljZS5jYWxsKHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubW9uaXRvci1vcHRpb24nKSk7XG4gICAgZm9yIChjb25zdCBlbGVtIG9mIGl0ZW1zKSB7XG4gICAgICBzZXR0aW5nc1tlbGVtLmRhdGFzZXQubW9uaXRvck9wdGlvbl0gPSBlbGVtLnZhbHVlO1xuICAgIH1cbiAgICByZXR1cm4gc2V0dGluZ3M7XG4gIH1cblxuICBoYW5kbGVPcGVuKCkge31cbiAgaGFuZGxlQ2FuY2VsKCkge31cbn1cbiJdfQ==