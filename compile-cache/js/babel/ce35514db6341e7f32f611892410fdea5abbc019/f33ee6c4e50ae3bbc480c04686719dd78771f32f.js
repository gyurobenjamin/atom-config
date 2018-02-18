'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ToolBarSpacerView = (function () {
  function ToolBarSpacerView(options) {
    var _element$classList;

    _classCallCheck(this, ToolBarSpacerView);

    this.element = document.createElement('hr');
    this.priority = options && options.priority;
    var classNames = ['tool-bar-spacer'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    (_element$classList = this.element.classList).add.apply(_element$classList, classNames);
  }

  _createClass(ToolBarSpacerView, [{
    key: 'destroy',
    value: function destroy() {
      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }
      this.element = null;
    }
  }]);

  return ToolBarSpacerView;
})();

exports['default'] = ToolBarSpacerView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3Rvb2wtYmFyL2xpYi90b29sLWJhci1zcGFjZXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7SUFFUyxpQkFBaUI7QUFDeEIsV0FETyxpQkFBaUIsQ0FDdkIsT0FBTyxFQUFFOzs7MEJBREgsaUJBQWlCOztBQUVsQyxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUMsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUM1QyxRQUFNLFVBQVUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFDdkMsUUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtBQUNyQixnQkFBVSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQzVDO0FBQ0QsMEJBQUEsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUMsR0FBRyxNQUFBLHFCQUFJLFVBQVUsQ0FBQyxDQUFDO0dBQzNDOztlQVRrQixpQkFBaUI7O1dBVzVCLG1CQUFHO0FBQ1QsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUMzQixZQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BQ25EO0FBQ0QsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDckI7OztTQWhCa0IsaUJBQWlCOzs7cUJBQWpCLGlCQUFpQiIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXItc3BhY2VyLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbEJhclNwYWNlclZpZXcge1xuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2hyJyk7XG4gICAgdGhpcy5wcmlvcml0eSA9IG9wdGlvbnMgJiYgb3B0aW9ucy5wcmlvcml0eTtcbiAgICBjb25zdCBjbGFzc05hbWVzID0gWyd0b29sLWJhci1zcGFjZXInXTtcbiAgICBpZiAodGhpcy5wcmlvcml0eSA8IDApIHtcbiAgICAgIGNsYXNzTmFtZXMucHVzaCgndG9vbC1iYXItaXRlbS1hbGlnbi1lbmQnKTtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NOYW1lcyk7XG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICBpZiAodGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gIH1cbn1cbiJdfQ==