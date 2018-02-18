Object.defineProperty(exports, '__esModule', {
  value: true
});

var command = _asyncToGenerator(function* () {
  var projects = yield getProjects(_path2['default'].join(config.BASE_DIR, 'project-examples'));
  var view = new _view.ProjectExamplesView(projects);
  var panel = atom.workspace.addModalPanel({ item: view.getElement() });
  var canceled = false;

  view.handlePrepare = _asyncToGenerator(function* () {
    var projects = view.getSelectedProjects();
    var step = 0;
    var processedPaths = [];
    view.progress.max = projects.size;
    view.progress.style.display = 'block';
    for (var projectPath of projects) {
      view.progress.value = step;
      step += 1;
      if (!canceled) {
        view.setStatus('Processing project "' + _path2['default'].basename(projectPath) + '"');
        var copyPath = yield tempp.mkdir(_path2['default'].basename(projectPath) + '-');
        yield fsp.copy(projectPath, copyPath);
        yield (0, _initCommand.ensureProjectsInited)([copyPath], true);
        atom.project.addPath(copyPath);
        processedPaths.push(copyPath);
      }
      view.progress.value = step;
    }
    if (canceled) {
      for (var projectPath of processedPaths) {
        atom.project.removePath(projectPath);
      }
    }
    panel.destroy();
  });
  view.handleCancel = function () {
    canceled = true;
    panel.destroy();
  };
});

exports.command = command;

