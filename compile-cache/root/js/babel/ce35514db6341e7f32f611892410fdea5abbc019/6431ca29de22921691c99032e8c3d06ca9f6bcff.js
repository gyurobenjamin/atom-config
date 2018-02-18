'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Linter = (function () {
  function Linter(registry) {
    _classCallCheck(this, Linter);

    this.linter = registry.register({ name: 'Build' });
  }

  _createClass(Linter, [{
    key: 'destroy',
    value: function destroy() {
      this.linter.dispose();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.linter.deleteMessages();
    }
  }, {
    key: 'processMessages',
    value: function processMessages(messages, cwd) {
      function extractRange(json) {
        return [[(json.line || 1) - 1, (json.col || 1) - 1], [(json.line_end || json.line || 1) - 1, (json.col_end || json.col || 1) - 1]];
      }
      function normalizePath(p) {
        return require('path').isAbsolute(p) ? p : require('path').join(cwd, p);
      }
      function typeToSeverity(type) {
        switch (type && type.toLowerCase()) {
          case 'err':
          case 'error':
            return 'error';
          case 'warn':
          case 'warning':
            return 'warning';
          default:
            return null;
        }
      }
      this.linter.setMessages(messages.map(function (match) {
        return {
          type: match.type || 'Error',
          text: !match.message && !match.html_message ? 'Error from build' : match.message,
          html: match.message ? undefined : match.html_message,
          filePath: normalizePath(match.file),
          severity: typeToSeverity(match.type),
          range: extractRange(match),
          trace: match.trace && match.trace.map(function (trace) {
            return {
              type: trace.type || 'Trace',
              text: !trace.message && !trace.html_message ? 'Trace in build' : trace.message,
              html: trace.message ? undefined : trace.html_message,
              filePath: trace.file && normalizePath(trace.file),
              severity: typeToSeverity(trace.type) || 'info',
              range: extractRange(trace)
            };
          })
        };
      }));
    }
  }]);

  return Linter;
})();

