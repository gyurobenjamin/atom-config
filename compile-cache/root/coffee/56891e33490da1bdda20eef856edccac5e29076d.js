(function() {
  var Disposable, Linter;

  Disposable = require('atom').Disposable;

  module.exports = Linter = {
    instance: null,
    config: {
      lintOnFly: {
        title: 'Lint As You Type',
        description: 'Lint files while typing, without the need to save',
        type: 'boolean',
        "default": true,
        order: 1
      },
      lintOnFlyInterval: {
        title: 'Lint As You Type Interval',
        description: 'Interval at which providers are triggered as you type (in ms)',
        type: 'integer',
        "default": 300,
        order: 1
      },
      ignoredMessageTypes: {
        description: 'Comma separated list of message types to completely ignore',
        type: 'array',
        "default": [],
        items: {
          type: 'string'
        },
        order: 2
      },
      ignoreVCSIgnoredFiles: {
        title: 'Do Not Lint Files Ignored by VCS',
        description: 'E.g., ignore files specified in .gitignore',
        type: 'boolean',
        "default": true,
        order: 2
      },
      ignoreMatchedFiles: {
        title: 'Do Not Lint Files that match this Glob',
        type: 'string',
        "default": '/**/*.min.{js,css}',
        order: 2
      },
      showErrorInline: {
        title: 'Show Inline Error Tooltips',
        type: 'boolean',
        "default": true,
        order: 3
      },
      inlineTooltipInterval: {
        title: 'Inline Tooltip Interval',
        description: 'Interval at which inline tooltip is updated (in ms)',
        type: 'integer',
        "default": 60,
        order: 3
      },
      gutterEnabled: {
        title: 'Highlight Error Lines in Gutter',
        type: 'boolean',
        "default": true,
        order: 3
      },
      gutterPosition: {
        title: 'Position of Gutter Highlights',
        "enum": ['Left', 'Right'],
        "default": 'Right',
        order: 3,
        type: 'string'
      },
      underlineIssues: {
        title: 'Underline Issues',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showProviderName: {
        title: 'Show Provider Name (When Available)',
        type: 'boolean',
        "default": true,
        order: 3
      },
      showErrorPanel: {
        title: 'Show Error Panel',
        description: 'Show a list of errors at the bottom of the editor',
        type: 'boolean',
        "default": true,
        order: 4
      },
      errorPanelHeight: {
        title: 'Error Panel Height',
        description: 'Height of the error panel (in px)',
        type: 'number',
        "default": 150,
        order: 4
      },
      alwaysTakeMinimumSpace: {
        title: 'Automatically Reduce Error Panel Height',
        description: 'Reduce panel height when it exceeds the height of the error list',
        type: 'boolean',
        "default": true,
        order: 4
      },
      displayLinterInfo: {
        title: 'Display Linter Info in the Status Bar',
        description: 'Whether to show any linter information in the status bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      displayLinterStatus: {
        title: 'Display Linter Status Info in Status Bar',
        description: 'The `No Issues` or `X Issues` widget',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabLine: {
        title: 'Show "Line" Tab in the Status Bar',
        type: 'boolean',
        "default": false,
        order: 5
      },
      showErrorTabFile: {
        title: 'Show "File" Tab in the Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      showErrorTabProject: {
        title: 'Show "Project" Tab in the Status Bar',
        type: 'boolean',
        "default": true,
        order: 5
      },
      statusIconScope: {
        title: 'Scope of Linter Messages to Show in Status Icon',
        type: 'string',
        "enum": ['File', 'Line', 'Project'],
        "default": 'Project',
        order: 5
      },
      statusIconPosition: {
        title: 'Position of Status Icon in the Status Bar',
        "enum": ['Left', 'Right'],
        type: 'string',
        "default": 'Left',
        order: 5
      }
    },
    activate: function(state) {
      var LinterPlus;
      Linter.state = state;
      LinterPlus = require('./linter.coffee');
      return this.instance = new LinterPlus(state);
    },
    serialize: function() {
      return Linter.state;
    },
    consumeLinter: function(linters) {
      var i, len, linter;
      if (!(linters instanceof Array)) {
        linters = [linters];
      }
      for (i = 0, len = linters.length; i < len; i++) {
        linter = linters[i];
        this.instance.addLinter(linter);
      }
      return new Disposable((function(_this) {
        return function() {
          var j, len1, results;
          results = [];
          for (j = 0, len1 = linters.length; j < len1; j++) {
            linter = linters[j];
            results.push(_this.instance.deleteLinter(linter));
          }
          return results;
        };
      })(this));
    },
    consumeStatusBar: function(statusBar) {
      return this.instance.views.attachBottom(statusBar);
    },
    provideLinter: function() {
      return this.instance;
    },
    provideIndie: function() {
      var ref;
      return (ref = this.instance) != null ? ref.indieLinters : void 0;
    },
    deactivate: function() {
      var ref;
      return (ref = this.instance) != null ? ref.deactivate() : void 0;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvbGludGVyL2xpYi9tYWluLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsYUFBYyxPQUFBLENBQVEsTUFBUjs7RUFDZixNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFBLEdBQ2Y7SUFBQSxRQUFBLEVBQVUsSUFBVjtJQUNBLE1BQUEsRUFDRTtNQUFBLFNBQUEsRUFDRTtRQUFBLEtBQUEsRUFBTyxrQkFBUDtRQUNBLFdBQUEsRUFBYSxtREFEYjtRQUVBLElBQUEsRUFBTSxTQUZOO1FBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1FBSUEsS0FBQSxFQUFPLENBSlA7T0FERjtNQU1BLGlCQUFBLEVBQ0U7UUFBQSxLQUFBLEVBQU8sMkJBQVA7UUFDQSxXQUFBLEVBQWEsK0RBRGI7UUFFQSxJQUFBLEVBQU0sU0FGTjtRQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsR0FIVDtRQUlBLEtBQUEsRUFBTyxDQUpQO09BUEY7TUFhQSxtQkFBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLDREQUFiO1FBQ0EsSUFBQSxFQUFNLE9BRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRlQ7UUFHQSxLQUFBLEVBQ0U7VUFBQSxJQUFBLEVBQU0sUUFBTjtTQUpGO1FBS0EsS0FBQSxFQUFPLENBTFA7T0FkRjtNQW9CQSxxQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLGtDQUFQO1FBQ0EsV0FBQSxFQUFhLDRDQURiO1FBRUEsSUFBQSxFQUFNLFNBRk47UUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFQ7UUFJQSxLQUFBLEVBQU8sQ0FKUDtPQXJCRjtNQTBCQSxrQkFBQSxFQUNFO1FBQUEsS0FBQSxFQUFPLHdDQUFQO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLG9CQUZUO1FBR0EsS0FBQSxF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Q0FBQSxRQUFRLENBQUMsS0FBSyxDQUFDLFlBQWhCLENBQTZCLFNBQTdCO0lBRGdCLENBakpsQjtJQW9KQSxhQUFBLEVBQWUsU0FBQTthQUNiLElBQUMsQ0FBQTtJQURZLENBcEpmO0lBdUpBLFlBQUEsRUFBYyxTQUFBO0FBQ1osVUFBQTtnREFBUyxDQUFFO0lBREMsQ0F2SmQ7SUEwSkEsVUFBQSxFQUFZLFNBQUE7QUFDVixVQUFBO2dEQUFTLENBQUUsVUFBWCxDQUFBO0lBRFUsQ0ExSlo7O0FBRkYiLCJzb3VyY2VzQ29udGVudCI6WyJ7RGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJylcbm1vZHVsZS5leHBvcnRzID0gTGludGVyID1cbiAgaW5zdGFuY2U6IG51bGxcbiAgY29uZmlnOlxuICAgIGxpbnRPbkZseTpcbiAgICAgIHRpdGxlOiAnTGludCBBcyBZb3UgVHlwZSdcbiAgICAgIGRlc2NyaXB0aW9uOiAnTGludCBmaWxlcyB3aGlsZSB0eXBpbmcsIHdpdGhvdXQgdGhlIG5lZWQgdG8gc2F2ZSdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDFcbiAgICBsaW50T25GbHlJbnRlcnZhbDpcbiAgICAgIHRpdGxlOiAnTGludCBBcyBZb3UgVHlwZSBJbnRlcnZhbCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnSW50ZXJ2YWwgYXQgd2hpY2ggcHJvdmlkZXJzIGFyZSB0cmlnZ2VyZWQgYXMgeW91IHR5cGUgKGluIG1zKSdcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogMzAwXG4gICAgICBvcmRlcjogMVxuXG4gICAgaWdub3JlZE1lc3NhZ2VUeXBlczpcbiAgICAgIGRlc2NyaXB0aW9uOiAnQ29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgbWVzc2FnZSB0eXBlcyB0byBjb21wbGV0ZWx5IGlnbm9yZSdcbiAgICAgIHR5cGU6ICdhcnJheSdcbiAgICAgIGRlZmF1bHQ6IFtdXG4gICAgICBpdGVtczpcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIG9yZGVyOiAyXG4gICAgaWdub3JlVkNTSWdub3JlZEZpbGVzOlxuICAgICAgdGl0bGU6ICdEbyBOb3QgTGludCBGaWxlcyBJZ25vcmVkIGJ5IFZDUydcbiAgICAgIGRlc2NyaXB0aW9uOiAnRS5nLiwgaWdub3JlIGZpbGVzIHNwZWNpZmllZCBpbiAuZ2l0aWdub3JlJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogMlxuICAgIGlnbm9yZU1hdGNoZWRGaWxlczpcbiAgICAgIHRpdGxlOiAnRG8gTm90IExpbnQgRmlsZXMgdGhhdCBtYXRjaCB0aGlzIEdsb2InXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJy8qKi8qLm1pbi57anMsY3NzfSdcbiAgICAgIG9yZGVyOiAyXG5cbiAgICBzaG93RXJyb3JJbmxpbmU6XG4gICAgICB0aXRsZTogJ1Nob3cgSW5saW5lIEVycm9yIFRvb2x0aXBzJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogM1xuICAgIGlubGluZVRvb2x0aXBJbnRlcnZhbDpcbiAgICAgIHRpdGxlOiAnSW5saW5lIFRvb2x0aXAgSW50ZXJ2YWwnXG4gICAgICBkZXNjcmlwdGlvbjogJ0ludGVydmFsIGF0IHdoaWNoIGlubGluZSB0b29sdGlwIGlzIHVwZGF0ZWQgKGluIG1zKSdcbiAgICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgICAgZGVmYXVsdDogNjBcbiAgICAgIG9yZGVyOiAzXG4gICAgZ3V0dGVyRW5hYmxlZDpcbiAgICAgIHRpdGxlOiAnSGlnaGxpZ2h0IEVycm9yIExpbmVzIGluIEd1dHRlcidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDNcbiAgICBndXR0ZXJQb3NpdGlvbjpcbiAgICAgIHRpdGxlOiAnUG9zaXRpb24gb2YgR3V0dGVyIEhpZ2hsaWdodHMnXG4gICAgICBlbnVtOiBbJ0xlZnQnLCAnUmlnaHQnXVxuICAgICAgZGVmYXVsdDogJ1JpZ2h0J1xuICAgICAgb3JkZXI6IDNcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgdW5kZXJsaW5lSXNzdWVzOlxuICAgICAgdGl0bGU6ICdVbmRlcmxpbmUgSXNzdWVzJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogM1xuICAgIHNob3dQcm92aWRlck5hbWU6XG4gICAgICB0aXRsZTogJ1Nob3cgUHJvdmlkZXIgTmFtZSAoV2hlbiBBdmFpbGFibGUpJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogM1xuXG4gICAgc2hvd0Vycm9yUGFuZWw6XG4gICAgICB0aXRsZTogJ1Nob3cgRXJyb3IgUGFuZWwnXG4gICAgICBkZXNjcmlwdGlvbjogJ1Nob3cgYSBsaXN0IG9mIGVycm9ycyBhdCB0aGUgYm90dG9tIG9mIHRoZSBlZGl0b3InXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiA0XG4gICAgZXJyb3JQYW5lbEhlaWdodDpcbiAgICAgIHRpdGxlOiAnRXJyb3IgUGFuZWwgSGVpZ2h0J1xuICAgICAgZGVzY3JpcHRpb246ICdIZWlnaHQgb2YgdGhlIGVycm9yIHBhbmVsIChpbiBweCknXG4gICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgZGVmYXVsdDogMTUwXG4gICAgICBvcmRlcjogNFxuICAgIGFsd2F5c1Rha2VNaW5pbXVtU3BhY2U6XG4gICAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgUmVkdWNlIEVycm9yIFBhbmVsIEhlaWdodCdcbiAgICAgIGRlc2NyaXB0aW9uOiAnUmVkdWNlIHBhbmVsIGhlaWdodCB3aGVuIGl0IGV4Y2VlZHMgdGhlIGhlaWdodCBvZiB0aGUgZXJyb3IgbGlzdCdcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDRcblxuICAgIGRpc3BsYXlMaW50ZXJJbmZvOlxuICAgICAgdGl0bGU6ICdEaXNwbGF5IExpbnRlciBJbmZvIGluIHRoZSBTdGF0dXMgQmFyJ1xuICAgICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIHNob3cgYW55IGxpbnRlciBpbmZvcm1hdGlvbiBpbiB0aGUgc3RhdHVzIGJhcidcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgb3JkZXI6IDVcbiAgICBkaXNwbGF5TGludGVyU3RhdHVzOlxuICAgICAgdGl0bGU6ICdEaXNwbGF5IExpbnRlciBTdGF0dXMgSW5mbyBpbiBTdGF0dXMgQmFyJ1xuICAgICAgZGVzY3JpcHRpb246ICdUaGUgYE5vIElzc3Vlc2Agb3IgYFggSXNzdWVzYCB3aWRnZXQnXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIG9yZGVyOiA1XG4gICAgc2hvd0Vycm9yVGFiTGluZTpcbiAgICAgIHRpdGxlOiAnU2hvdyBcIkxpbmVcIiBUYWIgaW4gdGhlIFN0YXR1cyBCYXInXG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBvcmRlcjogNVxuICAgIHNob3dFcnJvclRhYkZpbGU6XG4gICAgICB0aXRsZTogJ1Nob3cgXCJGaWxlXCIgVGFiIGluIHRoZSBTdGF0dXMgQmFyJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogNVxuICAgIHNob3dFcnJvclRhYlByb2plY3Q6XG4gICAgICB0aXRsZTogJ1Nob3cgXCJQcm9qZWN0XCIgVGFiIGluIHRoZSBTdGF0dXMgQmFyJ1xuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBvcmRlcjogNVxuICAgIHN0YXR1c0ljb25TY29wZTpcbiAgICAgIHRpdGxlOiAnU2NvcGUgb2YgTGludGVyIE1lc3NhZ2VzIHRvIFNob3cgaW4gU3RhdHVzIEljb24nXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZW51bTogWydGaWxlJywgJ0xpbmUnLCAnUHJvamVjdCddXG4gICAgICBkZWZhdWx0OiAnUHJvamVjdCdcbiAgICAgIG9yZGVyOiA1XG4gICAgc3RhdHVzSWNvblBvc2l0aW9uOlxuICAgICAgdGl0bGU6ICdQb3NpdGlvbiBvZiBTdGF0dXMgSWNvbiBpbiB0aGUgU3RhdHVzIEJhcidcbiAgICAgIGVudW06IFsnTGVmdCcsICdSaWdodCddXG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJ0xlZnQnXG4gICAgICBvcmRlcjogNVxuXG4gIGFjdGl2YXRlOiAoc3RhdGUpIC0+XG4gICAgTGludGVyLnN0YXRlID0gc3RhdGVcbiAgICBMaW50ZXJQbHVzID0gcmVxdWlyZSgnLi9saW50ZXIuY29mZmVlJylcbiAgICBAaW5zdGFuY2UgPSBuZXcgTGludGVyUGx1cyBzdGF0ZVxuXG4gIHNlcmlhbGl6ZTogLT5cbiAgICBMaW50ZXIuc3RhdGVcblxuICBjb25zdW1lTGludGVyOiAobGludGVycykgLT5cbiAgICB1bmxlc3MgbGludGVycyBpbnN0YW5jZW9mIEFycmF5XG4gICAgICBsaW50ZXJzID0gWyBsaW50ZXJzIF1cblxuICAgIGZvciBsaW50ZXIgaW4gbGludGVyc1xuICAgICAgQGluc3RhbmNlLmFkZExpbnRlcihsaW50ZXIpXG5cbiAgICBuZXcgRGlzcG9zYWJsZSA9PlxuICAgICAgZm9yIGxpbnRlciBpbiBsaW50ZXJzXG4gICAgICAgIEBpbnN0YW5jZS5kZWxldGVMaW50ZXIobGludGVyKVxuXG4gIGNvbnN1bWVTdGF0dXNCYXI6IChzdGF0dXNCYXIpIC0+XG4gICAgQGluc3RhbmNlLnZpZXdzLmF0dGFjaEJvdHRvbShzdGF0dXNCYXIpXG5cbiAgcHJvdmlkZUxpbnRlcjogLT5cbiAgICBAaW5zdGFuY2VcblxuICBwcm92aWRlSW5kaWU6IC0+XG4gICAgQGluc3RhbmNlPy5pbmRpZUxpbnRlcnNcblxuICBkZWFjdGl2YXRlOiAtPlxuICAgIEBpbnN0YW5jZT8uZGVhY3RpdmF0ZSgpXG4iXX0=
