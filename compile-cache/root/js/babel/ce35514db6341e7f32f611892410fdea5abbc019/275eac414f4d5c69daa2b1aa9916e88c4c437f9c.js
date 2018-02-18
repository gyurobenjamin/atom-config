Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

'use babel';

var TargetManager = (function (_EventEmitter) {
  _inherits(TargetManager, _EventEmitter);

  function TargetManager() {
    var _this = this;

    _classCallCheck(this, TargetManager);

    _get(Object.getPrototypeOf(TargetManager.prototype), 'constructor', this).call(this);

    var projectPaths = atom.project.getPaths();

    this.pathTargets = projectPaths.map(function (path) {
      return _this._defaultPathTarget(path);
    });

    atom.project.onDidChangePaths(function (newProjectPaths) {
      var addedPaths = newProjectPaths.filter(function (el) {
        return projectPaths.indexOf(el) === -1;
      });
      var removedPaths = projectPaths.filter(function (el) {
        return newProjectPaths.indexOf(el) === -1;
      });
      addedPaths.forEach(function (path) {
        return _this.pathTargets.push(_this._defaultPathTarget(path));
      });
      _this.pathTargets = _this.pathTargets.filter(function (pt) {
        return -1 === removedPaths.indexOf(pt.path);
      });
      _this.refreshTargets(addedPaths);
      projectPaths = newProjectPaths;
    });

    atom.commands.add('atom-workspace', 'build:refresh-targets', function () {
      return _this.refreshTargets();
    });
    atom.commands.add('atom-workspace', 'build:select-active-target', function () {
      return _this.selectActiveTarget();
    });
  }

  _createClass(TargetManager, [{
    key: 'setBusyRegistry',
    value: function setBusyRegistry(registry) {
      this.busyRegistry = registry;
    }
  }, {
    key: '_defaultPathTarget',
    value: function _defaultPathTarget(path) {
      var CompositeDisposable = require('atom').CompositeDisposable;
      return {
        path: path,
        loading: false,
        targets: [],
        instancedTools: [],
        activeTarget: null,
        tools: [],
        subscriptions: new CompositeDisposable()
      };
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.pathTargets.forEach(function (pathTarget) {
        return pathTarget.tools.map(function (tool) {
          tool.removeAllListeners && tool.removeAllListeners('refresh');
          tool.destructor && tool.destructor();
        });
      });
    }
  }, {
    key: 'setTools',
    value: function setTools(tools) {
      this.tools = tools || [];
    }
  }, {
    key: 'refreshTargets',
    value: function refreshTargets(refreshPaths) {
      var _this2 = this;

      refreshPaths = refreshPaths || atom.project.getPaths();

      this.busyRegistry && this.busyRegistry.begin('build.refresh-targets', 'Refreshing targets for ' + refreshPaths.join(','));
      var pathPromises = refreshPaths.map(function (path) {
        var pathTarget = _this2.pathTargets.find(function (pt) {
          return pt.path === path;
        });
        pathTarget.loading = true;

        pathTarget.instancedTools = pathTarget.instancedTools.map(function (t) {
          return t.removeAllListeners && t.removeAllListeners('refresh');
        }).filter(function () {
          return false;
        }); // Just empty the array

        var settingsPromise = _this2.tools.map(function (Tool) {
          return new Tool(path);
        }).filter(function (tool) {
          return tool.isEligible();
        }).map(function (tool) {
          pathTarget.instancedTools.push(tool);
          require('./google-analytics').sendEvent('build', 'tool eligible', tool.getNiceName());

          tool.on && tool.on('refresh', _this2.refreshTargets.bind(_this2, [path]));
          return Promise.resolve().then(function () {
            return tool.settings();
          })['catch'](function (err) {
            if (err instanceof SyntaxError) {
              atom.notifications.addError('Invalid build file.', {
                detail: 'You have a syntax error in your build file: ' + err.message,
                dismissable: true
              });
            } else {
              var toolName = tool.getNiceName();
              atom.notifications.addError('Ooops. Something went wrong' + (toolName ? ' in the ' + toolName + ' build provider' : '') + '.', {
                detail: err.message,
                stack: err.stack,
                dismissable: true
              });
            }
          });
        });

        var CompositeDisposable = require('atom').CompositeDisposable;
        return Promise.all(settingsPromise).then(function (settings) {
          settings = require('./utils').uniquifySettings([].concat.apply([], settings).filter(Boolean).map(function (setting) {
            return require('./utils').getDefaultSettings(path, setting);
          }));

          if (null === pathTarget.activeTarget || !settings.find(function (s) {
            return s.name === pathTarget.activeTarget;
          })) {
            /* Active target has been removed or not set. Set it to the highest prio target */
            pathTarget.activeTarget = settings[0] ? settings[0].name : undefined;
          }

          // CompositeDisposable cannot be reused, so we must create a new instance on every refresh
          pathTarget.subscriptions.dispose();
          pathTarget.subscriptions = new CompositeDisposable();

          settings.forEach(function (setting, index) {
            if (setting.keymap && !setting.atomCommandName) {
              setting.atomCommandName = 'build:trigger:' + setting.name;
            }

            pathTarget.subscriptions.add(atom.commands.add('atom-workspace', setting.atomCommandName, function (atomCommandName) {
              return _this2.emit('trigger', atomCommandName);
            }));

            if (setting.keymap) {
              require('./google-analytics').sendEvent('keymap', 'registered', setting.keymap);
              var keymapSpec = { 'atom-workspace, atom-text-editor': {} };
              keymapSpec['atom-workspace, atom-text-editor'][setting.keymap] = setting.atomCommandName;
              pathTarget.subscriptions.add(atom.keymaps.add(setting.name, keymapSpec));
            }
          });

          pathTarget.targets = settings;
          pathTarget.loading = false;
        })['catch'](function (err) {
          atom.notifications.addError('Ooops. Something went wrong.', {
            detail: err.message,
            stack: err.stack,
            dismissable: true
          });
        });
      });

      return Promise.all(pathPromises).then(function (entries) {
        _this2.fillTargets(require('./utils').activePath());
        _this2.emit('refresh-complete');
        _this2.busyRegistry && _this2.busyRegistry.end('build.refresh-targets');

        if (entries.length === 0) {
          return;
        }

        if (atom.config.get('build.notificationOnRefresh')) {
          var rows = refreshPaths.map(function (path) {
            var pathTarget = _this2.pathTargets.find(function (pt) {
              return pt.path === path;
            });
            if (!pathTarget) {
              return 'Targets ' + path + ' no longer exists. Is build deactivated?';
            }
            return pathTarget.targets.length + ' targets at: ' + path;
          });
          atom.notifications.addInfo('Build targets parsed.', {
            detail: rows.join('\n')
          });
        }
      })['catch'](function (err) {
        atom.notifications.addError('Ooops. Something went wrong.', {
          detail: err.message,
          stack: err.stack,
          dismissable: true
        });
      });
    }
  }, {
    key: 'fillTargets',
    value: function fillTargets(path) {
      var _this3 = this;

      if (!this.targetsView) {
        return;
      }

      var activeTarget = this.getActiveTarget(path);
      activeTarget && this.targetsView.setActiveTarget(activeTarget.name);

      this.getTargets(path).then(function (targets) {
        return targets.map(function (t) {
          return t.name;
        });
      }).then(function (targetNames) {
        return _this3.targetsView && _this3.targetsView.setItems(targetNames);
      });
    }
  }, {
    key: 'selectActiveTarget',
    value: function selectActiveTarget() {
      var _this4 = this;

      if (atom.config.get('build.refreshOnShowTargetList')) {
        this.refreshTargets();
      }

      var path = require('./utils').activePath();
      if (!path) {
        atom.notifications.addWarning('Unable to build.', {
          detail: 'Open file is not part of any open project in Atom'
        });
        return;
      }

      var TargetsView = require('./targets-view');
      this.targetsView = new TargetsView();

      if (this.isLoading(path)) {
        this.targetsView.setLoading('Loading project build targets…');
      } else {
        this.fillTargets(path);
      }

      this.targetsView.awaitSelection().then(function (newTarget) {
        _this4.setActiveTarget(path, newTarget);

        _this4.targetsView = null;
      })['catch'](function (err) {
        _this4.targetsView.setError(err.message);
        _this4.targetsView = null;
      });
    }
  }, {
    key: 'getTargets',
    value: function getTargets(path) {
      var pathTarget = this.pathTargets.find(function (pt) {
        return pt.path === path;
      });
      if (!pathTarget) {
        return Promise.resolve([]);
      }

      if (pathTarget.targets.length === 0) {
        return this.refreshTargets([pathTarget.path]).then(function () {
          return pathTarget.targets;
        });
      }
      return Promise.resolve(pathTarget.targets);
    }
  }, {
    key: 'getActiveTarget',
    value: function getActiveTarget(path) {
      var pathTarget = this.pathTargets.find(function (pt) {
        return pt.path === path;
      });
      if (!pathTarget) {
        return null;
      }
      return pathTarget.targets.find(function (target) {
        return target.name === pathTarget.activeTarget;
      });
    }
  }, {
    key: 'setActiveTarget',
    value: function setActiveTarget(path, targetName) {
      this.pathTargets.find(function (pt) {
        return pt.path === path;
      }).activeTarget = targetName;
      this.emit('new-active-target', path, this.getActiveTarget(path));
    }
  }, {
    key: 'isLoading',
    value: function isLoading(path) {
      return this.pathTargets.find(function (pt) {
        return pt.path === path;
      }).loading;
    }
  }]);

  return TargetManager;
})(_events2['default']);