exports['default'] = Linter;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9saW50ZXItaW50ZWdyYXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7O0lBRU4sTUFBTTtBQUNDLFdBRFAsTUFBTSxDQUNFLFFBQVEsRUFBRTswQkFEbEIsTUFBTTs7QUFFUixRQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztHQUNwRDs7ZUFIRyxNQUFNOztXQUlILG1CQUFHO0FBQ1IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUN2Qjs7O1dBQ0ksaUJBQUc7QUFDTixVQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO0tBQzlCOzs7V0FDYyx5QkFBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO0FBQzdCLGVBQVMsWUFBWSxDQUFDLElBQUksRUFBRTtBQUMxQixlQUFPLENBQ0wsQ0FBRSxDQUFDLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFBLEdBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUEsR0FBSSxDQUFDLENBQUUsRUFDN0MsQ0FBRSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUEsR0FBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFBLEdBQUksQ0FBQyxDQUFFLENBQy9FLENBQUM7T0FDSDtBQUNELGVBQVMsYUFBYSxDQUFDLENBQUMsRUFBRTtBQUN4QixlQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ3pFO0FBQ0QsZUFBUyxjQUFjLENBQUMsSUFBSSxFQUFFO0FBQzVCLGdCQUFRLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQ2hDLGVBQUssS0FBSyxDQUFDO0FBQ1gsZUFBSyxPQUFPO0FBQUUsbUJBQU8sT0FBTyxDQUFDO0FBQUEsQUFDN0IsZUFBSyxNQUFNLENBQUM7QUFDWixlQUFLLFNBQVM7QUFBRSxtQkFBTyxTQUFTLENBQUM7QUFBQSxBQUNqQztBQUFTLG1CQUFPLElBQUksQ0FBQztBQUFBLFNBQ3RCO09BQ0Y7QUFDRCxVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsS0FBSztlQUFLO0FBQzdDLGNBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLE9BQU87QUFDM0IsY0FBSSxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEdBQUcsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLE9BQU87QUFDaEYsY0FBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEdBQUcsU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZO0FBQ3BELGtCQUFRLEVBQUUsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7QUFDbkMsa0JBQVEsRUFBRSxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUNwQyxlQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQztBQUMxQixlQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUs7bUJBQUs7QUFDOUMsa0JBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLE9BQU87QUFDM0Isa0JBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxHQUFHLGdCQUFnQixHQUFHLEtBQUssQ0FBQyxPQUFPO0FBQzlFLGtCQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFDLFlBQVk7QUFDcEQsc0JBQVEsRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO0FBQ2pELHNCQUFRLEVBQUUsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNO0FBQzlDLG1CQUFLLEVBQUUsWUFBWSxDQUFDLEtBQUssQ0FBQzthQUMzQjtXQUFDLENBQUM7U0FDSjtPQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ047OztTQTdDRyxNQUFNOzs7cUJBZ0RHLE1BQU0iLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2xpbnRlci1pbnRlZ3JhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jbGFzcyBMaW50ZXIge1xuICBjb25zdHJ1Y3RvcihyZWdpc3RyeSkge1xuICAgIHRoaXMubGludGVyID0gcmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lOiAnQnVpbGQnIH0pO1xuICB9XG4gIGRlc3Ryb3koKSB7XG4gICAgdGhpcy5saW50ZXIuZGlzcG9zZSgpO1xuICB9XG4gIGNsZWFyKCkge1xuICAgIHRoaXMubGludGVyLmRlbGV0ZU1lc3NhZ2VzKCk7XG4gIH1cbiAgcHJvY2Vzc01lc3NhZ2VzKG1lc3NhZ2VzLCBjd2QpIHtcbiAgICBmdW5jdGlvbiBleHRyYWN0UmFuZ2UoanNvbikge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgWyAoanNvbi5saW5lIHx8IDEpIC0gMSwgKGpzb24uY29sIHx8IDEpIC0gMSBdLFxuICAgICAgICBbIChqc29uLmxpbmVfZW5kIHx8IGpzb24ubGluZSB8fCAxKSAtIDEsIChqc29uLmNvbF9lbmQgfHwganNvbi5jb2wgfHwgMSkgLSAxIF1cbiAgICAgIF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIG5vcm1hbGl6ZVBhdGgocCkge1xuICAgICAgcmV0dXJuIHJlcXVpcmUoJ3BhdGgnKS5pc0Fic29sdXRlKHApID8gcCA6IHJlcXVpcmUoJ3BhdGgnKS5qb2luKGN3ZCwgcCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHR5cGVUb1NldmVyaXR5KHR5cGUpIHtcbiAgICAgIHN3aXRjaCAodHlwZSAmJiB0eXBlLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgICAgY2FzZSAnZXJyJzpcbiAgICAgICAgY2FzZSAnZXJyb3InOiByZXR1cm4gJ2Vycm9yJztcbiAgICAgICAgY2FzZSAnd2Fybic6XG4gICAgICAgIGNhc2UgJ3dhcm5pbmcnOiByZXR1cm4gJ3dhcm5pbmcnO1xuICAgICAgICBkZWZhdWx0OiByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5saW50ZXIuc2V0TWVzc2FnZXMobWVzc2FnZXMubWFwKG1hdGNoID0+ICh7XG4gICAgICB0eXBlOiBtYXRjaC50eXBlIHx8ICdFcnJvcicsXG4gICAgICB0ZXh0OiAhbWF0Y2gubWVzc2FnZSAmJiAhbWF0Y2guaHRtbF9tZXNzYWdlID8gJ0Vycm9yIGZyb20gYnVpbGQnIDogbWF0Y2gubWVzc2FnZSxcbiAgICAgIGh0bWw6IG1hdGNoLm1lc3NhZ2UgPyB1bmRlZmluZWQgOiBtYXRjaC5odG1sX21lc3NhZ2UsXG4gICAgICBmaWxlUGF0aDogbm9ybWFsaXplUGF0aChtYXRjaC5maWxlKSxcbiAgICAgIHNldmVyaXR5OiB0eXBlVG9TZXZlcml0eShtYXRjaC50eXBlKSxcbiAgICAgIHJhbmdlOiBleHRyYWN0UmFuZ2UobWF0Y2gpLFxuICAgICAgdHJhY2U6IG1hdGNoLnRyYWNlICYmIG1hdGNoLnRyYWNlLm1hcCh0cmFjZSA9PiAoe1xuICAgICAgICB0eXBlOiB0cmFjZS50eXBlIHx8ICdUcmFjZScsXG4gICAgICAgIHRleHQ6ICF0cmFjZS5tZXNzYWdlICYmICF0cmFjZS5odG1sX21lc3NhZ2UgPyAnVHJhY2UgaW4gYnVpbGQnIDogdHJhY2UubWVzc2FnZSxcbiAgICAgICAgaHRtbDogdHJhY2UubWVzc2FnZSA/IHVuZGVmaW5lZCA6IHRyYWNlLmh0bWxfbWVzc2FnZSxcbiAgICAgICAgZmlsZVBhdGg6IHRyYWNlLmZpbGUgJiYgbm9ybWFsaXplUGF0aCh0cmFjZS5maWxlKSxcbiAgICAgICAgc2V2ZXJpdHk6IHR5cGVUb1NldmVyaXR5KHRyYWNlLnR5cGUpIHx8ICdpbmZvJyxcbiAgICAgICAgcmFuZ2U6IGV4dHJhY3RSYW5nZSh0cmFjZSlcbiAgICAgIH0pKVxuICAgIH0pKSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTGludGVyO1xuIl19