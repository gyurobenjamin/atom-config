(function() {
  var _, child, filteredEnvironment, fs, path, pty, systemLanguage;

  pty = require('pty.js');

  path = require('path');

  fs = require('fs');

  _ = require('underscore');

  child = require('child_process');

  systemLanguage = (function() {
    var command, language;
    language = "en_US.UTF-8";
    if (process.platform === 'darwin') {
      try {
        command = 'plutil -convert json -o - ~/Library/Preferences/.GlobalPreferences.plist';
        language = (JSON.parse(child.execSync(command).toString()).AppleLocale) + ".UTF-8";
      } catch (error) {}
    }
    return language;
  })();

  filteredEnvironment = (function() {
    var env;
    env = _.omit(process.env, 'ATOM_HOME', 'ATOM_SHELL_INTERNAL_RUN_AS_NODE', 'GOOGLE_API_KEY', 'NODE_ENV', 'NODE_PATH', 'userAgent', 'taskPath');
    if (env.LANG == null) {
      env.LANG = systemLanguage;
    }
    env.TERM_PROGRAM = 'platformio-ide-terminal';
    return env;
  })();

  module.exports = function(pwd, shell, args, options) {
    var callback, emitTitle, ptyProcess, title;
    if (options == null) {
      options = {};
    }
    callback = this.async();
    if (/zsh|bash/.test(shell) && args.indexOf('--login') === -1) {
      args.unshift('--login');
    }
    ptyProcess = pty.fork(shell, args, {
      cwd: pwd,
      env: filteredEnvironment,
      name: 'xterm-256color'
    });
    title = shell = path.basename(shell);
    emitTitle = _.throttle(function() {
      return emit('platformio-ide-terminal:title', ptyProcess.process);
    }, 500, true);
    ptyProcess.on('data', function(data) {
      emit('platformio-ide-terminal:data', data);
      return emitTitle();
    });
    ptyProcess.on('exit', function() {
      emit('platformio-ide-terminal:exit');
      return callback();
    });
    return process.on('message', function(arg) {
      var cols, event, ref, rows, text;
      ref = arg != null ? arg : {}, event = ref.event, cols = ref.cols, rows = ref.rows, text = ref.text;
      switch (event) {
        case 'resize':
          return ptyProcess.resize(cols, rows);
        case 'input':
          return ptyProcess.write(text);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUtdGVybWluYWwvbGliL3Byb2Nlc3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsSUFBUjs7RUFDTCxDQUFBLEdBQUksT0FBQSxDQUFRLFlBQVI7O0VBQ0osS0FBQSxHQUFRLE9BQUEsQ0FBUSxlQUFSOztFQUVSLGNBQUEsR0FBb0IsQ0FBQSxTQUFBO0FBQ2xCLFFBQUE7SUFBQSxRQUFBLEdBQVc7SUFDWCxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLFFBQXZCO0FBQ0U7UUFDRSxPQUFBLEdBQVU7UUFDVixRQUFBLEdBQWEsQ0FBQyxJQUFJLENBQUMsS0FBTCxDQUFXLEtBQUssQ0FBQyxRQUFOLENBQWUsT0FBZixDQUF1QixDQUFDLFFBQXhCLENBQUEsQ0FBWCxDQUE4QyxDQUFDLFdBQWhELENBQUEsR0FBNEQsU0FGM0U7T0FBQSxpQkFERjs7QUFJQSxXQUFPO0VBTlcsQ0FBQSxDQUFILENBQUE7O0VBUWpCLG1CQUFBLEdBQXlCLENBQUEsU0FBQTtBQUN2QixRQUFBO0lBQUEsR0FBQSxHQUFNLENBQUMsQ0FBQyxJQUFGLENBQU8sT0FBTyxDQUFDLEdBQWYsRUFBb0IsV0FBcEIsRUFBaUMsaUNBQWpDLEVBQW9FLGdCQUFwRSxFQUFzRixVQUF0RixFQUFrRyxXQUFsRyxFQUErRyxXQUEvRyxFQUE0SCxVQUE1SDs7TUFDTixHQUFHLENBQUMsT0FBUTs7SUFDWixHQUFHLENBQUMsWUFBSixHQUFtQjtBQUNuQixXQUFPO0VBSmdCLENBQUEsQ0FBSCxDQUFBOztFQU10QixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLEdBQUQsRUFBTSxLQUFOLEVBQWEsSUFBYixFQUFtQixPQUFuQjtBQUNmLFFBQUE7O01BRGtDLFVBQVE7O0lBQzFDLFFBQUEsR0FBVyxJQUFDLENBQUEsS0FBRCxDQUFBO0lBRVgsSUFBRyxVQUFVLENBQUMsSUFBWCxDQUFnQixLQUFoQixDQUFBLElBQTJCLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixDQUFBLEtBQTJCLENBQUMsQ0FBMUQ7TUFDRSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFERjs7SUFHQSxVQUFBLEdBQWEsR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFULEVBQWdCLElBQWhCLEVBQ1g7TUFBQSxHQUFBLEVBQUssR0FBTDtNQUNBLEdBQUEsRUFBSyxtQkFETDtNQUVBLElBQUEsRUFBTSxnQkFGTjtLQURXO0lBS2IsS0FBQSxHQUFRLEtBQUEsR0FBUSxJQUFJLENBQUMsUUFBTCxDQUFjLEtBQWQ7SUFFaEIsU0FBQSxHQUFZLENBQUMsQ0FBQyxRQUFGLENBQVcsU0FBQTthQUNyQixJQUFBLENBQUssK0JBQUwsRUFBc0MsVUFBVSxDQUFDLE9BQWpEO0lBRHFCLENBQVgsRUFFVixHQUZVLEVBRUwsSUFGSztJQUlaLFVBQVUsQ0FBQyxFQUFYLENBQWMsTUFBZCxFQUFzQixTQUFDLElBQUQ7TUFDcEIsSUFBQSxDQUFLLDhCQUFMLEVBQXFDLElBQXJDO2FBQ0EsU0FBQSxDQUFBO0lBRm9CLENBQXRCO0lBSUEsVUFBVSxDQUFDLEVBQVgsQ0FBYyxNQUFkLEVBQXNCLFNBQUE7TUFDcEIsSUFBQSxDQUFLLDhCQUFMO2FBQ0EsUUFBQSxDQUFBO0lBRm9CLENBQXRCO1dBSUEsT0FBTyxDQUFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLFNBQUMsR0FBRDtBQUNwQixVQUFBOzBCQURxQixNQUEwQixJQUF6QixtQkFBTyxpQkFBTSxpQkFBTTtBQUN6QyxjQUFPLEtBQVA7QUFBQSxhQUNPLFFBRFA7aUJBQ3FCLFVBQVUsQ0FBQyxNQUFYLENBQWtCLElBQWxCLEVBQXdCLElBQXhCO0FBRHJCLGFBRU8sT0FGUDtpQkFFb0IsVUFBVSxDQUFDLEtBQVgsQ0FBaUIsSUFBakI7QUFGcEI7SUFEb0IsQ0FBdEI7RUF6QmU7QUFwQmpCIiwic291cmNlc0NvbnRlbnQiOlsicHR5ID0gcmVxdWlyZSAncHR5LmpzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG5jaGlsZCA9IHJlcXVpcmUgJ2NoaWxkX3Byb2Nlc3MnXG5cbnN5c3RlbUxhbmd1YWdlID0gZG8gLT5cbiAgbGFuZ3VhZ2UgPSBcImVuX1VTLlVURi04XCJcbiAgaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnZGFyd2luJ1xuICAgIHRyeVxuICAgICAgY29tbWFuZCA9ICdwbHV0aWwgLWNvbnZlcnQganNvbiAtbyAtIH4vTGlicmFyeS9QcmVmZXJlbmNlcy8uR2xvYmFsUHJlZmVyZW5jZXMucGxpc3QnXG4gICAgICBsYW5ndWFnZSA9IFwiI3tKU09OLnBhcnNlKGNoaWxkLmV4ZWNTeW5jKGNvbW1hbmQpLnRvU3RyaW5nKCkpLkFwcGxlTG9jYWxlfS5VVEYtOFwiXG4gIHJldHVybiBsYW5ndWFnZVxuXG5maWx0ZXJlZEVudmlyb25tZW50ID0gZG8gLT5cbiAgZW52ID0gXy5vbWl0IHByb2Nlc3MuZW52LCAnQVRPTV9IT01FJywgJ0FUT01fU0hFTExfSU5URVJOQUxfUlVOX0FTX05PREUnLCAnR09PR0xFX0FQSV9LRVknLCAnTk9ERV9FTlYnLCAnTk9ERV9QQVRIJywgJ3VzZXJBZ2VudCcsICd0YXNrUGF0aCdcbiAgZW52LkxBTkcgPz0gc3lzdGVtTGFuZ3VhZ2VcbiAgZW52LlRFUk1fUFJPR1JBTSA9ICdwbGF0Zm9ybWlvLWlkZS10ZXJtaW5hbCdcbiAgcmV0dXJuIGVudlxuXG5tb2R1bGUuZXhwb3J0cyA9IChwd2QsIHNoZWxsLCBhcmdzLCBvcHRpb25zPXt9KSAtPlxuICBjYWxsYmFjayA9IEBhc3luYygpXG5cbiAgaWYgL3pzaHxiYXNoLy50ZXN0KHNoZWxsKSBhbmQgYXJncy5pbmRleE9mKCctLWxvZ2luJykgPT0gLTFcbiAgICBhcmdzLnVuc2hpZnQgJy0tbG9naW4nXG5cbiAgcHR5UHJvY2VzcyA9IHB0eS5mb3JrIHNoZWxsLCBhcmdzLFxuICAgIGN3ZDogcHdkLFxuICAgIGVudjogZmlsdGVyZWRFbnZpcm9ubWVudCxcbiAgICBuYW1lOiAneHRlcm0tMjU2Y29sb3InXG5cbiAgdGl0bGUgPSBzaGVsbCA9IHBhdGguYmFzZW5hbWUgc2hlbGxcblxuICBlbWl0VGl0bGUgPSBfLnRocm90dGxlIC0+XG4gICAgZW1pdCgncGxhdGZvcm1pby1pZGUtdGVybWluYWw6dGl0bGUnLCBwdHlQcm9jZXNzLnByb2Nlc3MpXG4gICwgNTAwLCB0cnVlXG5cbiAgcHR5UHJvY2Vzcy5vbiAnZGF0YScsIChkYXRhKSAtPlxuICAgIGVtaXQoJ3BsYXRmb3JtaW8taWRlLXRlcm1pbmFsOmRhdGEnLCBkYXRhKVxuICAgIGVtaXRUaXRsZSgpXG5cbiAgcHR5UHJvY2Vzcy5vbiAnZXhpdCcsIC0+XG4gICAgZW1pdCgncGxhdGZvcm1pby1pZGUtdGVybWluYWw6ZXhpdCcpXG4gICAgY2FsbGJhY2soKVxuXG4gIHByb2Nlc3Mub24gJ21lc3NhZ2UnLCAoe2V2ZW50LCBjb2xzLCByb3dzLCB0ZXh0fT17fSkgLT5cbiAgICBzd2l0Y2ggZXZlbnRcbiAgICAgIHdoZW4gJ3Jlc2l6ZScgdGhlbiBwdHlQcm9jZXNzLnJlc2l6ZShjb2xzLCByb3dzKVxuICAgICAgd2hlbiAnaW5wdXQnIHRoZW4gcHR5UHJvY2Vzcy53cml0ZSh0ZXh0KVxuIl19
