(function() {
  var LocationSelectList, SelectListView, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  SelectListView = require('atom-space-pen-views').SelectListView;

  path = require('path');

  module.exports = LocationSelectList = (function(superClass) {
    extend(LocationSelectList, superClass);

    function LocationSelectList() {
      return LocationSelectList.__super__.constructor.apply(this, arguments);
    }

    LocationSelectList.prototype.initialize = function(editor, callback) {
      LocationSelectList.__super__.initialize.apply(this, arguments);
      this.addClass('overlay from-top');
      this.editor = editor;
      this.callback = callback;
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    LocationSelectList.prototype.viewForItem = function(item) {
      var f;
      if (item[0] === '<stdin>') {
        return "<li class=\"event\">" + item[1] + ":" + item[2] + "</li>";
      } else {
        f = path.join(item[0]);
        return "<li class=\"event\">" + f + "  " + item[1] + ":" + item[2] + "</li>";
      }
    };

    LocationSelectList.prototype.hide = function() {
      var ref;
      return (ref = this.panel) != null ? ref.hide() : void 0;
    };

    LocationSelectList.prototype.show = function() {
      this.storeFocusedElement();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.focusFilterEditor();
    };

    LocationSelectList.prototype.toggle = function() {
      var ref;
      if ((ref = this.panel) != null ? ref.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    LocationSelectList.prototype.confirmed = function(item) {
      this.cancel();
      return this.callback(this.editor, item);
    };

    LocationSelectList.prototype.cancelled = function() {
      return this.hide();
    };

    return LocationSelectList;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi9sb2NhdGlvbi1zZWxlY3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHdDQUFBO0lBQUE7OztFQUFDLGlCQUFrQixPQUFBLENBQVEsc0JBQVI7O0VBQ25CLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O2lDQUNKLFVBQUEsR0FBWSxTQUFDLE1BQUQsRUFBUyxRQUFUO01BQ1Ysb0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsa0JBQVY7TUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO01BQ1YsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxtQkFBRCxDQUFBOztRQUNBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFSVTs7aUNBVVosV0FBQSxHQUFhLFNBQUMsSUFBRDtBQUNYLFVBQUE7TUFBQSxJQUFHLElBQUssQ0FBQSxDQUFBLENBQUwsS0FBVyxTQUFkO2VBQ0Usc0JBQUEsR0FBdUIsSUFBSyxDQUFBLENBQUEsQ0FBNUIsR0FBK0IsR0FBL0IsR0FBa0MsSUFBSyxDQUFBLENBQUEsQ0FBdkMsR0FBMEMsUUFENUM7T0FBQSxNQUFBO1FBR0UsQ0FBQSxHQUFJLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSyxDQUFBLENBQUEsQ0FBZjtlQUNKLHNCQUFBLEdBQXVCLENBQXZCLEdBQXlCLElBQXpCLEdBQTZCLElBQUssQ0FBQSxDQUFBLENBQWxDLEdBQXFDLEdBQXJDLEdBQXdDLElBQUssQ0FBQSxDQUFBLENBQTdDLEdBQWdELFFBSmxEOztJQURXOztpQ0FPYixJQUFBLEdBQU0sU0FBQTtBQUFHLFVBQUE7NkNBQU0sQ0FBRSxJQUFSLENBQUE7SUFBSDs7aUNBRU4sSUFBQSxHQUFNLFNBQUE7TUFDSixJQUFDLENBQUEsbUJBQUQsQ0FBQTs7UUFDQSxJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBSkk7O2lDQU1OLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLG9DQUFTLENBQUUsU0FBUixDQUFBLFVBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUhGOztJQURNOztpQ0FNUixTQUFBLEdBQVcsU0FBQyxJQUFEO01BQ1QsSUFBQyxDQUFBLE1BQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLE1BQVgsRUFBbUIsSUFBbkI7SUFGUzs7aUNBSVgsU0FBQSxHQUFXLFNBQUE7YUFDVCxJQUFDLENBQUEsSUFBRCxDQUFBO0lBRFM7Ozs7S0FwQ29CO0FBSmpDIiwic291cmNlc0NvbnRlbnQiOlsie1NlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIExvY2F0aW9uU2VsZWN0TGlzdCBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChlZGl0b3IsIGNhbGxiYWNrKS0+XG4gICAgc3VwZXJcbiAgICBAYWRkQ2xhc3MoJ292ZXJsYXkgZnJvbS10b3AnKVxuICAgIEBlZGl0b3IgPSBlZGl0b3JcbiAgICBAY2FsbGJhY2sgPSBjYWxsYmFja1xuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIHZpZXdGb3JJdGVtOiAoaXRlbSkgLT5cbiAgICBpZiBpdGVtWzBdIGlzICc8c3RkaW4+J1xuICAgICAgXCI8bGkgY2xhc3M9XFxcImV2ZW50XFxcIj4je2l0ZW1bMV19OiN7aXRlbVsyXX08L2xpPlwiXG4gICAgZWxzZVxuICAgICAgZiA9IHBhdGguam9pbihpdGVtWzBdKVxuICAgICAgXCI8bGkgY2xhc3M9XFxcImV2ZW50XFxcIj4je2Z9ICAje2l0ZW1bMV19OiN7aXRlbVsyXX08L2xpPlwiXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5oaWRlKClcblxuICBzaG93OiAtPlxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIHRvZ2dsZTogLT5cbiAgICBpZiBAcGFuZWw/LmlzVmlzaWJsZSgpXG4gICAgICBAY2FuY2VsKClcbiAgICBlbHNlXG4gICAgICBAc2hvdygpXG5cbiAgY29uZmlybWVkOiAoaXRlbSkgLT5cbiAgICBAY2FuY2VsKClcbiAgICBAY2FsbGJhY2soQGVkaXRvciwgaXRlbSlcblxuICBjYW5jZWxsZWQ6IC0+XG4gICAgQGhpZGUoKVxuIl19
