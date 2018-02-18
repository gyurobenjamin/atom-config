Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var _dexie = require('dexie');

var _dexie2 = _interopRequireDefault(_dexie);

'use babel';var db = new _dexie2['default']('platformio-ide');

exports.db = db;
db.version(1).stores({ projects: 'path,lastSeen' });

db.open()['catch'](function (err) {
  atom.notifications.addError('Failed to open a database.', {
    detail: err.toString(),
    dismissable: true
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9kYi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQmtCLE9BQU87Ozs7QUFuQnpCLFdBQVcsQ0FBQyxBQXFCTCxJQUFNLEVBQUUsR0FBRyx1QkFBVSxnQkFBZ0IsQ0FBQyxDQUFDOzs7QUFFOUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxRQUFRLEVBQUUsZUFBZSxFQUFDLENBQUMsQ0FBQzs7QUFFbEQsRUFBRSxDQUFDLElBQUksRUFBRSxTQUFNLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDckIsTUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7QUFDeEQsVUFBTSxFQUFFLEdBQUcsQ0FBQyxRQUFRLEVBQUU7QUFDdEIsZUFBVyxFQUFFLElBQUk7R0FDbEIsQ0FBQyxDQUFDO0NBQ0osQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9kYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vKipcbiAqIENvcHlyaWdodCAoQykgMjAxNiBJdmFuIEtyYXZldHMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgZmlsZSBpcyBmcmVlIHNvZnR3YXJlOyB5b3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3JcbiAqIG1vZGlmeSBpdCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIHZlcnNpb24gMlxuICogYXMgcHVibGlzaGVkIGJ5IHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24uXG4gKlxuICogVGhpcyBwcm9ncmFtIGlzIGRpc3RyaWJ1dGVkIGluIHRoZSBob3BlIHRoYXQgaXQgd2lsbCBiZSB1c2VmdWwsXG4gKiBidXQgV0lUSE9VVCBBTlkgV0FSUkFOVFk7IHdpdGhvdXQgZXZlbiB0aGUgaW1wbGllZCB3YXJyYW50eSBvZlxuICogTUVSQ0hBTlRBQklMSVRZIG9yIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFLiBTZWUgdGhlXG4gKiBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBmb3IgbW9yZSBkZXRhaWxzLlxuICpcbiAqIFlvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGFsb25nXG4gKiB3aXRoIHRoaXMgcHJvZ3JhbTsgaWYgbm90LCB3cml0ZSB0byB0aGUgRnJlZSBTb2Z0d2FyZSBGb3VuZGF0aW9uLCBJbmMuLFxuICogNTEgRnJhbmtsaW4gU3RyZWV0LCBGaWZ0aCBGbG9vciwgQm9zdG9uLCBNQSAwMjExMC0xMzAxIFVTQS5cbiAqL1xuXG5pbXBvcnQgRGV4aWUgZnJvbSAnZGV4aWUnO1xuXG5leHBvcnQgY29uc3QgZGIgPSBuZXcgRGV4aWUoJ3BsYXRmb3JtaW8taWRlJyk7XG5cbmRiLnZlcnNpb24oMSkuc3RvcmVzKHtwcm9qZWN0czogJ3BhdGgsbGFzdFNlZW4nfSk7XG5cbmRiLm9wZW4oKS5jYXRjaChlcnIgPT4ge1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ0ZhaWxlZCB0byBvcGVuIGEgZGF0YWJhc2UuJywge1xuICAgIGRldGFpbDogZXJyLnRvU3RyaW5nKCksXG4gICAgZGlzbWlzc2FibGU6IHRydWUsXG4gIH0pO1xufSk7XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/db.js
