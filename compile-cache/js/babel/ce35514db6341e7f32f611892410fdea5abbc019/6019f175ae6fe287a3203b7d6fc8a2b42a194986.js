Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _toolBarButtonView = require('./tool-bar-button-view');

var _toolBarButtonView2 = _interopRequireDefault(_toolBarButtonView);

var _toolBarSpacerView = require('./tool-bar-spacer-view');

var _toolBarSpacerView2 = _interopRequireDefault(_toolBarSpacerView);

'use babel';

var ToolBarManager = (function () {
  function ToolBarManager(group, toolBar, legacy) {
    _classCallCheck(this, ToolBarManager);

    this.group = group;
    this.toolBar = toolBar;
    this._legacy = legacy;
  }

  _createClass(ToolBarManager, [{
    key: 'addButton',
    value: function addButton(options) {
      var button = new _toolBarButtonView2['default'](options);
      button.group = this.group;
      this.toolBar.addItem(button);
      if (this._legacy) {
        return legacyWrap(button);
      }
      return button;
    }
  }, {
    key: 'addSpacer',
    value: function addSpacer(options) {
      var spacer = new _toolBarSpacerView2['default'](options);
      spacer.group = this.group;
      this.toolBar.addItem(spacer);
      if (this._legacy) {
        return legacyWrap(spacer);
      }
      return spacer;
    }
  }, {
    key: 'removeItems',
    value: function removeItems() {
      var _this = this;

      if (this.toolBar.items) {
        this.toolBar.items.filter(function (item) {
          return item.group === _this.group;
        }).forEach(function (item) {
          return _this.toolBar.removeItem(item);
        });
      }
    }
  }, {
    key: 'onDidDestroy',
    value: function onDidDestroy(callback) {
      this.toolBar.emitter.on('did-destroy', callback);
    }
  }]);

  return ToolBarManager;
})();

exports['default'] = ToolBarManager;

