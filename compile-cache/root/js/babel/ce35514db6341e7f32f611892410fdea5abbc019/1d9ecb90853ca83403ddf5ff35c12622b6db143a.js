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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

'use babel';
var BaseView = (function () {
  function BaseView() {
    _classCallCheck(this, BaseView);

    this.element = this.buildElement();
    this.initialize.apply(this, arguments);
  }

  /**
   * Creates an HTML element for a view.
   *
   * Subclasses must either provide a __template attribute (e.g., via
   * @withTemplate decorator) or override this method.
   */

  _createClass(BaseView, [{
    key: 'buildElement',
    value: function buildElement() {
      var templateString = _fs2['default'].readFileSync(this.__template, { encoding: 'utf-8' });
      var parser = new DOMParser();
      var doc = parser.parseFromString(templateString, 'text/html');
      return doc.querySelector('.pio-template-root').cloneNode(true);
    }

    /**
     * Performs an initialization of a view instance.
     */
  }, {
    key: 'initialize',
    value: function initialize() {}
  }, {
    key: 'getElement',
    value: function getElement() {
      return this.element;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.element.remove();
    }
  }]);

  return BaseView;
})();

exports['default'] = BaseView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9iYXNlLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQW1CZSxJQUFJOzs7O0FBbkJuQixXQUFXLENBQUM7SUFxQlMsUUFBUTtBQUNoQixXQURRLFFBQVEsR0FDYjswQkFESyxRQUFROztBQUV6QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUNuQyxRQUFJLENBQUMsVUFBVSxNQUFBLENBQWYsSUFBSSxFQUFlLFNBQVMsQ0FBQyxDQUFDO0dBQy9COzs7Ozs7Ozs7ZUFKa0IsUUFBUTs7V0FZZix3QkFBRztBQUNiLFVBQU0sY0FBYyxHQUFHLGdCQUFHLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7QUFDN0UsVUFBTSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztBQUMvQixVQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsZUFBZSxDQUFDLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQztBQUNoRSxhQUFPLEdBQUcsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEU7Ozs7Ozs7V0FLUyxzQkFBRyxFQUFFOzs7V0FFTCxzQkFBRztBQUNYLGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3ZCOzs7U0E5QmtCLFFBQVE7OztxQkFBUixRQUFRIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9iYXNlLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0IGZzIGZyb20gJ2ZzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFzZVZpZXcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmVsZW1lbnQgPSB0aGlzLmJ1aWxkRWxlbWVudCgpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZSguLi5hcmd1bWVudHMpO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYW4gSFRNTCBlbGVtZW50IGZvciBhIHZpZXcuXG4gICAqXG4gICAqIFN1YmNsYXNzZXMgbXVzdCBlaXRoZXIgcHJvdmlkZSBhIF9fdGVtcGxhdGUgYXR0cmlidXRlIChlLmcuLCB2aWFcbiAgICogQHdpdGhUZW1wbGF0ZSBkZWNvcmF0b3IpIG9yIG92ZXJyaWRlIHRoaXMgbWV0aG9kLlxuICAgKi9cbiAgYnVpbGRFbGVtZW50KCkge1xuICAgIGNvbnN0IHRlbXBsYXRlU3RyaW5nID0gZnMucmVhZEZpbGVTeW5jKHRoaXMuX190ZW1wbGF0ZSwge2VuY29kaW5nOiAndXRmLTgnfSk7XG4gICAgY29uc3QgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgIGNvbnN0IGRvYyA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcodGVtcGxhdGVTdHJpbmcsICd0ZXh0L2h0bWwnKTtcbiAgICByZXR1cm4gZG9jLnF1ZXJ5U2VsZWN0b3IoJy5waW8tdGVtcGxhdGUtcm9vdCcpLmNsb25lTm9kZSh0cnVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQZXJmb3JtcyBhbiBpbml0aWFsaXphdGlvbiBvZiBhIHZpZXcgaW5zdGFuY2UuXG4gICAqL1xuICBpbml0aWFsaXplKCkge31cblxuICBnZXRFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnQ7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuZWxlbWVudC5yZW1vdmUoKTtcbiAgfVxufVxuIl19