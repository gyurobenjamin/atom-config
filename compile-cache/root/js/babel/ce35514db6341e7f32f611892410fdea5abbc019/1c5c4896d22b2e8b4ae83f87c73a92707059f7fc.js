Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _statusBarView = require('./status-bar-view');

var _statusBarView2 = _interopRequireDefault(_statusBarView);

var _registry = require('./registry');

var _registry2 = _interopRequireDefault(_registry);

'use babel';

exports['default'] = {
  activate: function activate() {
    this.registry = new _registry2['default']();
    this.views = [];
    this.tasksBegun = [];
    this.tasksEnded = [];

    this.registry.on('begin', this.beginTask.bind(this));
    this.registry.on('end', this.endTask.bind(this));
  },

  deactivate: function deactivate() {
    this.views.forEach(function (view) {
      return view.dispose();
    });
  },

  provideRegistry: function provideRegistry() {
    return this.registry;
  },

  beginTask: function beginTask(task) {
    this.tasksBegun.push(task);
    this.views.forEach(function (view) {
      return view.beginTask(task);
    });
  },

  endTask: function endTask(task) {
    this.tasksEnded.push(task);
    this.views.forEach(function (view) {
      return view.endTask(task);
    });
  },

  consumeStatusBar: function consumeStatusBar(statusBar) {
    this.addView(new _statusBarView2['default'](statusBar));
  },

  addView: function addView(view) {
    this.views.push(view);
    this.tasksBegun.forEach(function (task) {
      return view.beginTask(task);
    });
    this.tasksEnded.forEach(function (task) {
      return view.endTask(task);
    });
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1c3kvbGliL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs2QkFFMEIsbUJBQW1COzs7O3dCQUN4QixZQUFZOzs7O0FBSGpDLFdBQVcsQ0FBQzs7cUJBS0c7QUFDYixVQUFRLEVBQUEsb0JBQUc7QUFDVCxRQUFJLENBQUMsUUFBUSxHQUFHLDJCQUFjLENBQUM7QUFDL0IsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDckIsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBSSxJQUFJLENBQUMsU0FBUyxNQUFkLElBQUksRUFBVyxDQUFDO0FBQzVDLFFBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLEtBQUssRUFBSSxJQUFJLENBQUMsT0FBTyxNQUFaLElBQUksRUFBUyxDQUFDO0dBQ3pDOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7S0FBQSxDQUFDLENBQUM7R0FDNUM7O0FBRUQsaUJBQWUsRUFBQSwyQkFBRztBQUNoQixXQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7R0FDdEI7O0FBRUQsV0FBUyxFQUFBLG1CQUFDLElBQUksRUFBRTtBQUNkLFFBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNCLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTthQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO0tBQUEsQ0FBQyxDQUFDO0dBQ2xEOztBQUVELFNBQU8sRUFBQSxpQkFBQyxJQUFJLEVBQUU7QUFDWixRQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzQixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7YUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztLQUFBLENBQUMsQ0FBQztHQUNoRDs7QUFFRCxrQkFBZ0IsRUFBQSwwQkFBQyxTQUFTLEVBQUU7QUFDMUIsUUFBSSxDQUFDLE9BQU8sQ0FBQywrQkFBa0IsU0FBUyxDQUFDLENBQUMsQ0FBQztHQUM1Qzs7QUFFRCxTQUFPLEVBQUEsaUJBQUMsSUFBSSxFQUFFO0FBQ1osUUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEIsUUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2FBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7S0FBQSxDQUFDLENBQUM7QUFDdEQsUUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJO2FBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7S0FBQSxDQUFDLENBQUM7R0FDckQ7Q0FDRiIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9idXN5L2xpYi9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgU3RhdHVzQmFyVmlldyBmcm9tICcuL3N0YXR1cy1iYXItdmlldyc7XG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi9yZWdpc3RyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeSgpO1xuICAgIHRoaXMudmlld3MgPSBbXTtcbiAgICB0aGlzLnRhc2tzQmVndW4gPSBbXTtcbiAgICB0aGlzLnRhc2tzRW5kZWQgPSBbXTtcblxuICAgIHRoaXMucmVnaXN0cnkub24oJ2JlZ2luJywgOjp0aGlzLmJlZ2luVGFzayk7XG4gICAgdGhpcy5yZWdpc3RyeS5vbignZW5kJywgOjp0aGlzLmVuZFRhc2spO1xuICB9LFxuXG4gIGRlYWN0aXZhdGUoKSB7XG4gICAgdGhpcy52aWV3cy5mb3JFYWNoKHZpZXcgPT4gdmlldy5kaXNwb3NlKCkpO1xuICB9LFxuXG4gIHByb3ZpZGVSZWdpc3RyeSgpIHtcbiAgICByZXR1cm4gdGhpcy5yZWdpc3RyeTtcbiAgfSxcblxuICBiZWdpblRhc2sodGFzaykge1xuICAgIHRoaXMudGFza3NCZWd1bi5wdXNoKHRhc2spO1xuICAgIHRoaXMudmlld3MuZm9yRWFjaCh2aWV3ID0+IHZpZXcuYmVnaW5UYXNrKHRhc2spKTtcbiAgfSxcblxuICBlbmRUYXNrKHRhc2spIHtcbiAgICB0aGlzLnRhc2tzRW5kZWQucHVzaCh0YXNrKTtcbiAgICB0aGlzLnZpZXdzLmZvckVhY2godmlldyA9PiB2aWV3LmVuZFRhc2sodGFzaykpO1xuICB9LFxuXG4gIGNvbnN1bWVTdGF0dXNCYXIoc3RhdHVzQmFyKSB7XG4gICAgdGhpcy5hZGRWaWV3KG5ldyBTdGF0dXNCYXJWaWV3KHN0YXR1c0JhcikpO1xuICB9LFxuXG4gIGFkZFZpZXcodmlldykge1xuICAgIHRoaXMudmlld3MucHVzaCh2aWV3KTtcbiAgICB0aGlzLnRhc2tzQmVndW4uZm9yRWFjaCh0YXNrID0+IHZpZXcuYmVnaW5UYXNrKHRhc2spKTtcbiAgICB0aGlzLnRhc2tzRW5kZWQuZm9yRWFjaCh0YXNrID0+IHZpZXcuZW5kVGFzayh0YXNrKSk7XG4gIH1cbn07XG4iXX0=