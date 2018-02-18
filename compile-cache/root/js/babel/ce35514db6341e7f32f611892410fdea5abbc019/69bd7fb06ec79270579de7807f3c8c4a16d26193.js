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

var _versionsView = require('../versions/view');

var _utils = require('../utils');

'use babel';
var AboutView = (function (_BaseView) {
  _inherits(AboutView, _BaseView);

  function AboutView() {
    _classCallCheck(this, _AboutView);

    _get(Object.getPrototypeOf(_AboutView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(AboutView, [{
    key: 'initialize',
    value: function initialize(uri) {
      this.uri = uri;

      this.versionsView = new _versionsView.VersionsView();
      this.element.querySelector('.versions').appendChild(this.versionsView.getElement());
    }
  }, {
    key: 'getTitle',
    value: function getTitle() {
      return 'About';
    }
  }, {
    key: 'getIconName',
    value: function getIconName() {
      return 'info';
    }
  }, {
    key: 'getURI',
    value: function getURI() {
      return this.uri;
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.versionsView.destroy();
      _get(Object.getPrototypeOf(_AboutView.prototype), 'destroy', this).call(this);
    }
  }]);

  var _AboutView = AboutView;
  AboutView = (0, _utils.withTemplate)(__dirname)(AboutView) || AboutView;
  return AboutView;
})(_baseView2['default']);

exports.AboutView = AboutView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9hYm91dC92aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7d0JBbUJxQixjQUFjOzs7OzRCQUNSLGtCQUFrQjs7cUJBQ2xCLFVBQVU7O0FBckJyQyxXQUFXLENBQUM7SUF3QkMsU0FBUztZQUFULFNBQVM7O1dBQVQsU0FBUzs7Ozs7O2VBQVQsU0FBUzs7V0FFVixvQkFBQyxHQUFHLEVBQUU7QUFDZCxVQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFZixVQUFJLENBQUMsWUFBWSxHQUFHLGdDQUFrQixDQUFDO0FBQ3ZDLFVBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7S0FDckY7OztXQUVPLG9CQUFHO0FBQ1QsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUVVLHVCQUFHO0FBQ1osYUFBTyxNQUFNLENBQUM7S0FDZjs7O1dBRUssa0JBQUc7QUFDUCxhQUFPLElBQUksQ0FBQyxHQUFHLENBQUM7S0FDakI7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM1QixvRkFBZ0I7S0FDakI7OzttQkF4QlUsU0FBUztBQUFULFdBQVMsR0FEckIseUJBQWEsU0FBUyxDQUFDLENBQ1gsU0FBUyxLQUFULFNBQVM7U0FBVCxTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9hYm91dC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCBCYXNlVmlldyBmcm9tICcuLi9iYXNlLXZpZXcnO1xuaW1wb3J0IHtWZXJzaW9uc1ZpZXd9IGZyb20gJy4uL3ZlcnNpb25zL3ZpZXcnO1xuaW1wb3J0IHt3aXRoVGVtcGxhdGV9IGZyb20gJy4uL3V0aWxzJztcblxuQHdpdGhUZW1wbGF0ZShfX2Rpcm5hbWUpXG5leHBvcnQgY2xhc3MgQWJvdXRWaWV3IGV4dGVuZHMgQmFzZVZpZXd7XG5cbiAgaW5pdGlhbGl6ZSh1cmkpIHtcbiAgICB0aGlzLnVyaSA9IHVyaTtcblxuICAgIHRoaXMudmVyc2lvbnNWaWV3ID0gbmV3IFZlcnNpb25zVmlldygpO1xuICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcudmVyc2lvbnMnKS5hcHBlbmRDaGlsZCh0aGlzLnZlcnNpb25zVmlldy5nZXRFbGVtZW50KCkpO1xuICB9XG5cbiAgZ2V0VGl0bGUoKSB7XG4gICAgcmV0dXJuICdBYm91dCc7XG4gIH1cblxuICBnZXRJY29uTmFtZSgpIHtcbiAgICByZXR1cm4gJ2luZm8nO1xuICB9XG5cbiAgZ2V0VVJJKCkge1xuICAgIHJldHVybiB0aGlzLnVyaTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy52ZXJzaW9uc1ZpZXcuZGVzdHJveSgpO1xuICAgIHN1cGVyLmRlc3Ryb3koKTtcbiAgfVxufVxuIl19