var getProjects = _asyncToGenerator(function* (examplesRoot) {
  var queue = [examplesRoot];
  var projects = {};
  while (queue.length > 0) {
    var dirPath = queue.splice(0, 1)[0]; // take the first element from the queue
    if (!dirPath) {
      continue;
    }
    var files = yield fsp.readdir(dirPath);
    if (files.indexOf('platformio.ini') !== -1) {
      projects[dirPath] = dirPath.slice(examplesRoot.length + 1);
      continue;
    }
    for (var file of files) {
      var fullPath = _path2['default'].join(dirPath, file);
      try {
        var stat = yield fsp.stat(fullPath);
        if (stat && stat.isDirectory() && file !== 'ide') {
          queue.push(fullPath);
        }
      } catch (e) {
        continue;
      }
    }
  }
  return projects;
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

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

var _config = require('../config');

var config = _interopRequireWildcard(_config);

var _view = require('./view');

var _initCommand = require('../init/command');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _promisifyNode = require('promisify-node');

var _promisifyNode2 = _interopRequireDefault(_promisifyNode);

'use babel';

var fsp = (0, _promisifyNode2['default'])('fs-extra');
var tempp = (0, _promisifyNode2['default'])('temp');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9wcm9qZWN0LWV4YW1wbGVzL2NvbW1hbmQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztJQThCc0IsT0FBTyxxQkFBdEIsYUFBeUI7QUFDOUIsTUFBTSxRQUFRLEdBQUcsTUFBTSxXQUFXLENBQUMsa0JBQUssSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0FBQ25GLE1BQU0sSUFBSSxHQUFHLDhCQUF3QixRQUFRLENBQUMsQ0FBQztBQUMvQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLEVBQUMsQ0FBQyxDQUFDO0FBQ3RFLE1BQUksUUFBUSxHQUFHLEtBQUssQ0FBQzs7QUFFckIsTUFBSSxDQUFDLGFBQWEscUJBQUcsYUFBaUI7QUFDcEMsUUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDNUMsUUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2IsUUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQzFCLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7QUFDbEMsUUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN0QyxTQUFLLElBQU0sV0FBVyxJQUFJLFFBQVEsRUFBRTtBQUNsQyxVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDM0IsVUFBSSxJQUFJLENBQUMsQ0FBQztBQUNWLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixZQUFJLENBQUMsU0FBUywwQkFBd0Isa0JBQUssUUFBUSxDQUFDLFdBQVcsQ0FBQyxPQUFJLENBQUM7QUFDckUsWUFBTSxRQUFRLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFJLGtCQUFLLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBSSxDQUFDO0FBQ3JFLGNBQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDdEMsY0FBTSx1Q0FBcUIsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM3QyxZQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMvQixzQkFBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUMvQjtBQUNELFVBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztLQUM1QjtBQUNELFFBQUksUUFBUSxFQUFFO0FBQ1osV0FBSyxJQUFNLFdBQVcsSUFBSSxjQUFjLEVBQUU7QUFDeEMsWUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDdEM7S0FDRjtBQUNELFNBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUNqQixDQUFBLENBQUM7QUFDRixNQUFJLENBQUMsWUFBWSxHQUFHLFlBQVc7QUFDN0IsWUFBUSxHQUFHLElBQUksQ0FBQztBQUNoQixTQUFLLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDakIsQ0FBQztDQUNIOzs7O0lBRWMsV0FBVyxxQkFBMUIsV0FBMkIsWUFBWSxFQUFFO0FBQ3ZDLE1BQU0sS0FBSyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDN0IsTUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFNBQU8sS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7QUFDdkIsUUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsUUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNaLGVBQVM7S0FDVjtBQUNELFFBQU0sS0FBSyxHQUFHLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN6QyxRQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtBQUMxQyxjQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNELGVBQVM7S0FDVjtBQUNELFNBQUssSUFBTSxJQUFJLElBQUksS0FBSyxFQUFFO0FBQ3hCLFVBQU0sUUFBUSxHQUFHLGtCQUFLLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDMUMsVUFBSTtBQUNGLFlBQU0sSUFBSSxHQUFHLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN0QyxZQUFJLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtBQUNoRCxlQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3RCO09BQ0YsQ0FBQyxPQUFNLENBQUMsRUFBRTtBQUNULGlCQUFTO09BQ1Y7S0FDRjtHQUNGO0FBQ0QsU0FBTyxRQUFRLENBQUM7Q0FDakI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7c0JBM0V1QixXQUFXOztJQUF2QixNQUFNOztvQkFDZ0IsUUFBUTs7MkJBQ1AsaUJBQWlCOztvQkFDbkMsTUFBTTs7Ozs2QkFDRCxnQkFBZ0I7Ozs7QUF2QnRDLFdBQVcsQ0FBQzs7QUEwQlosSUFBTSxHQUFHLEdBQUcsZ0NBQVUsVUFBVSxDQUFDLENBQUM7QUFDbEMsSUFBTSxLQUFLLEdBQUcsZ0NBQVUsTUFBTSxDQUFDLENBQUMiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUvbGliL3Byb2plY3QtZXhhbXBsZXMvY29tbWFuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKipcbiAqIENvcHlyaWdodCAoQykgMjAxNiBJdmFuIEtyYXZldHMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgZmlsZSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3JcbiAqIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMlxuICogYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nXG4gKiB3aXRoIHRoaXMgcHJvZ3JhbTsgaWYgbm90LCB3cml0ZSB0byB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBJbmMuLFxuICogNTEgRnJhbmtsaW4gU3RyZWV0LCBGaWZ0aCBGbG9vciwgQm9zdG9uLCBNQSAwMjExMC0xMzAxIFVTQS5cbiAqL1xuXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnLi4vY29uZmlnJztcbmltcG9ydCB7UHJvamVjdEV4YW1wbGVzVmlld30gZnJvbSAnLi92aWV3JztcbmltcG9ydCB7ZW5zdXJlUHJvamVjdHNJbml0ZWR9IGZyb20gJy4uL2luaXQvY29tbWFuZCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBwcm9taXNpZnkgZnJvbSAncHJvbWlzaWZ5LW5vZGUnO1xuXG5cbmNvbnN0IGZzcCA9IHByb21pc2lmeSgnZnMtZXh0cmEnKTtcbmNvbnN0IHRlbXBwID0gcHJvbWlzaWZ5KCd0ZW1wJyk7XG5cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbW1hbmQoKSB7XG4gIGNvbnN0IHByb2plY3RzID0gYXdhaXQgZ2V0UHJvamVjdHMocGF0aC5qb2luKGNvbmZpZy5CQVNFX0RJUiwgJ3Byb2plY3QtZXhhbXBsZXMnKSk7XG4gIGNvbnN0IHZpZXcgPSBuZXcgUHJvamVjdEV4YW1wbGVzVmlldyhwcm9qZWN0cyk7XG4gIGNvbnN0IHBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7aXRlbTogdmlldy5nZXRFbGVtZW50KCl9KTtcbiAgbGV0IGNhbmNlbGVkID0gZmFsc2U7XG5cbiAgdmlldy5oYW5kbGVQcmVwYXJlID0gYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcHJvamVjdHMgPSB2aWV3LmdldFNlbGVjdGVkUHJvamVjdHMoKTtcbiAgICBsZXQgc3RlcCA9IDA7XG4gICAgY29uc3QgcHJvY2Vzc2VkUGF0aHMgPSBbXTtcbiAgICB2aWV3LnByb2dyZXNzLm1heCA9IHByb2plY3RzLnNpemU7XG4gICAgdmlldy5wcm9ncmVzcy5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICBmb3IgKGNvbnN0IHByb2plY3RQYXRoIG9mIHByb2plY3RzKSB7XG4gICAgICB2aWV3LnByb2dyZXNzLnZhbHVlID0gc3RlcDtcbiAgICAgIHN0ZXAgKz0gMTtcbiAgICAgIGlmICghY2FuY2VsZWQpIHtcbiAgICAgICAgdmlldy5zZXRTdGF0dXMoYFByb2Nlc3NpbmcgcHJvamVjdCBcIiR7cGF0aC5iYXNlbmFtZShwcm9qZWN0UGF0aCl9XCJgKTtcbiAgICAgICAgY29uc3QgY29weVBhdGggPSBhd2FpdCB0ZW1wcC5ta2RpcihgJHtwYXRoLmJhc2VuYW1lKHByb2plY3RQYXRoKX0tYCk7XG4gICAgICAgIGF3YWl0IGZzcC5jb3B5KHByb2plY3RQYXRoLCBjb3B5UGF0aCk7XG4gICAgICAgIGF3YWl0IGVuc3VyZVByb2plY3RzSW5pdGVkKFtjb3B5UGF0aF0sIHRydWUpO1xuICAgICAgICBhdG9tLnByb2plY3QuYWRkUGF0aChjb3B5UGF0aCk7XG4gICAgICAgIHByb2Nlc3NlZFBhdGhzLnB1c2goY29weVBhdGgpO1xuICAgICAgfVxuICAgICAgdmlldy5wcm9ncmVzcy52YWx1ZSA9IHN0ZXA7XG4gICAgfVxuICAgIGlmIChjYW5jZWxlZCkge1xuICAgICAgZm9yIChjb25zdCBwcm9qZWN0UGF0aCBvZiBwcm9jZXNzZWRQYXRocykge1xuICAgICAgICBhdG9tLnByb2plY3QucmVtb3ZlUGF0aChwcm9qZWN0UGF0aCk7XG4gICAgICB9XG4gICAgfVxuICAgIHBhbmVsLmRlc3Ryb3koKTtcbiAgfTtcbiAgdmlldy5oYW5kbGVDYW5jZWwgPSBmdW5jdGlvbigpIHtcbiAgICBjYW5jZWxlZCA9IHRydWU7XG4gICAgcGFuZWwuZGVzdHJveSgpO1xuICB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBnZXRQcm9qZWN0cyhleGFtcGxlc1Jvb3QpIHtcbiAgY29uc3QgcXVldWUgPSBbZXhhbXBsZXNSb290XTtcbiAgY29uc3QgcHJvamVjdHMgPSB7fTtcbiAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCBkaXJQYXRoID0gcXVldWUuc3BsaWNlKDAsIDEpWzBdOyAgLy8gdGFrZSB0aGUgZmlyc3QgZWxlbWVudCBmcm9tIHRoZSBxdWV1ZVxuICAgIGlmICghZGlyUGF0aCkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgZnNwLnJlYWRkaXIoZGlyUGF0aCk7XG4gICAgaWYgKGZpbGVzLmluZGV4T2YoJ3BsYXRmb3JtaW8uaW5pJykgIT09IC0xKSB7XG4gICAgICBwcm9qZWN0c1tkaXJQYXRoXSA9IGRpclBhdGguc2xpY2UoZXhhbXBsZXNSb290Lmxlbmd0aCArIDEpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oZGlyUGF0aCwgZmlsZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBzdGF0ID0gYXdhaXQgZnNwLnN0YXQoZnVsbFBhdGgpO1xuICAgICAgICBpZiAoc3RhdCAmJiBzdGF0LmlzRGlyZWN0b3J5KCkgJiYgZmlsZSAhPT0gJ2lkZScpIHtcbiAgICAgICAgICBxdWV1ZS5wdXNoKGZ1bGxQYXRoKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvamVjdHM7XG59XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/project-examples/command.js
