Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

'use babel';

var Registry = (function (_EventEmitter) {
  _inherits(Registry, _EventEmitter);

  function Registry() {
    _classCallCheck(this, Registry);

    _get(Object.getPrototypeOf(Registry.prototype), 'constructor', this).call(this);
    this.uniqueId = 0;
    this.tasks = [];
  }

  _createClass(Registry, [{
    key: 'begin',
    value: function begin(id, description) {
      var task = {
        id: id,
        description: description,
        uniqueId: this.uniqueId++,
        time: {
          start: new Date(),
          end: null
        }
      };
      this.tasks.push(task);
      this.emit('begin', task);
    }
  }, {
    key: 'end',
    value: function end(id) {
      var success = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var index = this.tasks.findIndex(function (task) {
        return task.id === id;
      });
      if (-1 === index) {
        return;
      }

      var task = this.tasks.splice(index, 1)[0];
      task.success = success;
      task.time.end = new Date();
      this.emit('end', task);
    }
  }, {
    key: '_getTasks',
    value: function _getTasks() {
      return this.tasks;
    }
  }]);

  return Registry;
})(_events2['default']);

exports['default'] = Registry;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1c3kvbGliL3JlZ2lzdHJ5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3NCQUV5QixRQUFROzs7O0FBRmpDLFdBQVcsQ0FBQzs7SUFJUyxRQUFRO1lBQVIsUUFBUTs7QUFDaEIsV0FEUSxRQUFRLEdBQ2I7MEJBREssUUFBUTs7QUFFekIsK0JBRmlCLFFBQVEsNkNBRWpCO0FBQ1IsUUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDbEIsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7R0FDakI7O2VBTGtCLFFBQVE7O1dBT3RCLGVBQUMsRUFBRSxFQUFFLFdBQVcsRUFBRTtBQUNyQixVQUFNLElBQUksR0FBRztBQUNYLFVBQUUsRUFBRixFQUFFO0FBQ0YsbUJBQVcsRUFBWCxXQUFXO0FBQ1gsZ0JBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ3pCLFlBQUksRUFBRTtBQUNKLGVBQUssRUFBRSxJQUFJLElBQUksRUFBRTtBQUNqQixhQUFHLEVBQUUsSUFBSTtTQUNWO09BQ0YsQ0FBQztBQUNGLFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3RCLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzFCOzs7V0FFRSxhQUFDLEVBQUUsRUFBa0I7VUFBaEIsT0FBTyx5REFBRyxJQUFJOztBQUNwQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFBLElBQUk7ZUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUU7T0FBQSxDQUFDLENBQUM7QUFDM0QsVUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDaEIsZUFBTztPQUNSOztBQUVELFVBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QyxVQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixVQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQzNCLFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3hCOzs7V0FFUSxxQkFBRztBQUNWLGFBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztLQUNuQjs7O1NBbkNrQixRQUFROzs7cUJBQVIsUUFBUSIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9idXN5L2xpYi9yZWdpc3RyeS5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlZ2lzdHJ5IGV4dGVuZHMgRXZlbnRFbWl0dGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnVuaXF1ZUlkID0gMDtcbiAgICB0aGlzLnRhc2tzID0gW107XG4gIH1cblxuICBiZWdpbihpZCwgZGVzY3JpcHRpb24pIHtcbiAgICBjb25zdCB0YXNrID0ge1xuICAgICAgaWQsXG4gICAgICBkZXNjcmlwdGlvbixcbiAgICAgIHVuaXF1ZUlkOiB0aGlzLnVuaXF1ZUlkKyssXG4gICAgICB0aW1lOiB7XG4gICAgICAgIHN0YXJ0OiBuZXcgRGF0ZSgpLFxuICAgICAgICBlbmQ6IG51bGxcbiAgICAgIH1cbiAgICB9O1xuICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcbiAgICB0aGlzLmVtaXQoJ2JlZ2luJywgdGFzayk7XG4gIH1cblxuICBlbmQoaWQsIHN1Y2Nlc3MgPSB0cnVlKSB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLnRhc2tzLmZpbmRJbmRleCh0YXNrID0+IHRhc2suaWQgPT09IGlkKTtcbiAgICBpZiAoLTEgPT09IGluZGV4KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgdGFzayA9IHRoaXMudGFza3Muc3BsaWNlKGluZGV4LCAxKVswXTtcbiAgICB0YXNrLnN1Y2Nlc3MgPSBzdWNjZXNzO1xuICAgIHRhc2sudGltZS5lbmQgPSBuZXcgRGF0ZSgpO1xuICAgIHRoaXMuZW1pdCgnZW5kJywgdGFzayk7XG4gIH1cblxuICBfZ2V0VGFza3MoKSB7XG4gICAgcmV0dXJuIHRoaXMudGFza3M7XG4gIH1cbn1cbiJdfQ==