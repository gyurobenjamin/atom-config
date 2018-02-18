Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

'use babel';

var ErrorMatcher = (function (_EventEmitter) {
  _inherits(ErrorMatcher, _EventEmitter);

  function ErrorMatcher() {
    _classCallCheck(this, ErrorMatcher);

    _get(Object.getPrototypeOf(ErrorMatcher.prototype), 'constructor', this).call(this);
    this.regex = null;
    this.cwd = null;
    this.stdout = null;
    this.stderr = null;
    this.currentMatch = [];
    this.firstMatchId = null;

    atom.commands.add('atom-workspace', 'build:error-match', this.match.bind(this));
    atom.commands.add('atom-workspace', 'build:error-match-first', this.matchFirst.bind(this));
  }

  _createClass(ErrorMatcher, [{
    key: '_gotoNext',
    value: function _gotoNext() {
      if (0 === this.currentMatch.length) {
        return;
      }

      this.goto(this.currentMatch[0].id);
    }
  }, {
    key: 'goto',
    value: function goto(id) {
      var _this = this;

      var match = this.currentMatch.find(function (m) {
        return m.id === id;
      });
      if (!match) {
        this.emit('error', 'Can\'t find match with id ' + id);
        return;
      }

      // rotate to next match
      while (this.currentMatch[0] !== match) {
        this.currentMatch.push(this.currentMatch.shift());
      }
      this.currentMatch.push(this.currentMatch.shift());

      var file = match.file;
      if (!file) {
        this.emit('error', 'Did not match any file. Don\'t know what to open.');
        return;
      }

      var path = require('path');
      if (!path.isAbsolute(file)) {
        file = this.cwd + path.sep + file;
      }

      var row = match.line ? match.line - 1 : 0; /* Because atom is zero-based */
      var col = match.col ? match.col - 1 : 0; /* Because atom is zero-based */

      require('fs').exists(file, function (exists) {
        if (!exists) {
          _this.emit('error', 'Matched file does not exist: ' + file);
          return;
        }
        atom.workspace.open(file, {
          initialLine: row,
          initialColumn: col,
          searchAllPanes: true
        });
        _this.emit('matched', match);
      });
    }
  }, {
    key: '_parse',
    value: function _parse() {
      var _this2 = this;

      this.currentMatch = [];

      // first run all functional matches
      this.functions && this.functions.forEach(function (f, functionIndex) {
        _this2.currentMatch = _this2.currentMatch.concat(f(_this2.output).map(function (match, matchIndex) {
          match.id = 'error-match-function-' + functionIndex + '-' + matchIndex;
          match.type = match.type || 'Error';
          return match;
        }));
      });
      // then for all match kinds
      Object.keys(this.regex).forEach(function (kind) {
        // run all matches
        _this2.regex[kind] && _this2.regex[kind].forEach(function (regex, i) {
          regex && require('xregexp').forEach(_this2.output, regex, function (match, matchIndex) {
            match.id = 'error-match-' + i + '-' + matchIndex;
            match.type = kind;
            _this2.currentMatch.push(match);
          });
        });
      });

      this.currentMatch.sort(function (a, b) {
        return a.index - b.index;
      });

      this.firstMatchId = this.currentMatch.length > 0 ? this.currentMatch[0].id : null;
    }
  }, {
    key: '_prepareRegex',
    value: function _prepareRegex(regex) {
      var _this3 = this;

      regex = regex || [];
      regex = regex instanceof Array ? regex : [regex];

      return regex.map(function (r) {
        try {
          var XRegExp = require('xregexp');
          return XRegExp(r);
        } catch (err) {
          _this3.emit('error', 'Error parsing regex. ' + err.message);
          return null;
        }
      });
    }
  }, {
    key: 'set',
    value: function set(target, cwd, output) {
      var _this4 = this;

      if (target.functionMatch) {
        this.functions = (target.functionMatch instanceof Array ? target.functionMatch : [target.functionMatch]).filter(function (f) {
          if (typeof f !== 'function') {
            _this4.emit('error', 'found functionMatch that is no function: ' + typeof f);
            return false;
          }
          return true;
        });
      }
      this.regex = {
        Error: this._prepareRegex(target.errorMatch),
        Warning: this._prepareRegex(target.warningMatch)
      };

      this.cwd = cwd;
      this.output = output;
      this.currentMatch = [];

      this._parse();
    }
  }, {
    key: 'match',
    value: function match() {
      require('./google-analytics').sendEvent('errorMatch', 'match');

      this._gotoNext();
    }
  }, {
    key: 'matchFirst',
    value: function matchFirst() {
      require('./google-analytics').sendEvent('errorMatch', 'first');

      if (this.firstMatchId) {
        this.goto(this.firstMatchId);
      }
    }
  }, {
    key: 'hasMatch',
    value: function hasMatch() {
      return 0 !== this.currentMatch.length;
    }
  }, {
    key: 'getMatches',
    value: function getMatches() {
      return this.currentMatch;
    }
  }]);

  return ErrorMatcher;
})(_events.EventEmitter);

