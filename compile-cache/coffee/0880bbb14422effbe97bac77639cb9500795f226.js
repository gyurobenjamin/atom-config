(function() {
  var $$$, TextEditorView, View, ref;

  ref = require('atom-space-pen-views'), $$$ = ref.$$$, View = ref.View, TextEditorView = ref.TextEditorView;

  module.exports = function() {
    return this.div({
      tabIndex: -1,
      "class": 'atomts-rename-view'
    }, (function(_this) {
      return function() {
        _this.div({
          "class": 'block'
        }, function() {
          return _this.div(function() {
            _this.span({
              outlet: 'title'
            }, function() {
              return 'Rename Variable';
            });
            return _this.span({
              "class": 'subtle-info-message'
            }, function() {
              _this.span('Close this panel with ');
              _this.span({
                "class": 'highlight'
              }, 'esc');
              _this.span(' key. And commit with the ');
              _this.span({
                "class": 'highlight'
              }, 'enter');
              return _this.span('key.');
            });
          });
        });
        _this.div({
          "class": 'find-container block'
        }, function() {
          return _this.div({
            "class": 'editor-container'
          }, function() {
            return _this.subview('newNameEditor', new TextEditorView({
              mini: true,
              placeholderText: 'new name'
            }));
          });
        });
        return _this.div({
          "class": 'highlight-error',
          style: 'display:none',
          outlet: 'validationMessage'
        });
      };
    })(this));
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYXRvbS10eXBlc2NyaXB0L3ZpZXdzL3JlbmFtZVZpZXcuaHRtbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQThCLE9BQUEsQ0FBUSxzQkFBUixDQUE5QixFQUFDLGFBQUQsRUFBTSxlQUFOLEVBQVk7O0VBRVosTUFBTSxDQUFDLE9BQVAsR0FDSSxTQUFBO1dBQ0ksSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFBLFFBQUEsRUFBVSxDQUFDLENBQVg7TUFBYyxDQUFBLEtBQUEsQ0FBQSxFQUFPLG9CQUFyQjtLQUFMLEVBQWdELENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUM1QyxLQUFDLENBQUEsR0FBRCxDQUFLO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxPQUFQO1NBQUwsRUFBcUIsU0FBQTtpQkFDakIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO1lBQ0QsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFDLE1BQUEsRUFBUSxPQUFUO2FBQU4sRUFBeUIsU0FBQTtxQkFBRztZQUFILENBQXpCO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHFCQUFQO2FBQU4sRUFBb0MsU0FBQTtjQUNoQyxLQUFDLENBQUEsSUFBRCxDQUFNLHdCQUFOO2NBQ0EsS0FBQyxDQUFBLElBQUQsQ0FBTTtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFNLFdBQU47ZUFBTixFQUF5QixLQUF6QjtjQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sNEJBQU47Y0FDQSxLQUFDLENBQUEsSUFBRCxDQUFNO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU0sV0FBTjtlQUFOLEVBQXlCLE9BQXpCO3FCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sTUFBTjtZQUxnQyxDQUFwQztVQUZDLENBQUw7UUFEaUIsQ0FBckI7UUFVQSxLQUFDLENBQUEsR0FBRCxDQUFLO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxzQkFBUDtTQUFMLEVBQW9DLFNBQUE7aUJBQ2hDLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGtCQUFQO1dBQUwsRUFBZ0MsU0FBQTttQkFDNUIsS0FBQyxDQUFBLE9BQUQsQ0FBUyxlQUFULEVBQThCLElBQUEsY0FBQSxDQUFlO2NBQUEsSUFBQSxFQUFNLElBQU47Y0FBWSxlQUFBLEVBQWlCLFVBQTdCO2FBQWYsQ0FBOUI7VUFENEIsQ0FBaEM7UUFEZ0MsQ0FBcEM7ZUFJQSxLQUFDLENBQUEsR0FBRCxDQUFLO1VBQUMsQ0FBQSxLQUFBLENBQUEsRUFBTyxpQkFBUjtVQUEyQixLQUFBLEVBQU0sY0FBakM7VUFBaUQsTUFBQSxFQUFPLG1CQUF4RDtTQUFMO01BZjRDO0lBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRDtFQURKO0FBSEoiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQkLCBWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuICAgIC0+XG4gICAgICAgIEBkaXYgdGFiSW5kZXg6IC0xLCBjbGFzczogJ2F0b210cy1yZW5hbWUtdmlldycsID0+XG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnYmxvY2snLCA9PlxuICAgICAgICAgICAgICAgIEBkaXYgPT5cbiAgICAgICAgICAgICAgICAgICAgQHNwYW4ge291dGxldDogJ3RpdGxlJ30sID0+ICdSZW5hbWUgVmFyaWFibGUnXG4gICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOiAnc3VidGxlLWluZm8tbWVzc2FnZScsID0+XG4gICAgICAgICAgICAgICAgICAgICAgICBAc3BhbiAnQ2xvc2UgdGhpcyBwYW5lbCB3aXRoICdcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuIGNsYXNzOidoaWdobGlnaHQnLCAnZXNjJ1xuICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gJyBrZXkuIEFuZCBjb21taXQgd2l0aCB0aGUgJ1xuICAgICAgICAgICAgICAgICAgICAgICAgQHNwYW4gY2xhc3M6J2hpZ2hsaWdodCcsICdlbnRlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIEBzcGFuICdrZXkuJ1xuXG4gICAgICAgICAgICBAZGl2IGNsYXNzOiAnZmluZC1jb250YWluZXIgYmxvY2snLCA9PlxuICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdlZGl0b3ItY29udGFpbmVyJywgPT5cbiAgICAgICAgICAgICAgICAgICAgQHN1YnZpZXcgJ25ld05hbWVFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiAnbmV3IG5hbWUnKVxuXG4gICAgICAgICAgICBAZGl2IHtjbGFzczogJ2hpZ2hsaWdodC1lcnJvcicsIHN0eWxlOidkaXNwbGF5Om5vbmUnLCBvdXRsZXQ6J3ZhbGlkYXRpb25NZXNzYWdlJ30sXG4iXX0=
