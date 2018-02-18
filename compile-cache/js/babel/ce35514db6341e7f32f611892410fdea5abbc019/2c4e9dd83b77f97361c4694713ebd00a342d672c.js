Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var TargetsView = (function (_SelectListView) {
  _inherits(TargetsView, _SelectListView);

  function TargetsView() {
    _classCallCheck(this, TargetsView);

    _get(Object.getPrototypeOf(TargetsView.prototype), 'constructor', this).apply(this, arguments);
    this.show();
  }

  _createClass(TargetsView, [{
    key: 'initialize',
    value: function initialize() {
      _get(Object.getPrototypeOf(TargetsView.prototype), 'initialize', this).apply(this, arguments);
      this.addClass('build-target');
      this.list.addClass('mark-active');
    }
  }, {
    key: 'show',
    value: function show() {
      this.panel = atom.workspace.addModalPanel({ item: this });
      this.panel.show();
      this.focusFilterEditor();
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.panel.hide();
    }
  }, {
    key: 'setItems',
    value: function setItems() {
      _get(Object.getPrototypeOf(TargetsView.prototype), 'setItems', this).apply(this, arguments);

      var activeItemView = this.find('.active');
      if (0 < activeItemView.length) {
        this.selectItemView(activeItemView);
        this.scrollToItemView(activeItemView);
      }
    }
  }, {
    key: 'setActiveTarget',
    value: function setActiveTarget(target) {
      this.activeTarget = target;
    }
  }, {
    key: 'viewForItem',
    value: function viewForItem(targetName) {
      var activeTarget = this.activeTarget;
      return TargetsView.render(function () {
        var activeClass = targetName === activeTarget ? 'active' : '';
        this.li({ 'class': activeClass + ' build-target' }, targetName);
      });
    }
  }, {
    key: 'getEmptyMessage',
    value: function getEmptyMessage(itemCount) {
      return 0 === itemCount ? 'No targets found.' : 'No matches';
    }
  }, {
    key: 'awaitSelection',
    value: function awaitSelection() {
      var _this = this;

      return new Promise(function (resolve, reject) {
        _this.resolveFunction = resolve;
      });
    }
  }, {
    key: 'confirmed',
    value: function confirmed(target) {
      if (this.resolveFunction) {
        this.resolveFunction(target);
        this.resolveFunction = null;
      }
      this.hide();
    }
  }, {
    key: 'cancelled',
    value: function cancelled() {
      this.hide();
    }
  }]);

  return TargetsView;
})(_atomSpacePenViews.SelectListView);

