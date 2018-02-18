Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.command = command;
exports.synchronizeRecentProjects = synchronizeRecentProjects;
exports.getRecentProjects = getRecentProjects;

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

var _db = require('../db');

'use babel';

var RECENT_PROJECTS_NUMBER = 5;

function command() {
  var skipCheck = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

  if (skipCheck || atom.config.get('platformio-ide.showHomeScreen')) {
    atom.workspace.open('platformio://home');
  }
}

function synchronizeRecentProjects(paths) {
  paths = paths.filter(function (p) {
    return !p.startsWith('atom:');
  });
  return _db.db.transaction('rw', _db.db.projects, function () {
    var processedPaths = new Set();
    var now = Date.now();
    return _db.db.projects.where('path').anyOf(paths).modify(function (project) {
      project.lastSeen = now;
      processedPaths.add(project.path);
    }).then(function addUnprocessedProjects() {
      return _db.db.projects.bulkPut(paths.filter(function (p) {
        return !processedPaths.has(p);
      }).map(function (p) {
        return { path: p, lastSeen: now };
      }));
    }).then(function removeOldProjects() {
      return getRecentProjects().last().then(function (project) {
        if (project) {
          return _db.db.projects.where('lastSeen').below(project.lastSeen)['delete']();
        }
      });
    });
  })['catch'](function (error) {
    console.error(error);
  });
}

