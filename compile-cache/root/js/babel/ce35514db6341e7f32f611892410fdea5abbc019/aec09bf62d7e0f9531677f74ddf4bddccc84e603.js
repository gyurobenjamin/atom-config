Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var BuildView = (function (_View) {
  _inherits(BuildView, _View);

  _createClass(BuildView, null, [{
    key: 'initialTimerText',
    value: function initialTimerText() {
      return '0.0 s';
    }
  }, {
    key: 'initialHeadingText',
    value: function initialHeadingText() {
      return 'Atom Build';
    }
  }, {
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ tabIndex: -1, 'class': 'build tool-panel native-key-bindings' }, function () {
        _this.div({ 'class': 'heading', outlet: 'panelHeading' }, function () {
          _this.div({ 'class': 'control-container opaque-hover' }, function () {
            _this.button({ 'class': 'btn btn-default icon icon-zap', click: 'build', title: 'Build current project' });
            _this.button({ 'class': 'btn btn-default icon icon-trashcan', click: 'clearOutput' });
            _this.button({ 'class': 'btn btn-default icon icon-x', click: 'close' });
            _this.div({ 'class': 'title', outlet: 'title' }, function () {
              _this.span({ 'class': 'build-timer', outlet: 'buildTimer' }, _this.initialTimerText());
            });
          });
          _this.div({ 'class': 'icon heading-text', outlet: 'heading' }, _this.initialHeadingText());
        });

        _this.div({ 'class': 'output panel-body', outlet: 'output' });
        _this.div({ 'class': 'resizer', outlet: 'resizer' });
      });
    }
  }]);

  function BuildView() {
    var _context,
        _this2 = this;

    _classCallCheck(this, BuildView);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _get(Object.getPrototypeOf(BuildView.prototype), 'constructor', this).apply(this, args);
    var Terminal = require('term.js');
    this.starttime = new Date();
    this.terminal = new Terminal({
      cursorBlink: false,
      convertEol: true,
      useFocus: false,
      termName: 'xterm-256color',
      scrollback: atom.config.get('build.terminalScrollback')
    });

    // On some systems, prependListern and prependOnceListener is expected to exist. Add them until terminal replacement is here.
    this.terminal.prependListener = function () {
      var _terminal;

      (_terminal = _this2.terminal).addListener.apply(_terminal, arguments);
    };
    this.terminal.prependOnceListener = function () {
      var _terminal2;

      (_terminal2 = _this2.terminal).addOnceListener.apply(_terminal2, arguments);
    };

    this.terminal.getContent = function () {
      return this.lines.reduce(function (m1, line) {
        return m1 + line.reduce(function (m2, col) {
          return m2 + col[1];
        }, '') + '\n';
      }, '');
    };

    this.fontGeometry = { w: 15, h: 15 };
    this.terminal.open(this.output[0]);
    this.destroyTerminal = (_context = this.terminal).destroy.bind(_context);
    this.terminal.destroy = this.terminal.destroySoon = function () {}; // This terminal will be open forever and reset when necessary
    this.terminalEl = (0, _atomSpacePenViews.$)(this.terminal.element);
    this.terminalEl[0].terminal = this.terminal; // For testing purposes

    this.resizeStarted = this.resizeStarted.bind(this);
    this.resizeMoved = this.resizeMoved.bind(this);
    this.resizeEnded = this.resizeEnded.bind(this);

    atom.config.observe('build.panelVisibility', this.visibleFromConfig.bind(this));
    atom.config.observe('build.panelOrientation', this.orientationFromConfig.bind(this));
    atom.config.observe('build.hidePanelHeading', function (hide) {
      hide && _this2.panelHeading.hide() || _this2.panelHeading.show();
    });
    atom.config.observe('build.overrideThemeColors', function (override) {
      _this2.output.removeClass('override-theme');
      override && _this2.output.addClass('override-theme');
    });
    atom.config.observe('editor.fontSize', this.fontSizeFromConfig.bind(this));
    atom.config.observe('editor.fontFamily', this.fontFamilyFromConfig.bind(this));
    atom.commands.add('atom-workspace', 'build:toggle-panel', this.toggle.bind(this));
  }

  _createClass(BuildView, [{
    key: 'destroy',
    value: function destroy() {
      this.destroyTerminal();
      clearInterval(this.detectResizeInterval);
    }
  }, {
    key: 'resizeStarted',
    value: function resizeStarted() {
      document.body.style['-webkit-user-select'] = 'none';
      document.addEventListener('mousemove', this.resizeMoved);
      document.addEventListener('mouseup', this.resizeEnded);
    }
  }, {
    key: 'resizeMoved',
    value: function resizeMoved(ev) {
      var h = this.fontGeometry.h;

      switch (atom.config.get('build.panelOrientation')) {
        case 'Bottom':
          {
            var delta = this.resizer.get(0).getBoundingClientRect().top - ev.y;
            if (Math.abs(delta) < h * 5 / 6) return;

            var nearestRowHeight = Math.round((this.terminalEl.height() + delta) / h) * h;
            var maxHeight = (0, _atomSpacePenViews.$)('.item-views').height() + (0, _atomSpacePenViews.$)('.build .output').height();
            this.terminalEl.css('height', Math.min(maxHeight, nearestRowHeight) + 'px');
            break;
          }

        case 'Top':
          {
            var delta = this.resizer.get(0).getBoundingClientRect().top - ev.y;
            if (Math.abs(delta) < h * 5 / 6) return;

            var nearestRowHeight = Math.round((this.terminalEl.height() - delta) / h) * h;
            var maxHeight = (0, _atomSpacePenViews.$)('.item-views').height() + (0, _atomSpacePenViews.$)('.build .output').height();
            this.terminalEl.css('height', Math.min(maxHeight, nearestRowHeight) + 'px');
            break;
          }

        case 'Left':
          {
            var delta = this.resizer.get(0).getBoundingClientRect().right - ev.x;
            this.css('width', this.width() - delta - this.resizer.outerWidth() + 'px');
            break;
          }

        case 'Right':
          {
            var delta = this.resizer.get(0).getBoundingClientRect().left - ev.x;
            this.css('width', this.width() + delta + 'px');
            break;
          }
      }

      this.resizeTerminal();
    }
  }, {
    key: 'resizeEnded',
    value: function resizeEnded() {
      document.body.style['-webkit-user-select'] = 'all';
      document.removeEventListener('mousemove', this.resizeMoved);
      document.removeEventListener('mouseup', this.resizeEnded);
    }
  }, {
    key: 'resizeToNearestRow',
    value: function resizeToNearestRow() {
      if (-1 !== ['Top', 'Bottom'].indexOf(atom.config.get('build.panelOrientation'))) {
        this.fixTerminalElHeight();
      }
      this.resizeTerminal();
    }
  }, {
    key: 'getFontGeometry',
    value: function getFontGeometry() {
      var o = (0, _atomSpacePenViews.$)('<div>A</div>').addClass('terminal').addClass('terminal-test').appendTo(this.output);
      var w = o[0].getBoundingClientRect().width;
      var h = o[0].getBoundingClientRect().height;
      o.remove();
      return { w: w, h: h };
    }
  }, {
    key: 'resizeTerminal',
    value: function resizeTerminal() {
      this.fontGeometry = this.getFontGeometry();
      var _fontGeometry = this.fontGeometry;
      var w = _fontGeometry.w;
      var h = _fontGeometry.h;

      if (0 === w || 0 === h) {
        return;
      }

      var terminalWidth = Math.floor(this.terminalEl.width() / w);
      var terminalHeight = Math.floor(this.terminalEl.height() / h);

      this.terminal.resize(terminalWidth, terminalHeight);
    }
  }, {
    key: 'getContent',
    value: function getContent() {
      return this.terminal.getContent();
    }
  }, {
    key: 'attach',
    value: function attach() {
      var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

      if (!force) {
        switch (atom.config.get('build.panelVisibility')) {
          case 'Hidden':
          case 'Show on Error':
            return;
        }
      }

      if (this.panel) {
        this.panel.destroy();
      }

      var addfn = {
        Top: atom.workspace.addTopPanel,
        Bottom: atom.workspace.addBottomPanel,
        Left: atom.workspace.addLeftPanel,
        Right: atom.workspace.addRightPanel
      };
      var orientation = atom.config.get('build.panelOrientation') || 'Bottom';
      this.panel = addfn[orientation].call(atom.workspace, { item: this });
      this.fixTerminalElHeight();
      this.resizeToNearestRow();
    }
  }, {
    key: 'fixTerminalElHeight',
    value: function fixTerminalElHeight() {
      var nearestRowHeight = (0, _atomSpacePenViews.$)('.build .output').height();
      this.terminalEl.css('height', nearestRowHeight + 'px');
    }
  }, {
    key: 'detach',
    value: function detach(force) {
      force = force || false;
      if (atom.views.getView(atom.workspace) && document.activeElement === this[0]) {
        atom.views.getView(atom.workspace).focus();
      }
      if (this.panel && (force || 'Keep Visible' !== atom.config.get('build.panelVisibility'))) {
        this.panel.destroy();
        this.panel = null;
      }
    }
  }, {
    key: 'isAttached',
    value: function isAttached() {
      return !!this.panel;
    }
  }, {
    key: 'visibleFromConfig',
    value: function visibleFromConfig(val) {
      switch (val) {
        case 'Toggle':
        case 'Show on Error':
          if (!this.terminalEl.hasClass('error')) {
            this.detach();
          }
          return;
      }

      this.attach();
    }
  }, {
    key: 'orientationFromConfig',
    value: function orientationFromConfig(orientation) {
      var isVisible = this.isVisible();
      this.detach(true);
      if (isVisible) {
        this.attach();
      }

      this.resizer.get(0).removeEventListener('mousedown', this.resizeStarted);

      switch (orientation) {
        case 'Top':
        case 'Bottom':
          this.get(0).style.width = null;
          this.resizer.get(0).addEventListener('mousedown', this.resizeStarted);
          break;

        case 'Left':
        case 'Right':
          this.terminalEl.get(0).style.height = null;
          this.resizer.get(0).addEventListener('mousedown', this.resizeStarted);
          break;
      }

      this.resizeTerminal();
    }
  }, {
    key: 'fontSizeFromConfig',
    value: function fontSizeFromConfig(size) {
      this.css({ 'font-size': size });
      this.resizeToNearestRow();
    }
  }, {
    key: 'fontFamilyFromConfig',
    value: function fontFamilyFromConfig(family) {
      this.css({ 'font-family': family });
      this.resizeToNearestRow();
    }
  }, {
    key: 'reset',
    value: function reset() {
      clearTimeout(this.titleTimer);
      this.buildTimer.text(BuildView.initialTimerText());
      this.titleTimer = 0;
      this.terminal.reset();

      this.panelHeading.removeClass('success error');
      this.title.removeClass('success error');

      this.detach();
    }
  }, {
    key: 'updateTitle',
    value: function updateTitle() {
      this.buildTimer.text(((new Date() - this.starttime) / 1000).toFixed(1) + ' s');
      this.titleTimer = setTimeout(this.updateTitle.bind(this), 100);
    }
  }, {
    key: 'close',
    value: function close() {
      this.detach(true);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      require('./google-analytics').sendEvent('view', 'panel toggled');
      this.isAttached() ? this.detach(true) : this.attach(true);
    }
  }, {
    key: 'clearOutput',
    value: function clearOutput() {
      this.terminal.reset();
    }
  }, {
    key: 'build',
    value: function build() {
      atom.commands.dispatch(atom.views.getView(atom.workspace), 'build:trigger');
    }
  }, {
    key: 'setHeading',
    value: function setHeading(heading) {
      this.heading.text(heading);
    }
  }, {
    key: 'buildStarted',
    value: function buildStarted() {
      this.starttime = new Date();
      this.reset();
      this.attach();
      if (atom.config.get('build.stealFocus')) {
        this.focus();
      }
      this.updateTitle();
    }
  }, {
    key: 'buildFinished',
    value: function buildFinished(success) {
      if (!success && !this.isAttached()) {
        this.attach(atom.config.get('build.panelVisibility') === 'Show on Error');
      }
      this.finalizeBuild(success);
    }
  }, {
    key: 'buildAbortInitiated',
    value: function buildAbortInitiated() {
      this.heading.addClass('icon-stop');
    }
  }, {
    key: 'buildAborted',
    value: function buildAborted() {
      this.finalizeBuild(false);
    }
  }, {
    key: 'finalizeBuild',
    value: function finalizeBuild(success) {
      this.title.addClass(success ? 'success' : 'error');
      this.panelHeading.addClass(success ? 'success' : 'error');
      this.heading.removeClass('icon-stop');
      clearTimeout(this.titleTimer);
    }
  }, {
    key: 'scrollTo',
    value: function scrollTo(text) {
      var content = this.getContent();
      var endPos = -1;
      var curPos = text.length;
      // We need to decrease the size of `text` until we find a match. This is because
      // terminal will insert line breaks ('\r\n') when width of terminal is reached.
      // It may have been that the middle of a matched error is on a line break.
      while (-1 === endPos && curPos > 0) {
        endPos = content.indexOf(text.substring(0, curPos--));
      }

      if (curPos === 0) {
        // No match - which is weird. Oh well - rather be defensive
        return;
      }

      var row = content.slice(0, endPos).split('\n').length;
      this.terminal.ydisp = 0;
      this.terminal.scrollDisp(row - 1);
    }
  }]);

  return BuildView;
})(_atomSpacePenViews.View);

