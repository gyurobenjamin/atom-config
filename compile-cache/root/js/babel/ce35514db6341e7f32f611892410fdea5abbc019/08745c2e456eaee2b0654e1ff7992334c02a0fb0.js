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
var ProjectExamplesView = (function (_BaseView) {
  _inherits(ProjectExamplesView, _BaseView);

  function ProjectExamplesView() {
    _classCallCheck(this, _ProjectExamplesView);

    _get(Object.getPrototypeOf(_ProjectExamplesView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ProjectExamplesView, [{
    key: 'initialize',
    value: function initialize(projects) {
      var _this = this;

      this.projects = projects;

      this.projectsSelect = this.element.querySelector('.projects-select');
      this.selectedProjectsUl = this.element.querySelector('.selected-projects');
      this.placeholder = this.element.querySelector('.selected-placeholder');
      this.prepareButton = this.element.querySelector('.do-prepare');
      this.cancelButton = this.element.querySelector('.cancel');
      this.progress = this.element.querySelector('.pio-project-examples-progress');
      this.currentStatus = this.element.querySelector('.current-status');
      this.commandStatusWrapper = this.element.querySelector('.command-status');
      this.commandStatusContent = this.commandStatusWrapper.querySelector('.content');
      this.commandStatusSpinner = this.commandStatusWrapper.querySelector('.icon');

      this.allProjects = {};
      this.selectedProjects = new Set();

      this.projectsSelect.onchange = function (event) {
        _this.selectedProjects.add(event.target.value);
        _this.filterChoices();
        _this.renderSelected();
        _this.updatePrepareButtonDisabled();
      };
      this.prepareButton.onclick = function () {
        return _this.handlePrepare();
      };
      this.cancelButton.onclick = function () {
        return _this.handleCancel();
      };

      this.setProjects(projects);
    }
  }, {
    key: 'getSelectedProjects',
    value: function getSelectedProjects() {
      return this.selectedProjects;
    }
  }, {
    key: 'setProjects',
    value: function setProjects(projects) {
      this.allProjects = projects;
      this.filterChoices();
    }
  }, {
    key: 'filterChoices',
    value: function filterChoices() {
      var _this2 = this;

      var defaultOption = document.createElement('option');
      defaultOption.textContent = '-- add project --';
      defaultOption.selected = true;
      defaultOption.disabled = true;

      var sortedKeys = Object.keys(this.allProjects).sort(function (a, b) {
        if (_this2.allProjects[a] > _this2.allProjects[b]) {
          return 1;
        } else if (_this2.allProjects[a] < _this2.allProjects[b]) {
          return -1;
        } else {
          return 0;
        }
      });

      (0, _utils.removeChildrenOf)(this.projectsSelect);
      this.projectsSelect.appendChild(defaultOption);

      for (var projectPath of sortedKeys) {
        if (this.selectedProjects.has(projectPath)) {
          continue;
        }

        var option = document.createElement('option');
        option.value = projectPath;
        option.textContent = this.allProjects[projectPath];
        this.projectsSelect.appendChild(option);
      }
    }
  }, {
    key: 'renderSelected',
    value: function renderSelected() {
      var _this3 = this;

      this.checkPlaceholderAndUlVisibility();
      (0, _utils.removeChildrenOf)(this.selectedProjectsUl);
      this.selectedProjects.forEach(function (projectPath) {
        _this3.selectedProjectsUl.appendChild(_this3.createSelected(projectPath));
      });
    }
  }, {
    key: 'checkPlaceholderAndUlVisibility',
    value: function checkPlaceholderAndUlVisibility() {
      if (this.selectedProjects.length < 1) {
        this.placeholder.style.display = 'block';
        this.selectedProjectsUl.style.display = 'none';
      } else {
        this.placeholder.style.display = 'none';
        this.selectedProjectsUl.style.display = 'block';
      }
    }
  }, {
    key: 'createSelected',
    value: function createSelected(projectPath) {
      var _this4 = this;

      var li = document.createElement('li'),
          name = document.createElement('span'),
          icon = document.createElement('span'),
          unselect = document.createElement('a');

      li['data-project-path'] = projectPath;

      name.textContent = this.allProjects[projectPath];

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
      this.selectedProjects['delete'](event.target.parentNode.parentNode['data-project-path']);
      event.target.parentNode.parentNode.remove();
      this.checkPlaceholderAndUlVisibility();
      this.filterChoices();
      this.updatePrepareButtonDisabled();
    }
  }, {
    key: 'updatePrepareButtonDisabled',
    value: function updatePrepareButtonDisabled() {
      this.prepareButton.disabled = this.selectedProjects.size === 0;
    }
  }, {
    key: 'setStatus',
    value: function setStatus(text) {
      this.commandStatusWrapper.style.display = 'block';
      this.commandStatusContent.textContent = text;
    }
  }]);

  var _ProjectExamplesView = ProjectExamplesView;
  ProjectExamplesView = (0, _utils.withTemplate)(__dirname)(ProjectExamplesView) || ProjectExamplesView;
  return ProjectExamplesView;
})(_baseView2['default']);

exports.ProjectExamplesView = ProjectExamplesView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9wcm9qZWN0LWV4YW1wbGVzL3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQjZDLFVBQVU7O3dCQUNsQyxjQUFjOzs7O0FBcEJuQyxXQUFXLENBQUM7SUF1QkMsbUJBQW1CO1lBQW5CLG1CQUFtQjs7V0FBbkIsbUJBQW1COzs7Ozs7ZUFBbkIsbUJBQW1COztXQUNwQixvQkFBQyxRQUFRLEVBQUU7OztBQUNuQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3JFLFVBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQzNFLFVBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsQ0FBQztBQUN2RSxVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQy9ELFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDMUQsVUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBQzdFLFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUNuRSxVQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlC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bkIsbUJBQW1CO1NBQW5CLG1CQUFtQiIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS9saWIvcHJvamVjdC1leGFtcGxlcy92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCB7cmVtb3ZlQ2hpbGRyZW5PZiwgd2l0aFRlbXBsYXRlfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgQmFzZVZpZXcgZnJvbSAnLi4vYmFzZS12aWV3JztcblxuQHdpdGhUZW1wbGF0ZShfX2Rpcm5hbWUpXG5leHBvcnQgY2xhc3MgUHJvamVjdEV4YW1wbGVzVmlldyBleHRlbmRzIEJhc2VWaWV3IHtcbiAgaW5pdGlhbGl6ZShwcm9qZWN0cykge1xuICAgIHRoaXMucHJvamVjdHMgPSBwcm9qZWN0cztcblxuICAgIHRoaXMucHJvamVjdHNTZWxlY3QgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzLXNlbGVjdCcpO1xuICAgIHRoaXMuc2VsZWN0ZWRQcm9qZWN0c1VsID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZC1wcm9qZWN0cycpO1xuICAgIHRoaXMucGxhY2Vob2xkZXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkLXBsYWNlaG9sZGVyJyk7XG4gICAgdGhpcy5wcmVwYXJlQnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5kby1wcmVwYXJlJyk7XG4gICAgdGhpcy5jYW5jZWxCdXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNhbmNlbCcpO1xuICAgIHRoaXMucHJvZ3Jlc3MgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnBpby1wcm9qZWN0LWV4YW1wbGVzLXByb2dyZXNzJyk7XG4gICAgdGhpcy5jdXJyZW50U3RhdHVzID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jdXJyZW50LXN0YXR1cycpO1xuICAgIHRoaXMuY29tbWFuZFN0YXR1c1dyYXBwZXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNvbW1hbmQtc3RhdHVzJyk7XG4gICAgdGhpcy5jb21tYW5kU3RhdHVzQ29udGVudCA9IHRoaXMuY29tbWFuZFN0YXR1c1dyYXBwZXIucXVlcnlTZWxlY3RvcignLmNvbnRlbnQnKTtcbiAgICB0aGlzLmNvbW1hbmRTdGF0dXNTcGlubmVyID0gdGhpcy5jb21tYW5kU3RhdHVzV3JhcHBlci5xdWVyeVNlbGVjdG9yKCcuaWNvbicpO1xuXG5cbiAgICB0aGlzLmFsbFByb2plY3RzID0ge307XG4gICAgdGhpcy5zZWxlY3RlZFByb2plY3RzID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy5wcm9qZWN0c1NlbGVjdC5vbmNoYW5nZSA9IChldmVudCkgPT4ge1xuICAgICAgdGhpcy5zZWxlY3RlZFByb2plY3RzLmFkZChldmVudC50YXJnZXQudmFsdWUpO1xuICAgICAgdGhpcy5maWx0ZXJDaG9pY2VzKCk7XG4gICAgICB0aGlzLnJlbmRlclNlbGVjdGVkKCk7XG4gICAgICB0aGlzLnVwZGF0ZVByZXBhcmVCdXR0b25EaXNhYmxlZCgpO1xuICAgIH07XG4gICAgdGhpcy5wcmVwYXJlQnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB0aGlzLmhhbmRsZVByZXBhcmUoKTtcbiAgICB0aGlzLmNhbmNlbEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gdGhpcy5oYW5kbGVDYW5jZWwoKTtcblxuICAgIHRoaXMuc2V0UHJvamVjdHMocHJvamVjdHMpO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRQcm9qZWN0cygpIHtcbiAgICByZXR1cm4gdGhpcy5zZWxlY3RlZFByb2plY3RzO1xuICB9XG5cbiAgc2V0UHJvamVjdHMocHJvamVjdHMpIHtcbiAgICB0aGlzLmFsbFByb2plY3RzID0gcHJvamVjdHM7XG4gICAgdGhpcy5maWx0ZXJDaG9pY2VzKCk7XG4gIH1cblxuICBmaWx0ZXJDaG9pY2VzKCkge1xuICAgIHZhciBkZWZhdWx0T3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgZGVmYXVsdE9wdGlvbi50ZXh0Q29udGVudCA9ICctLSBhZGQgcHJvamVjdCAtLSc7XG4gICAgZGVmYXVsdE9wdGlvbi5zZWxlY3RlZCA9IHRydWU7XG4gICAgZGVmYXVsdE9wdGlvbi5kaXNhYmxlZCA9IHRydWU7XG5cbiAgICBjb25zdCBzb3J0ZWRLZXlzID0gT2JqZWN0LmtleXModGhpcy5hbGxQcm9qZWN0cykuc29ydCgoYSwgYikgPT4ge1xuICAgICAgaWYgKHRoaXMuYWxsUHJvamVjdHNbYV0gPiB0aGlzLmFsbFByb2plY3RzW2JdKSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmFsbFByb2plY3RzW2FdIDwgdGhpcy5hbGxQcm9qZWN0c1tiXSkge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJlbW92ZUNoaWxkcmVuT2YodGhpcy5wcm9qZWN0c1NlbGVjdCk7XG4gICAgdGhpcy5wcm9qZWN0c1NlbGVjdC5hcHBlbmRDaGlsZChkZWZhdWx0T3B0aW9uKTtcblxuICAgIGZvciAoY29uc3QgcHJvamVjdFBhdGggb2Ygc29ydGVkS2V5cykge1xuICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRQcm9qZWN0cy5oYXMocHJvamVjdFBhdGgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIG9wdGlvbi52YWx1ZSA9IHByb2plY3RQYXRoO1xuICAgICAgb3B0aW9uLnRleHRDb250ZW50ID0gdGhpcy5hbGxQcm9qZWN0c1twcm9qZWN0UGF0aF07XG4gICAgICB0aGlzLnByb2plY3RzU2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyU2VsZWN0ZWQoKSB7XG4gICAgdGhpcy5jaGVja1BsYWNlaG9sZGVyQW5kVWxWaXNpYmlsaXR5KCk7XG4gICAgcmVtb3ZlQ2hpbGRyZW5PZih0aGlzLnNlbGVjdGVkUHJvamVjdHNVbCk7XG4gICAgdGhpcy5zZWxlY3RlZFByb2plY3RzLmZvckVhY2goKHByb2plY3RQYXRoKSA9PiB7XG4gICAgICB0aGlzLnNlbGVjdGVkUHJvamVjdHNVbC5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVNlbGVjdGVkKHByb2plY3RQYXRoKSk7XG4gICAgfSk7XG4gIH1cblxuICBjaGVja1BsYWNlaG9sZGVyQW5kVWxWaXNpYmlsaXR5KCkge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkUHJvamVjdHMubGVuZ3RoIDwgMSkge1xuICAgICAgdGhpcy5wbGFjZWhvbGRlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIHRoaXMuc2VsZWN0ZWRQcm9qZWN0c1VsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGxhY2Vob2xkZXIuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgIHRoaXMuc2VsZWN0ZWRQcm9qZWN0c1VsLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIH1cbiAgfVxuXG4gIGNyZWF0ZVNlbGVjdGVkKHByb2plY3RQYXRoKSB7XG4gICAgY29uc3RcbiAgICAgIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKSxcbiAgICAgIG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyksXG4gICAgICBpY29uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpLFxuICAgICAgdW5zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cbiAgICBsaVsnZGF0YS1wcm9qZWN0LXBhdGgnXSA9IHByb2plY3RQYXRoO1xuXG4gICAgbmFtZS50ZXh0Q29udGVudCA9IHRoaXMuYWxsUHJvamVjdHNbcHJvamVjdFBhdGhdO1xuXG4gICAgaWNvbi5jbGFzc0xpc3QuYWRkKCdpY29uJyk7XG4gICAgaWNvbi5jbGFzc0xpc3QuYWRkKCdpY29uLXgnKTtcblxuICAgIHVuc2VsZWN0LmhyZWYgPSAnIyc7XG4gICAgdW5zZWxlY3QuY2xhc3NMaXN0LmFkZCgndW5zZWxlY3QnKTtcbiAgICB1bnNlbGVjdC5vbmNsaWNrID0gKGUpID0+IHRoaXMuaGFuZGxlUmVtb3ZlKGUpO1xuICAgIHVuc2VsZWN0LmFwcGVuZENoaWxkKGljb24pO1xuXG4gICAgbGkuYXBwZW5kQ2hpbGQobmFtZSk7XG4gICAgbGkuYXBwZW5kQ2hpbGQodW5zZWxlY3QpO1xuXG4gICAgcmV0dXJuIGxpO1xuICB9XG5cbiAgaGFuZGxlUmVtb3ZlKGV2ZW50KSB7XG4gICAgdGhpcy5zZWxlY3RlZFByb2plY3RzLmRlbGV0ZShldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlWydkYXRhLXByb2plY3QtcGF0aCddKTtcbiAgICBldmVudC50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnJlbW92ZSgpO1xuICAgIHRoaXMuY2hlY2tQbGFjZWhvbGRlckFuZFVsVmlzaWJpbGl0eSgpO1xuICAgIHRoaXMuZmlsdGVyQ2hvaWNlcygpO1xuICAgIHRoaXMudXBkYXRlUHJlcGFyZUJ1dHRvbkRpc2FibGVkKCk7XG4gIH1cblxuICB1cGRhdGVQcmVwYXJlQnV0dG9uRGlzYWJsZWQoKSB7XG4gICAgdGhpcy5wcmVwYXJlQnV0dG9uLmRpc2FibGVkID0gdGhpcy5zZWxlY3RlZFByb2plY3RzLnNpemUgPT09IDA7XG4gIH1cblxuICBzZXRTdGF0dXModGV4dCkge1xuICAgIHRoaXMuY29tbWFuZFN0YXR1c1dyYXBwZXIuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgdGhpcy5jb21tYW5kU3RhdHVzQ29udGVudC50ZXh0Q29udGVudCA9IHRleHQ7XG4gIH1cbn1cbiJdfQ==