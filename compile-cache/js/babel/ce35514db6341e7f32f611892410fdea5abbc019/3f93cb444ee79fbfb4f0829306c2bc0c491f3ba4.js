Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomSpacePenViews = require('atom-space-pen-views');

'use babel';

var SaveConfirmView = (function (_View) {
  _inherits(SaveConfirmView, _View);

  function SaveConfirmView() {
    _classCallCheck(this, SaveConfirmView);

    _get(Object.getPrototypeOf(SaveConfirmView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(SaveConfirmView, [{
    key: 'destroy',
    value: function destroy() {
      this.confirmcb = undefined;
      this.cancelcb = undefined;
      if (this.panel) {
        this.panel.destroy();
        this.panel = null;
      }
    }
  }, {
    key: 'show',
    value: function show(confirmcb, cancelcb) {
      this.confirmcb = confirmcb;
      this.cancelcb = cancelcb;

      this.panel = atom.workspace.addTopPanel({
        item: this
      });
      this.saveBuildButton.focus();
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.destroy();
      if (this.cancelcb) {
        this.cancelcb();
      }
    }
  }, {
    key: 'saveAndConfirm',
    value: function saveAndConfirm() {
      if (this.confirmcb) {
        this.confirmcb(true);
      }
      this.destroy();
    }
  }, {
    key: 'confirmWithoutSave',
    value: function confirmWithoutSave() {
      if (this.confirmcb) {
        this.confirmcb(false);
      }
      this.destroy();
    }
  }], [{
    key: 'content',
    value: function content() {
      var _this = this;

      this.div({ 'class': 'build-confirm overlay from-top' }, function () {
        _this.h3('You have unsaved changes');
        _this.div({ 'class': 'btn-container pull-right' }, function () {
          _this.button({ 'class': 'btn btn-success', outlet: 'saveBuildButton', title: 'Save and Build', click: 'saveAndConfirm' }, 'Save and build');
          _this.button({ 'class': 'btn btn-info', title: 'Build Without Saving', click: 'confirmWithoutSave' }, 'Build Without Saving');
        });
        _this.div({ 'class': 'btn-container pull-left' }, function () {
          _this.button({ 'class': 'btn btn-info', title: 'Cancel', click: 'cancel' }, 'Cancel');
        });
      });
    }
  }]);

  return SaveConfirmView;
})(_atomSpacePenViews.View);

exports['default'] = SaveConfirmView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9zYXZlLWNvbmZpcm0tdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7aUNBRXFCLHNCQUFzQjs7QUFGM0MsV0FBVyxDQUFDOztJQUlTLGVBQWU7WUFBZixlQUFlOztXQUFmLGVBQWU7MEJBQWYsZUFBZTs7K0JBQWYsZUFBZTs7O2VBQWYsZUFBZTs7V0FjM0IsbUJBQUc7QUFDUixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixVQUFJLENBQUMsUUFBUSxHQUFHLFNBQVMsQ0FBQztBQUMxQixVQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7QUFDZCxZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3JCLFlBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO09BQ25CO0tBQ0Y7OztXQUVHLGNBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRTtBQUN4QixVQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixVQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzs7QUFFekIsVUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztBQUN0QyxZQUFJLEVBQUUsSUFBSTtPQUNYLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDOUI7OztXQUVLLGtCQUFHO0FBQ1AsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ2YsVUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO0FBQ2pCLFlBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztPQUNqQjtLQUNGOzs7V0FFYSwwQkFBRztBQUNmLFVBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtBQUNsQixZQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3RCO0FBQ0QsVUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ2hCOzs7V0FFaUIsOEJBQUc7QUFDbkIsVUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO0FBQ2xCLFlBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7T0FDdkI7QUFDRCxVQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7S0FDaEI7OztXQW5EYSxtQkFBRzs7O0FBQ2YsVUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFNBQU8sZ0NBQWdDLEVBQUUsRUFBRSxZQUFNO0FBQzFELGNBQUssRUFBRSxDQUFDLDBCQUEwQixDQUFDLENBQUM7QUFDcEMsY0FBSyxHQUFHLENBQUMsRUFBRSxTQUFPLDBCQUEwQixFQUFFLEVBQUUsWUFBTTtBQUNwRCxnQkFBSyxNQUFNLENBQUMsRUFBRSxTQUFPLGlCQUFpQixFQUFFLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztBQUN6SSxnQkFBSyxNQUFNLENBQUMsRUFBRSxTQUFPLGNBQWMsRUFBRSxLQUFLLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLG9CQUFvQixFQUFFLEVBQUUsc0JBQXNCLENBQUMsQ0FBQztTQUM1SCxDQUFDLENBQUM7QUFDSCxjQUFLLEdBQUcsQ0FBQyxFQUFFLFNBQU8seUJBQXlCLEVBQUUsRUFBRSxZQUFNO0FBQ25ELGdCQUFLLE1BQU0sQ0FBQyxFQUFFLFNBQU8sY0FBYyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3BGLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7U0Faa0IsZUFBZTs7O3FCQUFmLGVBQWUiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL3NhdmUtY29uZmlybS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCB7IFZpZXcgfSBmcm9tICdhdG9tLXNwYWNlLXBlbi12aWV3cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNhdmVDb25maXJtVmlldyBleHRlbmRzIFZpZXcge1xuICBzdGF0aWMgY29udGVudCgpIHtcbiAgICB0aGlzLmRpdih7IGNsYXNzOiAnYnVpbGQtY29uZmlybSBvdmVybGF5IGZyb20tdG9wJyB9LCAoKSA9PiB7XG4gICAgICB0aGlzLmgzKCdZb3UgaGF2ZSB1bnNhdmVkIGNoYW5nZXMnKTtcbiAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdidG4tY29udGFpbmVyIHB1bGwtcmlnaHQnIH0sICgpID0+IHtcbiAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0biBidG4tc3VjY2VzcycsIG91dGxldDogJ3NhdmVCdWlsZEJ1dHRvbicsIHRpdGxlOiAnU2F2ZSBhbmQgQnVpbGQnLCBjbGljazogJ3NhdmVBbmRDb25maXJtJyB9LCAnU2F2ZSBhbmQgYnVpbGQnKTtcbiAgICAgICAgdGhpcy5idXR0b24oeyBjbGFzczogJ2J0biBidG4taW5mbycsIHRpdGxlOiAnQnVpbGQgV2l0aG91dCBTYXZpbmcnLCBjbGljazogJ2NvbmZpcm1XaXRob3V0U2F2ZScgfSwgJ0J1aWxkIFdpdGhvdXQgU2F2aW5nJyk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGl2KHsgY2xhc3M6ICdidG4tY29udGFpbmVyIHB1bGwtbGVmdCcgfSwgKCkgPT4ge1xuICAgICAgICB0aGlzLmJ1dHRvbih7IGNsYXNzOiAnYnRuIGJ0bi1pbmZvJywgdGl0bGU6ICdDYW5jZWwnLCBjbGljazogJ2NhbmNlbCcgfSwgJ0NhbmNlbCcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuICAgIHRoaXMuY29uZmlybWNiID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY2FuY2VsY2IgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgc2hvdyhjb25maXJtY2IsIGNhbmNlbGNiKSB7XG4gICAgdGhpcy5jb25maXJtY2IgPSBjb25maXJtY2I7XG4gICAgdGhpcy5jYW5jZWxjYiA9IGNhbmNlbGNiO1xuXG4gICAgdGhpcy5wYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZFRvcFBhbmVsKHtcbiAgICAgIGl0ZW06IHRoaXNcbiAgICB9KTtcbiAgICB0aGlzLnNhdmVCdWlsZEJ1dHRvbi5mb2N1cygpO1xuICB9XG5cbiAgY2FuY2VsKCkge1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIGlmICh0aGlzLmNhbmNlbGNiKSB7XG4gICAgICB0aGlzLmNhbmNlbGNiKCk7XG4gICAgfVxuICB9XG5cbiAgc2F2ZUFuZENvbmZpcm0oKSB7XG4gICAgaWYgKHRoaXMuY29uZmlybWNiKSB7XG4gICAgICB0aGlzLmNvbmZpcm1jYih0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5kZXN0cm95KCk7XG4gIH1cblxuICBjb25maXJtV2l0aG91dFNhdmUoKSB7XG4gICAgaWYgKHRoaXMuY29uZmlybWNiKSB7XG4gICAgICB0aGlzLmNvbmZpcm1jYihmYWxzZSk7XG4gICAgfVxuICAgIHRoaXMuZGVzdHJveSgpO1xuICB9XG59XG4iXX0=