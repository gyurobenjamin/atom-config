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

var _boardsSelectView = require('../boards-select/view');

'use babel';
var InitializeNewProjectView = (function (_BaseView) {
  _inherits(InitializeNewProjectView, _BaseView);

  function InitializeNewProjectView() {
    _classCallCheck(this, _InitializeNewProjectView);

    _get(Object.getPrototypeOf(_InitializeNewProjectView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(InitializeNewProjectView, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      // Find important nodes
      this.boardsSelectWrapper = this.element.querySelector('.boards-select-wrapper');
      this.directorySelect = this.element.querySelector('.directory-select');
      this.otherDirectoryButton = this.element.querySelector('.other-directory');
      this.doInitButton = this.element.querySelector('.controls .do-init');
      this.cancelButton = this.element.querySelector('.controls .cancel');
      this.commandStatusWrapper = this.element.querySelector('.command-status');
      this.commandStatusContent = this.commandStatusWrapper.querySelector('.content');
      this.commandStatusSpinner = this.commandStatusWrapper.querySelector('.icon');

      // Set handlers
      this.otherDirectoryButton.onclick = function () {
        atom.pickFolder(function (selectedPaths) {
          if (!selectedPaths) {
            return;
          }
          _this.addDirectories(selectedPaths, selectedPaths[selectedPaths.length - 1]);
          _this.updateInitButtonDisabled();
        });
      };
      this.doInitButton.onclick = function () {
        _this.doInitButton.textContent = 'Processing...';
        _this.doInitButton.disabled = true;
        _this.handleInit();
      };
      this.cancelButton.onclick = function () {
        return _this.handleCancel();
      };

      this.initializeBoardsSelect();
    }
  }, {
    key: 'initializeBoardsSelect',
    value: function initializeBoardsSelect() {
      var _this2 = this;

      var boards = (0, _utils.getBoards)();
      (0, _utils.removeChildrenOf)(this.boardsSelectWrapper);
      this.boardsSelect = new _boardsSelectView.BoardsSelectView(boards);
      this.boardsSelectWrapper.appendChild(this.boardsSelect.getElement());
      this.boardsSelect.handleSelectBoard = function () {
        return _this2.updateInitButtonDisabled();
      };
    }
  }, {
    key: 'addDirectories',
    value: function addDirectories(directories, activeDir) {
      for (var dir of directories) {
        var option = document.createElement('option');
        option.value = dir;
        option.textContent = dir;
        if (dir == activeDir) {
          option.selected = true;
        }
        this.directorySelect.appendChild(option);
      }
    }
  }, {
    key: 'getDirectory',
    value: function getDirectory() {
      return this.directorySelect.value;
    }
  }, {
    key: 'getSelectedBoards',
    value: function getSelectedBoards() {
      return this.boardsSelect.getSelectedBoards();
    }
  }, {
    key: 'updateInitButtonDisabled',
    value: function updateInitButtonDisabled() {
      var boardsSelected = this.boardsSelect && this.getSelectedBoards().size > 0;
      var directorySelected = this.directorySelect.value.toString().length > 0;
      this.doInitButton.disabled = !boardsSelected || !directorySelected;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(text) {
      this.commandStatusWrapper.style.display = 'block';
      this.commandStatusContent.textContent = text;
    }
  }, {
    key: 'handleInit',
    value: function handleInit() {}
  }, {
    key: 'handleCancel',
    value: function handleCancel() {}
  }]);

  var _InitializeNewProjectView = InitializeNewProjectView;
  InitializeNewProjectView = (0, _utils.withTemplate)(__dirname)(InitializeNewProjectView) || InitializeNewProjectView;
  return InitializeNewProjectView;
})(_baseView2['default']);

exports.InitializeNewProjectView = InitializeNewProjectView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbml0L3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQndELFVBQVU7O3dCQUM3QyxjQUFjOzs7O2dDQUNKLHVCQUF1Qjs7QUFyQnRELFdBQVcsQ0FBQztJQXdCQyx3QkFBd0I7WUFBeEIsd0JBQXdCOztXQUF4Qix3QkFBd0I7Ozs7OztlQUF4Qix3QkFBd0I7O1dBRXpCLHNCQUFHOzs7O0FBRVgsVUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFDaEYsVUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0FBQ3ZFLFVBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzNFLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUNyRSxVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDcEUsVUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDMUUsVUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDaEYsVUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7OztBQUc3RSxVQUFJLENBQUMsb0JBQW9C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bmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbml0L3ZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0IHtnZXRCb2FyZHMsIHJlbW92ZUNoaWxkcmVuT2YsIHdpdGhUZW1wbGF0ZX0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEJhc2VWaWV3IGZyb20gJy4uL2Jhc2Utdmlldyc7XG5pbXBvcnQge0JvYXJkc1NlbGVjdFZpZXd9IGZyb20gJy4uL2JvYXJkcy1zZWxlY3Qvdmlldyc7XG5cbkB3aXRoVGVtcGxhdGUoX19kaXJuYW1lKVxuZXhwb3J0IGNsYXNzIEluaXRpYWxpemVOZXdQcm9qZWN0VmlldyBleHRlbmRzIEJhc2VWaWV3IHtcblxuICBpbml0aWFsaXplKCkge1xuICAgIC8vIEZpbmQgaW1wb3J0YW50IG5vZGVzXG4gICAgdGhpcy5ib2FyZHNTZWxlY3RXcmFwcGVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5ib2FyZHMtc2VsZWN0LXdyYXBwZXInKTtcbiAgICB0aGlzLmRpcmVjdG9yeVNlbGVjdCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGlyZWN0b3J5LXNlbGVjdCcpO1xuICAgIHRoaXMub3RoZXJEaXJlY3RvcnlCdXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLm90aGVyLWRpcmVjdG9yeScpO1xuICAgIHRoaXMuZG9Jbml0QnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9scyAuZG8taW5pdCcpO1xuICAgIHRoaXMuY2FuY2VsQnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9scyAuY2FuY2VsJyk7XG4gICAgdGhpcy5jb21tYW5kU3RhdHVzV3JhcHBlciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuY29tbWFuZC1zdGF0dXMnKTtcbiAgICB0aGlzLmNvbW1hbmRTdGF0dXNDb250ZW50ID0gdGhpcy5jb21tYW5kU3RhdHVzV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuY29udGVudCcpO1xuICAgIHRoaXMuY29tbWFuZFN0YXR1c1NwaW5uZXIgPSB0aGlzLmNvbW1hbmRTdGF0dXNXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5pY29uJyk7XG5cbiAgICAvLyBTZXQgaGFuZGxlcnNcbiAgICB0aGlzLm90aGVyRGlyZWN0b3J5QnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICBhdG9tLnBpY2tGb2xkZXIoKHNlbGVjdGVkUGF0aHMpID0+IHtcbiAgICAgICAgaWYgKCFzZWxlY3RlZFBhdGhzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkRGlyZWN0b3JpZXMoc2VsZWN0ZWRQYXRocywgc2VsZWN0ZWRQYXRoc1tzZWxlY3RlZFBhdGhzLmxlbmd0aCAtIDFdKTtcbiAgICAgICAgdGhpcy51cGRhdGVJbml0QnV0dG9uRGlzYWJsZWQoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgdGhpcy5kb0luaXRCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgIHRoaXMuZG9Jbml0QnV0dG9uLnRleHRDb250ZW50ID0gJ1Byb2Nlc3NpbmcuLi4nO1xuICAgICAgdGhpcy5kb0luaXRCdXR0b24uZGlzYWJsZWQgPSB0cnVlO1xuICAgICAgdGhpcy5oYW5kbGVJbml0KCk7XG4gICAgfTtcbiAgICB0aGlzLmNhbmNlbEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gdGhpcy5oYW5kbGVDYW5jZWwoKTtcblxuICAgIHRoaXMuaW5pdGlhbGl6ZUJvYXJkc1NlbGVjdCgpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUJvYXJkc1NlbGVjdCgpIHtcbiAgICBjb25zdCBib2FyZHMgPSBnZXRCb2FyZHMoKTtcbiAgICByZW1vdmVDaGlsZHJlbk9mKHRoaXMuYm9hcmRzU2VsZWN0V3JhcHBlcik7XG4gICAgdGhpcy5ib2FyZHNTZWxlY3QgPSBuZXcgQm9hcmRzU2VsZWN0Vmlldyhib2FyZHMpO1xuICAgIHRoaXMuYm9hcmRzU2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJvYXJkc1NlbGVjdC5nZXRFbGVtZW50KCkpO1xuICAgIHRoaXMuYm9hcmRzU2VsZWN0LmhhbmRsZVNlbGVjdEJvYXJkID0gKCkgPT4gdGhpcy51cGRhdGVJbml0QnV0dG9uRGlzYWJsZWQoKTtcbiAgfVxuXG4gIGFkZERpcmVjdG9yaWVzKGRpcmVjdG9yaWVzLCBhY3RpdmVEaXIpIHtcbiAgICBmb3IgKGNvbnN0IGRpciBvZiBkaXJlY3Rvcmllcykge1xuICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHRpb24udmFsdWUgPSBkaXI7XG4gICAgICBvcHRpb24udGV4dENvbnRlbnQgPSBkaXI7XG4gICAgICBpZiAoZGlyID09IGFjdGl2ZURpcikge1xuICAgICAgICBvcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5kaXJlY3RvcnlTZWxlY3QuYXBwZW5kQ2hpbGQob3B0aW9uKTtcbiAgICB9XG4gIH1cblxuICBnZXREaXJlY3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlyZWN0b3J5U2VsZWN0LnZhbHVlO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRCb2FyZHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuYm9hcmRzU2VsZWN0LmdldFNlbGVjdGVkQm9hcmRzKCk7XG4gIH1cblxuICB1cGRhdGVJbml0QnV0dG9uRGlzYWJsZWQoKSB7XG4gICAgY29uc3QgYm9hcmRzU2VsZWN0ZWQgPSB0aGlzLmJvYXJkc1NlbGVjdCAmJiB0aGlzLmdldFNlbGVjdGVkQm9hcmRzKCkuc2l6ZSA+IDA7XG4gICAgY29uc3QgZGlyZWN0b3J5U2VsZWN0ZWQgPSB0aGlzLmRpcmVjdG9yeVNlbGVjdC52YWx1ZS50b1N0cmluZygpLmxlbmd0aCA+IDA7XG4gICAgdGhpcy5kb0luaXRCdXR0b24uZGlzYWJsZWQgPSAhYm9hcmRzU2VsZWN0ZWQgfHwgIWRpcmVjdG9yeVNlbGVjdGVkO1xuICB9XG5cbiAgc2V0U3RhdHVzKHRleHQpIHtcbiAgICB0aGlzLmNvbW1hbmRTdGF0dXNXcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMuY29tbWFuZFN0YXR1c0NvbnRlbnQudGV4dENvbnRlbnQgPSB0ZXh0O1xuICB9XG5cbiAgaGFuZGxlSW5pdCgpIHt9XG4gIGhhbmRsZUNhbmNlbCgpIHt9XG59XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/init/view.js
