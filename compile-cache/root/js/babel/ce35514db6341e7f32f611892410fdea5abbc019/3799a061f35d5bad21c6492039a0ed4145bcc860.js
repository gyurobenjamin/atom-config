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

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

'use babel';
var ImportArduinoProjectView = (function (_BaseView) {
  _inherits(ImportArduinoProjectView, _BaseView);

  function ImportArduinoProjectView() {
    _classCallCheck(this, _ImportArduinoProjectView);

    _get(Object.getPrototypeOf(_ImportArduinoProjectView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ImportArduinoProjectView, [{
    key: 'initialize',
    value: function initialize() {
      var _this = this;

      // Find important nodes
      this.boardsSelectWrapper = this.element.querySelector('.boards-select-wrapper');
      this.directoryInput = this.element.querySelector('.directory-input');
      this.pickDirectoryButton = this.element.querySelector('.pick-directory');
      this.keepCompatible = this.element.querySelector('.keep-compatible');
      this.useArduinoLibManager = this.element.querySelector('.use-arduino-lib-manager');
      this.libManagerDirectory = this.element.querySelector('.lib-manager-dir');
      this.libManagerInputWrapper = this.element.querySelector('.lib-manager-input-wrapper');
      this.otherButton = this.element.querySelector('.other');
      this.doImportButton = this.element.querySelector('.controls .do-import');
      this.cancelButton = this.element.querySelector('.controls .cancel');
      this.commandStatusWrapper = this.element.querySelector('.command-status');
      this.commandStatusContent = this.commandStatusWrapper.querySelector('.content');
      this.commandStatusSpinner = this.commandStatusWrapper.querySelector('.icon');

      // Set handlers
      this.useArduinoLibManager.onclick = function (event) {
        if (event.target.checked) {
          _this.libManagerInputWrapper.style.display = 'block';
        } else {
          _this.libManagerInputWrapper.style.display = 'none';
        }
        _this.updateImportButtonDisabled();
      };
      this.otherButton.onclick = function () {
        atom.pickFolder(function (selectedPaths) {
          if (!selectedPaths) {
            return;
          }
          _this.libManagerDirectory.value = selectedPaths[0];
          _this.updateImportButtonDisabled();
        });
      };
      this.doImportButton.onclick = function () {
        _this.doImportButton.textContent += '...';
        _this.doImportButton.disabled = true;
        _this.handleImport();
      };
      this.cancelButton.onclick = function () {
        return _this.handleCancel();
      };
      this.pickDirectoryButton.onclick = function () {
        atom.pickFolder(function (selectedPaths) {
          if (!selectedPaths) {
            return;
          }
          if (selectedPaths.length > 1) {
            atom.notifications.addWarning('PlatformIO: Multiple directories have been selected', {
              detail: 'Importing more than one project at a time is not allowed.'
            });
          }
          if (_fs2['default'].statSyncNoException(_path2['default'].join(selectedPaths[0], 'platformio.ini'))) {
            atom.notifications.addWarning('PlatformIO: Invalid directory', {
              detail: 'Selected directory is already a PlatformIO project.'
            });
            return;
          }

          _this.directoryInput.value = selectedPaths[0];
          _this.updateImportButtonDisabled();
        });
      };

      this.setDefaultLibDir();
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
        return _this2.updateImportButtonDisabled();
      };
    }
  }, {
    key: 'setDefaultLibDir',
    value: function setDefaultLibDir() {
      var defaultLibDir = '';
      if (_os2['default'].platform().indexOf('win32') > -1) {
        defaultLibDir = '~\\Documents\\Arduino\\libraries';
      } else if (_os2['default'].platform().indexOf('darwin') > -1) {
        defaultLibDir = '~/Documents/Arduino/Libraries';
      } else if (_os2['default'].platform().indexOf('linux') > -1) {
        defaultLibDir = '~/Arduino/Libraries';
      }
      this.libManagerDirectory.value = defaultLibDir;
    }
  }, {
    key: 'setDirectories',
    value: function setDirectories(directories) {
      for (var dir of directories) {
        var option = document.createElement('option');
        option.value = dir;
        option.textContent = dir;
        this.directorySelect.appendChild(option);
      }
      if (this.directoryInput.children.length > 1) {
        this.element.querySelector('.directory-select-wrapper').style.display = 'block';
      }
    }
  }, {
    key: 'getDirectory',
    value: function getDirectory() {
      return this.directoryInput.value.toString();
    }
  }, {
    key: 'getSelectedBoards',
    value: function getSelectedBoards() {
      return this.boardsSelect.getSelectedBoards();
    }
  }, {
    key: 'getKeepCompatible',
    value: function getKeepCompatible() {
      return this.keepCompatible.checked;
    }
  }, {
    key: 'getUseArduinoLibManager',
    value: function getUseArduinoLibManager() {
      return this.useArduinoLibManager.checked;
    }
  }, {
    key: 'getLibManagerDirectory',
    value: function getLibManagerDirectory() {
      return this.libManagerDirectory.value.toString();
    }
  }, {
    key: 'updateImportButtonDisabled',
    value: function updateImportButtonDisabled() {
      this.doImportButton.disabled = this.boardsSelect && this.getSelectedBoards().size < 1 || !this.getDirectory() || this.getUseArduinoLibManager() && !this.getLibManagerDirectory();
    }
  }, {
    key: 'setStatus',
    value: function setStatus(text) {
      this.commandStatusWrapper.style.display = 'block';
      this.commandStatusContent.textContent = text;
    }
  }, {
    key: 'handleImport',
    value: function handleImport() {}
  }, {
    key: 'handleCancel',
    value: function handleCancel() {}
  }]);

  var _ImportArduinoProjectView = ImportArduinoProjectView;
  ImportArduinoProjectView = (0, _utils.withTemplate)(__dirname)(ImportArduinoProjectView) || ImportArduinoProjectView;
  return ImportArduinoProjectView;
})(_baseView2['default']);

exports.ImportArduinoProjectView = ImportArduinoProjectView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9pbXBvcnQtYXJkdWluby1wcm9qZWN0L3ZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztxQkFtQndELFVBQVU7O3dCQUM3QyxjQUFjOzs7O2dDQUNKLHVCQUF1Qjs7a0JBQ3ZDLElBQUk7Ozs7a0JBQ0osSUFBSTs7OztvQkFDRixNQUFNOzs7O0FBeEJ2QixXQUFXLENBQUM7SUEyQkMsd0JBQXdCO1lBQXhCLHdCQUF3Qjs7V0FBeEIsd0JBQXdCOzs7Ozs7ZUFBeEIsd0JBQXdCOztXQUV6QixzQkFBRzs7OztBQUVYLFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ2hGLFVBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsQ0FBQztBQUNyRSxVQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUN6RSxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDckUsVUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDbkYsVUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDMUUsVUFBSSxDQUFDLHNCQUFzQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDdkYsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMs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QUU7OztrQ0FwSU4sd0JBQXdCO0FBQXhCLDBCQUF3QixHQURwQyx5QkFBYSxTQUFTLENBQUMsQ0FDWCx3QkFBd0IsS0FBeEIsd0JBQXdCO1NBQXhCLHdCQUF3QiIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS9saWIvaW1wb3J0LWFyZHVpbm8tcHJvamVjdC92aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCB7Z2V0Qm9hcmRzLCByZW1vdmVDaGlsZHJlbk9mLCB3aXRoVGVtcGxhdGV9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCBCYXNlVmlldyBmcm9tICcuLi9iYXNlLXZpZXcnO1xuaW1wb3J0IHtCb2FyZHNTZWxlY3RWaWV3fSBmcm9tICcuLi9ib2FyZHMtc2VsZWN0L3ZpZXcnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuQHdpdGhUZW1wbGF0ZShfX2Rpcm5hbWUpXG5leHBvcnQgY2xhc3MgSW1wb3J0QXJkdWlub1Byb2plY3RWaWV3IGV4dGVuZHMgQmFzZVZpZXcge1xuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgLy8gRmluZCBpbXBvcnRhbnQgbm9kZXNcbiAgICB0aGlzLmJvYXJkc1NlbGVjdFdyYXBwZXIgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmJvYXJkcy1zZWxlY3Qtd3JhcHBlcicpO1xuICAgIHRoaXMuZGlyZWN0b3J5SW5wdXQgPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmRpcmVjdG9yeS1pbnB1dCcpO1xuICAgIHRoaXMucGlja0RpcmVjdG9yeUJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcucGljay1kaXJlY3RvcnknKTtcbiAgICB0aGlzLmtlZXBDb21wYXRpYmxlID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5rZWVwLWNvbXBhdGlibGUnKTtcbiAgICB0aGlzLnVzZUFyZHVpbm9MaWJNYW5hZ2VyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy51c2UtYXJkdWluby1saWItbWFuYWdlcicpO1xuICAgIHRoaXMubGliTWFuYWdlckRpcmVjdG9yeSA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcubGliLW1hbmFnZXItZGlyJyk7XG4gICAgdGhpcy5saWJNYW5hZ2VySW5wdXRXcmFwcGVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5saWItbWFuYWdlci1pbnB1dC13cmFwcGVyJyk7XG4gICAgdGhpcy5vdGhlckJ1dHRvbiA9IHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcub3RoZXInKTtcbiAgICB0aGlzLmRvSW1wb3J0QnV0dG9uID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb250cm9scyAuZG8taW1wb3J0Jyk7XG4gICAgdGhpcy5jYW5jZWxCdXR0b24gPSB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLmNvbnRyb2xzIC5jYW5jZWwnKTtcbiAgICB0aGlzLmNvbW1hbmRTdGF0dXNXcmFwcGVyID0gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jb21tYW5kLXN0YXR1cycpO1xuICAgIHRoaXMuY29tbWFuZFN0YXR1c0NvbnRlbnQgPSB0aGlzLmNvbW1hbmRTdGF0dXNXcmFwcGVyLnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XG4gICAgdGhpcy5jb21tYW5kU3RhdHVzU3Bpbm5lciA9IHRoaXMuY29tbWFuZFN0YXR1c1dyYXBwZXIucXVlcnlTZWxlY3RvcignLmljb24nKTtcblxuICAgIC8vIFNldCBoYW5kbGVyc1xuICAgIHRoaXMudXNlQXJkdWlub0xpYk1hbmFnZXIub25jbGljayA9IChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LnRhcmdldC5jaGVja2VkKSB7XG4gICAgICAgIHRoaXMubGliTWFuYWdlcklucHV0V3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubGliTWFuYWdlcklucHV0V3JhcHBlci5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVJbXBvcnRCdXR0b25EaXNhYmxlZCgpO1xuICAgIH07XG4gICAgdGhpcy5vdGhlckJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgYXRvbS5waWNrRm9sZGVyKChzZWxlY3RlZFBhdGhzKSA9PiB7XG4gICAgICAgIGlmICghc2VsZWN0ZWRQYXRocykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmxpYk1hbmFnZXJEaXJlY3RvcnkudmFsdWUgPSBzZWxlY3RlZFBhdGhzWzBdO1xuICAgICAgICB0aGlzLnVwZGF0ZUltcG9ydEJ1dHRvbkRpc2FibGVkKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgIHRoaXMuZG9JbXBvcnRCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgIHRoaXMuZG9JbXBvcnRCdXR0b24udGV4dENvbnRlbnQgKz0gJy4uLic7XG4gICAgICB0aGlzLmRvSW1wb3J0QnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcbiAgICAgIHRoaXMuaGFuZGxlSW1wb3J0KCk7XG4gICAgfTtcbiAgICB0aGlzLmNhbmNlbEJ1dHRvbi5vbmNsaWNrID0gKCkgPT4gdGhpcy5oYW5kbGVDYW5jZWwoKTtcbiAgICB0aGlzLnBpY2tEaXJlY3RvcnlCdXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgIGF0b20ucGlja0ZvbGRlcigoc2VsZWN0ZWRQYXRocykgPT4ge1xuICAgICAgICBpZiAoIXNlbGVjdGVkUGF0aHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHNlbGVjdGVkUGF0aHMubGVuZ3RoID4gMSkge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdQbGF0Zm9ybUlPOiBNdWx0aXBsZSBkaXJlY3RvcmllcyBoYXZlIGJlZW4gc2VsZWN0ZWQnLCB7XG4gICAgICAgICAgICBkZXRhaWw6ICdJbXBvcnRpbmcgbW9yZSB0aGFuIG9uZSBwcm9qZWN0IGF0IGEgdGltZSBpcyBub3QgYWxsb3dlZC4nXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZzLnN0YXRTeW5jTm9FeGNlcHRpb24ocGF0aC5qb2luKHNlbGVjdGVkUGF0aHNbMF0sICdwbGF0Zm9ybWlvLmluaScpKSkge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKCdQbGF0Zm9ybUlPOiBJbnZhbGlkIGRpcmVjdG9yeScsIHtcbiAgICAgICAgICAgIGRldGFpbDogJ1NlbGVjdGVkIGRpcmVjdG9yeSBpcyBhbHJlYWR5IGEgUGxhdGZvcm1JTyBwcm9qZWN0LidcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRpcmVjdG9yeUlucHV0LnZhbHVlID0gc2VsZWN0ZWRQYXRoc1swXTtcbiAgICAgICAgdGhpcy51cGRhdGVJbXBvcnRCdXR0b25EaXNhYmxlZCgpO1xuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHRoaXMuc2V0RGVmYXVsdExpYkRpcigpO1xuICAgIHRoaXMuaW5pdGlhbGl6ZUJvYXJkc1NlbGVjdCgpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZUJvYXJkc1NlbGVjdCgpIHtcbiAgICBjb25zdCBib2FyZHMgPSBnZXRCb2FyZHMoKTtcbiAgICByZW1vdmVDaGlsZHJlbk9mKHRoaXMuYm9hcmRzU2VsZWN0V3JhcHBlcik7XG4gICAgdGhpcy5ib2FyZHNTZWxlY3QgPSBuZXcgQm9hcmRzU2VsZWN0Vmlldyhib2FyZHMpO1xuICAgIHRoaXMuYm9hcmRzU2VsZWN0V3JhcHBlci5hcHBlbmRDaGlsZCh0aGlzLmJvYXJkc1NlbGVjdC5nZXRFbGVtZW50KCkpO1xuICAgIHRoaXMuYm9hcmRzU2VsZWN0LmhhbmRsZVNlbGVjdEJvYXJkID0gKCkgPT4gdGhpcy51cGRhdGVJbXBvcnRCdXR0b25EaXNhYmxlZCgpO1xuICB9XG5cbiAgc2V0RGVmYXVsdExpYkRpcigpIHtcbiAgICBsZXQgZGVmYXVsdExpYkRpciA9ICcnO1xuICAgIGlmIChvcy5wbGF0Zm9ybSgpLmluZGV4T2YoJ3dpbjMyJykgPiAtMSkge1xuICAgICAgZGVmYXVsdExpYkRpciA9ICd+XFxcXERvY3VtZW50c1xcXFxBcmR1aW5vXFxcXGxpYnJhcmllcyc7XG4gICAgfSBlbHNlIGlmIChvcy5wbGF0Zm9ybSgpLmluZGV4T2YoJ2RhcndpbicpID4gLTEpIHtcbiAgICAgIGRlZmF1bHRMaWJEaXIgPSAnfi9Eb2N1bWVudHMvQXJkdWluby9MaWJyYXJpZXMnO1xuICAgIH0gZWxzZSBpZiAob3MucGxhdGZvcm0oKS5pbmRleE9mKCdsaW51eCcpID4gLTEpIHtcbiAgICAgIGRlZmF1bHRMaWJEaXIgPSAnfi9BcmR1aW5vL0xpYnJhcmllcyc7XG4gICAgfVxuICAgIHRoaXMubGliTWFuYWdlckRpcmVjdG9yeS52YWx1ZSA9IGRlZmF1bHRMaWJEaXI7XG4gIH1cblxuICBzZXREaXJlY3RvcmllcyhkaXJlY3Rvcmllcykge1xuICAgIGZvciAoY29uc3QgZGlyIG9mIGRpcmVjdG9yaWVzKSB7XG4gICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgIG9wdGlvbi52YWx1ZSA9IGRpcjtcbiAgICAgIG9wdGlvbi50ZXh0Q29udGVudCA9IGRpcjtcbiAgICAgIHRoaXMuZGlyZWN0b3J5U2VsZWN0LmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgfVxuICAgIGlmICh0aGlzLmRpcmVjdG9yeUlucHV0LmNoaWxkcmVuLmxlbmd0aCA+IDEpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKCcuZGlyZWN0b3J5LXNlbGVjdC13cmFwcGVyJykuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGlyZWN0b3J5KCkge1xuICAgIHJldHVybiB0aGlzLmRpcmVjdG9yeUlucHV0LnZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cblxuICBnZXRTZWxlY3RlZEJvYXJkcygpIHtcbiAgICByZXR1cm4gdGhpcy5ib2FyZHNTZWxlY3QuZ2V0U2VsZWN0ZWRCb2FyZHMoKTtcbiAgfVxuXG4gIGdldEtlZXBDb21wYXRpYmxlKCkge1xuICAgIHJldHVybiB0aGlzLmtlZXBDb21wYXRpYmxlLmNoZWNrZWQ7XG4gIH1cblxuICBnZXRVc2VBcmR1aW5vTGliTWFuYWdlcigpIHtcbiAgICByZXR1cm4gdGhpcy51c2VBcmR1aW5vTGliTWFuYWdlci5jaGVja2VkO1xuICB9XG5cbiAgZ2V0TGliTWFuYWdlckRpcmVjdG9yeSgpIHtcbiAgICByZXR1cm4gdGhpcy5saWJNYW5hZ2VyRGlyZWN0b3J5LnZhbHVlLnRvU3RyaW5nKCk7XG4gIH1cblxuICB1cGRhdGVJbXBvcnRCdXR0b25EaXNhYmxlZCgpIHtcbiAgICB0aGlzLmRvSW1wb3J0QnV0dG9uLmRpc2FibGVkID1cbiAgICAgIHRoaXMuYm9hcmRzU2VsZWN0ICYmIHRoaXMuZ2V0U2VsZWN0ZWRCb2FyZHMoKS5zaXplIDwgMSB8fCAhdGhpcy5nZXREaXJlY3RvcnkoKSB8fFxuICAgICAgKHRoaXMuZ2V0VXNlQXJkdWlub0xpYk1hbmFnZXIoKSAmJiAhdGhpcy5nZXRMaWJNYW5hZ2VyRGlyZWN0b3J5KCkpO1xuICB9XG5cbiAgc2V0U3RhdHVzKHRleHQpIHtcbiAgICB0aGlzLmNvbW1hbmRTdGF0dXNXcmFwcGVyLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIHRoaXMuY29tbWFuZFN0YXR1c0NvbnRlbnQudGV4dENvbnRlbnQgPSB0ZXh0O1xuICB9XG5cbiAgaGFuZGxlSW1wb3J0KCkge31cbiAgaGFuZGxlQ2FuY2VsKCkge31cbn1cbiJdfQ==