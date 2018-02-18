Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

// Local vars
'use babel';var regex = /(.+):(\d+)\t*(.+)/g;

// Settings
var executablePath = undefined;
var rulesets = undefined;

exports['default'] = {
  activate: function activate() {
    require('atom-package-deps').install('linter-phpmd');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-phpmd.executablePath', function (value) {
      executablePath = value;
    }));
    this.subscriptions.add(atom.config.observe('linter-phpmd.rulesets', function (value) {
      rulesets = value;
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    return {
      name: 'PHPMD',
      grammarScopes: ['text.html.php', 'source.php'],
      scope: 'file',
      lintOnFly: false,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        var ruleset = rulesets;
        if (/^[a-z0-9]+\.xml$/gi.test(rulesets)) {
          var rulesetPath = yield helpers.findAsync(filePath, rulesets);
          if (rulesetPath !== null) {
            ruleset = rulesetPath;
          }
        }

        var parameters = [filePath, 'text', ruleset];

        var projectDir = atom.project.relativizePath(filePath)[0];
        var options = {
          ignoreExitCode: true,
          cwd: projectDir || _path2['default'].dirname(filePath)
        };

        var output = yield helpers.exec(executablePath, parameters, options);

        if (textEditor.getText() !== fileText) {
          // eslint-disable-next-line no-console
          console.warn('linter-phpmd:: The file was modified since the ' + 'request was sent to check it. Since any results would no longer ' + 'be valid, they are not being updated. Please save the file ' + 'again to update the results.');
          return null;
        }

        var messages = [];
        var match = regex.exec(output);
        while (match !== null) {
          var line = Number.parseInt(match[2], 10) - 1;
          messages.push({
            type: 'Error',
            filePath: match[1],
            range: helpers.generateRange(textEditor, line),
            text: match[3]
          });

          match = regex.exec(output);
        }
        return messages;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1waHBtZC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07O29CQUN6QixNQUFNOzs7OzBCQUNFLGFBQWE7O0lBQTFCLE9BQU87OztBQUxuQixXQUFXLENBQUMsQUFRWixJQUFNLEtBQUssR0FBRyxvQkFBb0IsQ0FBQzs7O0FBR25DLElBQUksY0FBYyxZQUFBLENBQUM7QUFDbkIsSUFBSSxRQUFRLFlBQUEsQ0FBQzs7cUJBRUU7QUFDYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxXQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRXJELFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDZCQUE2QixFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQzVELG9CQUFjLEdBQUcsS0FBSyxDQUFDO0tBQ3hCLENBQ0YsQ0FBQyxDQUFDO0FBQ0gsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLHVCQUF1QixFQUFFLFVBQUMsS0FBSyxFQUFLO0FBQ3RELGNBQVEsR0FBRyxLQUFLLENBQUM7S0FDbEIsQ0FDRixDQUFDLENBQUM7R0FDSjs7QUFFRCxZQUFVLEVBQUEsc0JBQUc7QUFDWCxRQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQzlCOztBQUVELGVBQWEsRUFBQSx5QkFBRztBQUNkLFdBQU87QUFDTCxVQUFJLEVBQUUsT0FBTztBQUNiLG1CQUFhLEVBQUUsQ0FBQyxlQUFlLEVBQUUsWUFBWSxDQUFDO0FBQzlDLFdBQUssRUFBRSxNQUFNO0FBQ2IsZUFBUyxFQUFFLEtBQUs7QUFDaEIsVUFBSSxvQkFBRSxXQUFPLFVBQVUsRUFBSztBQUMxQixZQUFNLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdEMsWUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDOztBQUV0QyxZQUFJLE9BQU8sR0FBRyxRQUFRLENBQUM7QUFDdkIsWUFBSSxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDdkMsY0FBTSxXQUFXLEdBQUcsTUFBTSxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNoRSxjQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7QUFDeEIsbUJBQU8sR0FBRyxXQUFXLENBQUM7V0FDdkI7U0FDRjs7QUFFRCxZQUFNLFVBQVUsR0FBRyxDQUNqQixRQUFRLEVBQ1IsTUFBTSxFQUNOLE9BQU8sQ0FDUixDQUFDOztBQUVGLFlBQU0sVUFBVSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzVELFlBQU0sT0FBTyxHQUFHO0FBQ2Qsd0JBQWMsRUFBRSxJQUFJO0FBQ3BCLGFBQUcsRUFBRSxVQUFVLElBQUksa0JBQUssT0FBTyxDQUFDLFFBQVEsQ0FBQztTQUMxQyxDQUFDOztBQUVGLFlBQU0sTUFBTSxHQUFHLE1BQU0sT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUV2RSxZQUFJLFVBQVUsQ0FBQyxPQUFPLEVBQUUsS0FBSyxRQUFRLEVBQUU7O0FBRXJDLGlCQUFPLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxHQUM1RCxrRUFBa0UsR0FDbEUsNkRBQTZELEdBQzdELDhCQUE4QixDQUFDLENBQUM7QUFDbEMsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsWUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0IsZUFBTyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3JCLGNBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQyxrQkFBUSxDQUFDLElBQUksQ0FBQztBQUNaLGdCQUFJLEVBQUUsT0FBTztBQUNiLG9CQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNsQixpQkFBSyxFQUFFLE9BQU8sQ0FBQyxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQztBQUM5QyxnQkFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7V0FDZixDQUFDLENBQUM7O0FBRUgsZUFBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDNUI7QUFDRCxlQUFPLFFBQVEsQ0FBQztPQUNqQixDQUFBO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvbGludGVyLXBocG1kL2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsIGltcG9ydC9leHRlbnNpb25zXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgUGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCAqIGFzIGhlbHBlcnMgZnJvbSAnYXRvbS1saW50ZXInO1xuXG4vLyBMb2NhbCB2YXJzXG5jb25zdCByZWdleCA9IC8oLispOihcXGQrKVxcdCooLispL2c7XG5cbi8vIFNldHRpbmdzXG5sZXQgZXhlY3V0YWJsZVBhdGg7XG5sZXQgcnVsZXNldHM7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItcGhwbWQnKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1waHBtZC5leGVjdXRhYmxlUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICBleGVjdXRhYmxlUGF0aCA9IHZhbHVlO1xuICAgICAgfSxcbiAgICApKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXBocG1kLnJ1bGVzZXRzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHJ1bGVzZXRzID0gdmFsdWU7XG4gICAgICB9LFxuICAgICkpO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbiAgfSxcblxuICBwcm92aWRlTGludGVyKCkge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAnUEhQTUQnLFxuICAgICAgZ3JhbW1hclNjb3BlczogWyd0ZXh0Lmh0bWwucGhwJywgJ3NvdXJjZS5waHAnXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IGZhbHNlLFxuICAgICAgbGludDogYXN5bmMgKHRleHRFZGl0b3IpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZVBhdGggPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICAgICAgY29uc3QgZmlsZVRleHQgPSB0ZXh0RWRpdG9yLmdldFRleHQoKTtcblxuICAgICAgICBsZXQgcnVsZXNldCA9IHJ1bGVzZXRzO1xuICAgICAgICBpZiAoL15bYS16MC05XStcXC54bWwkL2dpLnRlc3QocnVsZXNldHMpKSB7XG4gICAgICAgICAgY29uc3QgcnVsZXNldFBhdGggPSBhd2FpdCBoZWxwZXJzLmZpbmRBc3luYyhmaWxlUGF0aCwgcnVsZXNldHMpO1xuICAgICAgICAgIGlmIChydWxlc2V0UGF0aCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgcnVsZXNldCA9IHJ1bGVzZXRQYXRoO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBbXG4gICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgJ3RleHQnLFxuICAgICAgICAgIHJ1bGVzZXQsXG4gICAgICAgIF07XG5cbiAgICAgICAgY29uc3QgcHJvamVjdERpciA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF07XG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgaWdub3JlRXhpdENvZGU6IHRydWUsXG4gICAgICAgICAgY3dkOiBwcm9qZWN0RGlyIHx8IFBhdGguZGlybmFtZShmaWxlUGF0aCksXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKGV4ZWN1dGFibGVQYXRoLCBwYXJhbWV0ZXJzLCBvcHRpb25zKTtcblxuICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVUZXh0KSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ2xpbnRlci1waHBtZDo6IFRoZSBmaWxlIHdhcyBtb2RpZmllZCBzaW5jZSB0aGUgJyArXG4gICAgICAgICAgICAncmVxdWVzdCB3YXMgc2VudCB0byBjaGVjayBpdC4gU2luY2UgYW55IHJlc3VsdHMgd291bGQgbm8gbG9uZ2VyICcgK1xuICAgICAgICAgICAgJ2JlIHZhbGlkLCB0aGV5IGFyZSBub3QgYmVpbmcgdXBkYXRlZC4gUGxlYXNlIHNhdmUgdGhlIGZpbGUgJyArXG4gICAgICAgICAgICAnYWdhaW4gdG8gdXBkYXRlIHRoZSByZXN1bHRzLicpO1xuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcbiAgICAgICAgbGV0IG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB3aGlsZSAobWF0Y2ggIT09IG51bGwpIHtcbiAgICAgICAgICBjb25zdCBsaW5lID0gTnVtYmVyLnBhcnNlSW50KG1hdGNoWzJdLCAxMCkgLSAxO1xuICAgICAgICAgIG1lc3NhZ2VzLnB1c2goe1xuICAgICAgICAgICAgdHlwZTogJ0Vycm9yJyxcbiAgICAgICAgICAgIGZpbGVQYXRoOiBtYXRjaFsxXSxcbiAgICAgICAgICAgIHJhbmdlOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbGluZSksXG4gICAgICAgICAgICB0ZXh0OiBtYXRjaFszXSxcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIG1hdGNoID0gcmVnZXguZXhlYyhvdXRwdXQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtZXNzYWdlcztcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=