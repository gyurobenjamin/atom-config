(function() {
  var CSONParser, fs, path;

  fs = require('fs');

  path = require('path');

  CSONParser = require('cson-parser');

  module.exports = {
    config: {
      debug: {
        type: 'boolean',
        "default": false
      }
    },
    activate: function() {
      console.log('activate editor-settings');
      this.watching = [];
      this.configDir = atom.getConfigDirPath() + "/grammar-config";
      if (!fs.existsSync(this.configDir)) {
        fs.mkdirSync(this.configDir);
      }
      this.registerCommands();
      atom.workspace.onDidChangeActivePaneItem((function(_this) {
        return function() {
          return _this.reconfigureCurrentEditor();
        };
      })(this));
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          return editor.observeGrammar(function() {
            return _this.reconfigureCurrentEditor();
          });
        };
      })(this));
      return this.reconfigureCurrentEditor();
    },
    debug: function(msg) {
      if (atom.config.get('editor-settings.debug')) {
        return console.log(msg);
      }
    },
    registerCommands: function() {
      return atom.commands.add('atom-text-editor', {
        'editor-settings:open-grammar-config': (function(_this) {
          return function() {
            return _this.editCurrentGrammarConfig();
          };
        })(this)
      });
    },
    reconfigureCurrentEditor: function() {
      var buffer, config, editor, view;
      editor = atom.workspace.getActiveTextEditor();
      this.debug("reconfigure current editor");
      if (editor != null) {
        config = this.loadAllConfigFiles(editor.getGrammar().name);
        if (config.tabLength != null) {
          editor.setTabLength(config.tabLength);
        }
        if (config.softTabs != null) {
          editor.setSoftTabs(config.softTabs);
        }
        if (config.softWrap != null) {
          editor.setSoftWrapped(config.softWrap);
        }
        if (config.themes != null) {
          atom.config.settings.core.themes = [config.themes[0], config.themes[1]];
        }
        if (editor.buffer != null) {
          buffer = editor.buffer;
          if (config.encoding) {
            buffer.setEncoding(config.encoding);
          }
        }
        view = atom.views.getView(editor);
        if (view != null) {
          if (config.fontFamily != null) {
            view.style.fontFamily = config.fontFamily;
          }
          if (config.fontSize != null) {
            return view.style.fontSize = config.fontSize;
          }
        }
      }
    },
    loadAllConfigFiles: function(grammarName) {
      var config, defaults, directoryConfig, directoryConfigPath, directoryPath, editor, fileExtension, grammarConfig, i, projectConfig, projectConfigPath, projectPaths, ref, ref1, ref2, ref3, ref4, ref5;
      editor = atom.workspace.getActiveTextEditor();
      fileExtension = path.extname(editor.getPath()).substring(1);
      this.debug('current editor file extension: ' + fileExtension);
      config = {};
      defaults = this.merge(atom.config.defaultSettings.editor, atom.config.settings.editor);
      config = this.merge(config, defaults);
      if (fs.existsSync(this.grammarConfigPath(grammarName))) {
        grammarConfig = this.loadConfig(this.grammarConfigPath(grammarName));
        this.debug('loading grammar config: ' + grammarName);
        config = this.merge(config, grammarConfig);
      } else {
        this.debug('no grammar config for: ' + grammarName);
      }
      if ((ref = atom.project) != null ? ref.getPaths() : void 0) {
        projectPaths = atom.project.getPaths();
        if (editor.buffer.file != null) {
          directoryPath = editor.buffer.file.getParent().path;
          for (i in projectPaths) {
            if (directoryPath.indexOf(projectPaths[i]) === 0) {
              projectConfigPath = projectPaths[i] + '/.editor-settings';
              break;
            }
          }
        }
        if (projectConfig = this.loadConfig(projectConfigPath)) {
          this.debug('loading project config: ' + projectConfigPath);
          config = this.merge(config, projectConfig);
        }
      }
      if (((ref1 = editor.buffer) != null ? (ref2 = ref1.file) != null ? (ref3 = ref2.getParent()) != null ? ref3.path : void 0 : void 0 : void 0) != null) {
        directoryPath = editor.buffer.file.getParent().path;
        directoryConfigPath = directoryPath + "/.editor-settings";
        if (directoryConfig = this.loadConfig(directoryConfigPath)) {
          this.debug('loading directory config: ' + directoryConfigPath);
          config = this.merge(config, directoryConfig);
        }
      }
      if (((ref4 = config.grammarConfig) != null ? ref4[grammarName] : void 0) != null) {
        this.debug('merging grammar config: ' + grammarName);
        config = this.merge(config, config.grammarConfig[grammarName]);
      }
      if ((((ref5 = config.extensionConfig) != null ? ref5[fileExtension] : void 0) != null) && fileExtension.length > 0) {
        this.debug('merging file extension config: ' + fileExtension);
        config = this.merge(config, config.extensionConfig[fileExtension]);
      }
      return config;
    },
    merge: function(first, second) {
      var a, b, c, config, d;
      config = {};
      for (a in first) {
        b = first[a];
        if (typeof b === "object") {
          config[a] = this.merge({}, b);
        } else {
          config[a] = b;
        }
      }
      for (c in second) {
        d = second[c];
        if (typeof d === "object") {
          config[c] = this.merge({}, d);
        } else {
          config[c] = d;
        }
      }
      return config;
    },
    editCurrentGrammarConfig: function() {
      var editor, filePath, grammar, workspace;
      workspace = atom.workspace != null;
      if (!workspace) {
        return;
      }
      editor = atom.workspace.getActiveTextEditor();
      if (editor != null) {
        grammar = editor.getGrammar();
        filePath = this.grammarConfigPath(grammar.name);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '');
        }
        this.watchFile(filePath);
        return atom.workspace.open(filePath);
      }
    },
    watchFile: function(path) {
      if (!this.watching[path]) {
        fs.watch(path, (function(_this) {
          return function() {
            _this.debug('watched file updated: ' + path);
            return _this.reconfigureCurrentEditor();
          };
        })(this));
        this.debug('watching: ' + path);
        return this.watching[path] = true;
      }
    },
    fileNameFor: function(text) {
      return text.replace(/\s+/gi, '-').toLowerCase();
    },
    grammarConfigPath: function(name) {
      var fileName;
      fileName = this.fileNameFor(name);
      return this.configDir + "/" + fileName + ".cson";
    },
    loadConfig: function(path) {
      var contents, error;
      if (fs.existsSync(path)) {
        contents = fs.readFileSync(path);
        this.watchFile(path);
        if (contents.length > 1) {
          try {
            return CSONParser.parse(contents);
          } catch (error1) {
            error = error1;
            return console.log(error);
          }
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvZWRpdG9yLXNldHRpbmdzL2xpYi9lZGl0b3Itc2V0dGluZ3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxFQUFBLEdBQWMsT0FBQSxDQUFRLElBQVI7O0VBQ2QsSUFBQSxHQUFjLE9BQUEsQ0FBUSxNQUFSOztFQUNkLFVBQUEsR0FBYyxPQUFBLENBQVEsYUFBUjs7RUFtQmQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLEtBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO09BREY7S0FERjtJQUtBLFFBQUEsRUFBVSxTQUFBO01BQ1IsT0FBTyxDQUFDLEdBQVIsQ0FBWSwwQkFBWjtNQUVBLElBQUMsQ0FBQSxRQUFELEdBQWE7TUFDYixJQUFDLENBQUEsU0FBRCxHQUFhLElBQUksQ0FBQyxnQkFBTCxDQUFBLENBQUEsR0FBMEI7TUFHdkMsSUFBRyxDQUFJLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBQyxDQUFBLFNBQWYsQ0FBUDtRQUNFLEVBQUUsQ0FBQyxTQUFILENBQWEsSUFBQyxDQUFBLFNBQWQsRUFERjs7TUFHQSxJQUFDLENBQUEsZ0JBQUQsQ0FBQTtNQUVBLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQWYsQ0FBeUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUN2QyxLQUFDLENBQUEsd0JBQUQsQ0FBQTtRQUR1QztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekM7TUFHQSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxNQUFEO2lCQUNoQyxNQUFNLENBQUMsY0FBUCxDQUFzQixTQUFBO21CQUNwQixLQUFDLENBQUEsd0JBQUQsQ0FBQTtVQURv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SUE4S0EsVUFBQSxFQUFZLFNBQUMsSUFBRDtBQUNWLFVBQUE7TUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsSUFBZCxDQUFIO1FBQ0UsUUFBQSxHQUFXLEVBQUUsQ0FBQyxZQUFILENBQWdCLElBQWhCO1FBQ1gsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFYO1FBRUEsSUFBRyxRQUFRLENBQUMsTUFBVCxHQUFrQixDQUFyQjtBQUNFO0FBQ0UsbUJBQU8sVUFBVSxDQUFDLEtBQVgsQ0FBaUIsUUFBakIsRUFEVDtXQUFBLGNBQUE7WUFFTTttQkFDSixPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosRUFIRjtXQURGO1NBSkY7O0lBRFUsQ0E5S1o7O0FBdEJGIiwic291cmNlc0NvbnRlbnQiOlsiZnMgICAgICAgICAgPSByZXF1aXJlICdmcydcbnBhdGggICAgICAgID0gcmVxdWlyZSAncGF0aCdcbkNTT05QYXJzZXIgID0gcmVxdWlyZSAnY3Nvbi1wYXJzZXInXG5cbiMgQ29uZmlnIGZpbGUgZXhhbXBsZXM6XG4jXG4jIENvZmZlZVNjcmlwdCBncmFtbWFyIGNvbmZpZyBleGFtcGxlOlxuIyAgIHRhYkxlbmd0aDogMlxuIyAgIGV4dGVuc2lvbkNvbmZpZzpcbiMgICAgIGNzb246XG4jICAgICAgIHRhYkxlbmd0aDogNFxuI1xuIyBQcm9qZWN0IC8gRGlyZWN0b3J5IGNvbmZpZyBleGFtcGxlOlxuIyAgIHRhYkxlbmd0aDogMlxuIyAgIGdyYW1tYXJDb25maWc6XG4jICAgICAnQ29mZmVlU2NyaXB0JzpcbiMgICAgICAgdGFiTGVuZ3RoIDRcbiMgICAgICAgZXh0ZW5zaW9uQ29uZmlnOlxuIyAgICAgICAgIGNzb246XG4jICAgICAgICAgICB0YWJMZW5ndGggOFxuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNvbmZpZzpcbiAgICBkZWJ1ZzpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcblxuICBhY3RpdmF0ZTogLT5cbiAgICBjb25zb2xlLmxvZyAnYWN0aXZhdGUgZWRpdG9yLXNldHRpbmdzJ1xuXG4gICAgQHdhdGNoaW5nICA9IFtdXG4gICAgQGNvbmZpZ0RpciA9IGF0b20uZ2V0Q29uZmlnRGlyUGF0aCgpICsgXCIvZ3JhbW1hci1jb25maWdcIlxuXG4gICAgIyBDcmVhdGUgY29uZmlnIGRpcmVjdG9yeSBpZiBpdCBkb2Vzbid0IGV4aXN0LlxuICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jIEBjb25maWdEaXJcbiAgICAgIGZzLm1rZGlyU3luYyBAY29uZmlnRGlyXG5cbiAgICBAcmVnaXN0ZXJDb21tYW5kcygpXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vbkRpZENoYW5nZUFjdGl2ZVBhbmVJdGVtID0+XG4gICAgICBAcmVjb25maWd1cmVDdXJyZW50RWRpdG9yKClcblxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgZWRpdG9yLm9ic2VydmVHcmFtbWFyID0+XG4gICAgICAgIEByZWNvbmZpZ3VyZUN1cnJlbnRFZGl0b3IoKVxuXG4gICAgQHJlY29uZmlndXJlQ3VycmVudEVkaXRvcigpXG5cbiAgZGVidWc6IChtc2cpIC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdlZGl0b3Itc2V0dGluZ3MuZGVidWcnKVxuICAgICAgY29uc29sZS5sb2cgbXNnXG5cbiAgcmVnaXN0ZXJDb21tYW5kczogLT5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsXG4gICAgICAnZWRpdG9yLXNldHRpbmdzOm9wZW4tZ3JhbW1hci1jb25maWcnOiA9PiBAZWRpdEN1cnJlbnRHcmFtbWFyQ29uZmlnKClcblxuICAjIFJlY29uZmlndXJlIHRoZSBjdXJyZW50IGVkaXRvclxuICByZWNvbmZpZ3VyZUN1cnJlbnRFZGl0b3I6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cbiAgICBAZGVidWcgXCJyZWNvbmZpZ3VyZSBjdXJyZW50IGVkaXRvclwiXG5cbiAgICBpZiBlZGl0b3I/XG4gICAgICBjb25maWcgPSBAbG9hZEFsbENvbmZpZ0ZpbGVzKGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZSlcblxuICAgICAgZWRpdG9yLnNldFRhYkxlbmd0aCAgIGNvbmZpZy50YWJMZW5ndGggaWYgY29uZmlnLnRhYkxlbmd0aD9cbiAgICAgIGVkaXRvci5zZXRTb2Z0VGFicyAgICBjb25maWcuc29mdFRhYnMgIGlmIGNvbmZpZy5zb2Z0VGFicz9cbiAgICAgIGVkaXRvci5zZXRTb2Z0V3JhcHBlZCBjb25maWcuc29mdFdyYXAgIGlmIGNvbmZpZy5zb2Z0V3JhcD9cbiAgICAgIGF0b20uY29uZmlnLnNldHRpbmdzLmNvcmUudGhlbWVzID0gW2NvbmZpZy50aGVtZXNbMF0sIGNvbmZpZy50aGVtZXNbMV1dIGlmIGNvbmZpZy50aGVtZXM/XG5cbiAgICAgIGlmIGVkaXRvci5idWZmZXI/XG4gICAgICAgIGJ1ZmZlciA9IGVkaXRvci5idWZmZXJcbiAgICAgICAgYnVmZmVyLnNldEVuY29kaW5nIGNvbmZpZy5lbmNvZGluZyBpZiBjb25maWcuZW5jb2RpbmdcblxuICAgICAgdmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpXG4gICAgICBpZiB2aWV3P1xuICAgICAgICB2aWV3LnN0eWxlLmZvbnRGYW1pbHkgPSBjb25maWcuZm9udEZhbWlseSBpZiBjb25maWcuZm9udEZhbWlseT9cbiAgICAgICAgdmlldy5zdHlsZS5mb250U2l6ZSA9IGNvbmZpZy5mb250U2l6ZSBpZiBjb25maWcuZm9udFNpemU/XG5cbiAgIyBMb2FkIHRoZSBjb250ZW50cyBvZiBhbGwgY29uZmlnIGZpbGVzOlxuICAjICAgLSBncmFtbWFyXG4gICMgICAtIHByb2plY3RcbiAgIyAgIC0gY3VycmVudCBmaWxlIGRpcmVjdG9yeVxuICBsb2FkQWxsQ29uZmlnRmlsZXM6IChncmFtbWFyTmFtZSkgLT5cbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICMgRmlsZSBleHRlc2lvblxuICAgIGZpbGVFeHRlbnNpb24gPSBwYXRoLmV4dG5hbWUoZWRpdG9yLmdldFBhdGgoKSkuc3Vic3RyaW5nKDEpXG4gICAgQGRlYnVnICdjdXJyZW50IGVkaXRvciBmaWxlIGV4dGVuc2lvbjogJyArIGZpbGVFeHRlbnNpb25cblxuICAgIGNvbmZpZyA9IHt9XG5cbiAgICAjIERlZmF1bHQgYW5kIGN1cnJlbnQgQXRvbSBzZXR0aW5nc1xuICAgIGRlZmF1bHRzID0gQG1lcmdlIGF0b20uY29uZmlnLmRlZmF1bHRTZXR0aW5ncy5lZGl0b3IsXG4gICAgICAgICAgICAgICAgICAgICAgYXRvbS5jb25maWcuc2V0dGluZ3MuZWRpdG9yXG5cbiAgICBjb25maWcgPSBAbWVyZ2UgY29uZmlnLCBkZWZhdWx0c1xuXG4gICAgIyBHcmFtbWFyIHNldHRpbmdzXG4gICAgaWYgZnMuZXhpc3RzU3luYyBAZ3JhbW1hckNvbmZpZ1BhdGgoZ3JhbW1hck5hbWUpXG4gICAgICBncmFtbWFyQ29uZmlnID0gQGxvYWRDb25maWcoQGdyYW1tYXJDb25maWdQYXRoKGdyYW1tYXJOYW1lKSlcbiAgICAgIEBkZWJ1ZyAnbG9hZGluZyBncmFtbWFyIGNvbmZpZzogJyArIGdyYW1tYXJOYW1lXG4gICAgICBjb25maWcgPSBAbWVyZ2UgY29uZmlnLCBncmFtbWFyQ29uZmlnXG4gICAgZWxzZVxuICAgICAgQGRlYnVnICdubyBncmFtbWFyIGNvbmZpZyBmb3I6ICcgKyBncmFtbWFyTmFtZVxuXG4gICAgIyBQcm9qZWN0IHNldHRpbmdzXG4gICAgaWYgYXRvbS5wcm9qZWN0Py5nZXRQYXRocygpXG4gICAgICBwcm9qZWN0UGF0aHMgPSBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuXG4gICAgICBpZiBlZGl0b3IuYnVmZmVyLmZpbGU/XG4gICAgICAgIGRpcmVjdG9yeVBhdGggPSBlZGl0b3IuYnVmZmVyLmZpbGUuZ2V0UGFyZW50KCkucGF0aFxuXG4gICAgICAgIGZvciBpIG9mIHByb2plY3RQYXRoc1xuICAgICAgICAgIGlmIGRpcmVjdG9yeVBhdGguaW5kZXhPZihwcm9qZWN0UGF0aHNbaV0pID09IDBcbiAgICAgICAgICAgIHByb2plY3RDb25maWdQYXRoID0gcHJvamVjdFBhdGhzW2ldICsgJy8uZWRpdG9yLXNldHRpbmdzJ1xuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgaWYgcHJvamVjdENvbmZpZyA9IEBsb2FkQ29uZmlnKHByb2plY3RDb25maWdQYXRoKVxuICAgICAgICBAZGVidWcgJ2xvYWRpbmcgcHJvamVjdCBjb25maWc6ICcgKyBwcm9qZWN0Q29uZmlnUGF0aFxuICAgICAgICBjb25maWcgPSBAbWVyZ2UgY29uZmlnLCBwcm9qZWN0Q29uZmlnXG5cbiAgICAjIERpcmVjdG9yeSBzZXR0aW5nc1xuICAgIGlmIGVkaXRvci5idWZmZXI/LmZpbGU/LmdldFBhcmVudCgpPy5wYXRoP1xuICAgICAgZGlyZWN0b3J5UGF0aCAgICAgICA9IGVkaXRvci5idWZmZXIuZmlsZS5nZXRQYXJlbnQoKS5wYXRoXG4gICAgICBkaXJlY3RvcnlDb25maWdQYXRoID0gZGlyZWN0b3J5UGF0aCArIFwiLy5lZGl0b3Itc2V0dGluZ3NcIlxuXG4gICAgICBpZiBkaXJlY3RvcnlDb25maWcgPSBAbG9hZENvbmZpZyhkaXJlY3RvcnlDb25maWdQYXRoKVxuICAgICAgICBAZGVidWcgJ2xvYWRpbmcgZGlyZWN0b3J5IGNvbmZpZzogJyArIGRpcmVjdG9yeUNvbmZpZ1BhdGhcbiAgICAgICAgY29uZmlnID0gQG1lcmdlIGNvbmZpZywgZGlyZWN0b3J5Q29uZmlnXG5cbiAgICBpZiBjb25maWcuZ3JhbW1hckNvbmZpZz9bZ3JhbW1hck5hbWVdP1xuICAgICAgQGRlYnVnICdtZXJnaW5nIGdyYW1tYXIgY29uZmlnOiAnICsgZ3JhbW1hck5hbWVcbiAgICAgIGNvbmZpZyA9IEBtZXJnZSBjb25maWcsIGNvbmZpZy5ncmFtbWFyQ29uZmlnW2dyYW1tYXJOYW1lXVxuXG4gICAgaWYgY29uZmlnLmV4dGVuc2lvbkNvbmZpZz9bZmlsZUV4dGVuc2lvbl0/IGFuZCBmaWxlRXh0ZW5zaW9uLmxlbmd0aCA+IDBcbiAgICAgIEBkZWJ1ZyAnbWVyZ2luZyBmaWxlIGV4dGVuc2lvbiBjb25maWc6ICcgKyBmaWxlRXh0ZW5zaW9uXG4gICAgICBjb25maWcgPSBAbWVyZ2UgY29uZmlnLCBjb25maWcuZXh0ZW5zaW9uQ29uZmlnW2ZpbGVFeHRlbnNpb25dXG5cbiAgICByZXR1cm4gY29uZmlnXG5cbiAgIyBNZXJnZSB0d28gb2JqZWN0c1xuICBtZXJnZTogKGZpcnN0LCBzZWNvbmQpIC0+XG4gICAgY29uZmlnID0ge31cblxuICAgIGZvciBhLCBiIG9mIGZpcnN0XG4gICAgICBpZiB0eXBlb2YgYiBpcyBcIm9iamVjdFwiXG4gICAgICAgIGNvbmZpZ1thXSA9IEBtZXJnZSB7fSwgYlxuICAgICAgZWxzZVxuICAgICAgICBjb25maWdbYV0gPSBiXG5cbiAgICBmb3IgYywgZCBvZiBzZWNvbmRcbiAgICAgIGlmIHR5cGVvZiBkIGlzIFwib2JqZWN0XCJcbiAgICAgICAgY29uZmlnW2NdID0gQG1lcmdlIHt9LCBkXG4gICAgICBlbHNlXG4gICAgICAgIGNvbmZpZ1tjXSA9IGRcblxuICAgIHJldHVybiBjb25maWdcblxuICAjIE9wZW4gY3VycmVudCBlZGl0b3JzIGdyYW1tYXIgY29uZmlnIGZpbGVcbiAgZWRpdEN1cnJlbnRHcmFtbWFyQ29uZmlnOiAtPlxuICAgIHdvcmtzcGFjZSA9IGF0b20ud29ya3NwYWNlP1xuXG4gICAgcmV0dXJuIHVubGVzcyB3b3Jrc3BhY2VcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgaWYgZWRpdG9yP1xuICAgICAgZ3JhbW1hciAgPSBlZGl0b3IuZ2V0R3JhbW1hcigpXG4gICAgICBmaWxlUGF0aCA9IEBncmFtbWFyQ29uZmlnUGF0aChncmFtbWFyLm5hbWUpXG5cbiAgICAgIGlmIG5vdCBmcy5leGlzdHNTeW5jIGZpbGVQYXRoXG4gICAgICAgIGZzLndyaXRlRmlsZVN5bmMgZmlsZVBhdGgsICcnXG5cbiAgICAgIEB3YXRjaEZpbGUgZmlsZVBhdGhcbiAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZmlsZVBhdGhcblxuICAjIFdhdGNoIGZpbGVcbiAgd2F0Y2hGaWxlOiAocGF0aCkgLT5cbiAgICB1bmxlc3MgQHdhdGNoaW5nW3BhdGhdXG4gICAgICBmcy53YXRjaCBwYXRoLCA9PlxuICAgICAgICBAZGVidWcgJ3dhdGNoZWQgZmlsZSB1cGRhdGVkOiAnICsgcGF0aFxuICAgICAgICBAcmVjb25maWd1cmVDdXJyZW50RWRpdG9yKClcblxuICAgICAgQGRlYnVnICd3YXRjaGluZzogJyArIHBhdGhcbiAgICAgIEB3YXRjaGluZ1twYXRoXSA9IHRydWVcblxuICAjIENvbnZlcnRzIHRoZSBncmFtbWFyIG5hbWUgdG8gYSBmaWxlIG5hbWUuXG4gIGZpbGVOYW1lRm9yOiAodGV4dCkgLT5cbiAgICB0ZXh0LnJlcGxhY2UoL1xccysvZ2ksICctJykudG9Mb3dlckNhc2UoKVxuXG4gICMgUmV0dXJucyBmdWxsIGNvbmZpZyBmaWxlIHBhdGggZm9yIHNwZWNpZmllZCBncmFtbWFyXG4gIGdyYW1tYXJDb25maWdQYXRoOiAobmFtZSkgLT5cbiAgICBmaWxlTmFtZSA9IEBmaWxlTmFtZUZvcihuYW1lKVxuICAgIHJldHVybiBAY29uZmlnRGlyICsgXCIvXCIgKyBmaWxlTmFtZSArIFwiLmNzb25cIlxuXG4gIGxvYWRDb25maWc6IChwYXRoKSAtPlxuICAgIGlmIGZzLmV4aXN0c1N5bmMocGF0aClcbiAgICAgIGNvbnRlbnRzID0gZnMucmVhZEZpbGVTeW5jKHBhdGgpXG4gICAgICBAd2F0Y2hGaWxlIHBhdGhcblxuICAgICAgaWYgY29udGVudHMubGVuZ3RoID4gMVxuICAgICAgICB0cnlcbiAgICAgICAgICByZXR1cm4gQ1NPTlBhcnNlci5wYXJzZShjb250ZW50cylcbiAgICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgICBjb25zb2xlLmxvZyBlcnJvclxuIl19
