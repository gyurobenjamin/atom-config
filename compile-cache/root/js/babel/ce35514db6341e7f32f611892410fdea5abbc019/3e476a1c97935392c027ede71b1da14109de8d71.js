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

var _command = require('./command');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _utils = require('../utils');

'use babel';
var RecentProjectsView = (function (_BaseView) {
  _inherits(RecentProjectsView, _BaseView);

  function RecentProjectsView() {
    _classCallCheck(this, _RecentProjectsView);

    _get(Object.getPrototypeOf(_RecentProjectsView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(RecentProjectsView, [{
    key: 'buildElement',
    value: function buildElement() {
      var element = document.createElement('div');
      element.classList.add('recent-projects-wrapper');
      return element;
    }
  }, {
    key: 'initialize',
    value: function initialize() {
      this.populateProjects();
    }
  }, {
    key: 'populateProjects',
    value: function populateProjects() {
      var _this = this;

      this.element.textContent = '';
      return (0, _command.getRecentProjects)().each(function (project) {
        var div = document.createElement('div');
        div.classList.add('recent-project-item');
        div.onclick = function () {
          return atom.project.addPath(project.path);
        };

        var title = document.createElement('span');
        title.classList.add('recent-project-title');
        title.textContent = _path2['default'].basename(project.path);
        div.appendChild(title);

        var projectPath = document.createElement('span');
        projectPath.classList.add('recent-project-path');
        projectPath.textContent = project.path;
        div.appendChild(projectPath);

        _this.element.appendChild(div);
      })['catch'](function (err) {
        atom.notifications.addError('An error occured during fetching recent projects', {
          detail: err.toString(),
          dismissable: true
        });
        _this.element.textContent = 'Failed to fetch a list of recent projects.';
      });
    }
  }]);

  var _RecentProjectsView = RecentProjectsView;
  RecentProjectsView = (0, _utils.withTemplate)(__dirname)(RecentProjectsView) || RecentProjectsView;
  return RecentProjectsView;
})(_baseView2['default']);

exports.RecentProjectsView = RecentProjectsView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9ob21lLXNjcmVlbi9yZWNlbnQtcHJvamVjdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt3QkFtQnFCLGNBQWM7Ozs7dUJBQ0gsV0FBVzs7b0JBQzFCLE1BQU07Ozs7cUJBQ0ksVUFBVTs7QUF0QnJDLFdBQVcsQ0FBQztJQXlCQyxrQkFBa0I7WUFBbEIsa0JBQWtCOztXQUFsQixrQkFBa0I7Ozs7OztlQUFsQixrQkFBa0I7O1dBRWpCLHdCQUFHO0FBQ2IsVUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM5QyxhQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ2pELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7V0FFUyxzQkFBRztBQUNYLFVBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0tBQ3pCOzs7V0FFZSw0QkFBRzs7O0FBQ2pCLFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztBQUM5QixhQUFPLGlDQUFtQixDQUFDLElBQUksQ0FBQyxVQUFBLE9BQU8sRUFBSTtBQUN6QyxZQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzFDLFdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFDekMsV0FBRyxDQUFDLE9BQU8sR0FBRztpQkFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1NBQUEsQ0FBQzs7QUFFdkQsWUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUM3QyxhQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQzVDLGFBQUssQ0FBQyxXQUFXLEdBQUcsa0JBQUssUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNoRCxXQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUV2QixZQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25ELG1CQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0FBQ2pELG1CQUFXLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7QUFDdkMsV0FBRyxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFN0IsY0FBSyxPQUFPLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQy9CLENBQUMsU0FBTSxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ2QsWUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsa0RBQWtELEVBQUU7QUFDOUUsZ0JBQU0sRUFBRSxHQUFHLENBQUMsUUFBUSxFQUFFO0FBQ3RCLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7QUFDSCxjQUFLLE9BQU8sQ0FBQyxXQUFXLEdBQUcsNENBQTRDLENBQUM7T0FDekUsQ0FBQyxDQUFDO0tBQ0o7Ozs0QkFyQ1Usa0JBQWtCO0FBQWxCLG9CQUFrQixHQUQ5Qix5QkFBYSxTQUFTLENBQUMsQ0FDWCxrQkFBa0IsS0FBbEIsa0JBQWtCO1NBQWxCLGtCQUFrQiIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS9saWIvaG9tZS1zY3JlZW4vcmVjZW50LXByb2plY3RzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCBCYXNlVmlldyBmcm9tICcuLi9iYXNlLXZpZXcnO1xuaW1wb3J0IHtnZXRSZWNlbnRQcm9qZWN0c30gZnJvbSAnLi9jb21tYW5kJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHt3aXRoVGVtcGxhdGV9IGZyb20gJy4uL3V0aWxzJztcblxuQHdpdGhUZW1wbGF0ZShfX2Rpcm5hbWUpXG5leHBvcnQgY2xhc3MgUmVjZW50UHJvamVjdHNWaWV3IGV4dGVuZHMgQmFzZVZpZXd7XG5cbiAgYnVpbGRFbGVtZW50KCkge1xuICAgIGNvbnN0IGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoJ3JlY2VudC1wcm9qZWN0cy13cmFwcGVyJyk7XG4gICAgcmV0dXJuIGVsZW1lbnQ7XG4gIH1cblxuICBpbml0aWFsaXplKCkge1xuICAgIHRoaXMucG9wdWxhdGVQcm9qZWN0cygpO1xuICB9XG5cbiAgcG9wdWxhdGVQcm9qZWN0cygpIHtcbiAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSAnJztcbiAgICByZXR1cm4gZ2V0UmVjZW50UHJvamVjdHMoKS5lYWNoKHByb2plY3QgPT4ge1xuICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBkaXYuY2xhc3NMaXN0LmFkZCgncmVjZW50LXByb2plY3QtaXRlbScpO1xuICAgICAgZGl2Lm9uY2xpY2sgPSAoKSA9PiBhdG9tLnByb2plY3QuYWRkUGF0aChwcm9qZWN0LnBhdGgpO1xuXG4gICAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgIHRpdGxlLmNsYXNzTGlzdC5hZGQoJ3JlY2VudC1wcm9qZWN0LXRpdGxlJyk7XG4gICAgICB0aXRsZS50ZXh0Q29udGVudCA9IHBhdGguYmFzZW5hbWUocHJvamVjdC5wYXRoKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZCh0aXRsZSk7XG5cbiAgICAgIGNvbnN0IHByb2plY3RQYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgcHJvamVjdFBhdGguY2xhc3NMaXN0LmFkZCgncmVjZW50LXByb2plY3QtcGF0aCcpO1xuICAgICAgcHJvamVjdFBhdGgudGV4dENvbnRlbnQgPSBwcm9qZWN0LnBhdGg7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQocHJvamVjdFBhdGgpO1xuXG4gICAgICB0aGlzLmVsZW1lbnQuYXBwZW5kQ2hpbGQoZGl2KTtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdBbiBlcnJvciBvY2N1cmVkIGR1cmluZyBmZXRjaGluZyByZWNlbnQgcHJvamVjdHMnLCB7XG4gICAgICAgIGRldGFpbDogZXJyLnRvU3RyaW5nKCksXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgfSk7XG4gICAgICB0aGlzLmVsZW1lbnQudGV4dENvbnRlbnQgPSAnRmFpbGVkIHRvIGZldGNoIGEgbGlzdCBvZiByZWNlbnQgcHJvamVjdHMuJztcbiAgICB9KTtcbiAgfVxufVxuIl19