(function() {
  var fs, getClangFlagsCompDB, getClangFlagsDotClangComplete, getFileContents, path;

  path = require('path');

  fs = require('fs');

  module.exports = {
    getClangFlags: function(fileName) {
      var flags;
      flags = getClangFlagsCompDB(fileName);
      if (flags.length === 0) {
        flags = getClangFlagsDotClangComplete(fileName);
      }
      return flags;
    },
    activate: function(state) {}
  };

  getFileContents = function(startFile, fileName) {
    var contents, error, parentDir, searchDir, searchFilePath, searchFileStats;
    searchDir = path.dirname(startFile);
    while (searchDir) {
      searchFilePath = path.join(searchDir, fileName);
      try {
        searchFileStats = fs.statSync(searchFilePath);
        if (searchFileStats.isFile()) {
          try {
            contents = fs.readFileSync(searchFilePath, 'utf8');
            return [searchDir, contents];
          } catch (error1) {
            error = error1;
            console.log("clang-flags for " + fileName + " couldn't read file " + searchFilePath);
            console.log(error);
          }
          return [null, null];
        }
      } catch (error1) {}
      parentDir = path.dirname(searchDir);
      if (parentDir === searchDir) {
        break;
      }
      searchDir = parentDir;
    }
    return [null, null];
  };

  getClangFlagsCompDB = function(fileName) {
    var allArgs, args, compDB, compDBContents, config, doubleArgs, i, it, j, k, l, len, len1, nextArg, ref, ref1, relativeName, searchDir, singleArgs;
    ref = getFileContents(fileName, "compile_commands.json"), searchDir = ref[0], compDBContents = ref[1];
    args = [];
    if (compDBContents !== null && compDBContents.length > 0) {
      compDB = JSON.parse(compDBContents);
      for (j = 0, len = compDB.length; j < len; j++) {
        config = compDB[j];
        relativeName = fileName.slice(searchDir.length + 1, +fileName.length + 1 || 9e9);
        if (fileName === config['file'] || relativeName === config['file']) {
          allArgs = config.command.replace(/\s+/g, " ").split(' ');
          singleArgs = [];
          doubleArgs = [];
          for (i = k = 0, ref1 = allArgs.length - 1; 0 <= ref1 ? k <= ref1 : k >= ref1; i = 0 <= ref1 ? ++k : --k) {
            nextArg = allArgs[i + 1];
            if (allArgs[i][0] === '-' && (!nextArg || nextArg[0] === '-')) {
              singleArgs.push(allArgs[i]);
            }
            if (allArgs[i][0] === '-' && nextArg && (nextArg[0] !== '-')) {
              doubleArgs.push(allArgs[i] + " " + nextArg);
            }
          }
          args = singleArgs;
          for (l = 0, len1 = doubleArgs.length; l < len1; l++) {
            it = doubleArgs[l];
            if (it.slice(0, 8) === '-isystem') {
              args.push(it);
            }
          }
          args = args.concat(["-working-directory=" + searchDir]);
          break;
        }
      }
    }
    return args;
  };

  getClangFlagsDotClangComplete = function(fileName) {
    var args, clangCompleteContents, ref, searchDir;
    ref = getFileContents(fileName, ".clang_complete"), searchDir = ref[0], clangCompleteContents = ref[1];
    args = [];
    if (clangCompleteContents !== null && clangCompleteContents.length > 0) {
      args = clangCompleteContents.trim().split("\n");
      args = args.concat(["-working-directory=" + searchDir]);
    }
    return args;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYXV0b2NvbXBsZXRlLWNsYW5nL25vZGVfbW9kdWxlcy9jbGFuZy1mbGFncy9saWIvY2xhbmctZmxhZ3MuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxhQUFBLEVBQWUsU0FBQyxRQUFEO0FBQ2IsVUFBQTtNQUFBLEtBQUEsR0FBUSxtQkFBQSxDQUFvQixRQUFwQjtNQUNSLElBQUcsS0FBSyxDQUFDLE1BQU4sS0FBZ0IsQ0FBbkI7UUFDRSxLQUFBLEdBQVEsNkJBQUEsQ0FBOEIsUUFBOUIsRUFEVjs7QUFFQSxhQUFPO0lBSk0sQ0FBZjtJQUtBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQSxDQUxWOzs7RUFPRixlQUFBLEdBQWtCLFNBQUMsU0FBRCxFQUFZLFFBQVo7QUFDaEIsUUFBQTtJQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWI7QUFDWixXQUFNLFNBQU47TUFDRSxjQUFBLEdBQWlCLElBQUksQ0FBQyxJQUFMLENBQVUsU0FBVixFQUFxQixRQUFyQjtBQUNqQjtRQUNFLGVBQUEsR0FBa0IsRUFBRSxDQUFDLFFBQUgsQ0FBWSxjQUFaO1FBQ2xCLElBQUcsZUFBZSxDQUFDLE1BQWhCLENBQUEsQ0FBSDtBQUNFO1lBQ0UsUUFBQSxHQUFXLEVBQUUsQ0FBQyxZQUFILENBQWdCLGNBQWhCLEVBQWdDLE1BQWhDO0FBQ1gsbUJBQU8sQ0FBQyxTQUFELEVBQVksUUFBWixFQUZUO1dBQUEsY0FBQTtZQUdNO1lBQ0osT0FBTyxDQUFDLEdBQVIsQ0FBWSxrQkFBQSxHQUFxQixRQUFyQixHQUFnQyxzQkFBaEMsR0FBeUQsY0FBckU7WUFDQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVosRUFMRjs7QUFNQSxpQkFBTyxDQUFDLElBQUQsRUFBTyxJQUFQLEVBUFQ7U0FGRjtPQUFBO01BVUEsU0FBQSxHQUFZLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYjtNQUNaLElBQVMsU0FBQSxLQUFhLFNBQXRCO0FBQUEsY0FBQTs7TUFDQSxTQUFBLEdBQVk7SUFkZDtBQWVBLFdBQU8sQ0FBQyxJQUFELEVBQU8sSUFBUDtFQWpCUzs7RUFtQmxCLG1CQUFBLEdBQXNCLFNBQUMsUUFBRDtBQUNwQixRQUFBO0lBQUEsTUFBOEIsZUFBQSxDQUFnQixRQUFoQixFQUEwQix1QkFBMUIsQ0FBOUIsRUFBQyxrQkFBRCxFQUFZO0lBQ1osSUFBQSxHQUFPO0lBQ1AsSUFBRyxjQUFBLEtBQWtCLElBQWxCLElBQTBCLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQXJEO01BQ0UsTUFBQSxHQUFTLElBQUksQ0FBQyxLQUFMLENBQVcsY0FBWDtBQUNULFdBQUEsd0NBQUE7O1FBRUUsWUFBQSxHQUFlLFFBQVM7UUFDeEIsSUFBRyxRQUFBLEtBQVksTUFBTyxDQUFBLE1BQUEsQ0FBbkIsSUFBOEIsWUFBQSxLQUFnQixNQUFPLENBQUEsTUFBQSxDQUF4RDtVQUNFLE9BQUEsR0FBVSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQWYsQ0FBdUIsTUFBdkIsRUFBK0IsR0FBL0IsQ0FBbUMsQ0FBQyxLQUFwQyxDQUEwQyxHQUExQztVQUNWLFVBQUEsR0FBYTtVQUNiLFVBQUEsR0FBYTtBQUNiLGVBQVMsa0dBQVQ7WUFDRSxPQUFBLEdBQVUsT0FBUSxDQUFBLENBQUEsR0FBRSxDQUFGO1lBRWxCLElBQThCLE9BQVEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVgsS0FBaUIsR0FBakIsSUFBeUIsQ0FBQyxDQUFJLE9BQUosSUFBZSxPQUFRLENBQUEsQ0FBQSxDQUFSLEtBQWMsR0FBOUIsQ0FBdkQ7Y0FBQSxVQUFVLENBQUMsSUFBWCxDQUFnQixPQUFRLENBQUEsQ0FBQSxDQUF4QixFQUFBOztZQUNBLElBQThDLE9BQVEsQ0FBQSxDQUFBLENBQUcsQ0FBQSxDQUFBLENBQVgsS0FBaUIsR0FBakIsSUFBeUIsT0FBekIsSUFBcUMsQ0FBQyxPQUFRLENBQUEsQ0FBQSxDQUFSLEtBQWMsR0FBZixDQUFuRjtjQUFBLFVBQVUsQ0FBQyxJQUFYLENBQWdCLE9BQVEsQ0FBQSxDQUFBLENBQVIsR0FBYSxHQUFiLEdBQW1CLE9BQW5DLEVBQUE7O0FBSkY7VUFLQSxJQUFBLEdBQU87QUFDUCxlQUFBLDhDQUFBOztnQkFBdUMsRUFBRyxZQUFILEtBQVk7Y0FBbkQsSUFBSSxDQUFDLElBQUwsQ0FBVSxFQUFWOztBQUFBO1VBQ0EsSUFBQSxHQUFPLElBQUksQ0FBQyxNQUFMLENBQVksQ0FBQyxxQkFBQSxHQUFzQixTQUF2QixDQUFaO0FBQ1AsZ0JBWkY7O0FBSEYsT0FGRjs7QUFrQkEsV0FBTztFQXJCYTs7RUF1QnRCLDZCQUFBLEdBQWdDLFNBQUMsUUFBRDtBQUM5QixRQUFBO0lBQUEsTUFBcUMsZUFBQSxDQUFnQixRQUFoQixFQUEwQixpQkFBMUIsQ0FBckMsRUFBQyxrQkFBRCxFQUFZO0lBQ1osSUFBQSxHQUFPO0lBQ1AsSUFBRyxxQkFBQSxLQUF5QixJQUF6QixJQUFpQyxxQkFBcUIsQ0FBQyxNQUF0QixHQUErQixDQUFuRTtNQUNFLElBQUEsR0FBTyxxQkFBcUIsQ0FBQyxJQUF0QixDQUFBLENBQTRCLENBQUMsS0FBN0IsQ0FBbUMsSUFBbkM7TUFDUCxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFDLHFCQUFBLEdBQXNCLFNBQXZCLENBQVosRUFGVDs7QUFHQSxXQUFPO0VBTnVCO0FBckRoQyIsInNvdXJjZXNDb250ZW50IjpbIiMgQ2xhbmdGbGFnc1ZpZXcgPSByZXF1aXJlICcuL2NsYW5nLWZsYWdzLXZpZXcnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgZ2V0Q2xhbmdGbGFnczogKGZpbGVOYW1lKSAtPlxuICAgIGZsYWdzID0gZ2V0Q2xhbmdGbGFnc0NvbXBEQihmaWxlTmFtZSlcbiAgICBpZiBmbGFncy5sZW5ndGggPT0gMFxuICAgICAgZmxhZ3MgPSBnZXRDbGFuZ0ZsYWdzRG90Q2xhbmdDb21wbGV0ZShmaWxlTmFtZSlcbiAgICByZXR1cm4gZmxhZ3NcbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cblxuZ2V0RmlsZUNvbnRlbnRzID0gKHN0YXJ0RmlsZSwgZmlsZU5hbWUpIC0+XG4gIHNlYXJjaERpciA9IHBhdGguZGlybmFtZSBzdGFydEZpbGVcbiAgd2hpbGUgc2VhcmNoRGlyXG4gICAgc2VhcmNoRmlsZVBhdGggPSBwYXRoLmpvaW4gc2VhcmNoRGlyLCBmaWxlTmFtZVxuICAgIHRyeVxuICAgICAgc2VhcmNoRmlsZVN0YXRzID0gZnMuc3RhdFN5bmMgc2VhcmNoRmlsZVBhdGhcbiAgICAgIGlmIHNlYXJjaEZpbGVTdGF0cy5pc0ZpbGUoKVxuICAgICAgICB0cnlcbiAgICAgICAgICBjb250ZW50cyA9IGZzLnJlYWRGaWxlU3luYyBzZWFyY2hGaWxlUGF0aCwgJ3V0ZjgnXG4gICAgICAgICAgcmV0dXJuIFtzZWFyY2hEaXIsIGNvbnRlbnRzXVxuICAgICAgICBjYXRjaCBlcnJvclxuICAgICAgICAgIGNvbnNvbGUubG9nIFwiY2xhbmctZmxhZ3MgZm9yIFwiICsgZmlsZU5hbWUgKyBcIiBjb3VsZG4ndCByZWFkIGZpbGUgXCIgKyBzZWFyY2hGaWxlUGF0aFxuICAgICAgICAgIGNvbnNvbGUubG9nIGVycm9yXG4gICAgICAgIHJldHVybiBbbnVsbCwgbnVsbF1cbiAgICBwYXJlbnREaXIgPSBwYXRoLmRpcm5hbWUgc2VhcmNoRGlyXG4gICAgYnJlYWsgaWYgcGFyZW50RGlyID09IHNlYXJjaERpclxuICAgIHNlYXJjaERpciA9IHBhcmVudERpclxuICByZXR1cm4gW251bGwsIG51bGxdXG5cbmdldENsYW5nRmxhZ3NDb21wREIgPSAoZmlsZU5hbWUpIC0+XG4gIFtzZWFyY2hEaXIsIGNvbXBEQkNvbnRlbnRzXSA9IGdldEZpbGVDb250ZW50cyhmaWxlTmFtZSwgXCJjb21waWxlX2NvbW1hbmRzLmpzb25cIilcbiAgYXJncyA9IFtdXG4gIGlmIGNvbXBEQkNvbnRlbnRzICE9IG51bGwgJiYgY29tcERCQ29udGVudHMubGVuZ3RoID4gMFxuICAgIGNvbXBEQiA9IEpTT04ucGFyc2UoY29tcERCQ29udGVudHMpXG4gICAgZm9yIGNvbmZpZyBpbiBjb21wREJcbiAgICAgICMgV2UgbWlnaHQgaGF2ZSBmdWxsIHBhdGhzLCBvciB3ZSBtaWdodCBoYXZlIHJlbGF0aXZlIHBhdGhzLiBUcnkgdG8gZ3Vlc3MgdGhlIHJlbGF0aXZlIHBhdGggYnkgcmVtb3ZpbmcgdGhlIHNlYXJjaCBwYXRoIGZyb20gdGhlIGZpbGUgcGF0aFxuICAgICAgcmVsYXRpdmVOYW1lID0gZmlsZU5hbWVbc2VhcmNoRGlyLmxlbmd0aCsxLi5maWxlTmFtZS5sZW5ndGhdXG4gICAgICBpZiBmaWxlTmFtZSA9PSBjb25maWdbJ2ZpbGUnXSB8fCByZWxhdGl2ZU5hbWUgPT0gY29uZmlnWydmaWxlJ11cbiAgICAgICAgYWxsQXJncyA9IGNvbmZpZy5jb21tYW5kLnJlcGxhY2UoL1xccysvZywgXCIgXCIpLnNwbGl0KCcgJylcbiAgICAgICAgc2luZ2xlQXJncyA9IFtdXG4gICAgICAgIGRvdWJsZUFyZ3MgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMC4uYWxsQXJncy5sZW5ndGggLSAxXVxuICAgICAgICAgIG5leHRBcmcgPSBhbGxBcmdzW2krMV1cbiAgICAgICAgICAjIHdvcmsgb3V0IHdoaWNoIGFyZSBzdGFuZGFsb25lIGFyZ3VtZW50cywgYW5kIHdoaWNoIHRha2UgYSBwYXJhbWV0ZXJcbiAgICAgICAgICBzaW5nbGVBcmdzLnB1c2ggYWxsQXJnc1tpXSBpZiBhbGxBcmdzW2ldWzBdID09ICctJyBhbmQgKG5vdCBuZXh0QXJnIHx8IG5leHRBcmdbMF0gPT0gJy0nKVxuICAgICAgICAgIGRvdWJsZUFyZ3MucHVzaCBhbGxBcmdzW2ldICsgXCIgXCIgKyBuZXh0QXJnIGlmIGFsbEFyZ3NbaV1bMF0gPT0gJy0nIGFuZCBuZXh0QXJnIGFuZCAobmV4dEFyZ1swXSAhPSAnLScpXG4gICAgICAgIGFyZ3MgPSBzaW5nbGVBcmdzXG4gICAgICAgIGFyZ3MucHVzaCBpdCBmb3IgaXQgaW4gZG91YmxlQXJncyB3aGVuIGl0WzAuLjddID09ICctaXN5c3RlbSdcbiAgICAgICAgYXJncyA9IGFyZ3MuY29uY2F0IFtcIi13b3JraW5nLWRpcmVjdG9yeT0je3NlYXJjaERpcn1cIl1cbiAgICAgICAgYnJlYWtcbiAgcmV0dXJuIGFyZ3NcblxuZ2V0Q2xhbmdGbGFnc0RvdENsYW5nQ29tcGxldGUgPSAoZmlsZU5hbWUpIC0+XG4gIFtzZWFyY2hEaXIsIGNsYW5nQ29tcGxldGVDb250ZW50c10gPSBnZXRGaWxlQ29udGVudHMoZmlsZU5hbWUsIFwiLmNsYW5nX2NvbXBsZXRlXCIpXG4gIGFyZ3MgPSBbXVxuICBpZiBjbGFuZ0NvbXBsZXRlQ29udGVudHMgIT0gbnVsbCAmJiBjbGFuZ0NvbXBsZXRlQ29udGVudHMubGVuZ3RoID4gMFxuICAgIGFyZ3MgPSBjbGFuZ0NvbXBsZXRlQ29udGVudHMudHJpbSgpLnNwbGl0KFwiXFxuXCIpXG4gICAgYXJncyA9IGFyZ3MuY29uY2F0IFtcIi13b3JraW5nLWRpcmVjdG9yeT0je3NlYXJjaERpcn1cIl1cbiAgcmV0dXJuIGFyZ3NcbiJdfQ==
