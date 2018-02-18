Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var supportFullWidth = typeof atom.workspace.addHeaderPanel === 'function';

var ToolBarView = (function () {
  function ToolBarView() {
    var _this = this;

    _classCallCheck(this, ToolBarView);

    this.element = document.createElement('div');
    this.element.classList.add('tool-bar');
    this.items = [];
    this.emitter = new _atom.Emitter();
    this.subscriptions = new _atom.CompositeDisposable();

    this.subscriptions.add(atom.commands.add('atom-workspace', 'tool-bar:toggle', function () {
      _this.toggle();
    }), atom.commands.add('atom-workspace', 'tool-bar:position-top', function () {
      _this.updatePosition('Top');
      atom.config.set('tool-bar.position', 'Top');
    }), atom.commands.add('atom-workspace', 'tool-bar:position-right', function () {
      _this.updatePosition('Right');
      atom.config.set('tool-bar.position', 'Right');
    }), atom.commands.add('atom-workspace', 'tool-bar:position-bottom', function () {
      _this.updatePosition('Bottom');
      atom.config.set('tool-bar.position', 'Bottom');
    }), atom.commands.add('atom-workspace', 'tool-bar:position-left', function () {
      _this.updatePosition('Left');
      atom.config.set('tool-bar.position', 'Left');
    }), atom.config.observe('tool-bar.iconSize', function (newValue) {
      _this.updateSize(newValue);
    }), atom.config.onDidChange('tool-bar.position', function (_ref) {
      var newValue = _ref.newValue;
      var oldValue = _ref.oldValue;

      if (atom.config.get('tool-bar.visible')) {
        _this.show();
      }
    }), atom.config.onDidChange('tool-bar.visible', function (_ref2) {
      var newValue = _ref2.newValue;
      var oldValue = _ref2.oldValue;

      if (newValue) {
        _this.show();
      } else {
        _this.hide();
      }
    }));

    if (supportFullWidth) {
      this.subscriptions.add(atom.config.onDidChange('tool-bar.fullWidth', function (_ref3) {
        var newValue = _ref3.newValue;
        var oldValue = _ref3.oldValue;

        if (atom.config.get('tool-bar.visible')) {
          _this.show();
        }
      }));
    }

    if (atom.config.get('tool-bar.visible')) {
      this.show();
    }

    this.drawGutter = this.drawGutter.bind(this);

    this.element.addEventListener('scroll', this.drawGutter);
    window.addEventListener('resize', this.drawGutter);
  }

  _createClass(ToolBarView, [{
    key: 'addItem',
    value: function addItem(newItem) {
      newItem.priority = this.calculatePriority(newItem);

      if (atom.devMode) {
        newItem.element.dataset.group = newItem.group;
        newItem.element.dataset.priority = newItem.priority;
      }

      var index = this.items.findIndex(function (existingItem) {
        return existingItem.priority > newItem.priority;
      });
      if (index === -1) {
        index = this.items.length;
      }
      var nextItem = this.items[index];

      this.items.splice(index, 0, newItem);

      this.element.insertBefore(newItem.element, nextItem ? nextItem.element : null);

      this.drawGutter();

      return nextItem;
    }
  }, {
    key: 'removeItem',
    value: function removeItem(item) {
      item.destroy();
      this.items.splice(this.items.indexOf(item), 1);
      this.drawGutter();
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.items.forEach(function (item) {
        return item.destroy();
      });
      this.items = null;

      this.subscriptions.dispose();
      this.subscriptions = null;

      this.hide();
      this.element.removeEventListener('scroll', this.drawGutter);
      this.element = null;

      window.removeEventListener('resize', this.drawGutter);

      this.emitter.emit('did-destroy');
      this.emitter.dispose();
      this.emitter = null;
    }
  }, {
    key: 'calculatePriority',
    value: function calculatePriority(item) {
      if (!isNaN(item.priority)) {
        return item.priority;
      }
      var lastItem = this.items.filter(function (i) {
        return i.group !== item.group;
      }).pop();
      return lastItem && !isNaN(lastItem.priority) ? lastItem.priority + 1 : 50;
    }
  }, {
    key: 'updateSize',
    value: function updateSize(size) {
      this.element.classList.remove('tool-bar-12px', 'tool-bar-16px', 'tool-bar-24px', 'tool-bar-32px');
      this.element.classList.add('tool-bar-' + size);
    }
  }, {
    key: 'updatePosition',
    value: function updatePosition(position) {
      var _element$classList;

      this.element.classList.remove('tool-bar-top', 'tool-bar-right', 'tool-bar-bottom', 'tool-bar-left', 'tool-bar-horizontal', 'tool-bar-vertical');

      var fullWidth = supportFullWidth && atom.config.get('tool-bar.fullWidth');

      switch (position) {
        case 'Top':
          this.panel = fullWidth ? atom.workspace.addHeaderPanel({ item: this.element }) : atom.workspace.addTopPanel({ item: this.element });
          break;
        case 'Right':
          this.panel = atom.workspace.addRightPanel({ item: this.element });
          break;
        case 'Bottom':
          this.panel = fullWidth ? atom.workspace.addFooterPanel({ item: this.element }) : atom.workspace.addBottomPanel({ item: this.element });
          break;
        case 'Left':
          this.panel = atom.workspace.addLeftPanel({ item: this.element, priority: 50 });
          break;
      }

      var classNames = ['tool-bar-' + position.toLowerCase()];
      if (position === 'Top' || position === 'Bottom') {
        classNames.push('tool-bar-horizontal');
      } else {
        classNames.push('tool-bar-vertical');
      }
      (_element$classList = this.element.classList).add.apply(_element$classList, classNames);

      this.updateMenu(position);
      this.drawGutter();
    }
  }, {
    key: 'updateMenu',
    value: function updateMenu(position) {
      var packagesMenu = atom.menu.template.find(function (_ref4) {
        var label = _ref4.label;
        return label === 'Packages' || label === '&Packages';
      });

      var toolBarMenu = packagesMenu && packagesMenu.submenu.find(function (_ref5) {
        var label = _ref5.label;
        return label === 'Tool Bar' || label === '&Tool Bar';
      });

      var positionsMenu = toolBarMenu && toolBarMenu.submenu.find(function (_ref6) {
        var label = _ref6.label;
        return label === 'Position' || label === '&Position';
      });

      var positionMenu = positionMenu && positionsMenu.submenu.find(function (_ref7) {
        var label = _ref7.label;
        return label === position;
      });

      if (positionMenu) {
        positionMenu.checked = true;
      }
    }
  }, {
    key: 'drawGutter',
    value: function drawGutter() {
      this.element.classList.remove('gutter-top', 'gutter-bottom');

      var visibleHeight = this.element.offsetHeight;
      var scrollHeight = this.element.scrollHeight;
      var hiddenHeight = scrollHeight - visibleHeight;

      if (visibleHeight < scrollHeight) {
        if (this.element.scrollTop > 0) {
          this.element.classList.add('gutter-top');
        }
        if (this.element.scrollTop < hiddenHeight) {
          this.element.classList.add('gutter-bottom');
        }
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      if (this.panel != null) {
        if (this.element.parentNode) {
          this.element.parentNode.removeChild(this.element);
        }
        this.panel.destroy();
        this.panel = null;
      }
    }
  }, {
    key: 'show',
    value: function show() {
      this.hide();
      this.updatePosition(atom.config.get('tool-bar.position'));
      this.updateSize(atom.config.get('tool-bar.iconSize'));
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      if (this.element.parentNode) {
        this.hide();
        atom.config.set('tool-bar.visible', false);
      } else {
        this.show();
        atom.config.set('tool-bar.visible', true);
      }
    }
  }]);

  return ToolBarView;
})();

exports['default'] = ToolBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3Rvb2wtYmFyL2xpYi90b29sLWJhci12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O29CQUUyQyxNQUFNOztBQUZqRCxXQUFXLENBQUM7O0FBSVosSUFBTSxnQkFBZ0IsR0FBRyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxLQUFLLFVBQVUsQ0FBQzs7SUFFeEQsV0FBVztBQUVsQixXQUZPLFdBQVcsR0FFZjs7OzBCQUZJLFdBQVc7O0FBRzVCLFFBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxRQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDdkMsUUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxtQkFBYSxDQUFDO0FBQzdCLFFBQUksQ0FBQyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7O0FBRS9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxpQkFBaUIsRUFBRSxZQUFNO0FBQzNELFlBQUssTUFBTSxFQUFFLENBQUM7S0FDZixDQUFDLEVBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsdUJBQXVCLEVBQUUsWUFBTTtBQUNqRSxZQUFLLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMzQixVQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM3QyxDQUFDLEVBQ0YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUseUJBQXlCLEVBQUUsWUFBTTtBQUNuRSxZQUFLLGNBQWMsQ0FBQyxPQUFPLENB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LENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDbkQ7QUFDRCxZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO09BQ25CO0tBQ0Y7OztXQUVJLGdCQUFHO0FBQ04sVUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7QUFDMUQsVUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7S0FDdkQ7OztXQUVNLGtCQUFHO0FBQ1IsVUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRTtBQUMzQixZQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixZQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxLQUFLLENBQUMsQ0FBQztPQUM1QyxNQUFNO0FBQ0wsWUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ1osWUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDM0M7S0FDRjs7O1NBL09rQixXQUFXOzs7cUJBQVgsV0FBVyIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy90b29sLWJhci9saWIvdG9vbC1iYXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGUsIEVtaXR0ZXJ9IGZyb20gJ2F0b20nO1xuXG5jb25zdCBzdXBwb3J0RnVsbFdpZHRoID0gdHlwZW9mIGF0b20ud29ya3NwYWNlLmFkZEhlYWRlclBhbmVsID09PSAnZnVuY3Rpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sQmFyVmlldyB7XG5cbiAgY29uc3RydWN0b3IgKCkge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCd0b29sLWJhcicpO1xuICAgIHRoaXMuaXRlbXMgPSBbXTtcbiAgICB0aGlzLmVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ3Rvb2wtYmFyOnRvZ2dsZScsICgpID0+IHtcbiAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ3Rvb2wtYmFyOnBvc2l0aW9uLXRvcCcsICgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbignVG9wJyk7XG4gICAgICAgIGF0b20uY29uZmlnLnNldCgndG9vbC1iYXIucG9zaXRpb24nLCAnVG9wJyk7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXdvcmtzcGFjZScsICd0b29sLWJhcjpwb3NpdGlvbi1yaWdodCcsICgpID0+IHtcbiAgICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbignUmlnaHQnKTtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd0b29sLWJhci5wb3NpdGlvbicsICdSaWdodCcpO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAndG9vbC1iYXI6cG9zaXRpb24tYm90dG9tJywgKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKCdCb3R0b20nKTtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd0b29sLWJhci5wb3NpdGlvbicsICdCb3R0b20nKTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20td29ya3NwYWNlJywgJ3Rvb2wtYmFyOnBvc2l0aW9uLWxlZnQnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMudXBkYXRlUG9zaXRpb24oJ0xlZnQnKTtcbiAgICAgICAgYXRvbS5jb25maWcuc2V0KCd0b29sLWJhci5wb3NpdGlvbicsICdMZWZ0Jyk7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ3Rvb2wtYmFyLmljb25TaXplJywgbmV3VmFsdWUgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZVNpemUobmV3VmFsdWUpO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgndG9vbC1iYXIucG9zaXRpb24nLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+IHtcbiAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgndG9vbC1iYXIudmlzaWJsZScpKSB7XG4gICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgIH1cbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UoJ3Rvb2wtYmFyLnZpc2libGUnLCAoe25ld1ZhbHVlLCBvbGRWYWx1ZX0pID0+IHtcbiAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgKTtcblxuICAgIGlmIChzdXBwb3J0RnVsbFdpZHRoKSB7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSgndG9vbC1iYXIuZnVsbFdpZHRoJywgKHtuZXdWYWx1ZSwgb2xkVmFsdWV9KSA9PiB7XG4gICAgICAgICAgaWYgKGF0b20uY29uZmlnLmdldCgndG9vbC1iYXIudmlzaWJsZScpKSB7XG4gICAgICAgICAgICB0aGlzLnNob3coKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChhdG9tLmNvbmZpZy5nZXQoJ3Rvb2wtYmFyLnZpc2libGUnKSkge1xuICAgICAgdGhpcy5zaG93KCk7XG4gICAgfVxuXG4gICAgdGhpcy5kcmF3R3V0dGVyID0gdGhpcy5kcmF3R3V0dGVyLmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5kcmF3R3V0dGVyKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy5kcmF3R3V0dGVyKTtcbiAgfVxuXG4gIGFkZEl0ZW0gKG5ld0l0ZW0pIHtcbiAgICBuZXdJdGVtLnByaW9yaXR5ID0gdGhpcy5jYWxjdWxhdGVQcmlvcml0eShuZXdJdGVtKTtcblxuICAgIGlmIChhdG9tLmRldk1vZGUpIHtcbiAgICAgIG5ld0l0ZW0uZWxlbWVudC5kYXRhc2V0Lmdyb3VwID0gbmV3SXRlbS5ncm91cDtcbiAgICAgIG5ld0l0ZW0uZWxlbWVudC5kYXRhc2V0LnByaW9yaXR5ID0gbmV3SXRlbS5wcmlvcml0eTtcbiAgICB9XG5cbiAgICBsZXQgaW5kZXggPSB0aGlzLml0ZW1zLmZpbmRJbmRleChleGlzdGluZ0l0ZW0gPT5cbiAgICAgIChleGlzdGluZ0l0ZW0ucHJpb3JpdHkgPiBuZXdJdGVtLnByaW9yaXR5KSk7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgaW5kZXggPSB0aGlzLml0ZW1zLmxlbmd0aDtcbiAgICB9XG4gICAgY29uc3QgbmV4dEl0ZW0gPSB0aGlzLml0ZW1zW2luZGV4XTtcblxuICAgIHRoaXMuaXRlbXMuc3BsaWNlKGluZGV4LCAwLCBuZXdJdGVtKTtcblxuICAgIHRoaXMuZWxlbWVudC5pbnNlcnRCZWZvcmUoXG4gICAgICBuZXdJdGVtLmVsZW1lbnQsXG4gICAgICBuZXh0SXRlbSA/IG5leHRJdGVtLmVsZW1lbnQgOiBudWxsXG4gICAgKTtcblxuICAgIHRoaXMuZHJhd0d1dHRlcigpO1xuXG4gICAgcmV0dXJuIG5leHRJdGVtO1xuICB9XG5cbiAgcmVtb3ZlSXRlbSAoaXRlbSkge1xuICAgIGl0ZW0uZGVzdHJveSgpO1xuICAgIHRoaXMuaXRlbXMuc3BsaWNlKHRoaXMuaXRlbXMuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgdGhpcy5kcmF3R3V0dGVyKCk7XG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLml0ZW1zLmZvckVhY2goaXRlbSA9PiBpdGVtLmRlc3Ryb3koKSk7XG4gICAgdGhpcy5pdGVtcyA9IG51bGw7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG5cbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLmVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgdGhpcy5kcmF3R3V0dGVyKTtcbiAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xuXG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuZHJhd0d1dHRlcik7XG5cbiAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWRlc3Ryb3knKTtcbiAgICB0aGlzLmVtaXR0ZXIuZGlzcG9zZSgpO1xuICAgIHRoaXMuZW1pdHRlciA9IG51bGw7XG4gIH1cblxuICBjYWxjdWxhdGVQcmlvcml0eSAoaXRlbSkge1xuICAgIGlmICghaXNOYU4oaXRlbS5wcmlvcml0eSkpIHtcbiAgICAgIHJldHVybiBpdGVtLnByaW9yaXR5O1xuICAgIH1cbiAgICBjb25zdCBsYXN0SXRlbSA9IHRoaXMuaXRlbXMuZmlsdGVyKGkgPT4gaS5ncm91cCAhPT0gaXRlbS5ncm91cCkucG9wKCk7XG4gICAgcmV0dXJuIGxhc3RJdGVtICYmICFpc05hTihsYXN0SXRlbS5wcmlvcml0eSlcbiAgICAgID8gbGFzdEl0ZW0ucHJpb3JpdHkgKyAxXG4gICAgICA6IDUwO1xuICB9XG5cbiAgdXBkYXRlU2l6ZSAoc2l6ZSkge1xuICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKFxuICAgICAgJ3Rvb2wtYmFyLTEycHgnLFxuICAgICAgJ3Rvb2wtYmFyLTE2cHgnLFxuICAgICAgJ3Rvb2wtYmFyLTI0cHgnLFxuICAgICAgJ3Rvb2wtYmFyLTMycHgnXG4gICAgKTtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZChgdG9vbC1iYXItJHtzaXplfWApO1xuICB9XG5cbiAgdXBkYXRlUG9zaXRpb24gKHBvc2l0aW9uKSB7XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5yZW1vdmUoXG4gICAgICAndG9vbC1iYXItdG9wJyxcbiAgICAgICd0b29sLWJhci1yaWdodCcsXG4gICAgICAndG9vbC1iYXItYm90dG9tJyxcbiAgICAgICd0b29sLWJhci1sZWZ0JyxcbiAgICAgICd0b29sLWJhci1ob3Jpem9udGFsJyxcbiAgICAgICd0b29sLWJhci12ZXJ0aWNhbCdcbiAgICApO1xuXG4gICAgY29uc3QgZnVsbFdpZHRoID0gc3VwcG9ydEZ1bGxXaWR0aCAmJiBhdG9tLmNvbmZpZy5nZXQoJ3Rvb2wtYmFyLmZ1bGxXaWR0aCcpO1xuXG4gICAgc3dpdGNoIChwb3NpdGlvbikge1xuICAgICAgY2FzZSAnVG9wJzpcbiAgICAgICAgdGhpcy5wYW5lbCA9IGZ1bGxXaWR0aFxuICAgICAgICAgID8gYXRvbS53b3Jrc3BhY2UuYWRkSGVhZGVyUGFuZWwoe2l0ZW06IHRoaXMuZWxlbWVudH0pXG4gICAgICAgICAgOiBhdG9tLndvcmtzcGFjZS5hZGRUb3BQYW5lbCh7aXRlbTogdGhpcy5lbGVtZW50fSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnUmlnaHQnOlxuICAgICAgICB0aGlzLnBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbCh7aXRlbTogdGhpcy5lbGVtZW50fSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnQm90dG9tJzpcbiAgICAgICAgdGhpcy5wYW5lbCA9IGZ1bGxXaWR0aFxuICAgICAgICAgID8gYXRvbS53b3Jrc3BhY2UuYWRkRm9vdGVyUGFuZWwoe2l0ZW06IHRoaXMuZWxlbWVudH0pXG4gICAgICAgICAgOiBhdG9tLndvcmtzcGFjZS5hZGRCb3R0b21QYW5lbCh7aXRlbTogdGhpcy5lbGVtZW50fSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnTGVmdCc6XG4gICAgICAgIHRoaXMucGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRMZWZ0UGFuZWwoe2l0ZW06IHRoaXMuZWxlbWVudCwgcHJpb3JpdHk6IDUwfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnN0IGNsYXNzTmFtZXMgPSBbYHRvb2wtYmFyLSR7cG9zaXRpb24udG9Mb3dlckNhc2UoKX1gXTtcbiAgICBpZiAocG9zaXRpb24gPT09ICdUb3AnIHx8IHBvc2l0aW9uID09PSAnQm90dG9tJykge1xuICAgICAgY2xhc3NOYW1lcy5wdXNoKCd0b29sLWJhci1ob3Jpem9udGFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsYXNzTmFtZXMucHVzaCgndG9vbC1iYXItdmVydGljYWwnKTtcbiAgICB9XG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NOYW1lcyk7XG5cbiAgICB0aGlzLnVwZGF0ZU1lbnUocG9zaXRpb24pO1xuICAgIHRoaXMuZHJhd0d1dHRlcigpO1xuICB9XG5cbiAgdXBkYXRlTWVudSAocG9zaXRpb24pIHtcbiAgICBjb25zdCBwYWNrYWdlc01lbnUgPSBhdG9tLm1lbnUudGVtcGxhdGUuZmluZCgoe2xhYmVsfSkgPT5cbiAgICAgIChsYWJlbCA9PT0gJ1BhY2thZ2VzJyB8fCBsYWJlbCA9PT0gJyZQYWNrYWdlcycpKTtcblxuICAgIGNvbnN0IHRvb2xCYXJNZW51ID0gcGFja2FnZXNNZW51ICYmIHBhY2thZ2VzTWVudS5zdWJtZW51LmZpbmQoKHtsYWJlbH0pID0+XG4gICAgICAobGFiZWwgPT09ICdUb29sIEJhcicgfHwgbGFiZWwgPT09ICcmVG9vbCBCYXInKSk7XG5cbiAgICBjb25zdCBwb3NpdGlvbnNNZW51ID0gdG9vbEJhck1lbnUgJiYgdG9vbEJhck1lbnUuc3VibWVudS5maW5kKCh7bGFiZWx9KSA9PlxuICAgICAgKGxhYmVsID09PSAnUG9zaXRpb24nIHx8IGxhYmVsID09PSAnJlBvc2l0aW9uJykpO1xuXG4gICAgY29uc3QgcG9zaXRpb25NZW51ID0gcG9zaXRpb25NZW51ICYmIHBvc2l0aW9uc01lbnUuc3VibWVudS5maW5kKCh7bGFiZWx9KSA9PlxuICAgICAgbGFiZWwgPT09IHBvc2l0aW9uKTtcblxuICAgIGlmIChwb3NpdGlvbk1lbnUpIHtcbiAgICAgIHBvc2l0aW9uTWVudS5jaGVja2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBkcmF3R3V0dGVyICgpIHtcbiAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSgnZ3V0dGVyLXRvcCcsICdndXR0ZXItYm90dG9tJyk7XG5cbiAgICBjb25zdCB2aXNpYmxlSGVpZ2h0ID0gdGhpcy5lbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICBjb25zdCBzY3JvbGxIZWlnaHQgPSB0aGlzLmVsZW1lbnQuc2Nyb2xsSGVpZ2h0O1xuICAgIGNvbnN0IGhpZGRlbkhlaWdodCA9IHNjcm9sbEhlaWdodCAtIHZpc2libGVIZWlnaHQ7XG5cbiAgICBpZiAodmlzaWJsZUhlaWdodCA8IHNjcm9sbEhlaWdodCkge1xuICAgICAgaWYgKHRoaXMuZWxlbWVudC5zY3JvbGxUb3AgPiAwKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QuYWRkKCdndXR0ZXItdG9wJyk7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5lbGVtZW50LnNjcm9sbFRvcCA8IGhpZGRlbkhlaWdodCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZ3V0dGVyLWJvdHRvbScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhpZGUgKCkge1xuICAgIGlmICh0aGlzLnBhbmVsICE9IG51bGwpIHtcbiAgICAgIGlmICh0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICB0aGlzLmVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgfVxuICAgICAgdGhpcy5wYW5lbC5kZXN0cm95KCk7XG4gICAgICB0aGlzLnBhbmVsID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzaG93ICgpIHtcbiAgICB0aGlzLmhpZGUoKTtcbiAgICB0aGlzLnVwZGF0ZVBvc2l0aW9uKGF0b20uY29uZmlnLmdldCgndG9vbC1iYXIucG9zaXRpb24nKSk7XG4gICAgdGhpcy51cGRhdGVTaXplKGF0b20uY29uZmlnLmdldCgndG9vbC1iYXIuaWNvblNpemUnKSk7XG4gIH1cblxuICB0b2dnbGUgKCkge1xuICAgIGlmICh0aGlzLmVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoJ3Rvb2wtYmFyLnZpc2libGUnLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgYXRvbS5jb25maWcuc2V0KCd0b29sLWJhci52aXNpYmxlJywgdHJ1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=