exports['default'] = ErrorMatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9lcnJvci1tYXRjaGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztzQkFFNkIsUUFBUTs7QUFGckMsV0FBVyxDQUFDOztJQUlTLFlBQVk7WUFBWixZQUFZOztBQUVwQixXQUZRLFlBQVksR0FFakI7MEJBRkssWUFBWTs7QUFHN0IsK0JBSGlCLFlBQVksNkNBR3JCO0FBQ1IsUUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7QUFDaEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsUUFBSSxDQUFDLFlBQVksR0FBRyxFQUFFLENBQUM7QUFDdkIsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLG1CQUFtQixFQUFJLElBQUksQ0FBQyxLQUFLLE1BQVYsSUFBSSxFQUFPLENBQUM7QUFDdkUsUUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUseUJBQXlCLEVBQUksSUFBSSxDQUFDLFVBQVUsTUFBZixJQUFJLEVBQVksQ0FBQztHQUNuRjs7ZUFia0IsWUFBWTs7V0FldEIscUJBQUc7QUFDVixVQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtBQUNsQyxlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3BDOzs7V0FFRyxjQUFDLEVBQUUsRUFBRTs7O0FBQ1AsVUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBQSxD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LENBQUMsWUFBWSxFQUFFLE9BQU8sQ0FBQyxDQUFDOztBQUUvRCxVQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7QUFDckIsWUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7T0FDOUI7S0FDRjs7O1dBRU8sb0JBQUc7QUFDVCxhQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQztLQUN2Qzs7O1dBRVMsc0JBQUc7QUFDWCxhQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7S0FDMUI7OztTQXJKa0IsWUFBWTs7O3FCQUFaLFlBQVkiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2Vycm9yLW1hdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRXJyb3JNYXRjaGVyIGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMucmVnZXggPSBudWxsO1xuICAgIHRoaXMuY3dkID0gbnVsbDtcbiAgICB0aGlzLnN0ZG91dCA9IG51bGw7XG4gICAgdGhpcy5zdGRlcnIgPSBudWxsO1xuICAgIHRoaXMuY3VycmVudE1hdGNoID0gW107XG4gICAgdGhpcy5maXJzdE1hdGNoSWQgPSBudWxsO1xuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOmVycm9yLW1hdGNoJywgOjp0aGlzLm1hdGNoKTtcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYnVpbGQ6ZXJyb3ItbWF0Y2gtZmlyc3QnLCA6OnRoaXMubWF0Y2hGaXJzdCk7XG4gIH1cblxuICBfZ290b05leHQoKSB7XG4gICAgaWYgKDAgPT09IHRoaXMuY3VycmVudE1hdGNoLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZ290byh0aGlzLmN1cnJlbnRNYXRjaFswXS5pZCk7XG4gIH1cblxuICBnb3RvKGlkKSB7XG4gICAgY29uc3QgbWF0Y2ggPSB0aGlzLmN1cnJlbnRNYXRjaC5maW5kKG0gPT4gbS5pZCA9PT0gaWQpO1xuICAgIGlmICghbWF0Y2gpIHtcbiAgICAgIHRoaXMuZW1pdCgnZXJyb3InLCAnQ2FuXFwndCBmaW5kIG1hdGNoIHdpdGggaWQgJyArIGlkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyByb3RhdGUgdG8gbmV4dCBtYXRjaFxuICAgIHdoaWxlICh0aGlzLmN1cnJlbnRNYXRjaFswXSAhPT0gbWF0Y2gpIHtcbiAgICAgIHRoaXMuY3VycmVudE1hdGNoLnB1c2godGhpcy5jdXJyZW50TWF0Y2guc2hpZnQoKSk7XG4gICAgfVxuICAgIHRoaXMuY3VycmVudE1hdGNoLnB1c2godGhpcy5jdXJyZW50TWF0Y2guc2hpZnQoKSk7XG5cbiAgICBsZXQgZmlsZSA9IG1hdGNoLmZpbGU7XG4gICAgaWYgKCFmaWxlKSB7XG4gICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgJ0RpZCBub3QgbWF0Y2ggYW55IGZpbGUuIERvblxcJ3Qga25vdyB3aGF0IHRvIG9wZW4uJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShmaWxlKSkge1xuICAgICAgZmlsZSA9IHRoaXMuY3dkICsgcGF0aC5zZXAgKyBmaWxlO1xuICAgIH1cblxuICAgIGNvbnN0IHJvdyA9IG1hdGNoLmxpbmUgPyBtYXRjaC5saW5lIC0gMSA6IDA7IC8qIEJlY2F1c2UgYXRvbSBpcyB6ZXJvLWJhc2VkICovXG4gICAgY29uc3QgY29sID0gbWF0Y2guY29sID8gbWF0Y2guY29sIC0gMSA6IDA7IC8qIEJlY2F1c2UgYXRvbSBpcyB6ZXJvLWJhc2VkICovXG5cbiAgICByZXF1aXJlKCdmcycpLmV4aXN0cyhmaWxlLCAoZXhpc3RzKSA9PiB7XG4gICAgICBpZiAoIWV4aXN0cykge1xuICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgJ01hdGNoZWQgZmlsZSBkb2VzIG5vdCBleGlzdDogJyArIGZpbGUpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGUsIHtcbiAgICAgICAgaW5pdGlhbExpbmU6IHJvdyxcbiAgICAgICAgaW5pdGlhbENvbHVtbjogY29sLFxuICAgICAgICBzZWFyY2hBbGxQYW5lczogdHJ1ZVxuICAgICAgfSk7XG4gICAgICB0aGlzLmVtaXQoJ21hdGNoZWQnLCBtYXRjaCk7XG4gICAgfSk7XG4gIH1cblxuICBfcGFyc2UoKSB7XG4gICAgdGhpcy5jdXJyZW50TWF0Y2ggPSBbXTtcblxuICAgIC8vIGZpcnN0IHJ1biBhbGwgZnVuY3Rpb25hbCBtYXRjaGVzXG4gICAgdGhpcy5mdW5jdGlvbnMgJiYgdGhpcy5mdW5jdGlvbnMuZm9yRWFjaCgoZiwgZnVuY3Rpb25JbmRleCkgPT4ge1xuICAgICAgdGhpcy5jdXJyZW50TWF0Y2ggPSB0aGlzLmN1cnJlbnRNYXRjaC5jb25jYXQoZih0aGlzLm91dHB1dCkubWFwKChtYXRjaCwgbWF0Y2hJbmRleCkgPT4ge1xuICAgICAgICBtYXRjaC5pZCA9ICdlcnJvci1tYXRjaC1mdW5jdGlvbi0nICsgZnVuY3Rpb25JbmRleCArICctJyArIG1hdGNoSW5kZXg7XG4gICAgICAgIG1hdGNoLnR5cGUgPSBtYXRjaC50eXBlIHx8ICdFcnJvcic7XG4gICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgIH0pKTtcbiAgICB9KTtcbiAgICAvLyB0aGVuIGZvciBhbGwgbWF0Y2gga2luZHNcbiAgICBPYmplY3Qua2V5cyh0aGlzLnJlZ2V4KS5mb3JFYWNoKGtpbmQgPT4ge1xuICAgICAgLy8gcnVuIGFsbCBtYXRjaGVzXG4gICAgICB0aGlzLnJlZ2V4W2tpbmRdICYmIHRoaXMucmVnZXhba2luZF0uZm9yRWFjaCgocmVnZXgsIGkpID0+IHtcbiAgICAgICAgcmVnZXggJiYgcmVxdWlyZSgneHJlZ2V4cCcpLmZvckVhY2godGhpcy5vdXRwdXQsIHJlZ2V4LCAobWF0Y2gsIG1hdGNoSW5kZXgpID0+IHtcbiAgICAgICAgICBtYXRjaC5pZCA9ICdlcnJvci1tYXRjaC0nICsgaSArICctJyArIG1hdGNoSW5kZXg7XG4gICAgICAgICAgbWF0Y2gudHlwZSA9IGtpbmQ7XG4gICAgICAgICAgdGhpcy5jdXJyZW50TWF0Y2gucHVzaChtYXRjaCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmN1cnJlbnRNYXRjaC5zb3J0KChhLCBiKSA9PiBhLmluZGV4IC0gYi5pbmRleCk7XG5cbiAgICB0aGlzLmZpcnN0TWF0Y2hJZCA9ICh0aGlzLmN1cnJlbnRNYXRjaC5sZW5ndGggPiAwKSA/IHRoaXMuY3VycmVudE1hdGNoWzBdLmlkIDogbnVsbDtcbiAgfVxuXG4gIF9wcmVwYXJlUmVnZXgocmVnZXgpIHtcbiAgICByZWdleCA9IHJlZ2V4IHx8IFtdO1xuICAgIHJlZ2V4ID0gKHJlZ2V4IGluc3RhbmNlb2YgQXJyYXkpID8gcmVnZXggOiBbIHJlZ2V4IF07XG5cbiAgICByZXR1cm4gcmVnZXgubWFwKHIgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgWFJlZ0V4cCA9IHJlcXVpcmUoJ3hyZWdleHAnKTtcbiAgICAgICAgcmV0dXJuIFhSZWdFeHAocik7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgdGhpcy5lbWl0KCdlcnJvcicsICdFcnJvciBwYXJzaW5nIHJlZ2V4LiAnICsgZXJyLm1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHNldCh0YXJnZXQsIGN3ZCwgb3V0cHV0KSB7XG4gICAgaWYgKHRhcmdldC5mdW5jdGlvbk1hdGNoKSB7XG4gICAgICB0aGlzLmZ1bmN0aW9ucyA9ICgodGFyZ2V0LmZ1bmN0aW9uTWF0Y2ggaW5zdGFuY2VvZiBBcnJheSkgPyB0YXJnZXQuZnVuY3Rpb25NYXRjaCA6IFsgdGFyZ2V0LmZ1bmN0aW9uTWF0Y2ggXSkuZmlsdGVyKGYgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGYgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICB0aGlzLmVtaXQoJ2Vycm9yJywgJ2ZvdW5kIGZ1bmN0aW9uTWF0Y2ggdGhhdCBpcyBubyBmdW5jdGlvbjogJyArIHR5cGVvZiBmKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9KTtcbiAgICB9XG4gICAgdGhpcy5yZWdleCA9IHtcbiAgICAgIEVycm9yOiB0aGlzLl9wcmVwYXJlUmVnZXgodGFyZ2V0LmVycm9yTWF0Y2gpLFxuICAgICAgV2FybmluZzogdGhpcy5fcHJlcGFyZVJlZ2V4KHRhcmdldC53YXJuaW5nTWF0Y2gpXG4gICAgfTtcblxuICAgIHRoaXMuY3dkID0gY3dkO1xuICAgIHRoaXMub3V0cHV0ID0gb3V0cHV0O1xuICAgIHRoaXMuY3VycmVudE1hdGNoID0gW107XG5cbiAgICB0aGlzLl9wYXJzZSgpO1xuICB9XG5cbiAgbWF0Y2goKSB7XG4gICAgcmVxdWlyZSgnLi9nb29nbGUtYW5hbHl0aWNzJykuc2VuZEV2ZW50KCdlcnJvck1hdGNoJywgJ21hdGNoJyk7XG5cbiAgICB0aGlzLl9nb3RvTmV4dCgpO1xuICB9XG5cbiAgbWF0Y2hGaXJzdCgpIHtcbiAgICByZXF1aXJlKCcuL2dvb2dsZS1hbmFseXRpY3MnKS5zZW5kRXZlbnQoJ2Vycm9yTWF0Y2gnLCAnZmlyc3QnKTtcblxuICAgIGlmICh0aGlzLmZpcnN0TWF0Y2hJZCkge1xuICAgICAgdGhpcy5nb3RvKHRoaXMuZmlyc3RNYXRjaElkKTtcbiAgICB9XG4gIH1cblxuICBoYXNNYXRjaCgpIHtcbiAgICByZXR1cm4gMCAhPT0gdGhpcy5jdXJyZW50TWF0Y2gubGVuZ3RoO1xuICB9XG5cbiAgZ2V0TWF0Y2hlcygpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TWF0Y2g7XG4gIH1cbn1cbiJdfQ==