(function() {
  var clangSourceScopeDictionary;

  clangSourceScopeDictionary = {
    'source.cpp': 'c++',
    'source.c': 'c',
    'source.objc': 'objective-c',
    'source.objcpp': 'objective-c++',
    'source.c++': 'c++',
    'source.objc++': 'objective-c++'
  };

  module.exports = {
    getFirstCursorSourceScopeLang: function(editor) {
      var scopes;
      scopes = this.getFirstCursorScopes(editor);
      return this.getSourceScopeLang(scopes);
    },
    getFirstCursorScopes: function(editor) {
      var firstPosition, scopeDescriptor, scopes;
      if (editor.getCursors) {
        firstPosition = editor.getCursors()[0].getBufferPosition();
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(firstPosition);
        return scopes = scopeDescriptor.getScopesArray();
      } else {
        return scopes = [];
      }
    },
    getSourceScopeLang: function(scopes, scopeDictionary) {
      var i, lang, len, scope;
      if (scopeDictionary == null) {
        scopeDictionary = clangSourceScopeDictionary;
      }
      lang = null;
      for (i = 0, len = scopes.length; i < len; i++) {
        scope = scopes[i];
        if (scope in scopeDictionary) {
          return scopeDictionary[scope];
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL2xpYi91dGlsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsMEJBQUEsR0FBNkI7SUFDM0IsWUFBQSxFQUFrQixLQURTO0lBRTNCLFVBQUEsRUFBa0IsR0FGUztJQUczQixhQUFBLEVBQWtCLGFBSFM7SUFJM0IsZUFBQSxFQUFrQixlQUpTO0lBTzNCLFlBQUEsRUFBa0IsS0FQUztJQVEzQixlQUFBLEVBQWtCLGVBUlM7OztFQVc3QixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsNkJBQUEsRUFBK0IsU0FBQyxNQUFEO0FBQzdCLFVBQUE7TUFBQSxNQUFBLEdBQVMsSUFBQyxDQUFBLG9CQUFELENBQXNCLE1BQXRCO0FBQ1QsYUFBTyxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsTUFBcEI7SUFGc0IsQ0FBL0I7SUFJQSxvQkFBQSxFQUFzQixTQUFDLE1BQUQ7QUFDcEIsVUFBQTtNQUFBLElBQUcsTUFBTSxDQUFDLFVBQVY7UUFDRSxhQUFBLEdBQWdCLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBb0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxpQkFBdkIsQ0FBQTtRQUNoQixlQUFBLEdBQWtCLE1BQU0sQ0FBQyxnQ0FBUCxDQUF3QyxhQUF4QztlQUNsQixNQUFBLEdBQVMsZUFBZSxDQUFDLGNBQWhCLENBQUEsRUFIWDtPQUFBLE1BQUE7ZUFLRSxNQUFBLEdBQVMsR0FMWDs7SUFEb0IsQ0FKdEI7SUFZQSxrQkFBQSxFQUFvQixTQUFDLE1BQUQsRUFBUyxlQUFUO0FBQ2xCLFVBQUE7O1FBRDJCLGtCQUFnQjs7TUFDM0MsSUFBQSxHQUFPO0FBQ1AsV0FBQSx3Q0FBQTs7UUFDRSxJQUFHLEtBQUEsSUFBUyxlQUFaO0FBQ0UsaUJBQU8sZUFBZ0IsQ0FBQSxLQUFBLEVBRHpCOztBQURGO0lBRmtCLENBWnBCOztBQVpGIiwic291cmNlc0NvbnRlbnQiOlsiY2xhbmdTb3VyY2VTY29wZURpY3Rpb25hcnkgPSB7XG4gICdzb3VyY2UuY3BwJyAgICA6ICdjKysnICxcbiAgJ3NvdXJjZS5jJyAgICAgIDogJ2MnICxcbiAgJ3NvdXJjZS5vYmpjJyAgIDogJ29iamVjdGl2ZS1jJyAsXG4gICdzb3VyY2Uub2JqY3BwJyA6ICdvYmplY3RpdmUtYysrJyAsXG5cbiAgIyBGb3IgYmFja3dhcmQtY29tcGF0aWJpbGl0eSB3aXRoIHZlcnNpb25zIG9mIEF0b20gPCAwLjE2NlxuICAnc291cmNlLmMrKycgICAgOiAnYysrJyAsXG4gICdzb3VyY2Uub2JqYysrJyA6ICdvYmplY3RpdmUtYysrJyAsXG59XG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZ2V0Rmlyc3RDdXJzb3JTb3VyY2VTY29wZUxhbmc6IChlZGl0b3IpIC0+XG4gICAgc2NvcGVzID0gQGdldEZpcnN0Q3Vyc29yU2NvcGVzIGVkaXRvclxuICAgIHJldHVybiBAZ2V0U291cmNlU2NvcGVMYW5nIHNjb3Blc1xuXG4gIGdldEZpcnN0Q3Vyc29yU2NvcGVzOiAoZWRpdG9yKSAtPlxuICAgIGlmIGVkaXRvci5nZXRDdXJzb3JzXG4gICAgICBmaXJzdFBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvcnMoKVswXS5nZXRCdWZmZXJQb3NpdGlvbigpXG4gICAgICBzY29wZURlc2NyaXB0b3IgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oZmlyc3RQb3NpdGlvbilcbiAgICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG4gICAgZWxzZVxuICAgICAgc2NvcGVzID0gW11cblxuICBnZXRTb3VyY2VTY29wZUxhbmc6IChzY29wZXMsIHNjb3BlRGljdGlvbmFyeT1jbGFuZ1NvdXJjZVNjb3BlRGljdGlvbmFyeSkgLT5cbiAgICBsYW5nID0gbnVsbFxuICAgIGZvciBzY29wZSBpbiBzY29wZXNcbiAgICAgIGlmIHNjb3BlIG9mIHNjb3BlRGljdGlvbmFyeVxuICAgICAgICByZXR1cm4gc2NvcGVEaWN0aW9uYXJ5W3Njb3BlXVxuIl19
