function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

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

var _initCommand = require('./init/command');

var init = _interopRequireWildcard(_initCommand);

var _maintenance = require('./maintenance');

var maintenance = _interopRequireWildcard(_maintenance);

var _utils = require('./utils');

var utils = _interopRequireWildcard(_utils);

var _homeScreenCommand = require('./home-screen/command');

var _aboutView = require('./about/view');

var _atom = require('atom');

var _homeScreenView = require('./home-screen/view');

var _librariesView = require('./libraries/view');

var _config = require('./config');

var _buildProvider = require('./build-provider');

var _config2 = _interopRequireDefault(_config);

var _terminal = require('./terminal');

var _donateCommand = require('./donate/command');

var _importArduinoProjectCommand = require('./import-arduino-project/command');

var _installCommand = require('./install/command');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _serialMonitorCommand = require('./serial-monitor/command');

var _shell = require('shell');

var _shell2 = _interopRequireDefault(_shell);

var _projectExamplesCommand = require('./project-examples/command');

'use babel';

module.exports = {
  config: _config2['default'],
  subscriptions: null,
  highlightSubscriptions: null,

  consumeRunInTerminal: _terminal.consumeRunInTerminal,

  provideBuilder: function provideBuilder() {
    return _buildProvider.PlatformIOBuildProvider;
  },

  activate: function activate() {
    var _this = this;

    maintenance.updateOSEnviron();
    this.subscriptions = new _atom.CompositeDisposable();
    (0, _installCommand.command)().then(function () {
      return _this.setupCommands();
    }).then(function () {
      return (0, _homeScreenCommand.synchronizeRecentProjects)(atom.project.getPaths());
    }).then(_homeScreenCommand.command).then(function () {
      return (0, _donateCommand.command)(true);
    }).then(function () {
      return maintenance.setupActivationHooks();
    });
  },

  setupCommands: function setupCommands() {
    var _this2 = this;

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'platformio-ide:initialize-new-project': function platformioIdeInitializeNewProject() {
        return init.command();
      },
      'platformio-ide:import-arduino-ide-project': function platformioIdeImportArduinoIdeProject() {
        return (0, _importArduinoProjectCommand.command)();
      },

      'platformio-ide:maintenance.open-terminal': function platformioIdeMaintenanceOpenTerminal() {
        return maintenance.openTerminal('pio --help');
      },
      'platformio-ide:maintenance.libraries': function platformioIdeMaintenanceLibraries() {
        return atom.workspace.open('platformio://lib');
      },
      'platformio-ide:maintenance.serial-monitor': function platformioIdeMaintenanceSerialMonitor() {
        return (0, _serialMonitorCommand.command)();
      },
      'platformio-ide:maintenance.serial-ports': function platformioIdeMaintenanceSerialPorts() {
        return maintenance.openTerminal('pio serialports list');
      },

      'platformio-ide:maintenance.rebuild-index': function platformioIdeMaintenanceRebuildIndex() {
        var p = utils.getActiveProjectPath();
        if (!p) {
          atom.notifications.addError('PlatformIO: Please open the project directory.');
          return;
        }
        if (p === _config.NO_ELIGIBLE_PROJECTS_FOUND) {
          atom.notifications.addError('Can not find PlatformIO project.', {
            detail: 'Make sure that project you\'re trying to rebuid is a ' + 'PlatformIO project (e. g., contains `platformio.ini`).'
          });
          return;
        }
        return init.intendToPerformIndexRebuild(p);
      },
      'platformio-ide:maintenance.install-commands': function platformioIdeMaintenanceInstallCommands() {
        return maintenance.installCommands();
      },
      'platformio-ide:maintenance.update-platformio': function platformioIdeMaintenanceUpdatePlatformio() {
        return maintenance.openTerminal('platformio update');
      },
      'platformio-ide:maintenance.upgrade-platformio': function platformioIdeMaintenanceUpgradePlatformio() {
        return maintenance.openTerminal('platformio upgrade');
      },

      'platformio-ide:piolpus-site': function platformioIdePiolpusSite() {
        return _shell2['default'].openExternal('https://pioplus.com');
      },
      'platformio-ide:help-docs': function platformioIdeHelpDocs() {
        return _shell2['default'].openExternal('http://docs.platformio.org/');
      },
      'platformio-ide:help-faq': function platformioIdeHelpFaq() {
        return _shell2['default'].openExternal('http://docs.platformio.org/page/faq.html');
      },
      'platformio-ide:help.report-platformio-issue': function platformioIdeHelpReportPlatformioIssue() {
        return _shell2['default'].openExternal('https://github.com/platformio/platformio/issues');
      },
      'platformio-ide:help.community': function platformioIdeHelpCommunity() {
        return _shell2['default'].openExternal('https://community.platformio.org/');
      },

      'platformio-ide:help-twitter': function platformioIdeHelpTwitter() {
        return _shell2['default'].openExternal('https://twitter.com/PlatformIO_Org');
      },
      'platformio-ide:help-facebook': function platformioIdeHelpFacebook() {
        return _shell2['default'].openExternal('https://www.facebook.com/platformio');
      },

      'platformio-ide:help-website': function platformioIdeHelpWebsite() {
        return _shell2['default'].openExternal('http://platformio.org/');
      },
      'platformio-ide:help-about': function platformioIdeHelpAbout() {
        return atom.workspace.open('platformio://about');
      },
      'platformio-ide:donate': function platformioIdeDonate() {
        return (0, _donateCommand.command)();
      },

      'platformio-ide:settings:pkg-platformio-ide': function platformioIdeSettingsPkgPlatformioIde() {
        return atom.workspace.open('atom://config/packages/platformio-ide/');
      },
      'platformio-ide:settings:pkg-platformio-ide-terminal': function platformioIdeSettingsPkgPlatformioIdeTerminal() {
        return atom.workspace.open('atom://config/packages/platformio-ide-terminal/');
      },
      'platformio-ide:settings:pkg-build': function platformioIdeSettingsPkgBuild() {
        return atom.workspace.open('atom://config/packages/build/');
      },
      'platformio-ide:settings:pkg-file-icons': function platformioIdeSettingsPkgFileIcons() {
        return atom.workspace.open('atom://config/packages/file-icons/');
      },
      'platformio-ide:settings:pkg-linter': function platformioIdeSettingsPkgLinter() {
        return atom.workspace.open('atom://config/packages/linter/');
      },
      'platformio-ide:settings:pkg-minimap': function platformioIdeSettingsPkgMinimap() {
        return atom.workspace.open('atom://config/packages/minimap/');
      },
      'platformio-ide:settings:pkg-tool-bar': function platformioIdeSettingsPkgToolBar() {
        return atom.workspace.open('atom://config/packages/tool-bar/');
      },

      'platformio-ide:home-screen': function platformioIdeHomeScreen() {
        return (0, _homeScreenCommand.command)(true);
      },
      'platformio-ide:project-examples': function platformioIdeProjectExamples() {
        return (0, _projectExamplesCommand.command)();
      }
    }));

    // Refresh build targets on useBuiltinPlatformIO change
    this.subscriptions.add(atom.config.onDidChange('platformio-ide.useBuiltinPlatformIO', function () {
      utils.runAtomCommand('build:refresh-targets');
      maintenance.updateOSEnviron();
    }));

    this.subscriptions.add(atom.config.onDidChange('platformio-ide.useDevelopPlatformIO', function (event) {
      (0, _installCommand.reinstallPlatformIO)(event.newValue);
    }));

    this.subscriptions.add(atom.config.onDidChange('platformio-ide.customPATH', function (event) {
      maintenance.handleCustomPATH(event.newValue, event.oldValue);
    }));

    this.subscriptions.add(atom.config.onDidChange('platformio-ide.showPlatformIOFiles', function () {
      maintenance.handleShowPlatformIOFiles();
    }));
    maintenance.handleShowPlatformIOFiles();

    this.subscriptions.add(atom.config.onDidChange('platformio-ide.autoCloseSerialMonitor', function () {
      utils.runAtomCommand('build:refresh-targets');
    }));

    for (var target of ['Build', 'Upload', 'Clean', 'Test']) {
      this.subscriptions.add(atom.commands.add('atom-workspace', 'platformio-ide:target:' + target.toLowerCase(), makeRunTargetCommand(target)));
    }

    function makeRunTargetCommand(target) {
      return function () {
        var p = utils.getActiveProjectPath();
        if (!p) {
          atom.notifications.addError('PlatformIO: Project does not have opened directories', {
            detail: 'Please open a directory with your PlatformIO project first.'
          });
          return;
        }
        if (p === _config.NO_ELIGIBLE_PROJECTS_FOUND) {
          atom.notifications.addError('Can not find PlatformIO project.', {
            detail: 'Make sure that project you\'re trying to buid is a ' + 'PlatformIO project (e. g., contains `platformio.ini`).'
          });
          return;
        }

        var status = utils.runAtomCommand('platformio-ide:target:' + target.toLowerCase() + '-' + p);
        if (!status) {
          atom.notifications.addError('PlatformIO: Failed to run a command: ' + target, {
            detail: 'Please make sure that "build" package is installed and activated.'
          });
        }
      };
    }

    this.subscriptions.add(atom.workspace.addOpener(function (uriToOpen) {
      if ('platformio://about' === uriToOpen) {
        return new _aboutView.AboutView(uriToOpen);
      } else if ('platformio://home' === uriToOpen) {
        return new _homeScreenView.HomeView(uriToOpen);
      } else if ('platformio://lib' === uriToOpen) {
        return new _librariesView.LibrariesView(uriToOpen);
      }
    }));

    this.subscriptions.add(atom.workspace.observeTextEditors(function (editor) {
      var editorPath = editor.getPath();
      if (!editorPath) {
        return;
      }

      // Handle *.ino and *.pde files as C++
      var extname = _path2['default'].extname(editorPath);
      if (['.ino', '.pde'].indexOf(extname) !== -1) {
        editor.setGrammar(atom.grammars.grammarForScopeName('source.cpp'));
        maintenance.notifyLinterDisabledforArduino();
      }
      if (['.ino', '.pde', '.c', '.cpp', '.h'].indexOf(extname) !== -1) {
        maintenance.checkClang();
      }

      if ('platformio.ini' === _path2['default'].basename(editorPath)) {
        editor.onDidSave(function () {
          return utils.runAtomCommand('build:refresh-targets');
        });
      }
    }));

    this.subscriptions.add(atom.project.onDidChangePaths(function (projectPaths) {
      utils.runAtomCommand('tree-view:show');
      init.ensureProjectsInited(projectPaths);
      init.handleLibChanges(projectPaths);
      (0, _homeScreenCommand.synchronizeRecentProjects)(projectPaths);
    }));

    this.subscriptions.add(atom.config.observe('platformio-ide.autoRebuildAutocompleteIndex', function (enabled) {
      if (enabled) {
        init.handleLibChanges(atom.project.getPaths());
      } else {
        init.clearLibChangeWatchers();
      }
    }));

    this.subscriptions.add(atom.config.onDidChange('platformio-ide.highlightActiveProject', function (event) {
      _this2.toggleActiveProjectHighlighter(event.newValue);
    }));
    this.toggleActiveProjectHighlighter(atom.config.get('platformio-ide.highlightActiveProject'));
  },

  toggleActiveProjectHighlighter: function toggleActiveProjectHighlighter(isEnabled) {
    var doHighlight = function doHighlight() {
      return maintenance.highlightActiveProject(isEnabled);
    };

    if (isEnabled) {
      if (!this.highlightSubscriptions) {
        this.highlightSubscriptions = new _atom.CompositeDisposable();
      }
      this.highlightSubscriptions.add(atom.workspace.onDidStopChangingActivePaneItem(doHighlight));
      this.highlightSubscriptions.add(atom.project.onDidChangePaths(doHighlight));
    } else {
      if (this.highlightSubscriptions) {
        this.highlightSubscriptions.dispose();
        this.highlightSubscriptions = null;
      }
    }
    doHighlight();
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
    if (this.highlightSubscriptions) {
      this.highlightSubscriptions.dispose();
    }
    init.clearLibChangeWatchers();
    if (this.toolBar) {
      this.toolBar.removeItems();
      this.toolBar = null;
    }
    init.cleanMiscCache();
    utils.cleanMiscCache();
  },

  consumeBusy: function consumeBusy(registry) {
    init.setBusyRegistry(registry);
  },

  consumeToolBar: function consumeToolBar(toolBar) {
    this.toolBar = toolBar('platformio-ide');

    this.toolBar.addButton({
      icon: 'check',
      callback: 'platformio-ide:target:build',
      tooltip: 'PlatformIO: Build'
    });

    this.toolBar.addButton({
      icon: 'arrow-right',
      callback: 'platformio-ide:target:upload',
      tooltip: 'PlatformIO: Upload'
    });

    this.toolBar.addButton({
      icon: 'trashcan',
      callback: 'platformio-ide:target:clean',
      tooltip: 'PlatformIO: Clean'
    });

    this.toolBar.addButton({
      icon: 'checklist',
      callback: 'build:select-active-target',
      tooltip: 'Run other target...'
    });

    this.toolBar.addButton({
      icon: 'fold',
      callback: 'build:toggle-panel',
      tooltip: 'Toggle Build Panel'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon: 'file-code',
      callback: 'platformio-ide:initialize-new-project',
      tooltip: 'Initialize or Update PlatformIO Project'
    });

    this.toolBar.addButton({
      icon: 'file-directory',
      callback: 'application:add-project-folder',
      tooltip: 'Open Project Folder...'
    });

    this.toolBar.addButton({
      icon: 'search',
      callback: 'project-find:show',
      tooltip: 'Find in Project...'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon: 'terminal',
      callback: 'platformio-ide:maintenance.open-terminal',
      tooltip: 'Terminal'
    });

    this.toolBar.addButton({
      icon: 'code',
      callback: 'platformio-ide:maintenance.libraries',
      tooltip: 'Library Manager'
    });

    this.toolBar.addButton({
      icon: 'plug',
      callback: 'platformio-ide:maintenance.serial-monitor',
      tooltip: 'Serial Monitor'
    });

    this.toolBar.addSpacer();

    this.toolBar.addButton({
      icon: 'gear',
      callback: 'application:show-settings',
      tooltip: 'Settings'
    });

    this.toolBar.addButton({
      icon: 'question',
      callback: 'platformio-ide:help-docs',
      tooltip: 'PlatformIO Documentation'
    });
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9tYWluLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFtQnNCLGdCQUFnQjs7SUFBMUIsSUFBSTs7MkJBQ2EsZUFBZTs7SUFBaEMsV0FBVzs7cUJBQ0EsU0FBUzs7SUFBcEIsS0FBSzs7aUNBRWtELHVCQUF1Qjs7eUJBRWxFLGNBQWM7O29CQUNKLE1BQU07OzhCQUNqQixvQkFBb0I7OzZCQUNmLGtCQUFrQjs7c0JBQ0wsVUFBVTs7NkJBQ2Isa0JBQWtCOzs7O3dCQUVyQixZQUFZOzs2QkFDUixrQkFBa0I7OzJDQUNSLGtDQUFrQzs7OEJBQ3hDLG1CQUFtQjs7b0JBQzdDLE1BQU07Ozs7b0NBRWdCLDBCQUEwQjs7cUJBQy9DLE9BQU87Ozs7c0NBQ29CLDRCQUE0Qjs7QUF4Q3pFLFdBQVcsQ0FBQzs7QUEwQ1osTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFFBQU0scUJBQVE7QUFDZCxlQUFhLEVBQUUsSUFBSTtBQUNuQix3QkFBc0IsRUFBRSxJQUFJOztBQUU1QixzQkFBb0IsZ0NBQXNCOztBQUUxQyxnQkFBYyxFQUFFLDBCQUFXO0FBQ3pCLGtEQUErQjtHQUNoQzs7QUFFRCxVQUFRLEVBQUUsb0JBQVc7OztBQUNuQixlQUFXLENBQUMsZUFBZSxFQUFFLENBQUM7QUFDOUIsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQztBQUMvQyxrQ0FBbUIsQ0FDaEIsSUFBSSxDQUFDO2FBQU0sTUFBSyxhQUFhLEVBQUU7S0FBQSxDQUFDLENBQ2hDLElBQUksQ0FBQzthQUFNLGtEQUEwQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQUEsQ0FBQyxDQUM5RCxJQUFJLDRCQUFnQixDQUNwQixJQUFJLENBQUM7YUFBTSw0QkFBYyxJQUFJLENBQUM7S0FBQSxDQUFDLENBQy9CLElBQUksQ0FBQzthQUFN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LEVBQUUsQ0FBQzs7QUFFekIsUUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUM7QUFDckIsVUFBSSxFQUFFLE1BQU07QUFDWixjQUFRLEVBQUUsMkJBQTJCO0FBQ3JDLGFBQU8sRUFBRSxVQUFVO0tBQ3BCLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQztBQUNyQixVQUFJLEVBQUUsVUFBVTtBQUNoQixjQUFRLEVBQUUsMEJBQTBCO0FBQ3BDLGFBQU8sRUFBRSwwQkFBMEI7S0FDcEMsQ0FBQyxDQUFDO0dBQ0o7Q0FDRixDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCAqIGFzIGluaXQgZnJvbSAnLi9pbml0L2NvbW1hbmQnO1xuaW1wb3J0ICogYXMgbWFpbnRlbmFuY2UgZnJvbSAnLi9tYWludGVuYW5jZSc7XG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tICcuL3V0aWxzJztcblxuaW1wb3J0IHtjb21tYW5kIGFzIHNob3dIb21lU2NyZWVuLCBzeW5jaHJvbml6ZVJlY2VudFByb2plY3RzfSBmcm9tICcuL2hvbWUtc2NyZWVuL2NvbW1hbmQnO1xuXG5pbXBvcnQge0Fib3V0Vmlld30gZnJvbSAnLi9hYm91dC92aWV3JztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge0hvbWVWaWV3fSBmcm9tICcuL2hvbWUtc2NyZWVuL3ZpZXcnO1xuaW1wb3J0IHtMaWJyYXJpZXNWaWV3fSBmcm9tICcuL2xpYnJhcmllcy92aWV3JztcbmltcG9ydCB7Tk9fRUxJR0lCTEVfUFJPSkVDVFNfRk9VTkR9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7UGxhdGZvcm1JT0J1aWxkUHJvdmlkZXJ9IGZyb20gJy4vYnVpbGQtcHJvdmlkZXInO1xuaW1wb3J0IGNvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQge2NvbnN1bWVSdW5JblRlcm1pbmFsfSBmcm9tICcuL3Rlcm1pbmFsJztcbmltcG9ydCB7Y29tbWFuZCBhcyBkb25hdGVDb21tYW5kfSBmcm9tICcuL2RvbmF0ZS9jb21tYW5kJztcbmltcG9ydCB7Y29tbWFuZCBhcyBpbXBvcnRBcmR1aW5vSURFUHJvamVjdH0gZnJvbSAnLi9pbXBvcnQtYXJkdWluby1wcm9qZWN0L2NvbW1hbmQnO1xuaW1wb3J0IHtjb21tYW5kIGFzIGluc3RhbGxQbGF0Zm9ybUlPfSBmcm9tICcuL2luc3RhbGwvY29tbWFuZCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7cmVpbnN0YWxsUGxhdGZvcm1JT30gZnJvbSAnLi9pbnN0YWxsL2NvbW1hbmQnO1xuaW1wb3J0IHtjb21tYW5kIGFzIHNlcmlhbE1vbml0b3J9IGZyb20gJy4vc2VyaWFsLW1vbml0b3IvY29tbWFuZCc7XG5pbXBvcnQgc2hlbGwgZnJvbSAnc2hlbGwnO1xuaW1wb3J0IHtjb21tYW5kIGFzIHNob3dQcm9qZWN0RXhhbXBsZXN9IGZyb20gJy4vcHJvamVjdC1leGFtcGxlcy9jb21tYW5kJztcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGNvbmZpZzogY29uZmlnLFxuICBzdWJzY3JpcHRpb25zOiBudWxsLFxuICBoaWdobGlnaHRTdWJzY3JpcHRpb25zOiBudWxsLFxuXG4gIGNvbnN1bWVSdW5JblRlcm1pbmFsOiBjb25zdW1lUnVuSW5UZXJtaW5hbCxcblxuICBwcm92aWRlQnVpbGRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFBsYXRmb3JtSU9CdWlsZFByb3ZpZGVyO1xuICB9LFxuXG4gIGFjdGl2YXRlOiBmdW5jdGlvbigpIHtcbiAgICBtYWludGVuYW5jZS51cGRhdGVPU0Vudmlyb24oKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgIGluc3RhbGxQbGF0Zm9ybUlPKClcbiAgICAgIC50aGVuKCgpID0+IHRoaXMuc2V0dXBDb21tYW5kcygpKVxuICAgICAgLnRoZW4oKCkgPT4gc3luY2hyb25pemVSZWNlbnRQcm9qZWN0cyhhdG9tLnByb2plY3QuZ2V0UGF0aHMoKSkpXG4gICAgICAudGhlbihzaG93SG9tZVNjcmVlbilcbiAgICAgIC50aGVuKCgpID0+IGRvbmF0ZUNvbW1hbmQodHJ1ZSkpXG4gICAgICAudGhlbigoKSA9PiBtYWludGVuYW5jZS5zZXR1cEFjdGl2YXRpb25Ib29rcygpKTtcbiAgfSxcblxuICBzZXR1cENvbW1hbmRzOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsIHtcbiAgICAgICdwbGF0Zm9ybWlvLWlkZTppbml0aWFsaXplLW5ldy1wcm9qZWN0JzogKCkgPT4gaW5pdC5jb21tYW5kKCksXG4gICAgICAncGxhdGZvcm1pby1pZGU6aW1wb3J0LWFyZHVpbm8taWRlLXByb2plY3QnOiAoKSA9PiBpbXBvcnRBcmR1aW5vSURFUHJvamVjdCgpLFxuXG4gICAgICAncGxhdGZvcm1pby1pZGU6bWFpbnRlbmFuY2Uub3Blbi10ZXJtaW5hbCc6ICgpID0+IG1haW50ZW5hbmNlLm9wZW5UZXJtaW5hbCgncGlvIC0taGVscCcpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOm1haW50ZW5hbmNlLmxpYnJhcmllcyc6ICgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ3BsYXRmb3JtaW86Ly9saWInKSxcbiAgICAgICdwbGF0Zm9ybWlvLWlkZTptYWludGVuYW5jZS5zZXJpYWwtbW9uaXRvcic6ICgpID0+IHNlcmlhbE1vbml0b3IoKSxcbiAgICAgICdwbGF0Zm9ybWlvLWlkZTptYWludGVuYW5jZS5zZXJpYWwtcG9ydHMnOiAoKSA9PiBtYWludGVuYW5jZS5vcGVuVGVybWluYWwoJ3BpbyBzZXJpYWxwb3J0cyBsaXN0JyksXG5cbiAgICAgICdwbGF0Zm9ybWlvLWlkZTptYWludGVuYW5jZS5yZWJ1aWxkLWluZGV4JzogKCkgPT4ge1xuICAgICAgICBjb25zdCBwID0gdXRpbHMuZ2V0QWN0aXZlUHJvamVjdFBhdGgoKTtcbiAgICAgICAgaWYgKCFwKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdQbGF0Zm9ybUlPOiBQbGVhc2Ugb3BlbiB0aGUgcHJvamVjdCBkaXJlY3RvcnkuJyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwID09PSBOT19FTElHSUJMRV9QUk9KRUNUU19GT1VORCkge1xuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignQ2FuIG5vdCBmaW5kIFBsYXRmb3JtSU8gcHJvamVjdC4nLCB7XG4gICAgICAgICAgICBkZXRhaWw6ICdNYWtlIHN1cmUgdGhhdCBwcm9qZWN0IHlvdVxcJ3JlIHRyeWluZyB0byByZWJ1aWQgaXMgYSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1BsYXRmb3JtSU8gcHJvamVjdCAoZS4gZy4sIGNvbnRhaW5zIGBwbGF0Zm9ybWlvLmluaWApLicsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBpbml0LmludGVuZFRvUGVyZm9ybUluZGV4UmVidWlsZChwKTtcbiAgICAgIH0sXG4gICAgICAncGxhdGZvcm1pby1pZGU6bWFpbnRlbmFuY2UuaW5zdGFsbC1jb21tYW5kcyc6ICgpID0+IG1haW50ZW5hbmNlLmluc3RhbGxDb21tYW5kcygpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOm1haW50ZW5hbmNlLnVwZGF0ZS1wbGF0Zm9ybWlvJzogKCkgPT4gbWFpbnRlbmFuY2Uub3BlblRlcm1pbmFsKCdwbGF0Zm9ybWlvIHVwZGF0ZScpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOm1haW50ZW5hbmNlLnVwZ3JhZGUtcGxhdGZvcm1pbyc6ICgpID0+IG1haW50ZW5hbmNlLm9wZW5UZXJtaW5hbCgncGxhdGZvcm1pbyB1cGdyYWRlJyksXG5cbiAgICAgICdwbGF0Zm9ybWlvLWlkZTpwaW9scHVzLXNpdGUnOlxuICAgICAgICAoKSA9PiBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vcGlvcGx1cy5jb20nKSxcbiAgICAgICdwbGF0Zm9ybWlvLWlkZTpoZWxwLWRvY3MnOlxuICAgICAgICAgICgpID0+IHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cDovL2RvY3MucGxhdGZvcm1pby5vcmcvJyksXG4gICAgICAncGxhdGZvcm1pby1pZGU6aGVscC1mYXEnOlxuICAgICAgICAoKSA9PiBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHA6Ly9kb2NzLnBsYXRmb3JtaW8ub3JnL3BhZ2UvZmFxLmh0bWwnKSxcbiAgICAgICdwbGF0Zm9ybWlvLWlkZTpoZWxwLnJlcG9ydC1wbGF0Zm9ybWlvLWlzc3VlJzpcbiAgICAgICAgKCkgPT4gc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2dpdGh1Yi5jb20vcGxhdGZvcm1pby9wbGF0Zm9ybWlvL2lzc3VlcycpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOmhlbHAuY29tbXVuaXR5JzpcbiAgICAgICAgKCkgPT4gc2hlbGwub3BlbkV4dGVybmFsKCdodHRwczovL2NvbW11bml0eS5wbGF0Zm9ybWlvLm9yZy8nKSxcblxuICAgICAgJ3BsYXRmb3JtaW8taWRlOmhlbHAtdHdpdHRlcic6XG4gICAgICAgICgpID0+IHNoZWxsLm9wZW5FeHRlcm5hbCgnaHR0cHM6Ly90d2l0dGVyLmNvbS9QbGF0Zm9ybUlPX09yZycpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOmhlbHAtZmFjZWJvb2snOlxuICAgICAgICAoKSA9PiBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9wbGF0Zm9ybWlvJyksXG5cbiAgICAgICdwbGF0Zm9ybWlvLWlkZTpoZWxwLXdlYnNpdGUnOlxuICAgICAgICAoKSA9PiBzaGVsbC5vcGVuRXh0ZXJuYWwoJ2h0dHA6Ly9wbGF0Zm9ybWlvLm9yZy8nKSxcbiAgICAgICdwbGF0Zm9ybWlvLWlkZTpoZWxwLWFib3V0JzpcbiAgICAgICAgKCkgPT4gYXRvbS53b3Jrc3BhY2Uub3BlbigncGxhdGZvcm1pbzovL2Fib3V0JyksXG4gICAgICAncGxhdGZvcm1pby1pZGU6ZG9uYXRlJzogKCkgPT4gZG9uYXRlQ29tbWFuZCgpLFxuXG4gICAgICAncGxhdGZvcm1pby1pZGU6c2V0dGluZ3M6cGtnLXBsYXRmb3JtaW8taWRlJzpcbiAgICAgICAgKCkgPT4gYXRvbS53b3Jrc3BhY2Uub3BlbignYXRvbTovL2NvbmZpZy9wYWNrYWdlcy9wbGF0Zm9ybWlvLWlkZS8nKSxcbiAgICAgICdwbGF0Zm9ybWlvLWlkZTpzZXR0aW5nczpwa2ctcGxhdGZvcm1pby1pZGUtdGVybWluYWwnOlxuICAgICAgICAoKSA9PiBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tOi8vY29uZmlnL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsLycpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOnNldHRpbmdzOnBrZy1idWlsZCc6XG4gICAgICAgICgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMvYnVpbGQvJyksXG4gICAgICAncGxhdGZvcm1pby1pZGU6c2V0dGluZ3M6cGtnLWZpbGUtaWNvbnMnOlxuICAgICAgICAoKSA9PiBhdG9tLndvcmtzcGFjZS5vcGVuKCdhdG9tOi8vY29uZmlnL3BhY2thZ2VzL2ZpbGUtaWNvbnMvJyksXG4gICAgICAncGxhdGZvcm1pby1pZGU6c2V0dGluZ3M6cGtnLWxpbnRlcic6XG4gICAgICAgICgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMvbGludGVyLycpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOnNldHRpbmdzOnBrZy1taW5pbWFwJzpcbiAgICAgICAgKCkgPT4gYXRvbS53b3Jrc3BhY2Uub3BlbignYXRvbTovL2NvbmZpZy9wYWNrYWdlcy9taW5pbWFwLycpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOnNldHRpbmdzOnBrZy10b29sLWJhcic6XG4gICAgICAgICgpID0+IGF0b20ud29ya3NwYWNlLm9wZW4oJ2F0b206Ly9jb25maWcvcGFja2FnZXMvdG9vbC1iYXIvJyksXG5cbiAgICAgICdwbGF0Zm9ybWlvLWlkZTpob21lLXNjcmVlbic6ICgpID0+IHNob3dIb21lU2NyZWVuKHRydWUpLFxuICAgICAgJ3BsYXRmb3JtaW8taWRlOnByb2plY3QtZXhhbXBsZXMnOiAoKSA9PiBzaG93UHJvamVjdEV4YW1wbGVzKCksXG4gICAgfSkpO1xuXG4gICAgLy8gUmVmcmVzaCBidWlsZCB0YXJnZXRzIG9uIHVzZUJ1aWx0aW5QbGF0Zm9ybUlPIGNoYW5nZVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgncGxhdGZvcm1pby1pZGUudXNlQnVpbHRpblBsYXRmb3JtSU8nLCAoKSA9PiB7XG4gICAgICAgIHV0aWxzLnJ1bkF0b21Db21tYW5kKCdidWlsZDpyZWZyZXNoLXRhcmdldHMnKTtcbiAgICAgICAgbWFpbnRlbmFuY2UudXBkYXRlT1NFbnZpcm9uKCk7XG4gICAgICB9KVxuICAgICk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3BsYXRmb3JtaW8taWRlLnVzZURldmVsb3BQbGF0Zm9ybUlPJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIHJlaW5zdGFsbFBsYXRmb3JtSU8oZXZlbnQubmV3VmFsdWUpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKCdwbGF0Zm9ybWlvLWlkZS5jdXN0b21QQVRIJywgKGV2ZW50KSA9PiB7XG4gICAgICAgIG1haW50ZW5hbmNlLmhhbmRsZUN1c3RvbVBBVEgoZXZlbnQubmV3VmFsdWUsIGV2ZW50Lm9sZFZhbHVlKTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgncGxhdGZvcm1pby1pZGUuc2hvd1BsYXRmb3JtSU9GaWxlcycsICgpID0+IHtcbiAgICAgICAgbWFpbnRlbmFuY2UuaGFuZGxlU2hvd1BsYXRmb3JtSU9GaWxlcygpO1xuICAgICAgfSlcbiAgICApO1xuICAgIG1haW50ZW5hbmNlLmhhbmRsZVNob3dQbGF0Zm9ybUlPRmlsZXMoKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgncGxhdGZvcm1pby1pZGUuYXV0b0Nsb3NlU2VyaWFsTW9uaXRvcicsICgpID0+IHtcbiAgICAgICAgdXRpbHMucnVuQXRvbUNvbW1hbmQoJ2J1aWxkOnJlZnJlc2gtdGFyZ2V0cycpO1xuICAgICAgfSlcbiAgICApO1xuXG4gICAgZm9yIChjb25zdCB0YXJnZXQgb2YgWydCdWlsZCcsICdVcGxvYWQnLCAnQ2xlYW4nLCAnVGVzdCddKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29tbWFuZHMuYWRkKFxuICAgICAgICAnYXRvbS13b3Jrc3BhY2UnLFxuICAgICAgICBgcGxhdGZvcm1pby1pZGU6dGFyZ2V0OiR7dGFyZ2V0LnRvTG93ZXJDYXNlKCl9YCxcbiAgICAgICAgbWFrZVJ1blRhcmdldENvbW1hbmQodGFyZ2V0KVxuICAgICAgKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZVJ1blRhcmdldENvbW1hbmQodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHAgPSB1dGlscy5nZXRBY3RpdmVQcm9qZWN0UGF0aCgpO1xuICAgICAgICBpZiAoIXApIHtcbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoJ1BsYXRmb3JtSU86IFByb2plY3QgZG9lcyBub3QgaGF2ZSBvcGVuZWQgZGlyZWN0b3JpZXMnLCB7XG4gICAgICAgICAgICBkZXRhaWw6ICdQbGVhc2Ugb3BlbiBhIGRpcmVjdG9yeSB3aXRoIHlvdXIgUGxhdGZvcm1JTyBwcm9qZWN0IGZpcnN0LidcbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHAgPT09IE5PX0VMSUdJQkxFX1BST0pFQ1RTX0ZPVU5EKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdDYW4gbm90IGZpbmQgUGxhdGZvcm1JTyBwcm9qZWN0LicsIHtcbiAgICAgICAgICAgIGRldGFpbDogJ01ha2Ugc3VyZSB0aGF0IHByb2plY3QgeW91XFwncmUgdHJ5aW5nIHRvIGJ1aWQgaXMgYSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1BsYXRmb3JtSU8gcHJvamVjdCAoZS4gZy4sIGNvbnRhaW5zIGBwbGF0Zm9ybWlvLmluaWApLicsXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgc3RhdHVzID0gdXRpbHMucnVuQXRvbUNvbW1hbmQoYHBsYXRmb3JtaW8taWRlOnRhcmdldDoke3RhcmdldC50b0xvd2VyQ2FzZSgpfS0ke3B9YCk7XG4gICAgICAgIGlmICghc3RhdHVzKSB7XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBQbGF0Zm9ybUlPOiBGYWlsZWQgdG8gcnVuIGEgY29tbWFuZDogJHt0YXJnZXR9YCwge1xuICAgICAgICAgICAgZGV0YWlsOiAnUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IFwiYnVpbGRcIiBwYWNrYWdlIGlzIGluc3RhbGxlZCBhbmQgYWN0aXZhdGVkLicsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5hZGRPcGVuZXIoKHVyaVRvT3BlbikgPT4ge1xuICAgICAgaWYgKCdwbGF0Zm9ybWlvOi8vYWJvdXQnID09PSB1cmlUb09wZW4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBBYm91dFZpZXcodXJpVG9PcGVuKTtcbiAgICAgIH0gZWxzZSBpZiAoJ3BsYXRmb3JtaW86Ly9ob21lJyA9PT0gdXJpVG9PcGVuKSB7XG4gICAgICAgIHJldHVybiBuZXcgSG9tZVZpZXcodXJpVG9PcGVuKTtcbiAgICAgIH0gZWxzZSBpZiAoJ3BsYXRmb3JtaW86Ly9saWInID09PSB1cmlUb09wZW4pIHtcbiAgICAgICAgcmV0dXJuIG5ldyBMaWJyYXJpZXNWaWV3KHVyaVRvT3Blbik7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuICAgICAgY29uc3QgZWRpdG9yUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBpZiAoIWVkaXRvclBhdGgpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBIYW5kbGUgKi5pbm8gYW5kICoucGRlIGZpbGVzIGFzIEMrK1xuICAgICAgY29uc3QgZXh0bmFtZSA9IHBhdGguZXh0bmFtZShlZGl0b3JQYXRoKTtcbiAgICAgIGlmIChbJy5pbm8nLCAnLnBkZSddLmluZGV4T2YoZXh0bmFtZSkgIT09IC0xKSB7XG4gICAgICAgIGVkaXRvci5zZXRHcmFtbWFyKGF0b20uZ3JhbW1hcnMuZ3JhbW1hckZvclNjb3BlTmFtZSgnc291cmNlLmNwcCcpKTtcbiAgICAgICAgbWFpbnRlbmFuY2Uubm90aWZ5TGludGVyRGlzYWJsZWRmb3JBcmR1aW5vKCk7XG4gICAgICB9XG4gICAgICBpZiAoWycuaW5vJywgJy5wZGUnLCAnLmMnLCAnLmNwcCcsICcuaCddLmluZGV4T2YoZXh0bmFtZSkgIT09IC0xKSB7XG4gICAgICAgIG1haW50ZW5hbmNlLmNoZWNrQ2xhbmcoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCdwbGF0Zm9ybWlvLmluaScgPT09IHBhdGguYmFzZW5hbWUoZWRpdG9yUGF0aCkpIHtcbiAgICAgICAgZWRpdG9yLm9uRGlkU2F2ZSgoKSA9PiB1dGlscy5ydW5BdG9tQ29tbWFuZCgnYnVpbGQ6cmVmcmVzaC10YXJnZXRzJykpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMoKHByb2plY3RQYXRocykgPT4ge1xuICAgICAgdXRpbHMucnVuQXRvbUNvbW1hbmQoJ3RyZWUtdmlldzpzaG93Jyk7XG4gICAgICBpbml0LmVuc3VyZVByb2plY3RzSW5pdGVkKHByb2plY3RQYXRocyk7XG4gICAgICBpbml0LmhhbmRsZUxpYkNoYW5nZXMocHJvamVjdFBhdGhzKTtcbiAgICAgIHN5bmNocm9uaXplUmVjZW50UHJvamVjdHMocHJvamVjdFBhdGhzKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ3BsYXRmb3JtaW8taWRlLmF1dG9SZWJ1aWxkQXV0b2NvbXBsZXRlSW5kZXgnLCAoZW5hYmxlZCkgPT4ge1xuICAgICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgICAgaW5pdC5oYW5kbGVMaWJDaGFuZ2VzKGF0b20ucHJvamVjdC5nZXRQYXRocygpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGluaXQuY2xlYXJMaWJDaGFuZ2VXYXRjaGVycygpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgncGxhdGZvcm1pby1pZGUuaGlnaGxpZ2h0QWN0aXZlUHJvamVjdCcsIChldmVudCkgPT4ge1xuICAgICAgICB0aGlzLnRvZ2dsZUFjdGl2ZVByb2plY3RIaWdobGlnaHRlcihldmVudC5uZXdWYWx1ZSk7XG4gICAgICB9KVxuICAgICk7XG4gICAgdGhpcy50b2dnbGVBY3RpdmVQcm9qZWN0SGlnaGxpZ2h0ZXIoYXRvbS5jb25maWcuZ2V0KCdwbGF0Zm9ybWlvLWlkZS5oaWdobGlnaHRBY3RpdmVQcm9qZWN0JykpO1xuICB9LFxuXG4gIHRvZ2dsZUFjdGl2ZVByb2plY3RIaWdobGlnaHRlcjogZnVuY3Rpb24oaXNFbmFibGVkKSB7XG4gICAgY29uc3QgZG9IaWdobGlnaHQgPSAoKSA9PiBtYWludGVuYW5jZS5oaWdobGlnaHRBY3RpdmVQcm9qZWN0KGlzRW5hYmxlZCk7XG5cbiAgICBpZiAoaXNFbmFibGVkKSB7XG4gICAgICBpZiAoIXRoaXMuaGlnaGxpZ2h0U3Vic2NyaXB0aW9ucykge1xuICAgICAgICB0aGlzLmhpZ2hsaWdodFN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICAgICAgfVxuICAgICAgdGhpcy5oaWdobGlnaHRTdWJzY3JpcHRpb25zLmFkZChhdG9tLndvcmtzcGFjZS5vbkRpZFN0b3BDaGFuZ2luZ0FjdGl2ZVBhbmVJdGVtKGRvSGlnaGxpZ2h0KSk7XG4gICAgICB0aGlzLmhpZ2hsaWdodFN1YnNjcmlwdGlvbnMuYWRkKGF0b20ucHJvamVjdC5vbkRpZENoYW5nZVBhdGhzKGRvSGlnaGxpZ2h0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmhpZ2hsaWdodFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRTdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgICAgICAgdGhpcy5oaWdobGlnaHRTdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgZG9IaWdobGlnaHQoKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIGlmICh0aGlzLmhpZ2hsaWdodFN1YnNjcmlwdGlvbnMpIHtcbiAgICAgIHRoaXMuaGlnaGxpZ2h0U3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgfVxuICAgIGluaXQuY2xlYXJMaWJDaGFuZ2VXYXRjaGVycygpO1xuICAgIGlmICh0aGlzLnRvb2xCYXIpIHtcbiAgICAgIHRoaXMudG9vbEJhci5yZW1vdmVJdGVtcygpO1xuICAgICAgdGhpcy50b29sQmFyID0gbnVsbDtcbiAgICB9XG4gICAgaW5pdC5jbGVhbk1pc2NDYWNoZSgpO1xuICAgIHV0aWxzLmNsZWFuTWlzY0NhY2hlKCk7XG4gIH0sXG5cbiAgY29uc3VtZUJ1c3k6IGZ1bmN0aW9uKHJlZ2lzdHJ5KSB7XG4gICAgaW5pdC5zZXRCdXN5UmVnaXN0cnkocmVnaXN0cnkpO1xuICB9LFxuXG4gIGNvbnN1bWVUb29sQmFyOiBmdW5jdGlvbih0b29sQmFyKSB7XG4gICAgdGhpcy50b29sQmFyID0gdG9vbEJhcigncGxhdGZvcm1pby1pZGUnKTtcblxuICAgIHRoaXMudG9vbEJhci5hZGRCdXR0b24oe1xuICAgICAgaWNvbjogJ2NoZWNrJyxcbiAgICAgIGNhbGxiYWNrOiAncGxhdGZvcm1pby1pZGU6dGFyZ2V0OmJ1aWxkJyxcbiAgICAgIHRvb2x0aXA6ICdQbGF0Zm9ybUlPOiBCdWlsZCdcbiAgICB9KTtcblxuICAgIHRoaXMudG9vbEJhci5hZGRCdXR0b24oe1xuICAgICAgaWNvbjogJ2Fycm93LXJpZ2h0JyxcbiAgICAgIGNhbGxiYWNrOiAncGxhdGZvcm1pby1pZGU6dGFyZ2V0OnVwbG9hZCcsXG4gICAgICB0b29sdGlwOiAnUGxhdGZvcm1JTzogVXBsb2FkJ1xuICAgIH0pO1xuXG4gICAgdGhpcy50b29sQmFyLmFkZEJ1dHRvbih7XG4gICAgICBpY29uOiAndHJhc2hjYW4nLFxuICAgICAgY2FsbGJhY2s6ICdwbGF0Zm9ybWlvLWlkZTp0YXJnZXQ6Y2xlYW4nLFxuICAgICAgdG9vbHRpcDogJ1BsYXRmb3JtSU86IENsZWFuJ1xuICAgIH0pO1xuXG4gICAgdGhpcy50b29sQmFyLmFkZEJ1dHRvbih7XG4gICAgICBpY29uOiAnY2hlY2tsaXN0JyxcbiAgICAgIGNhbGxiYWNrOiAnYnVpbGQ6c2VsZWN0LWFjdGl2ZS10YXJnZXQnLFxuICAgICAgdG9vbHRpcDogJ1J1biBvdGhlciB0YXJnZXQuLi4nXG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2xCYXIuYWRkQnV0dG9uKHtcbiAgICAgIGljb246ICdmb2xkJyxcbiAgICAgIGNhbGxiYWNrOiAnYnVpbGQ6dG9nZ2xlLXBhbmVsJyxcbiAgICAgIHRvb2x0aXA6ICdUb2dnbGUgQnVpbGQgUGFuZWwnXG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2xCYXIuYWRkU3BhY2VyKCk7XG5cbiAgICB0aGlzLnRvb2xCYXIuYWRkQnV0dG9uKHtcbiAgICAgIGljb246ICdmaWxlLWNvZGUnLFxuICAgICAgY2FsbGJhY2s6ICdwbGF0Zm9ybWlvLWlkZTppbml0aWFsaXplLW5ldy1wcm9qZWN0JyxcbiAgICAgIHRvb2x0aXA6ICdJbml0aWFsaXplIG9yIFVwZGF0ZSBQbGF0Zm9ybUlPIFByb2plY3QnXG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2xCYXIuYWRkQnV0dG9uKHtcbiAgICAgIGljb246ICdmaWxlLWRpcmVjdG9yeScsXG4gICAgICBjYWxsYmFjazogJ2FwcGxpY2F0aW9uOmFkZC1wcm9qZWN0LWZvbGRlcicsXG4gICAgICB0b29sdGlwOiAnT3BlbiBQcm9qZWN0IEZvbGRlci4uLidcbiAgICB9KTtcblxuICAgIHRoaXMudG9vbEJhci5hZGRCdXR0b24oe1xuICAgICAgaWNvbjogJ3NlYXJjaCcsXG4gICAgICBjYWxsYmFjazogJ3Byb2plY3QtZmluZDpzaG93JyxcbiAgICAgIHRvb2x0aXA6ICdGaW5kIGluIFByb2plY3QuLi4nXG4gICAgfSk7XG5cbiAgICB0aGlzLnRvb2xCYXIuYWRkU3BhY2VyKCk7XG5cbiAgICB0aGlzLnRvb2xCYXIuYWRkQnV0dG9uKHtcbiAgICAgIGljb246ICd0ZXJtaW5hbCcsXG4gICAgICBjYWxsYmFjazogJ3BsYXRmb3JtaW8taWRlOm1haW50ZW5hbmNlLm9wZW4tdGVybWluYWwnLFxuICAgICAgdG9vbHRpcDogJ1Rlcm1pbmFsJ1xuICAgIH0pO1xuXG4gICAgdGhpcy50b29sQmFyLmFkZEJ1dHRvbih7XG4gICAgICBpY29uOiAnY29kZScsXG4gICAgICBjYWxsYmFjazogJ3BsYXRmb3JtaW8taWRlOm1haW50ZW5hbmNlLmxpYnJhcmllcycsXG4gICAgICB0b29sdGlwOiAnTGlicmFyeSBNYW5hZ2VyJ1xuICAgIH0pO1xuXG4gICAgdGhpcy50b29sQmFyLmFkZEJ1dHRvbih7XG4gICAgICBpY29uOiAncGx1ZycsXG4gICAgICBjYWxsYmFjazogJ3BsYXRmb3JtaW8taWRlOm1haW50ZW5hbmNlLnNlcmlhbC1tb25pdG9yJyxcbiAgICAgIHRvb2x0aXA6ICdTZXJpYWwgTW9uaXRvcidcbiAgICB9KTtcblxuICAgIHRoaXMudG9vbEJhci5hZGRTcGFjZXIoKTtcblxuICAgIHRoaXMudG9vbEJhci5hZGRCdXR0b24oe1xuICAgICAgaWNvbjogJ2dlYXInLFxuICAgICAgY2FsbGJhY2s6ICdhcHBsaWNhdGlvbjpzaG93LXNldHRpbmdzJyxcbiAgICAgIHRvb2x0aXA6ICdTZXR0aW5ncydcbiAgICB9KTtcblxuICAgIHRoaXMudG9vbEJhci5hZGRCdXR0b24oe1xuICAgICAgaWNvbjogJ3F1ZXN0aW9uJyxcbiAgICAgIGNhbGxiYWNrOiAncGxhdGZvcm1pby1pZGU6aGVscC1kb2NzJyxcbiAgICAgIHRvb2x0aXA6ICdQbGF0Zm9ybUlPIERvY3VtZW50YXRpb24nXG4gICAgfSk7XG4gIH1cbn07XG4iXX0=
//# sourceURL=/Users/gyurobenjamin/.atom/packages/platformio-ide/lib/main.js
