Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atom = require('atom');

'use babel';

var prevFocusedElm = null;

var ToolBarButtonView = (function () {
  function ToolBarButtonView(options) {
    var _element$classList;

    _classCallCheck(this, ToolBarButtonView);

    this.element = document.createElement('button');
    this.subscriptions = new _atom.CompositeDisposable();

    this.priority = options.priority;
    this.options = options;

    if (options.tooltip) {
      this.element.title = options.tooltip;
      this.subscriptions.add(atom.tooltips.add(this.element, {
        title: options.tooltip,
        placement: getTooltipPlacement
      }));
    }

    var classNames = ['btn', 'btn-default', 'tool-bar-btn'];
    if (this.priority < 0) {
      classNames.push('tool-bar-item-align-end');
    }
    if (options.iconset) {
      classNames.push(options.iconset, options.iconset + '-' + options.icon);
    } else {
      classNames.push('icon-' + options.icon);
    }

    (_element$classList = this.element.classList).add.apply(_element$classList, classNames);

    this._onClick = this._onClick.bind(this);
    this._onMouseOver = this._onMouseOver.bind(this);

    this.element.addEventListener('click', this._onClick);
    this.element.addEventListener('mouseover', this._onMouseOver);
  }

  _createClass(ToolBarButtonView, [{
    key: 'setEnabled',
    value: function setEnabled(enabled) {
      if (enabled) {
        this.element.classList.remove('disabled');
      } else {
        this.element.classList.add('disabled');
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      this.subscriptions.dispose();
      this.subscriptions = null;

      if (this.element.parentNode) {
        this.element.parentNode.removeChild(this.element);
      }

      this.element.removeEventListener('click', this._onClick);
      this.element.removeEventListener('mouseover', this._onMouseOver);
      this.element = null;
    }
  }, {
    key: '_onClick',
    value: function _onClick(e) {
      getPrevFocusedElm().focus();
      if (!this.element.classList.contains('disabled')) {
        executeCallback(this.options, e);
      }
      e.preventDefault();
      e.stopPropagation();
    }
  }, {
    key: '_onMouseOver',
    value: function _onMouseOver(e) {
      if (!document.activeElement.classList.contains('tool-bar-btn')) {
        prevFocusedElm = document.activeElement;
      }
    }
  }]);

  return ToolBarButtonView;
})();

exports['default'] = ToolBarButtonView;

function getPrevFocusedElm() {
  var workspaceView = atom.views.getView(atom.workspace);
  if (workspaceView.contains(prevFocusedElm)) {
    return prevFocusedElm;
  } else {
    return workspaceView;
  }
}

function getTooltipPlacement() {
  var toolbarPosition = atom.config.get('tool-bar.position');
  return toolbarPosition === 'Top' ? 'bottom' : toolbarPosition === 'Right' ? 'left' : toolbarPosition === 'Bottom' ? 'top' : toolbarPosition === 'Left' ? 'right' : null;
}

function executeCallback(_ref, e) {
  var callback = _ref.callback;
  var data = _ref.data;

  if (typeof callback === 'object' && callback) {
    callback = getCallbackModifier(callback, e);
  }
  if (typeof callback === 'string') {
    atom.commands.dispatch(getPrevFocusedElm(), callback);
  } else if (typeof callback === 'function') {
    callback(data, getPrevFocusedElm());
  }
}

function getCallbackModifier(callback, _ref2) {
  var altKey = _ref2.altKey;
  var ctrlKey = _ref2.ctrlKey;
  var shiftKey = _ref2.shiftKey;

  if (!(ctrlKey || altKey || shiftKey)) {
    return callback[''];
  }
  var modifier = Object.keys(callback).filter(Boolean).map(function (modifiers) {
    return modifiers.toLowerCase();
  }).reverse().find(function (item) {
    if (~item.indexOf('alt') && !altKey || altKey && ! ~item.indexOf('alt')) {
      return false;
    }
    if (~item.indexOf('ctrl') && !ctrlKey || ctrlKey && ! ~item.indexOf('ctrl')) {
      return false;
    }
    if (~item.indexOf('shift') && !shiftKey || shiftKey && ! ~item.indexOf('shift')) {
      return false;
    }
    return true;
  });
  return callback[modifier] || callback[''];
}
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3Rvb2wtYmFyL2xpYi90b29sLWJhci1idXR0b24tdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFa0MsTUFBTTs7QUFGeEMsV0FBVyxDQUFDOztBQUlaLElBQUksY0FBYyxHQUFHLElBQUksQ0FBQzs7SUFFTCxpQkFBaUI7QUFFeEIsV0FGTyxpQkFBaUIsQ0FFdkIsT0FBTyxFQUFFOzs7MEJBRkgsaUJBQWlCOztBQUdsQyxRQUFJLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDaEQsUUFBSSxDQUFDLGFBQWEsR0FBRywrQkFBeUIsQ0FBQzs7QUFFL0MsUUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOztBQUV2QixRQUFJLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDbkIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUNyQyxVQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtBQUM5QixhQUFLLEVBQUUsT0FBTyxDQUFDLE9BQU87QUFDdEIsaUJBQVMsRUFBRSxtQkFBbUI7T0FDL0IsQ0FBQyxDQUNILENBQUM7S0FDSDs7QUFFRCxRQUFNLFVBQVUsR0FBRyxDQUFDLEtBQUssRUFBRSxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDMUQsUUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtBQUNyQixnQkFBVSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0tBQzVDO0FBQ0QsUUFBSSxPQUFPLENBQUMsT0FBTyxFQUFFO0FBQ25CLGdCQUFVLENBQUMsSUFBSSxDQUFD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QyxPQUFPLENBQUMsQ0FDZixHQUFHLENBQUMsVUFBQSxTQUFTO1dBQUksU0FBUyxDQUFDLFdBQVcsRUFBRTtHQUFBLENBQUMsQ0FDekMsT0FBTyxFQUFFLENBQ1QsSUFBSSxDQUFDLFVBQUEsSUFBSSxFQUFJO0FBQ1osUUFBSSxBQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBTSxNQUFNLElBQUksRUFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEFBQUMsRUFBRTtBQUMxRSxhQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0QsUUFBSSxBQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBTSxPQUFPLElBQUksRUFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEFBQUMsRUFBRTtBQUM5RSxhQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0QsUUFBSSxBQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBTSxRQUFRLElBQUksRUFBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEFBQUMsRUFBRTtBQUNsRixhQUFPLEtBQUssQ0FBQztLQUNkO0FBQ0QsV0FBTyxJQUFJLENBQUM7R0FDYixDQUFDLENBQUM7QUFDTCxTQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7Q0FDM0MiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvdG9vbC1iYXIvbGliL3Rvb2wtYmFyLWJ1dHRvbi12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5cbmxldCBwcmV2Rm9jdXNlZEVsbSA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2xCYXJCdXR0b25WaWV3IHtcblxuICBjb25zdHJ1Y3RvciAob3B0aW9ucykge1xuICAgIHRoaXMuZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG5cbiAgICB0aGlzLnByaW9yaXR5ID0gb3B0aW9ucy5wcmlvcml0eTtcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgaWYgKG9wdGlvbnMudG9vbHRpcCkge1xuICAgICAgdGhpcy5lbGVtZW50LnRpdGxlID0gb3B0aW9ucy50b29sdGlwO1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgICAgYXRvbS50b29sdGlwcy5hZGQodGhpcy5lbGVtZW50LCB7XG4gICAgICAgICAgdGl0bGU6IG9wdGlvbnMudG9vbHRpcCxcbiAgICAgICAgICBwbGFjZW1lbnQ6IGdldFRvb2x0aXBQbGFjZW1lbnRcbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgY2xhc3NOYW1lcyA9IFsnYnRuJywgJ2J0bi1kZWZhdWx0JywgJ3Rvb2wtYmFyLWJ0biddO1xuICAgIGlmICh0aGlzLnByaW9yaXR5IDwgMCkge1xuICAgICAgY2xhc3NOYW1lcy5wdXNoKCd0b29sLWJhci1pdGVtLWFsaWduLWVuZCcpO1xuICAgIH1cbiAgICBpZiAob3B0aW9ucy5pY29uc2V0KSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2gob3B0aW9ucy5pY29uc2V0LCBgJHtvcHRpb25zLmljb25zZXR9LSR7b3B0aW9ucy5pY29ufWApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbGFzc05hbWVzLnB1c2goYGljb24tJHtvcHRpb25zLmljb259YCk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoLi4uY2xhc3NOYW1lcyk7XG5cbiAgICB0aGlzLl9vbkNsaWNrID0gdGhpcy5fb25DbGljay5iaW5kKHRoaXMpO1xuICAgIHRoaXMuX29uTW91c2VPdmVyID0gdGhpcy5fb25Nb3VzZU92ZXIuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuX29uQ2xpY2spO1xuICAgIHRoaXMuZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCB0aGlzLl9vbk1vdXNlT3Zlcik7XG4gIH1cblxuICBzZXRFbmFibGVkIChlbmFibGVkKSB7XG4gICAgaWYgKGVuYWJsZWQpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZWQnKTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95ICgpIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5lbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgIHRoaXMuZWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5fb25DbGljayk7XG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIHRoaXMuX29uTW91c2VPdmVyKTtcbiAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xuICB9XG5cbiAgX29uQ2xpY2sgKGUpIHtcbiAgICBnZXRQcmV2Rm9jdXNlZEVsbSgpLmZvY3VzKCk7XG4gICAgaWYgKCF0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlZCcpKSB7XG4gICAgICBleGVjdXRlQ2FsbGJhY2sodGhpcy5vcHRpb25zLCBlKTtcbiAgICB9XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH1cblxuICBfb25Nb3VzZU92ZXIgKGUpIHtcbiAgICBpZiAoIWRvY3VtZW50LmFjdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCd0b29sLWJhci1idG4nKSkge1xuICAgICAgcHJldkZvY3VzZWRFbG0gPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRQcmV2Rm9jdXNlZEVsbSAoKSB7XG4gIGNvbnN0IHdvcmtzcGFjZVZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuICBpZiAod29ya3NwYWNlVmlldy5jb250YWlucyhwcmV2Rm9jdXNlZEVsbSkpIHtcbiAgICByZXR1cm4gcHJldkZvY3VzZWRFbG07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHdvcmtzcGFjZVZpZXc7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VG9vbHRpcFBsYWNlbWVudCAoKSB7XG4gIGNvbnN0IHRvb2xiYXJQb3NpdGlvbiA9IGF0b20uY29uZmlnLmdldCgndG9vbC1iYXIucG9zaXRpb24nKTtcbiAgcmV0dXJuIHRvb2xiYXJQb3NpdGlvbiA9PT0gJ1RvcCcgPyAnYm90dG9tJ1xuICAgICAgIDogdG9vbGJhclBvc2l0aW9uID09PSAnUmlnaHQnID8gJ2xlZnQnXG4gICAgICAgOiB0b29sYmFyUG9zaXRpb24gPT09ICdCb3R0b20nID8gJ3RvcCdcbiAgICAgICA6IHRvb2xiYXJQb3NpdGlvbiA9PT0gJ0xlZnQnID8gJ3JpZ2h0J1xuICAgICAgIDogbnVsbDtcbn1cblxuZnVuY3Rpb24gZXhlY3V0ZUNhbGxiYWNrICh7Y2FsbGJhY2ssIGRhdGF9LCBlKSB7XG4gIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdvYmplY3QnICYmIGNhbGxiYWNrKSB7XG4gICAgY2FsbGJhY2sgPSBnZXRDYWxsYmFja01vZGlmaWVyKGNhbGxiYWNrLCBlKTtcbiAgfVxuICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnc3RyaW5nJykge1xuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZ2V0UHJldkZvY3VzZWRFbG0oKSwgY2FsbGJhY2spO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGNhbGxiYWNrKGRhdGEsIGdldFByZXZGb2N1c2VkRWxtKCkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldENhbGxiYWNrTW9kaWZpZXIgKGNhbGxiYWNrLCB7YWx0S2V5LCBjdHJsS2V5LCBzaGlmdEtleX0pIHtcbiAgaWYgKCEoY3RybEtleSB8fCBhbHRLZXkgfHwgc2hpZnRLZXkpKSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrWycnXTtcbiAgfVxuICBjb25zdCBtb2RpZmllciA9IE9iamVjdC5rZXlzKGNhbGxiYWNrKVxuICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAubWFwKG1vZGlmaWVycyA9PiBtb2RpZmllcnMudG9Mb3dlckNhc2UoKSlcbiAgICAucmV2ZXJzZSgpXG4gICAgLmZpbmQoaXRlbSA9PiB7XG4gICAgICBpZiAoKH5pdGVtLmluZGV4T2YoJ2FsdCcpICYmICFhbHRLZXkpIHx8IChhbHRLZXkgJiYgIX5pdGVtLmluZGV4T2YoJ2FsdCcpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBpZiAoKH5pdGVtLmluZGV4T2YoJ2N0cmwnKSAmJiAhY3RybEtleSkgfHwgKGN0cmxLZXkgJiYgIX5pdGVtLmluZGV4T2YoJ2N0cmwnKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgaWYgKCh+aXRlbS5pbmRleE9mKCdzaGlmdCcpICYmICFzaGlmdEtleSkgfHwgKHNoaWZ0S2V5ICYmICF+aXRlbS5pbmRleE9mKCdzaGlmdCcpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9KTtcbiAgcmV0dXJuIGNhbGxiYWNrW21vZGlmaWVyXSB8fCBjYWxsYmFja1snJ107XG59XG4iXX0=