exports['default'] = BuildView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9idWlsZC12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztpQ0FFd0Isc0JBQXNCOztBQUY5QyxXQUFXLENBQUM7O0lBSVMsU0FBUztZQUFULFNBQVM7O2VBQVQsU0FBUzs7V0FFTCw0QkFBRztBQUN4QixhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1dBRXdCLDhCQUFHO0FBQzFCLGFBQU8sWUFBWSxDQUFDO0tBQ3JCOzs7V0FFYSxtQkFBRzs7O0FBQ2YsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxTQUFPLHNDQUFzQyxFQUFFLEVBQUUsWUFBTTtBQUM5RSxjQUFLLEdBQUcsQ0FBQyxFQUFFLFNBQU8sU0FBUyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsRUFBRSxZQUFNO0FBQzNELGdCQUFLLEdBQUcsQ0FBQyxFQUFFLFNBQU8sZ0NBQWdDLEVBQUUsRUFBRSxZQUFNO0FBQzFELGtCQUFLLE1BQU0sQ0FBQyxFQUFFLFNBQU8sK0JBQStCLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDO0FBQ3hHLGtCQUFLLE1BQU0sQ0FBQyxFQUFFLFNBQU8sb0NBQW9DLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7QUFDbkYsa0JBQUssTUFBTSxDQUFDLEVBQUUsU0FBTyw2QkFBNkIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUN0RSxrQkFBSyxHQUFHLENBQUMsRUFBRSxTQUFPLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLEVBQUUsWUFBTTtBQUNsRCxvQkFBSyxJQUFJLENBQUMsRUFBRSxTQUFPLGFBQWEsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLEVBQUUsTUFBSyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7YUFD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RTtBQUNsQyxjQUFNLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDdkQ7O0FBRUQsVUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFOztBQUVoQixlQUFPO09BQ1I7O0FBRUQsVUFBTSxHQUFHLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUN4RCxVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDeEIsVUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQ25DOzs7U0FuV2tCLFNBQVM7OztxQkFBVCxTQUFTIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9idWlsZC12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFZpZXcsICQgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1aWxkVmlldyBleHRlbmRzIFZpZXcge1xuXG4gIHN0YXRpYyBpbml0aWFsVGltZXJUZXh0KCkge1xuICAgIHJldHVybiAnMC4wIHMnO1xuICB9XG5cbiAgc3RhdGljIGluaXRpYWxIZWFkaW5nVGV4dCgpIHtcbiAgICByZXR1cm4gJ0F0b20gQnVpbGQnO1xuICB9XG5cbiAgc3RhdGljIGNvbnRlbnQoKSB7XG4gICAgdGhpcy5kaXYoeyB0YWJJbmRleDogLTEsIGNsYXNzOiAnYnVpbGQgdG9vbC1wYW5lbCBuYXRpdmUta2V5LWJpbmRpbmdzJyB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmRpdih7IGNsYXNzOiAnaGVhZGluZycsIG91dGxldDogJ3BhbmVsSGVhZGluZycgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAnY29udHJvbC1jb250YWluZXIgb3BhcXVlLWhvdmVyJyB9LCAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0biBidG4tZGVmYXVsdCBpY29uIGljb24temFwJywgY2xpY2s6ICdidWlsZCcsIHRpdGxlOiAnQnVpbGQgY3VycmVudCBwcm9qZWN0JyB9KTtcbiAgICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiAnYnRuIGJ0bi1kZWZhdWx0IGljb24gaWNvbi10cmFzaGNhbicsIGNsaWNrOiAnY2xlYXJPdXRwdXQnIH0pO1xuICAgICAgICAgIHRoaXMuYnV0dG9uKHsgY2xhc3M6ICdidG4gYnRuLWRlZmF1bHQgaWNvbiBpY29uLXgnLCBjbGljazogJ2Nsb3NlJyB9KTtcbiAgICAgICAgICB0aGlzLmRpdih7IGNsYXNzOiAndGl0bGUnLCBvdXRsZXQ6ICd0aXRsZScgfSwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zcGFuKHsgY2xhc3M6ICdidWlsZC10aW1lcicsIG91dGxldDogJ2J1aWxkVGltZXInIH0sIHRoaXMuaW5pdGlhbFRpbWVyVGV4dCgpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdpY29uIGhlYWRpbmctdGV4dCcsIG91dGxldDogJ2hlYWRpbmcnIH0sIHRoaXMuaW5pdGlhbEhlYWRpbmdUZXh0KCkpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdvdXRwdXQgcGFuZWwtYm9keScsIG91dGxldDogJ291dHB1dCcgfSk7XG4gICAgICB0aGlzLmRpdih7IGNsYXNzOiAncmVzaXplcicsIG91dGxldDogJ3Jlc2l6ZXInIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoLi4uYXJncykge1xuICAgIHN1cGVyKC4uLmFyZ3MpO1xuICAgIGNvbnN0IFRlcm1pbmFsID0gcmVxdWlyZSgndGVybS5qcycpO1xuICAgIHRoaXMuc3RhcnR0aW1lID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLnRlcm1pbmFsID0gbmV3IFRlcm1pbmFsKHtcbiAgICAgIGN1cnNvckJsaW5rOiBmYWxzZSxcbiAgICAgIGNvbnZlcnRFb2w6IHRydWUsXG4gICAgICB1c2VGb2N1czogZmFsc2UsXG4gICAgICB0ZXJtTmFtZTogJ3h0ZXJtLTI1NmNvbG9yJyxcbiAgICAgIHNjcm9sbGJhY2s6IGF0b20uY29uZmlnLmdldCgnYnVpbGQudGVybWluYWxTY3JvbGxiYWNrJylcbiAgICB9KTtcblxuICAgIC8vIE9uIHNvbWUgc3lzdGVtcywgcHJlcGVuZExpc3Rlcm4gYW5kIHByZXBlbmRPbmNlTGlzdGVuZXIgaXMgZXhwZWN0ZWQgdG8gZXhpc3QuIEFkZCB0aGVtIHVudGlsIHRlcm1pbmFsIHJlcGxhY2VtZW50IGlzIGhlcmUuXG4gICAgdGhpcy50ZXJtaW5hbC5wcmVwZW5kTGlzdGVuZXIgPSAoLi4uYSkgPT4ge1xuICAgICAgdGhpcy50ZXJtaW5hbC5hZGRMaXN0ZW5lciguLi5hKTtcbiAgICB9O1xuICAgIHRoaXMudGVybWluYWwucHJlcGVuZE9uY2VMaXN0ZW5lciA9ICguLi5hKSA9PiB7XG4gICAgICB0aGlzLnRlcm1pbmFsLmFkZE9uY2VMaXN0ZW5lciguLi5hKTtcbiAgICB9O1xuXG4gICAgdGhpcy50ZXJtaW5hbC5nZXRDb250ZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIHRoaXMubGluZXMucmVkdWNlKChtMSwgbGluZSkgPT4ge1xuICAgICAgICByZXR1cm4gbTEgKyBsaW5lLnJlZHVjZSgobTIsIGNvbCkgPT4gbTIgKyBjb2xbMV0sICcnKSArICdcXG4nO1xuICAgICAgfSwgJycpO1xuICAgIH07XG5cbiAgICB0aGlzLmZvbnRHZW9tZXRyeSA9IHsgdzogMTUsIGg6IDE1IH07XG4gICAgdGhpcy50ZXJtaW5hbC5vcGVuKHRoaXMub3V0cHV0WzBdKTtcbiAgICB0aGlzLmRlc3Ryb3lUZXJtaW5hbCA9IDo6KHRoaXMudGVybWluYWwpLmRlc3Ryb3k7XG4gICAgdGhpcy50ZXJtaW5hbC5kZXN0cm95ID0gdGhpcy50ZXJtaW5hbC5kZXN0cm95U29vbiA9ICgpID0+IHt9OyAvLyBUaGlzIHRlcm1pbmFsIHdpbGwgYmUgb3BlbiBmb3JldmVyIGFuZCByZXNldCB3aGVuIG5lY2Vzc2FyeVxuICAgIHRoaXMudGVybWluYWxFbCA9ICQodGhpcy50ZXJtaW5hbC5lbGVtZW50KTtcbiAgICB0aGlzLnRlcm1pbmFsRWxbMF0udGVybWluYWwgPSB0aGlzLnRlcm1pbmFsOyAvLyBGb3IgdGVzdGluZyBwdXJwb3Nlc1xuXG4gICAgdGhpcy5yZXNpemVTdGFydGVkID0gOjp0aGlzLnJlc2l6ZVN0YXJ0ZWQ7XG4gICAgdGhpcy5yZXNpemVNb3ZlZCA9IDo6dGhpcy5yZXNpemVNb3ZlZDtcbiAgICB0aGlzLnJlc2l6ZUVuZGVkID0gOjp0aGlzLnJlc2l6ZUVuZGVkO1xuXG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JywgOjp0aGlzLnZpc2libGVGcm9tQ29uZmlnKTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdidWlsZC5wYW5lbE9yaWVudGF0aW9uJywgOjp0aGlzLm9yaWVudGF0aW9uRnJvbUNvbmZpZyk7XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQuaGlkZVBhbmVsSGVhZGluZycsIChoaWRlKSA9PiB7XG4gICAgICBoaWRlICYmIHRoaXMucGFuZWxIZWFkaW5nLmhpZGUoKSB8fCB0aGlzLnBhbmVsSGVhZGluZy5zaG93KCk7XG4gICAgfSk7XG4gICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnYnVpbGQub3ZlcnJpZGVUaGVtZUNvbG9ycycsIChvdmVycmlkZSkgPT4ge1xuICAgICAgdGhpcy5vdXRwdXQucmVtb3ZlQ2xhc3MoJ292ZXJyaWRlLXRoZW1lJyk7XG4gICAgICBvdmVycmlkZSAmJiB0aGlzLm91dHB1dC5hZGRDbGFzcygnb3ZlcnJpZGUtdGhlbWUnKTtcbiAgICB9KTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdlZGl0b3IuZm9udFNpemUnLCA6OnRoaXMuZm9udFNpemVGcm9tQ29uZmlnKTtcbiAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdlZGl0b3IuZm9udEZhbWlseScsIDo6dGhpcy5mb250RmFtaWx5RnJvbUNvbmZpZyk7XG4gICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ2J1aWxkOnRvZ2dsZS1wYW5lbCcsIDo6dGhpcy50b2dnbGUpO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmRlc3Ryb3lUZXJtaW5hbCgpO1xuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5kZXRlY3RSZXNpemVJbnRlcnZhbCk7XG4gIH1cblxuICByZXNpemVTdGFydGVkKCkge1xuICAgIGRvY3VtZW50LmJvZHkuc3R5bGVbJy13ZWJraXQtdXNlci1zZWxlY3QnXSA9ICdub25lJztcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLnJlc2l6ZU1vdmVkKTtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5yZXNpemVFbmRlZCk7XG4gIH1cblxuICByZXNpemVNb3ZlZChldikge1xuICAgIGNvbnN0IHsgaCB9ID0gdGhpcy5mb250R2VvbWV0cnk7XG5cbiAgICBzd2l0Y2ggKGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxPcmllbnRhdGlvbicpKSB7XG4gICAgICBjYXNlICdCb3R0b20nOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5yZXNpemVyLmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3AgLSBldi55O1xuICAgICAgICBpZiAoTWF0aC5hYnMoZGVsdGEpIDwgKGggKiA1IC8gNikpIHJldHVybjtcblxuICAgICAgICBjb25zdCBuZWFyZXN0Um93SGVpZ2h0ID0gTWF0aC5yb3VuZCgodGhpcy50ZXJtaW5hbEVsLmhlaWdodCgpICsgZGVsdGEpIC8gaCkgKiBoO1xuICAgICAgICBjb25zdCBtYXhIZWlnaHQgPSAkKCcuaXRlbS12aWV3cycpLmhlaWdodCgpICsgJCgnLmJ1aWxkIC5vdXRwdXQnKS5oZWlnaHQoKTtcbiAgICAgICAgdGhpcy50ZXJtaW5hbEVsLmNzcygnaGVpZ2h0JywgYCR7TWF0aC5taW4obWF4SGVpZ2h0LCBuZWFyZXN0Um93SGVpZ2h0KX1weGApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnVG9wJzoge1xuICAgICAgICBjb25zdCBkZWx0YSA9IHRoaXMucmVzaXplci5nZXQoMCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gZXYueTtcbiAgICAgICAgaWYgKE1hdGguYWJzKGRlbHRhKSA8IChoICogNSAvIDYpKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgbmVhcmVzdFJvd0hlaWdodCA9IE1hdGgucm91bmQoKHRoaXMudGVybWluYWxFbC5oZWlnaHQoKSAtIGRlbHRhKSAvIGgpICogaDtcbiAgICAgICAgY29uc3QgbWF4SGVpZ2h0ID0gJCgnLml0ZW0tdmlld3MnKS5oZWlnaHQoKSArICQoJy5idWlsZCAub3V0cHV0JykuaGVpZ2h0KCk7XG4gICAgICAgIHRoaXMudGVybWluYWxFbC5jc3MoJ2hlaWdodCcsIGAke01hdGgubWluKG1heEhlaWdodCwgbmVhcmVzdFJvd0hlaWdodCl9cHhgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGNhc2UgJ0xlZnQnOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5yZXNpemVyLmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5yaWdodCAtIGV2Lng7XG4gICAgICAgIHRoaXMuY3NzKCd3aWR0aCcsIGAke3RoaXMud2lkdGgoKSAtIGRlbHRhIC0gdGhpcy5yZXNpemVyLm91dGVyV2lkdGgoKX1weGApO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY2FzZSAnUmlnaHQnOiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gdGhpcy5yZXNpemVyLmdldCgwKS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0IC0gZXYueDtcbiAgICAgICAgdGhpcy5jc3MoJ3dpZHRoJywgYCR7dGhpcy53aWR0aCgpICsgZGVsdGF9cHhgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5yZXNpemVUZXJtaW5hbCgpO1xuICB9XG5cbiAgcmVzaXplRW5kZWQoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5zdHlsZVsnLXdlYmtpdC11c2VyLXNlbGVjdCddID0gJ2FsbCc7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5yZXNpemVNb3ZlZCk7XG4gICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMucmVzaXplRW5kZWQpO1xuICB9XG5cbiAgcmVzaXplVG9OZWFyZXN0Um93KCkge1xuICAgIGlmICgtMSAhPT0gWyAnVG9wJywgJ0JvdHRvbScgXS5pbmRleE9mKGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxPcmllbnRhdGlvbicpKSkge1xuICAgICAgdGhpcy5maXhUZXJtaW5hbEVsSGVpZ2h0KCk7XG4gICAgfVxuICAgIHRoaXMucmVzaXplVGVybWluYWwoKTtcbiAgfVxuXG4gIGdldEZvbnRHZW9tZXRyeSgpIHtcbiAgICBjb25zdCBvID0gJCgnPGRpdj5BPC9kaXY+JylcbiAgICAgIC5hZGRDbGFzcygndGVybWluYWwnKVxuICAgICAgLmFkZENsYXNzKCd0ZXJtaW5hbC10ZXN0JylcbiAgICAgIC5hcHBlbmRUbyh0aGlzLm91dHB1dCk7XG4gICAgY29uc3QgdyA9IG9bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgY29uc3QgaCA9IG9bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0O1xuICAgIG8ucmVtb3ZlKCk7XG4gICAgcmV0dXJuIHsgdywgaCB9O1xuICB9XG5cbiAgcmVzaXplVGVybWluYWwoKSB7XG4gICAgdGhpcy5mb250R2VvbWV0cnkgPSB0aGlzLmdldEZvbnRHZW9tZXRyeSgpO1xuICAgIGNvbnN0IHsgdywgaCB9ID0gdGhpcy5mb250R2VvbWV0cnk7XG4gICAgaWYgKDAgPT09IHcgfHwgMCA9PT0gaCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHRlcm1pbmFsV2lkdGggPSBNYXRoLmZsb29yKCh0aGlzLnRlcm1pbmFsRWwud2lkdGgoKSkgLyB3KTtcbiAgICBjb25zdCB0ZXJtaW5hbEhlaWdodCA9IE1hdGguZmxvb3IoKHRoaXMudGVybWluYWxFbC5oZWlnaHQoKSkgLyBoKTtcblxuICAgIHRoaXMudGVybWluYWwucmVzaXplKHRlcm1pbmFsV2lkdGgsIHRlcm1pbmFsSGVpZ2h0KTtcbiAgfVxuXG4gIGdldENvbnRlbnQoKSB7XG4gICAgcmV0dXJuIHRoaXMudGVybWluYWwuZ2V0Q29udGVudCgpO1xuICB9XG5cbiAgYXR0YWNoKGZvcmNlID0gZmFsc2UpIHtcbiAgICBpZiAoIWZvcmNlKSB7XG4gICAgICBzd2l0Y2ggKGF0b20uY29uZmlnLmdldCgnYnVpbGQucGFuZWxWaXNpYmlsaXR5JykpIHtcbiAgICAgICAgY2FzZSAnSGlkZGVuJzpcbiAgICAgICAgY2FzZSAnU2hvdyBvbiBFcnJvcic6XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnBhbmVsKSB7XG4gICAgICB0aGlzLnBhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICBjb25zdCBhZGRmbiA9IHtcbiAgICAgIFRvcDogYXRvbS53b3Jrc3BhY2UuYWRkVG9wUGFuZWwsXG4gICAgICBCb3R0b206IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsLFxuICAgICAgTGVmdDogYXRvbS53b3Jrc3BhY2UuYWRkTGVmdFBhbmVsLFxuICAgICAgUmlnaHQ6IGF0b20ud29ya3NwYWNlLmFkZFJpZ2h0UGFuZWxcbiAgICB9O1xuICAgIGNvbnN0IG9yaWVudGF0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdidWlsZC5wYW5lbE9yaWVudGF0aW9uJykgfHwgJ0JvdHRvbSc7XG4gICAgdGhpcy5wYW5lbCA9IGFkZGZuW29yaWVudGF0aW9uXS5jYWxsKGF0b20ud29ya3NwYWNlLCB7IGl0ZW06IHRoaXMgfSk7XG4gICAgdGhpcy5maXhUZXJtaW5hbEVsSGVpZ2h0KCk7XG4gICAgdGhpcy5yZXNpemVUb05lYXJlc3RSb3coKTtcbiAgfVxuXG4gIGZpeFRlcm1pbmFsRWxIZWlnaHQoKSB7XG4gICAgY29uc3QgbmVhcmVzdFJvd0hlaWdodCA9ICQoJy5idWlsZCAub3V0cHV0JykuaGVpZ2h0KCk7XG4gICAgdGhpcy50ZXJtaW5hbEVsLmNzcygnaGVpZ2h0JywgYCR7bmVhcmVzdFJvd0hlaWdodH1weGApO1xuICB9XG5cbiAgZGV0YWNoKGZvcmNlKSB7XG4gICAgZm9yY2UgPSBmb3JjZSB8fCBmYWxzZTtcbiAgICBpZiAoYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzWzBdKSB7XG4gICAgICBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpLmZvY3VzKCk7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhbmVsICYmIChmb3JjZSB8fCAnS2VlcCBWaXNpYmxlJyAhPT0gYXRvbS5jb25maWcuZ2V0KCdidWlsZC5wYW5lbFZpc2liaWxpdHknKSkpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgaXNBdHRhY2hlZCgpIHtcbiAgICByZXR1cm4gISF0aGlzLnBhbmVsO1xuICB9XG5cbiAgdmlzaWJsZUZyb21Db25maWcodmFsKSB7XG4gICAgc3dpdGNoICh2YWwpIHtcbiAgICAgIGNhc2UgJ1RvZ2dsZSc6XG4gICAgICBjYXNlICdTaG93IG9uIEVycm9yJzpcbiAgICAgICAgaWYgKCF0aGlzLnRlcm1pbmFsRWwuaGFzQ2xhc3MoJ2Vycm9yJykpIHtcbiAgICAgICAgICB0aGlzLmRldGFjaCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmF0dGFjaCgpO1xuICB9XG5cbiAgb3JpZW50YXRpb25Gcm9tQ29uZmlnKG9yaWVudGF0aW9uKSB7XG4gICAgY29uc3QgaXNWaXNpYmxlID0gdGhpcy5pc1Zpc2libGUoKTtcbiAgICB0aGlzLmRldGFjaCh0cnVlKTtcbiAgICBpZiAoaXNWaXNpYmxlKSB7XG4gICAgICB0aGlzLmF0dGFjaCgpO1xuICAgIH1cblxuICAgIHRoaXMucmVzaXplci5nZXQoMCkucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5yZXNpemVTdGFydGVkKTtcblxuICAgIHN3aXRjaCAob3JpZW50YXRpb24pIHtcbiAgICAgIGNhc2UgJ1RvcCc6XG4gICAgICBjYXNlICdCb3R0b20nOlxuICAgICAgICB0aGlzLmdldCgwKS5zdHlsZS53aWR0aCA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzaXplci5nZXQoMCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5yZXNpemVTdGFydGVkKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ0xlZnQnOlxuICAgICAgY2FzZSAnUmlnaHQnOlxuICAgICAgICB0aGlzLnRlcm1pbmFsRWwuZ2V0KDApLnN0eWxlLmhlaWdodCA9IG51bGw7XG4gICAgICAgIHRoaXMucmVzaXplci5nZXQoMCkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5yZXNpemVTdGFydGVkKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgdGhpcy5yZXNpemVUZXJtaW5hbCgpO1xuICB9XG5cbiAgZm9udFNpemVGcm9tQ29uZmlnKHNpemUpIHtcbiAgICB0aGlzLmNzcyh7ICdmb250LXNpemUnOiBzaXplIH0pO1xuICAgIHRoaXMucmVzaXplVG9OZWFyZXN0Um93KCk7XG4gIH1cblxuICBmb250RmFtaWx5RnJvbUNvbmZpZyhmYW1pbHkpIHtcbiAgICB0aGlzLmNzcyh7ICdmb250LWZhbWlseSc6IGZhbWlseSB9KTtcbiAgICB0aGlzLnJlc2l6ZVRvTmVhcmVzdFJvdygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRoaXMudGl0bGVUaW1lcik7XG4gICAgdGhpcy5idWlsZFRpbWVyLnRleHQoQnVpbGRWaWV3LmluaXRpYWxUaW1lclRleHQoKSk7XG4gICAgdGhpcy50aXRsZVRpbWVyID0gMDtcbiAgICB0aGlzLnRlcm1pbmFsLnJlc2V0KCk7XG5cbiAgICB0aGlzLnBhbmVsSGVhZGluZy5yZW1vdmVDbGFzcygnc3VjY2VzcyBlcnJvcicpO1xuICAgIHRoaXMudGl0bGUucmVtb3ZlQ2xhc3MoJ3N1Y2Nlc3MgZXJyb3InKTtcblxuICAgIHRoaXMuZGV0YWNoKCk7XG4gIH1cblxuICB1cGRhdGVUaXRsZSgpIHtcbiAgICB0aGlzLmJ1aWxkVGltZXIudGV4dCgoKG5ldyBEYXRlKCkgLSB0aGlzLnN0YXJ0dGltZSkgLyAxMDAwKS50b0ZpeGVkKDEpICsgJyBzJyk7XG4gICAgdGhpcy50aXRsZVRpbWVyID0gc2V0VGltZW91dCh0aGlzLnVwZGF0ZVRpdGxlLmJpbmQodGhpcyksIDEwMCk7XG4gIH1cblxuICBjbG9zZSgpIHtcbiAgICB0aGlzLmRldGFjaCh0cnVlKTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICByZXF1aXJlKCcuL2dvb2dsZS1hbmFseXRpY3MnKS5zZW5kRXZlbnQoJ3ZpZXcnLCAncGFuZWwgdG9nZ2xlZCcpO1xuICAgIHRoaXMuaXNBdHRhY2hlZCgpID8gdGhpcy5kZXRhY2godHJ1ZSkgOiB0aGlzLmF0dGFjaCh0cnVlKTtcbiAgfVxuXG4gIGNsZWFyT3V0cHV0KCkge1xuICAgIHRoaXMudGVybWluYWwucmVzZXQoKTtcbiAgfVxuXG4gIGJ1aWxkKCkge1xuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgJ2J1aWxkOnRyaWdnZXInKTtcbiAgfVxuXG4gIHNldEhlYWRpbmcoaGVhZGluZykge1xuICAgIHRoaXMuaGVhZGluZy50ZXh0KGhlYWRpbmcpO1xuICB9XG5cbiAgYnVpbGRTdGFydGVkKCkge1xuICAgIHRoaXMuc3RhcnR0aW1lID0gbmV3IERhdGUoKTtcbiAgICB0aGlzLnJlc2V0KCk7XG4gICAgdGhpcy5hdHRhY2goKTtcbiAgICBpZiAoYXRvbS5jb25maWcuZ2V0KCdidWlsZC5zdGVhbEZvY3VzJykpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gICAgdGhpcy51cGRhdGVUaXRsZSgpO1xuICB9XG5cbiAgYnVpbGRGaW5pc2hlZChzdWNjZXNzKSB7XG4gICAgaWYgKCFzdWNjZXNzICYmICF0aGlzLmlzQXR0YWNoZWQoKSkge1xuICAgICAgdGhpcy5hdHRhY2goYXRvbS5jb25maWcuZ2V0KCdidWlsZC5wYW5lbFZpc2liaWxpdHknKSA9PT0gJ1Nob3cgb24gRXJyb3InKTtcbiAgICB9XG4gICAgdGhpcy5maW5hbGl6ZUJ1aWxkKHN1Y2Nlc3MpO1xuICB9XG5cbiAgYnVpbGRBYm9ydEluaXRpYXRlZCgpIHtcbiAgICB0aGlzLmhlYWRpbmcuYWRkQ2xhc3MoJ2ljb24tc3RvcCcpO1xuICB9XG5cbiAgYnVpbGRBYm9ydGVkKCkge1xuICAgIHRoaXMuZmluYWxpemVCdWlsZChmYWxzZSk7XG4gIH1cblxuICBmaW5hbGl6ZUJ1aWxkKHN1Y2Nlc3MpIHtcbiAgICB0aGlzLnRpdGxlLmFkZENsYXNzKHN1Y2Nlc3MgPyAnc3VjY2VzcycgOiAnZXJyb3InKTtcbiAgICB0aGlzLnBhbmVsSGVhZGluZy5hZGRDbGFzcyhzdWNjZXNzID8gJ3N1Y2Nlc3MnIDogJ2Vycm9yJyk7XG4gICAgdGhpcy5oZWFkaW5nLnJlbW92ZUNsYXNzKCdpY29uLXN0b3AnKTtcbiAgICBjbGVhclRpbWVvdXQodGhpcy50aXRsZVRpbWVyKTtcbiAgfVxuXG4gIHNjcm9sbFRvKHRleHQpIHtcbiAgICBjb25zdCBjb250ZW50ID0gdGhpcy5nZXRDb250ZW50KCk7XG4gICAgbGV0IGVuZFBvcyA9IC0xO1xuICAgIGxldCBjdXJQb3MgPSB0ZXh0Lmxlbmd0aDtcbiAgICAvLyBXZSBuZWVkIHRvIGRlY3JlYXNlIHRoZSBzaXplIG9mIGB0ZXh0YCB1bnRpbCB3ZSBmaW5kIGEgbWF0Y2guIFRoaXMgaXMgYmVjYXVzZVxuICAgIC8vIHRlcm1pbmFsIHdpbGwgaW5zZXJ0IGxpbmUgYnJlYWtzICgnXFxyXFxuJykgd2hlbiB3aWR0aCBvZiB0ZXJtaW5hbCBpcyByZWFjaGVkLlxuICAgIC8vIEl0IG1heSBoYXZlIGJlZW4gdGhhdCB0aGUgbWlkZGxlIG9mIGEgbWF0Y2hlZCBlcnJvciBpcyBvbiBhIGxpbmUgYnJlYWsuXG4gICAgd2hpbGUgKC0xID09PSBlbmRQb3MgJiYgY3VyUG9zID4gMCkge1xuICAgICAgZW5kUG9zID0gY29udGVudC5pbmRleE9mKHRleHQuc3Vic3RyaW5nKDAsIGN1clBvcy0tKSk7XG4gICAgfVxuXG4gICAgaWYgKGN1clBvcyA9PT0gMCkge1xuICAgICAgLy8gTm8gbWF0Y2ggLSB3aGljaCBpcyB3ZWlyZC4gT2ggd2VsbCAtIHJhdGhlciBiZSBkZWZlbnNpdmVcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCByb3cgPSBjb250ZW50LnNsaWNlKDAsIGVuZFBvcykuc3BsaXQoJ1xcbicpLmxlbmd0aDtcbiAgICB0aGlzLnRlcm1pbmFsLnlkaXNwID0gMDtcbiAgICB0aGlzLnRlcm1pbmFsLnNjcm9sbERpc3Aocm93IC0gMSk7XG4gIH1cbn1cbiJdfQ==