function legacyWrap(view) {
  var $ = require('jquery');
  var wrapped = $(view.element);
  ['setEnabled', 'destroy'].forEach(function (name) {
    if (typeof view[name] === 'function') {
      wrapped[name] = function () {
        return view[name].apply(view, arguments);
      };
    }
  });
  wrapped.element = view.element;
  return wrapped;
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3Rvb2wtYmFyL2xpYi90b29sLWJhci1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBRThCLHdCQUF3Qjs7OztpQ0FDeEIsd0JBQXdCOzs7O0FBSHRELFdBQVcsQ0FBQzs7SUFLUyxjQUFjO0FBQ3JCLFdBRE8sY0FBYyxDQUNwQixLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTswQkFEbEIsY0FBYzs7QUFFL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDdkIsUUFBSSxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7R0FDdkI7O2VBTGtCLGNBQWM7O1dBT3ZCLG1CQUFDLE9BQU8sRUFBRTtBQUNsQixVQUFNLE1BQU0sR0FBRyxtQ0FBc0IsT0FBTyxDQUFDLENBQUM7QUFDOUMsWUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzFCLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixlQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUMzQjtBQUNELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVTLG1CQUFDLE9BQU8sRUFBRTtBQUNsQixVQUFNLE1BQU0sR0FBRyxtQ0FBc0IsT0FBTyxDQUFDLENBQUM7QUFDOUMsWUFBTSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQzFCLFVBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFVBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUNoQixlQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUMzQjtBQUNELGFBQU8sTUFBTSxDQUFDO0tBQ2Y7OztXQUVXLHVCQUFHOzs7QUFDYixVQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFO0FBQ3RCLFlBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUNmLE1BQU0sQ0FBQyxVQUFBLElBQUk7aUJBQUksSUFBSSxDQUFDLEtBQUssS0FBSyxNQUFLLEtBQUs7U0FBQSxDQUFDLENBQ3pDLE9BQU8sQ0FBQyxVQUFBLElBQUk7aUJBQUksTUFBSyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQztTQUFBLENBQUMsQ0FBQztPQUNuRDtLQUNGOzs7V0FFWSxzQkFBQyxRQUFRLEVBQUU7QUFDdEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxRQUFRLENBQUMsQ0FBQztLQUNsRDs7O1NBckNrQixjQUFjOzs7cUJBQWQsY0FBYzs7QUF3Q25DLFNBQVMsVUFBVSxDQUFFLElBQUksRUFBRTtBQUN6QixNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNoQyxHQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLEVBQUk7QUFDeEMsUUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLEVBQUU7QUFDcEMsYUFBTyxDQUFDLElBQUksQ0FBQyxHQUFHO2VBQWEsSUFBSSxDQUFDLElBQUksT0FBQyxDQUFWLElBQUksWUFBZTtPQUFBLENBQUM7S0FDbEQ7R0FDRixDQUFDLENBQUM7QUFDSCxTQUFPLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDL0IsU0FBTyxPQUFPLENBQUM7Q0FDaEIiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvdG9vbC1iYXIvbGliL3Rvb2wtYmFyLW1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFRvb2xCYXJCdXR0b25WaWV3IGZyb20gJy4vdG9vbC1iYXItYnV0dG9uLXZpZXcnO1xuaW1wb3J0IFRvb2xCYXJTcGFjZXJWaWV3IGZyb20gJy4vdG9vbC1iYXItc3BhY2VyLXZpZXcnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sQmFyTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yIChncm91cCwgdG9vbEJhciwgbGVnYWN5KSB7XG4gICAgdGhpcy5ncm91cCA9IGdyb3VwO1xuICAgIHRoaXMudG9vbEJhciA9IHRvb2xCYXI7XG4gICAgdGhpcy5fbGVnYWN5ID0gbGVnYWN5O1xuICB9XG5cbiAgYWRkQnV0dG9uIChvcHRpb25zKSB7XG4gICAgY29uc3QgYnV0dG9uID0gbmV3IFRvb2xCYXJCdXR0b25WaWV3KG9wdGlvbnMpO1xuICAgIGJ1dHRvbi5ncm91cCA9IHRoaXMuZ3JvdXA7XG4gICAgdGhpcy50b29sQmFyLmFkZEl0ZW0oYnV0dG9uKTtcbiAgICBpZiAodGhpcy5fbGVnYWN5KSB7XG4gICAgICByZXR1cm4gbGVnYWN5V3JhcChidXR0b24pO1xuICAgIH1cbiAgICByZXR1cm4gYnV0dG9uO1xuICB9XG5cbiAgYWRkU3BhY2VyIChvcHRpb25zKSB7XG4gICAgY29uc3Qgc3BhY2VyID0gbmV3IFRvb2xCYXJTcGFjZXJWaWV3KG9wdGlvbnMpO1xuICAgIHNwYWNlci5ncm91cCA9IHRoaXMuZ3JvdXA7XG4gICAgdGhpcy50b29sQmFyLmFkZEl0ZW0oc3BhY2VyKTtcbiAgICBpZiAodGhpcy5fbGVnYWN5KSB7XG4gICAgICByZXR1cm4gbGVnYWN5V3JhcChzcGFjZXIpO1xuICAgIH1cbiAgICByZXR1cm4gc3BhY2VyO1xuICB9XG5cbiAgcmVtb3ZlSXRlbXMgKCkge1xuICAgIGlmICh0aGlzLnRvb2xCYXIuaXRlbXMpIHtcbiAgICAgIHRoaXMudG9vbEJhci5pdGVtc1xuICAgICAgICAuZmlsdGVyKGl0ZW0gPT4gaXRlbS5ncm91cCA9PT0gdGhpcy5ncm91cClcbiAgICAgICAgLmZvckVhY2goaXRlbSA9PiB0aGlzLnRvb2xCYXIucmVtb3ZlSXRlbShpdGVtKSk7XG4gICAgfVxuICB9XG5cbiAgb25EaWREZXN0cm95IChjYWxsYmFjaykge1xuICAgIHRoaXMudG9vbEJhci5lbWl0dGVyLm9uKCdkaWQtZGVzdHJveScsIGNhbGxiYWNrKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBsZWdhY3lXcmFwICh2aWV3KSB7XG4gIGNvbnN0ICQgPSByZXF1aXJlKCdqcXVlcnknKTtcbiAgY29uc3Qgd3JhcHBlZCA9ICQodmlldy5lbGVtZW50KTtcbiAgWydzZXRFbmFibGVkJywgJ2Rlc3Ryb3knXS5mb3JFYWNoKG5hbWUgPT4ge1xuICAgIGlmICh0eXBlb2Ygdmlld1tuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgd3JhcHBlZFtuYW1lXSA9ICguLi5hcmdzKSA9PiB2aWV3W25hbWVdKC4uLmFyZ3MpO1xuICAgIH1cbiAgfSk7XG4gIHdyYXBwZWQuZWxlbWVudCA9IHZpZXcuZWxlbWVudDtcbiAgcmV0dXJuIHdyYXBwZWQ7XG59XG4iXX0=