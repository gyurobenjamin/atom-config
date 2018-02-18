Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.provideToolBar = provideToolBar;
exports.provideToolBarLegacy = provideToolBarLegacy;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _toolBarManager = require('./tool-bar-manager');

var _toolBarManager2 = _interopRequireDefault(_toolBarManager);

var _toolBarView = require('./tool-bar-view');

var _toolBarView2 = _interopRequireDefault(_toolBarView);

'use babel';

var toolBar = null;

function activate() {
  toolBar = new _toolBarView2['default']();
}

function deactivate() {
  toolBar.destroy();
  toolBar = null;
}

function provideToolBar() {
  return function (group) {
    return new _toolBarManager2['default'](group, toolBar);
  };
}

function provideToolBarLegacy() {
  return function (group) {
    var Grim = require('grim');
    Grim.deprecate('Please update to the latest tool-bar provider service.');
    return new _toolBarManager2['default'](group, toolBar, true);
  };
}

var config = {
  visible: {
    type: 'boolean',
    'default': true,
    order: 1
  },
  iconSize: {
    type: 'string',
    'default': '24px',
    'enum': ['12px', '16px', '24px', '32px'],
    order: 2
  },
  position: {
    type: 'string',
    'default': 'Top',
    'enum': ['Top', 'Right', 'Bottom', 'Left'],
    order: 3
  },
  fullWidth: {
    type: 'boolean',
    'default': true,
    order: 4
  }
};

exports.config = config;
if (typeof atom.workspace.addHeaderPanel !== 'function') {
  delete config.fullWidth;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3Rvb2wtYmFyL2xpYi90b29sLWJhci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzhCQUUyQixvQkFBb0I7Ozs7MkJBQ3ZCLGlCQUFpQjs7OztBQUh6QyxXQUFXLENBQUM7O0FBS1osSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDOztBQUVaLFNBQVMsUUFBUSxHQUFJO0FBQzFCLFNBQU8sR0FBRyw4QkFBaUIsQ0FBQztDQUM3Qjs7QUFFTSxTQUFTLFVBQVUsR0FBSTtBQUM1QixTQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbEIsU0FBTyxHQUFHLElBQUksQ0FBQztDQUNoQjs7QUFFTSxTQUFTLGNBQWMsR0FBSTtBQUNoQyxTQUFPLFVBQUMsS0FBSztXQUFLLGdDQUFtQixLQUFLLEVBQUUsT0FBTyxDQUFDO0dBQUEsQ0FBQztDQUN0RDs7QUFFTSxTQUFTLG9CQUFvQixHQUFJO0FBQ3RDLFNBQU8sVUFBQyxLQUFLLEVBQUs7QUFDaEIsUUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdCLFFBQUksQ0FBQyxTQUFTLENBQUMsd0RBQXdELENBQUMsQ0FBQztBQUN6RSxXQUFPLGdDQUFtQixLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0dBQ2pELENBQUM7Q0FDSDs7QUFFTSxJQUFNLE1BQU0sR0FBRztBQUNwQixTQUFPLEVBQUU7QUFDUCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxVQUFRLEVBQUU7QUFDUixRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsTUFBTTtBQUNmLFlBQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7QUFDdEMsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELFVBQVEsRUFBRTtBQUNSLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxLQUFLO0FBQ2QsWUFBTSxDQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQztBQUN4QyxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsV0FBUyxFQUFFO0FBQ1QsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0NBQ0YsQ0FBQzs7O0FBRUYsSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxLQUFLLFVBQVUsRUFBRTtBQUN2RCxTQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUM7Q0FDekIiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvdG9vbC1iYXIvbGliL3Rvb2wtYmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBUb29sQmFyTWFuYWdlciBmcm9tICcuL3Rvb2wtYmFyLW1hbmFnZXInO1xuaW1wb3J0IFRvb2xCYXJWaWV3IGZyb20gJy4vdG9vbC1iYXItdmlldyc7XG5cbmxldCB0b29sQmFyID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlICgpIHtcbiAgdG9vbEJhciA9IG5ldyBUb29sQmFyVmlldygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSAoKSB7XG4gIHRvb2xCYXIuZGVzdHJveSgpO1xuICB0b29sQmFyID0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVUb29sQmFyICgpIHtcbiAgcmV0dXJuIChncm91cCkgPT4gbmV3IFRvb2xCYXJNYW5hZ2VyKGdyb3VwLCB0b29sQmFyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3ZpZGVUb29sQmFyTGVnYWN5ICgpIHtcbiAgcmV0dXJuIChncm91cCkgPT4ge1xuICAgIGNvbnN0IEdyaW0gPSByZXF1aXJlKCdncmltJyk7XG4gICAgR3JpbS5kZXByZWNhdGUoJ1BsZWFzZSB1cGRhdGUgdG8gdGhlIGxhdGVzdCB0b29sLWJhciBwcm92aWRlciBzZXJ2aWNlLicpO1xuICAgIHJldHVybiBuZXcgVG9vbEJhck1hbmFnZXIoZ3JvdXAsIHRvb2xCYXIsIHRydWUpO1xuICB9O1xufVxuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICB2aXNpYmxlOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDFcbiAgfSxcbiAgaWNvblNpemU6IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnMjRweCcsXG4gICAgZW51bTogWycxMnB4JywgJzE2cHgnLCAnMjRweCcsICczMnB4J10sXG4gICAgb3JkZXI6IDJcbiAgfSxcbiAgcG9zaXRpb246IHtcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnVG9wJyxcbiAgICBlbnVtOiBbJ1RvcCcsICdSaWdodCcsICdCb3R0b20nLCAnTGVmdCddLFxuICAgIG9yZGVyOiAzXG4gIH0sXG4gIGZ1bGxXaWR0aDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA0XG4gIH1cbn07XG5cbmlmICh0eXBlb2YgYXRvbS53b3Jrc3BhY2UuYWRkSGVhZGVyUGFuZWwgIT09ICdmdW5jdGlvbicpIHtcbiAgZGVsZXRlIGNvbmZpZy5mdWxsV2lkdGg7XG59XG4iXX0=