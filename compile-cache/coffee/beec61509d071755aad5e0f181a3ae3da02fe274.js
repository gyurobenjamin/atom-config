(function() {
  var CompositeDisposable, RenameDialog, StatusIcon,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  RenameDialog = null;

  module.exports = StatusIcon = (function(superClass) {
    extend(StatusIcon, superClass);

    function StatusIcon() {
      return StatusIcon.__super__.constructor.apply(this, arguments);
    }

    StatusIcon.prototype.active = false;

    StatusIcon.prototype.initialize = function(terminalView) {
      var ref;
      this.terminalView = terminalView;
      this.classList.add('pio-terminal-status-icon');
      this.icon = document.createElement('i');
      this.icon.classList.add('icon', 'icon-terminal');
      this.appendChild(this.icon);
      this.name = document.createElement('span');
      this.name.classList.add('name');
      this.appendChild(this.name);
      this.dataset.type = (ref = this.terminalView.constructor) != null ? ref.name : void 0;
      this.addEventListener('click', (function(_this) {
        return function(arg) {
          var ctrlKey, which;
          which = arg.which, ctrlKey = arg.ctrlKey;
          if (which === 1) {
            _this.terminalView.toggle();
            return true;
          } else if (which === 2) {
            _this.terminalView.destroy();
            return false;
          }
        };
      })(this));
      return this.setupTooltip();
    };

    StatusIcon.prototype.setupTooltip = function() {
      var onMouseEnter;
      onMouseEnter = (function(_this) {
        return function(event) {
          if (event.detail === 'platformio-ide-terminal') {
            return;
          }
          return _this.updateTooltip();
        };
      })(this);
      this.mouseEnterSubscription = {
        dispose: (function(_this) {
          return function() {
            _this.removeEventListener('mouseenter', onMouseEnter);
            return _this.mouseEnterSubscription = null;
          };
        })(this)
      };
      return this.addEventListener('mouseenter', onMouseEnter);
    };

    StatusIcon.prototype.updateTooltip = function() {
      var process;
      this.removeTooltip();
      if (process = this.terminalView.getTerminalTitle()) {
        this.tooltip = atom.tooltips.add(this, {
          title: process,
          html: false,
          delay: {
            show: 1000,
            hide: 100
          }
        });
      }
      return this.dispatchEvent(new CustomEvent('mouseenter', {
        bubbles: true,
        detail: 'platformio-ide-terminal'
      }));
    };

    StatusIcon.prototype.removeTooltip = function() {
      if (this.tooltip) {
        this.tooltip.dispose();
      }
      return this.tooltip = null;
    };

    StatusIcon.prototype.destroy = function() {
      this.removeTooltip();
      if (this.mouseEnterSubscription) {
        this.mouseEnterSubscription.dispose();
      }
      return this.remove();
    };

    StatusIcon.prototype.activate = function() {
      this.classList.add('active');
      return this.active = true;
    };

    StatusIcon.prototype.isActive = function() {
      return this.classList.contains('active');
    };

    StatusIcon.prototype.deactivate = function() {
      this.classList.remove('active');
      return this.active = false;
    };

    StatusIcon.prototype.toggle = function() {
      if (this.active) {
        this.classList.remove('active');
      } else {
        this.classList.add('active');
      }
      return this.active = !this.active;
    };

    StatusIcon.prototype.isActive = function() {
      return this.active;
    };

    StatusIcon.prototype.rename = function() {
      var dialog;
      if (RenameDialog == null) {
        RenameDialog = require('./rename-dialog');
      }
      dialog = new RenameDialog(this);
      return dialog.attach();
    };

    StatusIcon.prototype.getName = function() {
      return this.name.textContent.substring(1);
    };

    StatusIcon.prototype.updateName = function(name) {
      if (name !== this.getName()) {
        if (name) {
          name = "&nbsp;" + name;
        }
        this.name.innerHTML = name;
        return this.terminalView.emit('did-change-title');
      }
    };

    return StatusIcon;

  })(HTMLElement);

  module.exports = document.registerElement('pio-terminal-status-icon', {
    prototype: StatusIcon.prototype,
    "extends": 'li'
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUtdGVybWluYWwvbGliL3N0YXR1cy1pY29uLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsNkNBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUV4QixZQUFBLEdBQWU7O0VBRWYsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt5QkFDSixNQUFBLEdBQVE7O3lCQUVSLFVBQUEsR0FBWSxTQUFDLFlBQUQ7QUFDVixVQUFBO01BRFcsSUFBQyxDQUFBLGVBQUQ7TUFDWCxJQUFDLENBQUEsU0FBUyxDQUFDLEdBQVgsQ0FBZSwwQkFBZjtNQUVBLElBQUMsQ0FBQSxJQUFELEdBQVEsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsR0FBdkI7TUFDUixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFoQixDQUFvQixNQUFwQixFQUE0QixlQUE1QjtNQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsSUFBQyxDQUFBLElBQWQ7TUFFQSxJQUFDLENBQUEsSUFBRCxHQUFRLFFBQVEsQ0FBQyxhQUFULENBQXVCLE1BQXZCO01BQ1IsSUFBQyxDQUFBLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBaEIsQ0FBb0IsTUFBcEI7TUFDQSxJQUFDLENBQUEsV0FBRCxDQUFhLElBQUMsQ0FBQSxJQUFkO01BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULHNEQUF5QyxDQUFFO01BRTNDLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixPQUFsQixFQUEyQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtBQUN6QixjQUFBO1VBRDJCLG1CQUFPO1VBQ2xDLElBQUcsS0FBQSxLQUFTLENBQVo7WUFDRSxLQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBQTttQkFDQSxLQUZGO1dBQUEsTUFHSyxJQUFH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QUFhLElBQWI7YUFDYixNQUFNLENBQUMsTUFBUCxDQUFBO0lBSE07O3lCQUtSLE9BQUEsR0FBUyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBbEIsQ0FBNEIsQ0FBNUI7SUFBSDs7eUJBRVQsVUFBQSxHQUFZLFNBQUMsSUFBRDtNQUNWLElBQUcsSUFBQSxLQUFVLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBYjtRQUNFLElBQTBCLElBQTFCO1VBQUEsSUFBQSxHQUFPLFFBQUEsR0FBVyxLQUFsQjs7UUFDQSxJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sR0FBa0I7ZUFDbEIsSUFBQyxDQUFBLFlBQVksQ0FBQyxJQUFkLENBQW1CLGtCQUFuQixFQUhGOztJQURVOzs7O0tBeEZXOztFQThGekIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsMEJBQXpCLEVBQXFEO0lBQUEsU0FBQSxFQUFXLFVBQVUsQ0FBQyxTQUF0QjtJQUFpQyxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBQTFDO0dBQXJEO0FBbkdqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5cblJlbmFtZURpYWxvZyA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU3RhdHVzSWNvbiBleHRlbmRzIEhUTUxFbGVtZW50XG4gIGFjdGl2ZTogZmFsc2VcblxuICBpbml0aWFsaXplOiAoQHRlcm1pbmFsVmlldykgLT5cbiAgICBAY2xhc3NMaXN0LmFkZCAncGlvLXRlcm1pbmFsLXN0YXR1cy1pY29uJ1xuXG4gICAgQGljb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpJylcbiAgICBAaWNvbi5jbGFzc0xpc3QuYWRkICdpY29uJywgJ2ljb24tdGVybWluYWwnXG4gICAgQGFwcGVuZENoaWxkKEBpY29uKVxuXG4gICAgQG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJylcbiAgICBAbmFtZS5jbGFzc0xpc3QuYWRkICduYW1lJ1xuICAgIEBhcHBlbmRDaGlsZChAbmFtZSlcblxuICAgIEBkYXRhc2V0LnR5cGUgPSBAdGVybWluYWxWaWV3LmNvbnN0cnVjdG9yPy5uYW1lXG5cbiAgICBAYWRkRXZlbnRMaXN0ZW5lciAnY2xpY2snLCAoe3doaWNoLCBjdHJsS2V5fSkgPT5cbiAgICAgIGlmIHdoaWNoIGlzIDFcbiAgICAgICAgQHRlcm1pbmFsVmlldy50b2dnbGUoKVxuICAgICAgICB0cnVlXG4gICAgICBlbHNlIGlmIHdoaWNoIGlzIDJcbiAgICAgICAgQHRlcm1pbmFsVmlldy5kZXN0cm95KClcbiAgICAgICAgZmFsc2VcblxuICAgIEBzZXR1cFRvb2x0aXAoKVxuXG4gIHNldHVwVG9vbHRpcDogLT5cblxuICAgIG9uTW91c2VFbnRlciA9IChldmVudCkgPT5cbiAgICAgIHJldHVybiBpZiBldmVudC5kZXRhaWwgaXMgJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsJ1xuICAgICAgQHVwZGF0ZVRvb2x0aXAoKVxuXG4gICAgQG1vdXNlRW50ZXJTdWJzY3JpcHRpb24gPSBkaXNwb3NlOiA9PlxuICAgICAgQHJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlZW50ZXInLCBvbk1vdXNlRW50ZXIpXG4gICAgICBAbW91c2VFbnRlclN1YnNjcmlwdGlvbiA9IG51bGxcblxuICAgIEBhZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgb25Nb3VzZUVudGVyKVxuXG4gIHVwZGF0ZVRvb2x0aXA6IC0+XG4gICAgQHJlbW92ZVRvb2x0aXAoKVxuXG4gICAgaWYgcHJvY2VzcyA9IEB0ZXJtaW5hbFZpZXcuZ2V0VGVybWluYWxUaXRsZSgpXG4gICAgICBAdG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkIHRoaXMsXG4gICAgICAgIHRpdGxlOiBwcm9jZXNzXG4gICAgICAgIGh0bWw6IGZhbHNlXG4gICAgICAgIGRlbGF5OlxuICAgICAgICAgIHNob3c6IDEwMDBcbiAgICAgICAgICBoaWRlOiAxMDBcblxuICAgIEBkaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudCgnbW91c2VlbnRlcicsIGJ1YmJsZXM6IHRydWUsIGRldGFpbDogJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsJykpXG5cbiAgcmVtb3ZlVG9vbHRpcDogLT5cbiAgICBAdG9vbHRpcC5kaXNwb3NlKCkgaWYgQHRvb2x0aXBcbiAgICBAdG9vbHRpcCA9IG51bGxcblxuICBkZXN0cm95OiAtPlxuICAgIEByZW1vdmVUb29sdGlwKClcbiAgICBAbW91c2VFbnRlclN1YnNjcmlwdGlvbi5kaXNwb3NlKCkgaWYgQG1vdXNlRW50ZXJTdWJzY3JpcHRpb25cbiAgICBAcmVtb3ZlKClcblxuICBhY3RpdmF0ZTogLT5cbiAgICBAY2xhc3NMaXN0LmFkZCAnYWN0aXZlJ1xuICAgIEBhY3RpdmUgPSB0cnVlXG5cbiAgaXNBY3RpdmU6IC0+XG4gICAgQGNsYXNzTGlzdC5jb250YWlucyAnYWN0aXZlJ1xuXG4gIGRlYWN0aXZhdGU6IC0+XG4gICAgQGNsYXNzTGlzdC5yZW1vdmUgJ2FjdGl2ZSdcbiAgICBAYWN0aXZlID0gZmFsc2VcblxuICB0b2dnbGU6IC0+XG4gICAgaWYgQGFjdGl2ZVxuICAgICAgQGNsYXNzTGlzdC5yZW1vdmUgJ2FjdGl2ZSdcbiAgICBlbHNlXG4gICAgICBAY2xhc3NMaXN0LmFkZCAnYWN0aXZlJ1xuICAgIEBhY3RpdmUgPSAhQGFjdGl2ZVxuXG4gIGlzQWN0aXZlOiAtPlxuICAgIHJldHVybiBAYWN0aXZlXG5cbiAgcmVuYW1lOiAtPlxuICAgIFJlbmFtZURpYWxvZyA/PSByZXF1aXJlICcuL3JlbmFtZS1kaWFsb2cnXG4gICAgZGlhbG9nID0gbmV3IFJlbmFtZURpYWxvZyB0aGlzXG4gICAgZGlhbG9nLmF0dGFjaCgpXG5cbiAgZ2V0TmFtZTogLT4gQG5hbWUudGV4dENvbnRlbnQuc3Vic3RyaW5nKDEpXG5cbiAgdXBkYXRlTmFtZTogKG5hbWUpIC0+XG4gICAgaWYgbmFtZSBpc250IEBnZXROYW1lKClcbiAgICAgIG5hbWUgPSBcIiZuYnNwO1wiICsgbmFtZSBpZiBuYW1lXG4gICAgICBAbmFtZS5pbm5lckhUTUwgPSBuYW1lXG4gICAgICBAdGVybWluYWxWaWV3LmVtaXQgJ2RpZC1jaGFuZ2UtdGl0bGUnXG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdwaW8tdGVybWluYWwtc3RhdHVzLWljb24nLCBwcm90b3R5cGU6IFN0YXR1c0ljb24ucHJvdG90eXBlLCBleHRlbmRzOiAnbGknKVxuIl19
