(function() {
  var CompositeDisposable, NiceIndex, path;

  CompositeDisposable = require('atom').CompositeDisposable;

  path = require('path');

  module.exports = NiceIndex = {
    subscriptions: null,
    config: {
      fileNames: {
        type: 'array',
        "default": ['index\\.'],
        description: "Regex patterns of file names to match",
        items: {
          type: 'string'
        }
      }
    },
    activate: function(state) {
      this.subscriptions = new CompositeDisposable;
      this.renameTabs = this.renameTabs.bind(this);
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this.subscriptions.add(editor.onDidDestroy(_this.renameTabs));
          _this.subscriptions.add(editor.onDidChangePath(_this.renameTabs));
          return _this.subscriptions.add(editor.onDidChangeTitle(_this.renameTabs));
        };
      })(this));
      atom.workspace.observePanes((function(_this) {
        return function(pane) {
          _this.subscriptions.add(pane.onDidMoveItem(_this.renameTabs));
          _this.subscriptions.add(pane.onDidAddItem(_this.renameTabs));
          return _this.subscriptions.add(pane.onDidRemoveItem(_this.renameTabs));
        };
      })(this));
      this.subscriptions.add(atom.workspace.onDidOpen(this.renameTabs));
      return setTimeout(this.renameTabs, 1234);
    },
    deactivate: function() {
      return this.subscriptions.dispose();
    },
    renameTabs: function() {
      var elements, fileNames, regex;
      elements = this.getElementsArray('li.tab .title');
      fileNames = atom.config.get('nice-index.fileNames');
      regex = new RegExp('^(' + fileNames.join('|') + ')');
      return elements.forEach((function(_this) {
        return function(el) {
          var ref;
          if ((ref = el.getAttribute('data-name')) != null ? ref.match(regex) : void 0) {
            return el.innerText = '/' + _this.getDirectoryName(el);
          }
        };
      })(this));
    },
    getDirectoryName: function(el) {
      var dir, dirs;
      dir = path.dirname(el.getAttribute('data-path'));
      dirs = dir.split(path.sep);
      return dirs[dirs.length - 1];
    },
    getElementsArray: function(selector) {
      return [].slice.call(document.querySelectorAll(selector));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvbmljZS1pbmRleC9saWIvbmljZS1pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFDLHNCQUF1QixPQUFBLENBQVEsTUFBUjs7RUFDeEIsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUdQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUEsR0FDZjtJQUFBLGFBQUEsRUFBZSxJQUFmO0lBRUEsTUFBQSxFQUNFO01BQUEsU0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLENBQ1AsVUFETyxDQURUO1FBSUEsV0FBQSxFQUFhLHVDQUpiO1FBS0EsS0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFFBQU47U0FORjtPQURGO0tBSEY7SUFZQSxRQUFBLEVBQVUsU0FBQyxLQUFEO01BQ1IsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtNQUVyQixJQUFDLENBQUEsVUFBRCxHQUFjLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQixJQUFqQjtNQUVkLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7VUFDaEMsS0FBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE1BQU0sQ0FBQyxZQUFQLENBQW9CLEtBQUMsQ0FBQSxVQUFyQixDQUFuQjtVQUNBLEtBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixNQUFNLENBQUMsZUFBUCxDQUF1QixLQUFDLENBQUEsVUFBeEIsQ0FBbkI7aUJBQ0EsS0FBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixLQUFDLENBQUEsVUFBekIsQ0FBbkI7UUFIZ0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxDO01BS0EsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFmLENBQTRCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQzFCLEtBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsYUFBTCxDQUFtQixLQUFDLENBQUEsVUFBcEIsQ0FBbkI7VUFDQSxLQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsS0FBQyxDQUFBLFVBQW5CLENBQW5CO2lCQUNBLEtBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsZUFBTCxDQUFxQixLQUFDLENBQUEsVUFBdEIsQ0FBbkI7UUFIMEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVCO01BS0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBZixDQUF5QixJQUFDLENBQUEsVUFBMUIsQ0FBbkI7YUFFQSxVQUFBLENBQVcsSUFBQyxDQUFBLFVBQVosRUFBd0IsSUFBeEI7SUFqQlEsQ0FaVjtJQWdDQSxVQUFBLEVBQVksU0FBQTthQUNWLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0lBRFUsQ0FoQ1o7SUFvQ0EsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsUUFBQSxHQUFXLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixlQUFsQjtNQUVYLFNBQUEsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCO01BQ1osS0FBQSxHQUFRLElBQUksTUFBSixDQUFXLElBQUEsR0FBTyxTQUFTLENBQUMsSUFBVixDQUFlLEdBQWYsQ0FBUCxHQUE2QixHQUF4QzthQUVSLFFBQVEsQ0FBQyxPQUFULENBQWlCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxFQUFEO0FBRWYsY0FBQTtVQUFBLHNEQUErQixDQUFFLEtBQTlCLENBQW9DLEtBQXBDLFVBQUg7bUJBQ0UsRUFBRSxDQUFDLFNBQUgsR0FBZSxHQUFBLEdBQU0sS0FBQyxDQUFBLGdCQUFELENBQWtCLEVBQWxCLEVBRHZCOztRQUZlO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtJQU5VLENBcENaO0lBK0NBLGdCQUFBLEVBQWtCLFNBQUMsRUFBRDtBQUNoQixVQUFBO01BQUEsR0FBQSxHQUFNLElBQUksQ0FBQyxPQUFMLENBQWEsRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsV0FBaEIsQ0FBYjtNQUNOLElBQUEsR0FBTyxHQUFHLENBQUMsS0FBSixDQUFVLElBQUksQ0FBQyxHQUFmO0FBQ1AsYUFBTyxJQUFLLENBQUEsSUFBSSxDQUFDLE1BQUwsR0FBYyxDQUFkO0lBSEksQ0EvQ2xCO0lBcURBLGdCQUFBLEVBQWtCLFNBQUMsUUFBRDtBQUNoQixhQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBVCxDQUFjLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixRQUExQixDQUFkO0lBRFMsQ0FyRGxCOztBQUxGIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcblxuXG5tb2R1bGUuZXhwb3J0cyA9IE5pY2VJbmRleCA9XG4gIHN1YnNjcmlwdGlvbnM6IG51bGxcblxuICBjb25maWc6XG4gICAgZmlsZU5hbWVzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDogW1xuICAgICAgICAnaW5kZXhcXFxcLidcbiAgICAgIF1cbiAgICAgIGRlc2NyaXB0aW9uOiBcIlJlZ2V4IHBhdHRlcm5zIG9mIGZpbGUgbmFtZXMgdG8gbWF0Y2hcIlxuICAgICAgaXRlbXM6XG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbiAgICBAcmVuYW1lVGFicyA9IEByZW5hbWVUYWJzLmJpbmQoQClcblxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIGVkaXRvci5vbkRpZERlc3Ryb3kgQHJlbmFtZVRhYnNcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBlZGl0b3Iub25EaWRDaGFuZ2VQYXRoIEByZW5hbWVUYWJzXG4gICAgICBAc3Vic2NyaXB0aW9ucy5hZGQgZWRpdG9yLm9uRGlkQ2hhbmdlVGl0bGUgQHJlbmFtZVRhYnNcblxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVQYW5lcyAocGFuZSkgPT5cbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBwYW5lLm9uRGlkTW92ZUl0ZW0gQHJlbmFtZVRhYnNcbiAgICAgIEBzdWJzY3JpcHRpb25zLmFkZCBwYW5lLm9uRGlkQWRkSXRlbSBAcmVuYW1lVGFic1xuICAgICAgQHN1YnNjcmlwdGlvbnMuYWRkIHBhbmUub25EaWRSZW1vdmVJdGVtIEByZW5hbWVUYWJzXG5cbiAgICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS53b3Jrc3BhY2Uub25EaWRPcGVuKEByZW5hbWVUYWJzKVxuXG4gICAgc2V0VGltZW91dCBAcmVuYW1lVGFicywgMTIzNFxuXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcblxuXG4gIHJlbmFtZVRhYnM6IC0+XG4gICAgZWxlbWVudHMgPSBAZ2V0RWxlbWVudHNBcnJheSAnbGkudGFiIC50aXRsZSdcblxuICAgIGZpbGVOYW1lcyA9IGF0b20uY29uZmlnLmdldCgnbmljZS1pbmRleC5maWxlTmFtZXMnKVxuICAgIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnXignICsgZmlsZU5hbWVzLmpvaW4oJ3wnKSArICcpJylcblxuICAgIGVsZW1lbnRzLmZvckVhY2ggKGVsKSA9PlxuICAgICAgIyBNYXRjaCBhbnkgYGluZGV4LmAgZmlsZVxuICAgICAgaWYgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLW5hbWUnKT8ubWF0Y2gocmVnZXgpXG4gICAgICAgIGVsLmlubmVyVGV4dCA9ICcvJyArIEBnZXREaXJlY3RvcnlOYW1lKGVsKVxuXG4gIGdldERpcmVjdG9yeU5hbWU6IChlbCkgLT5cbiAgICBkaXIgPSBwYXRoLmRpcm5hbWUgZWwuZ2V0QXR0cmlidXRlKCdkYXRhLXBhdGgnKVxuICAgIGRpcnMgPSBkaXIuc3BsaXQgcGF0aC5zZXBcbiAgICByZXR1cm4gZGlyc1tkaXJzLmxlbmd0aCAtIDFdXG5cblxuICBnZXRFbGVtZW50c0FycmF5OiAoc2VsZWN0b3IpIC0+XG4gICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwgZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvcilcbiJdfQ==