exports['default'] = TargetManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi90YXJnZXQtbWFuYWdlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFFeUIsUUFBUTs7OztBQUZqQyxXQUFXLENBQUM7O0lBSU4sYUFBYTtZQUFiLGFBQWE7O0FBQ04sV0FEUCxhQUFhLEdBQ0g7OzswQkFEVixhQUFhOztBQUVmLCtCQUZFLGFBQWEsNkNBRVA7O0FBRVIsUUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFM0MsUUFBSSxDQUFDLFdBQVcsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLFVBQUEsSUFBSTthQUFJLE1BQUssa0JBQWtCLENBQUMsSUFBSSxDQUFDO0tBQUEsQ0FBQyxDQUFDOztBQUUzRSxRQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLFVBQUEsZUFBZSxFQUFJO0FBQy9DLFVBQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxNQUFNLENBQUMsVUFBQSxFQUFFO2VBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7T0FBQSxDQUFDLENBQUM7QUFDakYsVUFBTSxZQUFZLEdBQUcsWUFBWSxDQUFDLE1BQU0sQ0FBQyxVQUFBLEVBQUU7ZUFBSSxlQUFlLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUNuRixnQkFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7ZUFBSSxNQUFLLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBSyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUFBLENBQUMsQ0FBQztBQUNqRixZQUFLLFdBQVcsR0FBRyxNQUFLLFdBQVcsQ0FBQyxNQUFNLENBQUMsVUFBQSxFQUFFO2VBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENB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LE1BQU07ZUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQyxZQUFZO09BQUEsQ0FBQyxDQUFDO0tBQ25GOzs7V0FFYyx5QkFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFO0FBQ2hDLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQUEsRUFBRTtlQUFJLEVBQUUsQ0FBQyxJQUFJLEtBQUssSUFBSTtPQUFBLENBQUMsQ0FBQyxZQUFZLEdBQUcsVUFBVSxDQUFDO0FBQ3hFLFVBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztLQUNsRTs7O1dBRVEsbUJBQUMsSUFBSSxFQUFFO0FBQ2QsYUFBTyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFBLEVBQUU7ZUFBSSxFQUFFLENBQUMsSUFBSSxLQUFLLElBQUk7T0FBQSxDQUFDLENBQUMsT0FBTyxDQUFDO0tBQzlEOzs7U0F2T0csYUFBYTs7O3FCQTBPSixhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi90YXJnZXQtbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5cbmNsYXNzIFRhcmdldE1hbmFnZXIgZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgbGV0IHByb2plY3RQYXRocyA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuXG4gICAgdGhpcy5wYXRoVGFyZ2V0cyA9IHByb2plY3RQYXRocy5tYXAocGF0aCA9PiB0aGlzLl9kZWZhdWx0UGF0aFRhcmdldChwYXRoKSk7XG5cbiAgICBhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocyhuZXdQcm9qZWN0UGF0aHMgPT4ge1xuICAgICAgY29uc3QgYWRkZWRQYXRocyA9IG5ld1Byb2plY3RQYXRocy5maWx0ZXIoZWwgPT4gcHJvamVjdFBhdGhzLmluZGV4T2YoZWwpID09PSAtMSk7XG4gICAgICBjb25zdCByZW1vdmVkUGF0aHMgPSBwcm9qZWN0UGF0aHMuZmlsdGVyKGVsID0+IG5ld1Byb2plY3RQYXRocy5pbmRleE9mKGVsKSA9PT0gLTEpO1xuICAgICAgYWRkZWRQYXRocy5mb3JFYWNoKHBhdGggPT4gdGhpcy5wYXRoVGFyZ2V0cy5wdXNoKHRoaXMuX2RlZmF1bHRQYXRoVGFyZ2V0KHBhdGgpKSk7XG4gICAgICB0aGlzLnBhdGhUYXJnZXRzID0gdGhpcy5wYXRoVGFyZ2V0cy5maWx0ZXIocHQgPT4gLTEgPT09IHJlbW92ZWRQYXRocy5pbmRleE9mKHB0LnBhdGgpKTtcbiAgICAgIHRoaXMucmVmcmVzaFRhcmdldHMoYWRkZWRQYXRocyk7XG4gICAgICBwcm9qZWN0UGF0aHMgPSBuZXdQcm9qZWN0UGF0aHM7XG4gICAgfSk7XG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6cmVmcmVzaC10YXJnZXRzJywgKCkgPT4gdGhpcy5yZWZyZXNoVGFyZ2V0cygpKTtcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6c2VsZWN0LWFjdGl2ZS10YXJnZXQnLCAoKSA9PiB0aGlzLnNlbGVjdEFjdGl2ZVRhcmdldCgpKTtcbiAgfVxuXG4gIHNldEJ1c3lSZWdpc3RyeShyZWdpc3RyeSkge1xuICAgIHRoaXMuYnVzeVJlZ2lzdHJ5ID0gcmVnaXN0cnk7XG4gIH1cblxuICBfZGVmYXVsdFBhdGhUYXJnZXQocGF0aCkge1xuICAgIGNvbnN0IENvbXBvc2l0ZURpc3Bvc2FibGUgPSByZXF1aXJlKCdhdG9tJykuQ29tcG9zaXRlRGlzcG9zYWJsZTtcbiAgICByZXR1cm4ge1xuICAgICAgcGF0aDogcGF0aCxcbiAgICAgIGxvYWRpbmc6IGZhbHNlLFxuICAgICAgdGFyZ2V0czogW10sXG4gICAgICBpbnN0YW5jZWRUb29sczogW10sXG4gICAgICBhY3RpdmVUYXJnZXQ6IG51bGwsXG4gICAgICB0b29sczogW10sXG4gICAgICBzdWJzY3JpcHRpb25zOiBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpXG4gICAgfTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5wYXRoVGFyZ2V0cy5mb3JFYWNoKHBhdGhUYXJnZXQgPT4gcGF0aFRhcmdldC50b29scy5tYXAodG9vbCA9PiB7XG4gICAgICB0b29sLnJlbW92ZUFsbExpc3RlbmVycyAmJiB0b29sLnJlbW92ZUFsbExpc3RlbmVycygncmVmcmVzaCcpO1xuICAgICAgdG9vbC5kZXN0cnVjdG9yICYmIHRvb2wuZGVzdHJ1Y3RvcigpO1xuICAgIH0pKTtcbiAgfVxuXG4gIHNldFRvb2xzKHRvb2xzKSB7XG4gICAgdGhpcy50b29scyA9IHRvb2xzIHx8IFtdO1xuICB9XG5cbiAgcmVmcmVzaFRhcmdldHMocmVmcmVzaFBhdGhzKSB7XG4gICAgcmVmcmVzaFBhdGhzID0gcmVmcmVzaFBhdGhzIHx8IGF0b20ucHJvamVjdC5nZXRQYXRocygpO1xuXG4gICAgdGhpcy5idXN5UmVnaXN0cnkgJiYgdGhpcy5idXN5UmVnaXN0cnkuYmVnaW4oJ2J1aWxkLnJlZnJlc2gtdGFyZ2V0cycsIGBSZWZyZXNoaW5nIHRhcmdldHMgZm9yICR7cmVmcmVzaFBhdGhzLmpvaW4oJywnKX1gKTtcbiAgICBjb25zdCBwYXRoUHJvbWlzZXMgPSByZWZyZXNoUGF0aHMubWFwKChwYXRoKSA9PiB7XG4gICAgICBjb25zdCBwYXRoVGFyZ2V0ID0gdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpO1xuICAgICAgcGF0aFRhcmdldC5sb2FkaW5nID0gdHJ1ZTtcblxuICAgICAgcGF0aFRhcmdldC5pbnN0YW5jZWRUb29scyA9IHBhdGhUYXJnZXQuaW5zdGFuY2VkVG9vbHNcbiAgICAgICAgLm1hcCh0ID0+IHQucmVtb3ZlQWxsTGlzdGVuZXJzICYmIHQucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZWZyZXNoJykpXG4gICAgICAgIC5maWx0ZXIoKCkgPT4gZmFsc2UpOyAvLyBKdXN0IGVtcHR5IHRoZSBhcnJheVxuXG4gICAgICBjb25zdCBzZXR0aW5nc1Byb21pc2UgPSB0aGlzLnRvb2xzXG4gICAgICAgIC5tYXAoVG9vbCA9PiBuZXcgVG9vbChwYXRoKSlcbiAgICAgICAgLmZpbHRlcih0b29sID0+IHRvb2wuaXNFbGlnaWJsZSgpKVxuICAgICAgICAubWFwKHRvb2wgPT4ge1xuICAgICAgICAgIHBhdGhUYXJnZXQuaW5zdGFuY2VkVG9vbHMucHVzaCh0b29sKTtcbiAgICAgICAgICByZXF1aXJlKCcuL2dvb2dsZS1hbmFseXRpY3MnKS5zZW5kRXZlbnQoJ2J1aWxkJywgJ3Rvb2wgZWxpZ2libGUnLCB0b29sLmdldE5pY2VOYW1lKCkpO1xuXG4gICAgICAgICAgdG9vbC5vbiAmJiB0b29sLm9uKCdyZWZyZXNoJywgdGhpcy5yZWZyZXNoVGFyZ2V0cy5iaW5kKHRoaXMsIFsgcGF0aCBdKSk7XG4gICAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpXG4gICAgICAgICAgICAudGhlbigoKSA9PiB0b29sLnNldHRpbmdzKCkpXG4gICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICAgICAgaWYgKGVyciBpbnN0YW5jZW9mIFN5bnRheEVycm9yKSB7XG4gICAgICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdJbnZhbGlkIGJ1aWxkIGZpbGUuJywge1xuICAgICAgICAgICAgICAgICAgZGV0YWlsOiAnWW91IGhhdmUgYSBzeW50YXggZXJyb3IgaW4geW91ciBidWlsZCBmaWxlOiAnICsgZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRvb2xOYW1lID0gdG9vbC5nZXROaWNlTmFtZSgpO1xuICAgICAgICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcignT29vcHMuIFNvbWV0aGluZyB3ZW50IHdyb25nJyArICh0b29sTmFtZSA/ICcgaW4gdGhlICcgKyB0b29sTmFtZSArICcgYnVpbGQgcHJvdmlkZXInIDogJycpICsgJy4nLCB7XG4gICAgICAgICAgICAgICAgICBkZXRhaWw6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgICAgICAgc3RhY2s6IGVyci5zdGFjayxcbiAgICAgICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgY29uc3QgQ29tcG9zaXRlRGlzcG9zYWJsZSA9IHJlcXVpcmUoJ2F0b20nKS5Db21wb3NpdGVEaXNwb3NhYmxlO1xuICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHNldHRpbmdzUHJvbWlzZSkudGhlbigoc2V0dGluZ3MpID0+IHtcbiAgICAgICAgc2V0dGluZ3MgPSByZXF1aXJlKCcuL3V0aWxzJykudW5pcXVpZnlTZXR0aW5ncyhbXS5jb25jYXQuYXBwbHkoW10sIHNldHRpbmdzKVxuICAgICAgICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAgICAgICAubWFwKHNldHRpbmcgPT4gcmVxdWlyZSgnLi91dGlscycpLmdldERlZmF1bHRTZXR0aW5ncyhwYXRoLCBzZXR0aW5nKSkpO1xuXG4gICAgICAgIGlmIChudWxsID09PSBwYXRoVGFyZ2V0LmFjdGl2ZVRhcmdldCB8fCAhc2V0dGluZ3MuZmluZChzID0+IHMubmFtZSA9PT0gcGF0aFRhcmdldC5hY3RpdmVUYXJnZXQpKSB7XG4gICAgICAgICAgLyogQWN0aXZlIHRhcmdldCBoYXMgYmVlbiByZW1vdmVkIG9yIG5vdCBzZXQuIFNldCBpdCB0byB0aGUgaGlnaGVzdCBwcmlvIHRhcmdldCAqL1xuICAgICAgICAgIHBhdGhUYXJnZXQuYWN0aXZlVGFyZ2V0ID0gc2V0dGluZ3NbMF0gPyBzZXR0aW5nc1swXS5uYW1lIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29tcG9zaXRlRGlzcG9zYWJsZSBjYW5ub3QgYmUgcmV1c2VkLCBzbyB3ZSBtdXN0IGNyZWF0ZSBhIG5ldyBpbnN0YW5jZSBvbiBldmVyeSByZWZyZXNoXG4gICAgICAgIHBhdGhUYXJnZXQuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgICAgIHBhdGhUYXJnZXQuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICAgICAgc2V0dGluZ3MuZm9yRWFjaCgoc2V0dGluZywgaW5kZXgpID0+IHtcbiAgICAgICAgICBpZiAoc2V0dGluZy5rZXltYXAgJiYgIXNldHRpbmcuYXRvbUNvbW1hbmROYW1lKSB7XG4gICAgICAgICAgICBzZXR0aW5nLmF0b21Db21tYW5kTmFtZSA9IGBidWlsZDp0cmlnZ2VyOiR7c2V0dGluZy5uYW1lfWA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcGF0aFRhcmdldC5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCBzZXR0aW5nLmF0b21Db21tYW5kTmFtZSwgYXRvbUNvbW1hbmROYW1lID0+IHRoaXMuZW1pdCgndHJpZ2dlcicsIGF0b21Db21tYW5kTmFtZSkpKTtcblxuICAgICAgICAgIGlmIChzZXR0aW5nLmtleW1hcCkge1xuICAgICAgICAgICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdrZXltYXAnLCAncmVnaXN0ZXJlZCcsIHNldHRpbmcua2V5bWFwKTtcbiAgICAgICAgICAgIGNvbnN0IGtleW1hcFNwZWMgPSB7ICdhdG9tLXdvcmtzcGFjZSwgYXRvbS10ZXh0LWVkaXRvcic6IHt9IH07XG4gICAgICAgICAgICBrZXltYXBTcGVjWydhdG9tLXdvcmtzcGFjZSwgYXRvbS10ZXh0LWVkaXRvciddW3NldHRpbmcua2V5bWFwXSA9IHNldHRpbmcuYXRvbUNvbW1hbmROYW1lO1xuICAgICAgICAgICAgcGF0aFRhcmdldC5zdWJzY3JpcHRpb25zLmFkZChhdG9tLmtleW1hcHMuYWRkKHNldHRpbmcubmFtZSwga2V5bWFwU3BlYykpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcGF0aFRhcmdldC50YXJnZXRzID0gc2V0dGluZ3M7XG4gICAgICAgIHBhdGhUYXJnZXQubG9hZGluZyA9IGZhbHNlO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdPb29wcy4gU29tZXRoaW5nIHdlbnQgd3JvbmcuJywge1xuICAgICAgICAgIGRldGFpbDogZXJyLm1lc3NhZ2UsXG4gICAgICAgICAgc3RhY2s6IGVyci5zdGFjayxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIFByb21pc2UuYWxsKHBhdGhQcm9taXNlcykudGhlbihlbnRyaWVzID0+IHtcbiAgICAgIHRoaXMuZmlsbFRhcmdldHMocmVxdWlyZSgnLi91dGlscycpLmFjdGl2ZVBhdGgoKSk7XG4gICAgICB0aGlzLmVtaXQoJ3JlZnJlc2gtY29tcGxldGUnKTtcbiAgICAgIHRoaXMuYnVzeVJlZ2lzdHJ5ICYmIHRoaXMuYnVzeVJlZ2lzdHJ5LmVuZCgnYnVpbGQucmVmcmVzaC10YXJnZXRzJyk7XG5cbiAgICAgIGlmIChlbnRyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLm5vdGlmaWNhdGlvbk9uUmVmcmVzaCcpKSB7XG4gICAgICAgIGNvbnN0IHJvd3MgPSByZWZyZXNoUGF0aHMubWFwKHBhdGggPT4ge1xuICAgICAgICAgIGNvbnN0IHBhdGhUYXJnZXQgPSB0aGlzLnBhdGhUYXJnZXRzLmZpbmQocHQgPT4gcHQucGF0aCA9PT0gcGF0aCk7XG4gICAgICAgICAgaWYgKCFwYXRoVGFyZ2V0KSB7XG4gICAgICAgICAgICByZXR1cm4gYFRhcmdldHMgJHtwYXRofSBubyBsb25nZXIgZXhpc3RzLiBJcyBidWlsZCBkZWFjdGl2YXRlZD9gO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gYCR7cGF0aFRhcmdldC50YXJnZXRzLmxlbmd0aH0gdGFyZ2V0cyBhdDogJHtwYXRofWA7XG4gICAgICAgIH0pO1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnQnVpbGQgdGFyZ2V0cyBwYXJzZWQuJywge1xuICAgICAgICAgIGRldGFpbDogcm93cy5qb2luKCdcXG4nKVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdPb29wcy4gU29tZXRoaW5nIHdlbnQgd3JvbmcuJywge1xuICAgICAgICBkZXRhaWw6IGVyci5tZXNzYWdlLFxuICAgICAgICBzdGFjazogZXJyLnN0YWNrLFxuICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmaWxsVGFyZ2V0cyhwYXRoKSB7XG4gICAgaWYgKCF0aGlzLnRhcmdldHNWaWV3KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgYWN0aXZlVGFyZ2V0ID0gdGhpcy5nZXRBY3RpdmVUYXJnZXQocGF0aCk7XG4gICAgYWN0aXZlVGFyZ2V0ICYmIHRoaXMudGFyZ2V0c1ZpZXcuc2V0QWN0aXZlVGFyZ2V0KGFjdGl2ZVRhcmdldC5uYW1lKTtcblxuICAgIHRoaXMuZ2V0VGFyZ2V0cyhwYXRoKVxuICAgICAgLnRoZW4odGFyZ2V0cyA9PiB0YXJnZXRzLm1hcCh0ID0+IHQubmFtZSkpXG4gICAgICAudGhlbih0YXJnZXROYW1lcyA9PiB0aGlzLnRhcmdldHNWaWV3ICYmIHRoaXMudGFyZ2V0c1ZpZXcuc2V0SXRlbXModGFyZ2V0TmFtZXMpKTtcbiAgfVxuXG4gIHNlbGVjdEFjdGl2ZVRhcmdldCgpIHtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5yZWZyZXNoT25TaG93VGFyZ2V0TGlzdCcpKSB7XG4gICAgICB0aGlzLnJlZnJlc2hUYXJnZXRzKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJy4vdXRpbHMnKS5hY3RpdmVQYXRoKCk7XG4gICAgaWYgKCFwYXRoKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZygnVW5hYmxlIHRvIGJ1aWxkLicsIHtcbiAgICAgICAgZGV0YWlsOiAnT3BlbiBmaWxlIGlzIG5vdCBwYXJ0IG9mIGFueSBvcGVuIHByb2plY3QgaW4gQXRvbSdcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IFRhcmdldHNWaWV3ID0gcmVxdWlyZSgnLi90YXJnZXRzLXZpZXcnKTtcbiAgICB0aGlzLnRhcmdldHNWaWV3ID0gbmV3IFRhcmdldHNWaWV3KCk7XG5cbiAgICBpZiAodGhpcy5pc0xvYWRpbmcocGF0aCkpIHtcbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcuc2V0TG9hZGluZygnTG9hZGluZyBwcm9qZWN0IGJ1aWxkIHRhcmdldHNcXHUyMDI2Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZmlsbFRhcmdldHMocGF0aCk7XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXRzVmlldy5hd2FpdFNlbGVjdGlvbigpLnRoZW4obmV3VGFyZ2V0ID0+IHtcbiAgICAgIHRoaXMuc2V0QWN0aXZlVGFyZ2V0KHBhdGgsIG5ld1RhcmdldCk7XG5cbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcgPSBudWxsO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIHRoaXMudGFyZ2V0c1ZpZXcuc2V0RXJyb3IoZXJyLm1lc3NhZ2UpO1xuICAgICAgdGhpcy50YXJnZXRzVmlldyA9IG51bGw7XG4gICAgfSk7XG4gIH1cblxuICBnZXRUYXJnZXRzKHBhdGgpIHtcbiAgICBjb25zdCBwYXRoVGFyZ2V0ID0gdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpO1xuICAgIGlmICghcGF0aFRhcmdldCkge1xuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShbXSk7XG4gICAgfVxuXG4gICAgaWYgKHBhdGhUYXJnZXQudGFyZ2V0cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnJlZnJlc2hUYXJnZXRzKFsgcGF0aFRhcmdldC5wYXRoIF0pLnRoZW4oKCkgPT4gcGF0aFRhcmdldC50YXJnZXRzKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShwYXRoVGFyZ2V0LnRhcmdldHMpO1xuICB9XG5cbiAgZ2V0QWN0aXZlVGFyZ2V0KHBhdGgpIHtcbiAgICBjb25zdCBwYXRoVGFyZ2V0ID0gdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpO1xuICAgIGlmICghcGF0aFRhcmdldCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBwYXRoVGFyZ2V0LnRhcmdldHMuZmluZCh0YXJnZXQgPT4gdGFyZ2V0Lm5hbWUgPT09IHBhdGhUYXJnZXQuYWN0aXZlVGFyZ2V0KTtcbiAgfVxuXG4gIHNldEFjdGl2ZVRhcmdldChwYXRoLCB0YXJnZXROYW1lKSB7XG4gICAgdGhpcy5wYXRoVGFyZ2V0cy5maW5kKHB0ID0+IHB0LnBhdGggPT09IHBhdGgpLmFjdGl2ZVRhcmdldCA9IHRhcmdldE5hbWU7XG4gICAgdGhpcy5lbWl0KCduZXctYWN0aXZlLXRhcmdldCcsIHBhdGgsIHRoaXMuZ2V0QWN0aXZlVGFyZ2V0KHBhdGgpKTtcbiAgfVxuXG4gIGlzTG9hZGluZyhwYXRoKSB7XG4gICAgcmV0dXJuIHRoaXMucGF0aFRhcmdldHMuZmluZChwdCA9PiBwdC5wYXRoID09PSBwYXRoKS5sb2FkaW5nO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRhcmdldE1hbmFnZXI7XG4iXX0=