function getRecentProjects() {
  return _db.db.projects.orderBy('lastSeen').reverse().limit(RECENT_PROJECTS_NUMBER);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9ob21lLXNjcmVlbi9jb21tYW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztrQkFtQmlCLE9BQU87O0FBbkJ4QixXQUFXLENBQUM7O0FBcUJaLElBQU0sc0JBQXNCLEdBQUcsQ0FBQyxDQUFDOztBQUUxQixTQUFTLE9BQU8sR0FBaUI7TUFBaEIsU0FBUyx5REFBQyxJQUFJOztBQUNwQyxNQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsQ0FBQyxFQUFFO0FBQ2pFLFFBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLENBQUM7R0FDMUM7Q0FDRjs7QUFFTSxTQUFTLHlCQUF5QixDQUFDLEtBQUssRUFBRTtBQUMvQyxPQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFBLENBQUM7V0FBSSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDO0dBQUEsQ0FBQyxDQUFDO0FBQ2xELFNBQU8sT0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQUcsUUFBUSxFQUFFLFlBQVc7QUFDbEQsUUFBTSxjQUFjLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNqQyxRQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDdkIsV0FBTyxPQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUMxQyxNQUFNLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDakIsYUFBTyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7QUFDdkIsb0JBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xDLENBQUMsQ0FDRCxJQUFJLENBQUMsU0FBUyxzQkFBc0IsR0FBRztBQUN0QyxhQUFPLE9BQUcsUUFBUSxDQUFDLE9BQU8sQ0FDeEIsS0FBSyxDQUNGLE1BQU0sQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO09BQUEsQ0FBQyxDQUNuQyxHQUFHLENBQUMsVUFBQSxDQUFDO2VBQUssRUFBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUM7T0FBQyxDQUFDLENBQ3hDLENBQUM7S0FDSCxDQUFDLENBQ0QsSUFBSSxDQUFDLFNBQVMsaUJBQWlCLEdBQUc7QUFDakMsYUFBTyxpQkFBaUIsRUFBRSxDQUN2QixJQUFJLEVBQUUsQ0FDTixJQUFJLENBQUMsVUFBQSxPQUFPLEVBQUk7QUFDZixZQUFJLE9BQU8sRUFBRTtBQUNYLGlCQUFPLE9BQUcsUUFBUSxDQUNmLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxVQUNuQyxFQUFFLENBQUM7U0FDYjtPQUNGLENBQUMsQ0FBQztLQUNOLENBQUMsQ0FBQztHQUNOLENBQUMsU0FBTSxDQUFDLFVBQUEsS0FBSyxFQUFJO0FBQ2hCLFdBQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDdEIsQ0FBQyxDQUFDO0NBQ0o7O0FBRU0sU0FBUyxpQkFBaUIsR0FBRztBQUNsQyxTQUFPLE9BQUcsUUFBUSxDQUNmLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FDbkIsT0FBTyxFQUFFLENBQ1QsS0FBSyxDQUFDLHNCQUFzQixDQUFDLENBQUM7Q0FDbEMiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUvbGliL2hvbWUtc2NyZWVuL2NvbW1hbmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBDb3B5cmlnaHQgKEMpIDIwMTYgSXZhbiBLcmF2ZXRzLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGZpbGUgaXMgZnJlZSBzb2Z0d2FyZTsgeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yXG4gKiBtb2RpZnkgaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSB2ZXJzaW9uIDJcbiAqIGFzIHB1Ymxpc2hlZCBieSB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLlxuICpcbiAqIFRoaXMgcHJvZ3JhbSBpcyBkaXN0cmlidXRlZCBpbiB0aGUgaG9wZSB0aGF0IGl0IHdpbGwgYmUgdXNlZnVsLFxuICogYnV0IFdJVEhPVVQgQU5ZIFdBUlJBTlRZOyB3aXRob3V0IGV2ZW4gdGhlIGltcGxpZWQgd2FycmFudHkgb2ZcbiAqIE1FUkNIQU5UQUJJTElUWSBvciBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRS4gU2VlIHRoZVxuICogR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBZb3Ugc2hvdWxkIGhhdmUgcmVjZWl2ZWQgYSBjb3B5IG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhbG9uZ1xuICogd2l0aCB0aGlzIHByb2dyYW07IGlmIG5vdCwgd3JpdGUgdG8gdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbiwgSW5jLixcbiAqIDUxIEZyYW5rbGluIFN0cmVldCwgRmlmdGggRmxvb3IsIEJvc3RvbiwgTUEgMDIxMTAtMTMwMSBVU0EuXG4gKi9cblxuaW1wb3J0IHtkYn0gZnJvbSAnLi4vZGInO1xuXG5jb25zdCBSRUNFTlRfUFJPSkVDVFNfTlVNQkVSID0gNTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbW1hbmQoc2tpcENoZWNrPXRydWUpIHtcbiAgaWYgKHNraXBDaGVjayB8fCBhdG9tLmNvbmZpZy5nZXQoJ3BsYXRmb3JtaW8taWRlLnNob3dIb21lU2NyZWVuJykpIHtcbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCdwbGF0Zm9ybWlvOi8vaG9tZScpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeW5jaHJvbml6ZVJlY2VudFByb2plY3RzKHBhdGhzKSB7XG4gIHBhdGhzID0gcGF0aHMuZmlsdGVyKHAgPT4gIXAuc3RhcnRzV2l0aCgnYXRvbTonKSk7XG4gIHJldHVybiBkYi50cmFuc2FjdGlvbigncncnLCBkYi5wcm9qZWN0cywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgcHJvY2Vzc2VkUGF0aHMgPSBuZXcgU2V0KCk7XG4gICAgY29uc3Qgbm93ID0gRGF0ZS5ub3coKTtcbiAgICByZXR1cm4gZGIucHJvamVjdHMud2hlcmUoJ3BhdGgnKS5hbnlPZihwYXRocylcbiAgICAgIC5tb2RpZnkocHJvamVjdCA9PiB7XG4gICAgICAgIHByb2plY3QubGFzdFNlZW4gPSBub3c7XG4gICAgICAgIHByb2Nlc3NlZFBhdGhzLmFkZChwcm9qZWN0LnBhdGgpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uIGFkZFVucHJvY2Vzc2VkUHJvamVjdHMoKSB7XG4gICAgICAgIHJldHVybiBkYi5wcm9qZWN0cy5idWxrUHV0KFxuICAgICAgICAgIHBhdGhzXG4gICAgICAgICAgICAuZmlsdGVyKHAgPT4gIXByb2Nlc3NlZFBhdGhzLmhhcyhwKSlcbiAgICAgICAgICAgIC5tYXAocCA9PiAoe3BhdGg6IHAsIGxhc3RTZWVuOiBub3d9KSlcbiAgICAgICAgKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbiByZW1vdmVPbGRQcm9qZWN0cygpIHtcbiAgICAgICAgcmV0dXJuIGdldFJlY2VudFByb2plY3RzKClcbiAgICAgICAgICAubGFzdCgpXG4gICAgICAgICAgLnRoZW4ocHJvamVjdCA9PiB7XG4gICAgICAgICAgICBpZiAocHJvamVjdCkge1xuICAgICAgICAgICAgICByZXR1cm4gZGIucHJvamVjdHNcbiAgICAgICAgICAgICAgICAud2hlcmUoJ2xhc3RTZWVuJykuYmVsb3cocHJvamVjdC5sYXN0U2VlbilcbiAgICAgICAgICAgICAgICAuZGVsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfSkuY2F0Y2goZXJyb3IgPT4ge1xuICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlY2VudFByb2plY3RzKCkge1xuICByZXR1cm4gZGIucHJvamVjdHNcbiAgICAub3JkZXJCeSgnbGFzdFNlZW4nKVxuICAgIC5yZXZlcnNlKClcbiAgICAubGltaXQoUkVDRU5UX1BST0pFQ1RTX05VTUJFUik7XG59XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/home-screen/command.js