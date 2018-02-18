Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var StatusBarView = (function (_View) {
  _inherits(StatusBarView, _View);

  function StatusBarView(statusBar) {
    var _this = this;

    _classCallCheck(this, StatusBarView);

    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    _get(Object.getPrototypeOf(StatusBarView.prototype), 'constructor', this).apply(this, args);
    this.statusBar = statusBar;
    atom.config.observe('build.statusBar', function () {
      return _this.attach();
    });
    atom.config.observe('build.statusBarPriority', function () {
      return _this.attach();
    });
  }

  _createClass(StatusBarView, [{
    key: 'attach',
    value: function attach() {
      var _this2 = this;

      this.destroy();

      var orientation = atom.config.get('build.statusBar');
      if ('Disable' === orientation) {
        return;
      }

      this.statusBarTile = this.statusBar['add' + orientation + 'Tile']({
        item: this,
        priority: atom.config.get('build.statusBarPriority')
      });

      this.tooltip = atom.tooltips.add(this, {
        title: function title() {
          return _this2.tooltipMessage();
        }
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      if (this.statusBarTile) {
        this.statusBarTile.destroy();
        this.statusBarTile = null;
      }

      if (this.tooltip) {
        this.tooltip.dispose();
        this.tooltip = null;
      }
    }
  }, {
    key: 'tooltipMessage',
    value: function tooltipMessage() {
      return 'Current build target is \'' + this.element.textContent + '\'';
    }
  }, {
    key: 'setClasses',
    value: function setClasses(classes) {
      this.removeClass('status-unknown status-success status-error');
      this.addClass(classes);
    }
  }, {
    key: 'setTarget',
    value: function setTarget(t) {
      if (this.target === t) {
        return;
      }

      this.target = t;
      this.message.text(t || '');
      this.setClasses();
    }
  }, {
    key: 'buildAborted',
    value: function buildAborted() {
      this.setBuildSuccess(false);
    }
  }, {
    key: 'setBuildSuccess',
    value: function setBuildSuccess(success) {
      this.setClasses(success ? 'status-success' : 'status-error');
    }
  }, {
    key: 'buildStarted',
    value: function buildStarted() {
      this.setClasses();
    }
  }, {
    key: 'onClick',
    value: function onClick(cb) {
      this.onClick = cb;
    }
  }, {
    key: 'clicked',
    value: function clicked() {
      this.onClick && this.onClick();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this3 = this;

      this.div({ id: 'build-status-bar', 'class': 'inline-block' }, function () {
        _this3.a({ click: 'clicked', outlet: 'message' });
      });
    }
  }]);

  return StatusBarView;
})(_atomSpacePenViews.View);

exports['default'] = StatusBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9zdGF0dXMtYmFyLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2lDQUVxQixzQkFBc0I7O0FBRjNDLFdBQVcsQ0FBQzs7SUFJUyxhQUFhO1lBQWIsYUFBYTs7QUFDckIsV0FEUSxhQUFhLENBQ3BCLFNBQVMsRUFBVzs7OzBCQURiLGFBQWE7O3NDQUNOLElBQUk7QUFBSixVQUFJOzs7QUFDNUIsK0JBRmlCLGFBQWEsOENBRXJCLElBQUksRUFBRTtBQUNmLFFBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFpQixFQUFFO2FBQU0sTUFBSyxNQUFNLEVBQUU7S0FBQSxDQUFDLENBQUM7QUFDNUQsUUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMseUJBQXlCLEVBQUU7YUFBTSxNQUFLLE1BQU0sRUFBRTtLQUFBLENBQUMsQ0FBQztHQUNyRTs7ZUFOa0IsYUFBYTs7V0FRMUIsa0JBQUc7OztBQUNQLFVBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFZixVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3ZELFVBQUksU0FBUyxLQUFLLFdBQVcsRUFBRTtBQUM3QixlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxTQUFPLFdBQVcsVUFBTyxDQUFDO0FBQzNELFlBQUksRUFBRSxJQUFJO0FBQ1YsZ0JBQVEsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyx5QkFBeUIsQ0FBQztPQUNyRCxDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7QUFDckMsYUFBSyxFQUFFO2lCQUFNLE9BQUssY0FBYyxFQUFFO1NBQUE7T0FDbkMsQ0FBQyxDQUFDO0tBQ0o7OztXQUVNLG1CQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsWUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7T0FDM0I7O0FBRUQsVUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ2hCLFlBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDdkIsWUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7T0FDckI7S0FDRjs7O1dBUWEsMEJBQUc7QUFDZiw0Q0FBbUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLFFBQUk7S0FDaEU7OztXQUVTLG9CQUFDLE9BQU8sRUFBRTtBQUNsQixVQUFJLENBQUMsV0FBVyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7QUFDL0QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztLQUN4Qjs7O1dBRVEsbUJBQUMsQ0FBQyxFQUFFO0FBQ1gsVUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUNyQixlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDaEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLFVBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztLQUNuQjs7O1dBRVcsd0JBQUc7QUFDYixVQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCOzs7V0FFYyx5QkFBQyxPQUFPLEVBQUU7QUFDdkIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEdBQUcsZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLENBQUM7S0FDOUQ7OztXQUVXLHdCQUFHO0FBQ2IsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ25COzs7V0FFTSxpQkFBQyxFQUFFLEVBQUU7QUFDVixVQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztLQUNuQjs7O1dBRU0sbUJBQUc7QUFDUixVQUFJLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztLQUNoQzs7O1dBM0NhLG1CQUFHOzs7QUFDZixVQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxFQUFFLGtCQUFrQixFQUFFLFNBQU8sY0FBYyxFQUFFLEVBQUUsWUFBTTtBQUNoRSxlQUFLLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQyxDQUFDLENBQUM7T0FDaEQsQ0FBQyxDQUFDO0tBQ0o7OztTQTFDa0IsYUFBYTs7O3FCQUFiLGFBQWEiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL3N0YXR1cy1iYXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgeyBWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNCYXJWaWV3IGV4dGVuZHMgVmlldyB7XG4gIGNvbnN0cnVjdG9yKHN0YXR1c0JhciwgLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIHRoaXMuc3RhdHVzQmFyID0gc3RhdHVzQmFyO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2J1aWxkLnN0YXR1c0JhcicsICgpID0+IHRoaXMuYXR0YWNoKCkpO1xuICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2J1aWxkLnN0YXR1c0JhclByaW9yaXR5JywgKCkgPT4gdGhpcy5hdHRhY2goKSk7XG4gIH1cblxuICBhdHRhY2goKSB7XG4gICAgdGhpcy5kZXN0cm95KCk7XG5cbiAgICBjb25zdCBvcmllbnRhdGlvbiA9IGF0b20uY29uZmlnLmdldCgnYnVpbGQuc3RhdHVzQmFyJyk7XG4gICAgaWYgKCdEaXNhYmxlJyA9PT0gb3JpZW50YXRpb24pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0YXR1c0JhclRpbGUgPSB0aGlzLnN0YXR1c0JhcltgYWRkJHtvcmllbnRhdGlvbn1UaWxlYF0oe1xuICAgICAgaXRlbTogdGhpcyxcbiAgICAgIHByaW9yaXR5OiBhdG9tLmNvbmZpZy5nZXQoJ2J1aWxkLnN0YXR1c0JhclByaW9yaXR5JylcbiAgICB9KTtcblxuICAgIHRoaXMudG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkKHRoaXMsIHtcbiAgICAgIHRpdGxlOiAoKSA9PiB0aGlzLnRvb2x0aXBNZXNzYWdlKClcbiAgICB9KTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG4gICAgaWYgKHRoaXMuc3RhdHVzQmFyVGlsZSkge1xuICAgICAgdGhpcy5zdGF0dXNCYXJUaWxlLmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuc3RhdHVzQmFyVGlsZSA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudG9vbHRpcCkge1xuICAgICAgdGhpcy50b29sdGlwLmRpc3Bvc2UoKTtcbiAgICAgIHRoaXMudG9vbHRpcCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgdGhpcy5kaXYoeyBpZDogJ2J1aWxkLXN0YXR1cy1iYXInLCBjbGFzczogJ2lubGluZS1ibG9jaycgfSwgKCkgPT4ge1xuICAgICAgdGhpcy5hKHsgY2xpY2s6ICdjbGlja2VkJywgb3V0bGV0OiAnbWVzc2FnZSd9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHRvb2x0aXBNZXNzYWdlKCkge1xuICAgIHJldHVybiBgQ3VycmVudCBidWlsZCB0YXJnZXQgaXMgJyR7dGhpcy5lbGVtZW50LnRleHRDb250ZW50fSdgO1xuICB9XG5cbiAgc2V0Q2xhc3NlcyhjbGFzc2VzKSB7XG4gICAgdGhpcy5yZW1vdmVDbGFzcygnc3RhdHVzLXVua25vd24gc3RhdHVzLXN1Y2Nlc3Mgc3RhdHVzLWVycm9yJyk7XG4gICAgdGhpcy5hZGRDbGFzcyhjbGFzc2VzKTtcbiAgfVxuXG4gIHNldFRhcmdldCh0KSB7XG4gICAgaWYgKHRoaXMudGFyZ2V0ID09PSB0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy50YXJnZXQgPSB0O1xuICAgIHRoaXMubWVzc2FnZS50ZXh0KHQgfHwgJycpO1xuICAgIHRoaXMuc2V0Q2xhc3NlcygpO1xuICB9XG5cbiAgYnVpbGRBYm9ydGVkKCkge1xuICAgIHRoaXMuc2V0QnVpbGRTdWNjZXNzKGZhbHNlKTtcbiAgfVxuXG4gIHNldEJ1aWxkU3VjY2VzcyhzdWNjZXNzKSB7XG4gICAgdGhpcy5zZXRDbGFzc2VzKHN1Y2Nlc3MgPyAnc3RhdHVzLXN1Y2Nlc3MnIDogJ3N0YXR1cy1lcnJvcicpO1xuICB9XG5cbiAgYnVpbGRTdGFydGVkKCkge1xuICAgIHRoaXMuc2V0Q2xhc3NlcygpO1xuICB9XG5cbiAgb25DbGljayhjYikge1xuICAgIHRoaXMub25DbGljayA9IGNiO1xuICB9XG5cbiAgY2xpY2tlZCgpIHtcbiAgICB0aGlzLm9uQ2xpY2sgJiYgdGhpcy5vbkNsaWNrKCk7XG4gIH1cbn1cbiJdfQ==