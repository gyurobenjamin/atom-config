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
var BoardsSelectView = (function (_BaseView) {
  _inherits(BoardsSelectView, _BaseView);

  function BoardsSelectView() {
    _classCallCheck(this, _BoardsSelectView);

    _get(Object.getPrototypeOf(_BoardsSelectView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(BoardsSelectView, [{
    key: 'initialize',
    value: function initialize(boards) {
      var _this = this;

      // Find important nodes
      this.boardsSelect = this.element.querySelector('.boards-select');
      this.selectedBoardsUl = this.element.querySelector('.selected-boards');
      this.placeholder = this.element.querySelector('.selected-placeholder');

      // Set handlers
      this.boardsSelect.onchange = function (event) {
        _this.selectedBoards.add(event.target.value);
        _this.filterBoardsChoices();
        _this.renderSelectedBoards();
        _this.handleSelectBoard();
      };

      this.allBoards = {};
      this.selectedBoards = new Set();

      this.setBoards(boards);
    }
  }, {
    key: 'getDirectory',
    value: function getDirectory() {
      return this.directorySelect.value;
    }
  }, {
    key: 'setBoards',
    value: function setBoards(boards) {
      this.allBoards = (0, _utils.clone)(boards);
      this.filterBoardsChoices();
    }
  }, {
    key: 'getSelectedBoards',
    value: function getSelectedBoards() {
      return this.selectedBoards;
    }
  }, {
    key: 'filterBoardsChoices',
    value: function filterBoardsChoices() {
      var _this2 = this;

      var defaultOption = document.createElement('option');
      defaultOption.textContent = '-- choose a board --';
      defaultOption.selected = true;
      defaultOption.disabled = true;

      // Sort boards by name
      var sortedKeys = Object.keys(this.allBoards).sort(function (a, b) {
        if (_this2.allBoards[a].name > _this2.allBoards[b].name) {
          return 1;
        } else if (_this2.allBoards[a].name < _this2.allBoards[b].name) {
          return -1;
        } else {
          return 0;
        }
      });

      var groups = {};
      for (var boardId of sortedKeys) {
        var board = this.allBoards[boardId];

        // Hide already selected boards
        if (this.selectedBoards.has(boardId)) {
          continue;
        }

        if (!groups.hasOwnProperty(board.vendor)) {
          groups[board.vendor] = document.createElement('optgroup');
          groups[board.vendor].label = board.vendor;
        }

        var option = document.createElement('option');
        option.value = boardId;
        option.textContent = board.name;
        groups[board.vendor].appendChild(option);
      }

      (0, _utils.removeChildrenOf)(this.boardsSelect);
      this.boardsSelect.appendChild(defaultOption);
      var vendorNames = Object.keys(groups).sort();
      for (var i = 0; i < vendorNames.length; i++) {
        this.boardsSelect.appendChild(groups[vendorNames[i]]);
      }
    }
  }, {
    key: 'handleSelectBoard',
    value: function handleSelectBoard() {}
  }, {
    key: 'renderSelectedBoards',
    value: function renderSelectedBoards() {
      var _this3 = this;

      this.checkPlaceholderAndUlVisibility();
      (0, _utils.removeChildrenOf)(this.selectedBoardsUl);
      this.selectedBoards.forEach(function (boardId) {
        _this3.selectedBoardsUl.appendChild(_this3.createSelected(boardId));
      });
    }
  }, {
    key: 'createSelected',
    value: function createSelected(boardId) {
      var _this4 = this;

      var li = document.createElement('li'),
          name = document.createElement('span'),
          icon = document.createElement('span'),
          unselect = document.createElement('a');

      li['data-board-id'] = boardId;

      name.textContent = this.allBoards[boardId].name;

      icon.classList.add('icon');
      icon.classList.add('icon-x');

      unselect.href = '#';
      unselect.classList.add('unselect');
      unselect.onclick = function (e) {
        return _this4.handleRemove(e);
      };
      unselect.appendChild(icon);

      li.appendChild(name);
      li.appendChild(unselect);

      return li;
    }
  }, {
    key: 'handleRemove',
    value: function handleRemove(event) {
      this.selectedBoards['delete'](event.target.parentNode.parentNode['data-board-id']);
      event.target.parentNode.parentNode.remove();
      this.checkPlaceholderAndUlVisibility();
      this.handleSelectBoard();
    }
  }, {
    key: 'checkPlaceholderAndUlVisibility',
    value: function checkPlaceholderAndUlVisibility() {
      if (this.selectedBoards.length < 1) {
        this.placeholder.style.display = 'block';
        this.selectedBoardsUl.style.display = 'none';
      } else {
        this.placeholder.style.display = 'none';
        this.selectedBoardsUl.style.display = 'block';
      }
    }
  }]);

  var _BoardsSelectView = BoardsSelectView;
  BoardsSelectView = (0, _utils.withTemplate)(__dirname)(BoardsSelectView) || BoardsSelectView;
  return BoardsSelectView;
})(_baseView2['default']);

exports.BoardsSelectView = BoardsSelectView;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9ib2FyZHMtc2VsZWN0L3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQm9ELFVBQVU7O3dCQUN6QyxjQUFjOzs7O0FBcEJuQyxXQUFXLENBQUM7SUF1QkMsZ0JBQWdCO1lBQWhCLGdCQUFnQjs7V0FBaEIsZ0JBQWdCOzs7Ozs7ZUFBaEIsZ0JBQWdCOztXQUVqQixvQkFBQyxNQUFNLEVBQUU7Ozs7QUFFakIsVUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2pFLFVBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3ZFLFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7O0FBR3ZFLFVBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHLFVBQUMsS0FBSyxFQUFLO0FBQ3RDLGNBQUssY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzVDLGNBQUssbUJBQW1CLEVBQUUsQ0FBQztBQUMzQixjQUFLLG9CQUFvQixFQUFFLENBQUM7QUFDNUIsY0FBSyxpQkFBaUIsRUFBRSxDQUFDO09BQzFCLENBQUM7O0FBRUYsVUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDcEIsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVoQyxVQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ3hCOzs7V0FFVyx3QkFBRztBQUNiLGFBQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFL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Ozs7V0FFVyxzQkFBQyxLQUFLLEVBQUU7QUFDbEIsVUFBSSxDQUFDLGNBQWMsVUFBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0FBQ2hGLFdBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUM1QyxVQUFJLENBQUMsK0JBQStCLEVBQUUsQ0FBQztBQUN2QyxVQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztLQUMxQjs7O1dBRThCLDJDQUFHO0FBQ2hDLFVBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ2xDLFlBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDekMsWUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO09BQzlDLE1BQU07QUFDTCxZQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBQ3hDLFlBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztPQUMvQztLQUNGOzs7MEJBbElVLGdCQUFnQjtBQUFoQixrQkFBZ0IsR0FENUIseUJBQWEsU0FBUyxDQUFDLENBQ1gsZ0JBQWdCLEtBQWhCLGdCQUFnQjtTQUFoQixnQkFBZ0IiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUvbGliL2JvYXJkcy1zZWxlY3Qvdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKipcbiAqIENvcHlyaWdodCAoQykgMjAxNiBJdmFuIEtyYXZldHMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgZmlsZSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3JcbiAqIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMlxuICogYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nXG4gKiB3aXRoIHRoaXMgcHJvZ3JhbTsgaWYgbm90LCB3cml0ZSB0byB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBJbmMuLFxuICogNTEgRnJhbmtsaW4gU3RyZWV0LCBGaWZ0aCBGbG9vciwgQm9zdG9uLCBNQSAwMjExMC0xMzAxIFVTQS5cbiAqL1xuXG5pbXBvcnQge2Nsb25lLCByZW1vdmVDaGlsZHJlbk9mLCB3aXRoVGVtcGxhdGV9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBCYXNlVmlldyBmcm9tICcuLi9iYXNlLXZpZXcnO1xuXG5Ad2l0aFRlbXBsYXRlKF9fZGlybmFtZSlcbmV4cG9ydCBjbGFzcyBCb2FyZHNTZWxlY3RWaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuXG4gIGluaXRpYWxpemUoYm9hcmRzKSB7XG4gICAgLy8gRmluZCBpbXBvcnRhbnQgbm9kZXNcbiAgICB0aGlzLmJvYXJkc1NlbGVjdCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuYm9hcmRzLXNlbGVjdCcpO1xuICAgIHRoaXMuc2VsZWN0ZWRCb2FyZHNVbCA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQtYm9hcmRzJyk7XG4gICAgdGhpcy5wbGFjZWhvbGRlciA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQtcGxhY2Vob2xkZXInKTtcblxuICAgIC8vIFNldCBoYW5kbGVyc1xuICAgIHRoaXMuYm9hcmRzU2VsZWN0Lm9uY2hhbmdlID0gKGV2ZW50KSA9PiB7XG4gICAgICB0aGlzLnNlbGVjdGVkQm9hcmRzLmFkZChldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgdGhpcy5maWx0ZXJCb2FyZHNDaG9pY2VzKCk7XG4gICAgICB0aGlzLnJlbmRlclNlbGVjdGVkQm9hcmRzKCk7XG4gICAgICB0aGlzLmhhbmRsZVNlbGVjdEJvYXJkKCk7XG4gICAgfTtcblxuICAgIHRoaXMuYWxsQm9hcmRzID0ge307XG4gICAgdGhpcy5zZWxlY3RlZEJvYXJkcyA9IG5ldyBTZXQoKTtcblxuICAgIHRoaXMuc2V0Qm9hcmRzKGJvYXJkcyk7XG4gIH1cblxuICBnZXREaXJlY3RvcnkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlyZWN0b3J5U2VsZWN0LnZhbHVlO1xuICB9XG5cbiAgc2V0Qm9hcmRzKGJvYXJkcykge1xuICAgIHRoaXMuYWxsQm9hcmRzID0gY2xvbmUoYm9hcmRzKTtcbiAgICB0aGlzLmZpbHRlckJvYXJkc0Nob2ljZXMoKTtcbiAgfVxuXG4gIGdldFNlbGVjdGVkQm9hcmRzKCkge1xuICAgIHJldHVybiB0aGlzLnNlbGVjdGVkQm9hcmRzO1xuICB9XG5cbiAgZmlsdGVyQm9hcmRzQ2hvaWNlcygpIHtcbiAgICB2YXIgZGVmYXVsdE9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgIGRlZmF1bHRPcHRpb24udGV4dENvbnRlbnQgPSAnLS0gY2hvb3NlIGEgYm9hcmQgLS0nO1xuICAgIGRlZmF1bHRPcHRpb24uc2VsZWN0ZWQgPSB0cnVlO1xuICAgIGRlZmF1bHRPcHRpb24uZGlzYWJsZWQgPSB0cnVlO1xuXG4gICAgLy8gU29ydCBib2FyZHMgYnkgbmFtZVxuICAgIGNvbnN0IHNvcnRlZEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmFsbEJvYXJkcykuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKHRoaXMuYWxsQm9hcmRzW2FdLm5hbWUgPiB0aGlzLmFsbEJvYXJkc1tiXS5uYW1lKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmFsbEJvYXJkc1thXS5uYW1lIDwgdGhpcy5hbGxCb2FyZHNbYl0ubmFtZSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IGdyb3VwcyA9IHt9O1xuICAgIGZvciAoY29uc3QgYm9hcmRJZCBvZiBzb3J0ZWRLZXlzKSB7XG4gICAgICBjb25zdCBib2FyZCA9IHRoaXMuYWxsQm9hcmRzW2JvYXJkSWRdO1xuXG4gICAgICAvLyBIaWRlIGFscmVhZHkgc2VsZWN0ZWQgYm9hcmRzXG4gICAgICBpZiAodGhpcy5zZWxlY3RlZEJvYXJkcy5oYXMoYm9hcmRJZCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghZ3JvdXBzLmhhc093blByb3BlcnR5KGJvYXJkLnZlbmRvcikpIHtcbiAgICAgICAgZ3JvdXBzW2JvYXJkLnZlbmRvcl0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRncm91cCcpO1xuICAgICAgICBncm91cHNbYm9hcmQudmVuZG9yXS5sYWJlbCA9IGJvYXJkLnZlbmRvcjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHRpb24udmFsdWUgPSBib2FyZElkO1xuICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gYm9hcmQubmFtZTtcbiAgICAgIGdyb3Vwc1tib2FyZC52ZW5kb3JdLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ2hpbGRyZW5PZih0aGlzLmJvYXJkc1NlbGVjdCk7XG4gICAgdGhpcy5ib2FyZHNTZWxlY3QuYXBwZW5kQ2hpbGQoZGVmYXVsdE9wdGlvbik7XG4gICAgY29uc3QgdmVuZG9yTmFtZXMgPSBPYmplY3Qua2V5cyhncm91cHMpLnNvcnQoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHZlbmRvck5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB0aGlzLmJvYXJkc1NlbGVjdC5hcHBlbmRDaGlsZChncm91cHNbdmVuZG9yTmFtZXNbaV1dKTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTZWxlY3RCb2FyZCgpIHt9XG5cbiAgcmVuZGVyU2VsZWN0ZWRCb2FyZHMoKSB7XG4gICAgdGhpcy5jaGVja1BsYWNlaG9sZGVyQW5kVWxWaXNpYmlsaXR5KCk7XG4gICAgcmVtb3ZlQ2hpbGRyZW5PZih0aGlzLnNlbGVjdGVkQm9hcmRzVWwpO1xuICAgIHRoaXMuc2VsZWN0ZWRCb2FyZHMuZm9yRWFjaCgoYm9hcmRJZCkgPT4ge1xuICAgICAgdGhpcy5zZWxlY3RlZEJvYXJkc1VsLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlU2VsZWN0ZWQoYm9hcmRJZCkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlU2VsZWN0ZWQoYm9hcmRJZCkge1xuICAgIGNvbnN0XG4gICAgICBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyksXG4gICAgICBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgICAgaWNvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKSxcbiAgICAgIHVuc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuXG4gICAgbGlbJ2RhdGEtYm9hcmQtaWQnXSA9IGJvYXJkSWQ7XG5cbiAgICBuYW1lLnRleHRDb250ZW50ID0gdGhpcy5hbGxCb2FyZHNbYm9hcmRJZF0ubmFtZTtcblxuICAgIGljb24uY2xhc3NMaXN0LmFkZCgnaWNvbicpO1xuICAgIGljb24uY2xhc3NMaXN0LmFkZCgnaWNvbi14Jyk7XG5cbiAgICB1bnNlbGVjdC5ocmVmID0gJyMnO1xuICAgIHVuc2VsZWN0LmNsYXNzTGlzdC5hZGQoJ3Vuc2VsZWN0Jyk7XG4gICAgdW5zZWxlY3Qub25jbGljayA9IChlKSA9PiB0aGlzLmhhbmRsZVJlbW92ZShlKTtcbiAgICB1bnNlbGVjdC5hcHBlbmRDaGlsZChpY29uKTtcblxuICAgIGxpLmFwcGVuZENoaWxkKG5hbWUpO1xuICAgIGxpLmFwcGVuZENoaWxkKHVuc2VsZWN0KTtcblxuICAgIHJldHVybiBsaTtcbiAgfVxuXG4gIGhhbmRsZVJlbW92ZShldmVudCkge1xuICAgIHRoaXMuc2VsZWN0ZWRCb2FyZHMuZGVsZXRlKGV2ZW50LnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGVbJ2RhdGEtYm9hcmQtaWQnXSk7XG4gICAgZXZlbnQudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5yZW1vdmUoKTtcbiAgICB0aGlzLmNoZWNrUGxhY2Vob2xkZXJBbmRVbFZpc2liaWxpdHkoKTtcbiAgICB0aGlzLmhhbmRsZVNlbGVjdEJvYXJkKCk7XG4gIH1cblxuICBjaGVja1BsYWNlaG9sZGVyQW5kVWxWaXNpYmlsaXR5KCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkQm9hcmRzLmxlbmd0aCA8IDEpIHtcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLnNlbGVjdGVkQm9hcmRzVWwuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wbGFjZWhvbGRlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgdGhpcy5zZWxlY3RlZEJvYXJkc1VsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cbiAgfVxufVxuIl19
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/boards-select/view.js