exports['default'] = TargetsView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi90YXJnZXRzLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O2lDQUUrQixzQkFBc0I7O0FBRnJELFdBQVcsQ0FBQzs7SUFJUyxXQUFXO1lBQVgsV0FBVzs7QUFFbkIsV0FGUSxXQUFXLEdBRWhCOzBCQUZLLFdBQVc7O0FBRzVCLCtCQUhpQixXQUFXLDhDQUduQixTQUFTLEVBQUU7QUFDcEIsUUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ2I7O2VBTGtCLFdBQVc7O1dBT3BCLHNCQUFHO0FBQ1gsaUNBUmlCLFdBQVcsNkNBUVIsU0FBUyxFQUFFO0FBQy9CLFVBQUksQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDOUIsVUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDbkM7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzFELFVBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbEIsVUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7S0FDMUI7OztXQUVHLGdCQUFHO0FBQ0wsVUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUNuQjs7O1dBRU8sb0JBQUc7QUFDVCxpQ0F4QmlCLFdBQVcsMkNBd0JWLFNBQVMsRUFBRTs7QUFFN0IsVUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM1QyxVQUFJLENBQUMsR0FBRyxjQUFjLENBQUMsTUFBTSxFQUFFO0FBQzdCLFlBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO09BQ3ZDO0tBQ0Y7OztXQUVjLHlCQUFDLE1BQU0sRUFBRTtBQUN0QixVQUFJLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQztLQUM1Qjs7O1dBRVUscUJBQUMsVUFBVSxFQUFFO0FBQ3RCLFVBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDdkMsYUFBTyxXQUFXLENBQUMsTUFBTSxDQUFDLFlBQVk7QUFDcEMsWUFBTSxXQUFXLEdBQUksVUFBVSxLQUFLLFlBQVksR0FBRyxRQUFRLEdBQUcsRUFBRSxBQUFDLENBQUM7QUFDbEUsWUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQU8sV0FBVyxHQUFHLGVBQWUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO09BQy9ELENBQUMsQ0FBQztLQUNKOzs7V0FFYyx5QkFBQyxTQUFTLEVBQUU7QUFDekIsYUFBTyxBQUFDLENBQUMsS0FBSyxTQUFTLEdBQUksbUJBQW1CLEdBQUcsWUFBWSxDQUFDO0tBQy9EOzs7V0FFYSwwQkFBRzs7O0FBQ2YsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdEMsY0FBSyxlQUFlLEdBQUcsT0FBTyxDQUFDO09BQ2hDLENBQUMsQ0FBQztLQUNKOzs7V0FFUSxtQkFBQyxNQUFNLEVBQUU7QUFDaEIsVUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO0FBQ3hCLFlBQUksQ0FBQyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0IsWUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7T0FDN0I7QUFDRCxVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1dBRVEscUJBQUc7QUFDVixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7S0FDYjs7O1NBakVrQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvdGFyZ2V0cy12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFNlbGVjdExpc3RWaWV3IH0gZnJvbSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUYXJnZXRzVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgIHRoaXMuc2hvdygpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICBzdXBlci5pbml0aWFsaXplKC4uLmFyZ3VtZW50cyk7XG4gICAgdGhpcy5hZGRDbGFzcygnYnVpbGQtdGFyZ2V0Jyk7XG4gICAgdGhpcy5saXN0LmFkZENsYXNzKCdtYXJrLWFjdGl2ZScpO1xuICB9XG5cbiAgc2hvdygpIHtcbiAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbCh7IGl0ZW06IHRoaXMgfSk7XG4gICAgdGhpcy5wYW5lbC5zaG93KCk7XG4gICAgdGhpcy5mb2N1c0ZpbHRlckVkaXRvcigpO1xuICB9XG5cbiAgaGlkZSgpIHtcbiAgICB0aGlzLnBhbmVsLmhpZGUoKTtcbiAgfVxuXG4gIHNldEl0ZW1zKCkge1xuICAgIHN1cGVyLnNldEl0ZW1zKC4uLmFyZ3VtZW50cyk7XG5cbiAgICBjb25zdCBhY3RpdmVJdGVtVmlldyA9IHRoaXMuZmluZCgnLmFjdGl2ZScpO1xuICAgIGlmICgwIDwgYWN0aXZlSXRlbVZpZXcubGVuZ3RoKSB7XG4gICAgICB0aGlzLnNlbGVjdEl0ZW1WaWV3KGFjdGl2ZUl0ZW1WaWV3KTtcbiAgICAgIHRoaXMuc2Nyb2xsVG9JdGVtVmlldyhhY3RpdmVJdGVtVmlldyk7XG4gICAgfVxuICB9XG5cbiAgc2V0QWN0aXZlVGFyZ2V0KHRhcmdldCkge1xuICAgIHRoaXMuYWN0aXZlVGFyZ2V0ID0gdGFyZ2V0O1xuICB9XG5cbiAgdmlld0Zvckl0ZW0odGFyZ2V0TmFtZSkge1xuICAgIGNvbnN0IGFjdGl2ZVRhcmdldCA9IHRoaXMuYWN0aXZlVGFyZ2V0O1xuICAgIHJldHVybiBUYXJnZXRzVmlldy5yZW5kZXIoZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgYWN0aXZlQ2xhc3MgPSAodGFyZ2V0TmFtZSA9PT0gYWN0aXZlVGFyZ2V0ID8gJ2FjdGl2ZScgOiAnJyk7XG4gICAgICB0aGlzLmxpKHsgY2xhc3M6IGFjdGl2ZUNsYXNzICsgJyBidWlsZC10YXJnZXQnIH0sIHRhcmdldE5hbWUpO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0RW1wdHlNZXNzYWdlKGl0ZW1Db3VudCkge1xuICAgIHJldHVybiAoMCA9PT0gaXRlbUNvdW50KSA/ICdObyB0YXJnZXRzIGZvdW5kLicgOiAnTm8gbWF0Y2hlcyc7XG4gIH1cblxuICBhd2FpdFNlbGVjdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgdGhpcy5yZXNvbHZlRnVuY3Rpb24gPSByZXNvbHZlO1xuICAgIH0pO1xuICB9XG5cbiAgY29uZmlybWVkKHRhcmdldCkge1xuICAgIGlmICh0aGlzLnJlc29sdmVGdW5jdGlvbikge1xuICAgICAgdGhpcy5yZXNvbHZlRnVuY3Rpb24odGFyZ2V0KTtcbiAgICAgIHRoaXMucmVzb2x2ZUZ1bmN0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICBjYW5jZWxsZWQoKSB7XG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cbn1cbiJdfQ==