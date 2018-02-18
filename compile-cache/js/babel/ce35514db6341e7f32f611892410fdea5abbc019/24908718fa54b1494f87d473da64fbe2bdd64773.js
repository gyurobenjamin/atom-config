'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function uuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  }
  return '' + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

var GoogleAnalytics = (function () {
  function GoogleAnalytics() {
    _classCallCheck(this, GoogleAnalytics);
  }

  _createClass(GoogleAnalytics, null, [{
    key: 'getCid',
    value: function getCid(cb) {
      var _this = this;

      if (this.cid) {
        cb(this.cid);
        return;
      }

      require('getmac').getMac(function (error, macAddress) {
        return error ? cb(_this.cid = uuid()) : cb(_this.cid = require('crypto').createHash('sha1').update(macAddress, 'utf8').digest('hex'));
      });
    }
  }, {
    key: 'sendEvent',
    value: function sendEvent(category, action, label, value) {
      var params = {
        t: 'event',
        ec: category,
        ea: action
      };
      if (label) {
        params.el = label;
      }
      if (value) {
        params.ev = value;
      }

      this.send(params);
    }
  }, {
    key: 'send',
    value: function send(params) {
      var _this2 = this;

      if (!atom.packages.getActivePackage('metrics')) {
        // If the metrics package is disabled, then user has opted out.
        return;
      }

      GoogleAnalytics.getCid(function (cid) {
        Object.assign(params, { cid: cid }, GoogleAnalytics.defaultParams());
        _this2.request('https://www.google-analytics.com/collect?' + require('querystring').stringify(params));
      });
    }
  }, {
    key: 'request',
    value: function request(url) {
      if (!navigator.onLine) {
        return;
      }
      this.post(url);
    }
  }, {
    key: 'post',
    value: function post(url) {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.send(null);
    }
  }, {
    key: 'defaultParams',
    value: function defaultParams() {
      // https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters
      return {
        v: 1,
        tid: 'UA-47615700-5'
      };
    }
  }]);

  return GoogleAnalytics;
})();

exports['default'] = GoogleAnalytics;

atom.packages.onDidActivatePackage(function (pkg) {
  if ('metrics' === pkg.name) {
    var buildPackage = atom.packages.getLoadedPackage('build');
    require('./google-analytics').sendEvent('core', 'activated', buildPackage.metadata.version);
  }
});
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9nb29nbGUtYW5hbHl0aWNzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7OztBQUVaLFNBQVMsSUFBSSxHQUFHO0FBQ2QsV0FBUyxFQUFFLEdBQUc7QUFDWixXQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBLEdBQUksT0FBTyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUM1RTtBQUNELGNBQVUsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLFNBQUksRUFBRSxFQUFFLFNBQUksRUFBRSxFQUFFLFNBQUksRUFBRSxFQUFFLFNBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUc7Q0FDdkU7O0lBRW9CLGVBQWU7V0FBZixlQUFlOzBCQUFmLGVBQWU7OztlQUFmLGVBQWU7O1dBQ3JCLGdCQUFDLEVBQUUsRUFBRTs7O0FBQ2hCLFVBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNaLFVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDYixlQUFPO09BQ1I7O0FBRUQsYUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxVQUFVLEVBQUs7QUFDOUMsZUFBTyxLQUFLLEdBQ1YsRUFBRSxDQUFDLE1BQUssR0FBRyxHQUFHLElBQUksRUFBRSxDQUFDLEdBQ3JCLEVBQUUsQ0FBQyxNQUFLLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7T0FDaEcsQ0FBQyxDQUFDO0tBQ0o7OztXQUVlLG1CQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtBQUMvQyxVQUFNLE1BQU0sR0FBRztBQUNiLFNBQUMsRUFBRSxPQUFPO0FBQ1YsVUFBRSxFQUFFLFFBQVE7QUFDWixVQUFFLEVBQUUsTUFBTTtPQUNYLENBQUM7QUFDRixVQUFJLEtBQUssRUFBRTtBQUNULGNBQU0sQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDO09BQ25CO0FBQ0QsVUFBSSxLQUFLLEVBQUU7QUFDVCxjQUFNLENBQUMsRUFBRSxHQUFHLEtBQUssQ0FBQztPQUNuQjs7QUFFRCxVQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ25COzs7V0FFVSxjQUFDLE1BQU0sRUFBRTs7O0FBQ2xCLFVBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxFQUFFOztBQUU5QyxlQUFPO09BQ1I7O0FBRUQscUJBQWUsQ0FBQyxNQUFNLENBQUMsVUFBQyxHQUFHLEVBQUs7QUFDOUIsY0FBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7QUFDckUsZUFBSyxPQUFPLENBQUMsMkNBQTJDLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO09BQ3RHLENBQUMsQ0FBQztLQUNKOzs7V0FFYSxpQkFBQyxHQUFHLEVBQUU7QUFDbEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUU7QUFDckIsZUFBTztPQUNSO0FBQ0QsVUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNoQjs7O1dBRVUsY0FBQyxHQUFHLEVBQUU7QUFDZixVQUFNLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO0FBQ2pDLFNBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3RCLFNBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEI7OztXQUVtQix5QkFBRzs7QUFFckIsYUFBTztBQUNMLFNBQUMsRUFBRSxDQUFDO0FBQ0osV0FBRyxFQUFFLGVBQWU7T0FDckIsQ0FBQztLQUNIOzs7U0E3RGtCLGVBQWU7OztxQkFBZixlQUFlOztBQWdFcEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFDLEdBQUcsRUFBSztBQUMxQyxNQUFJLFNBQVMsS0FBSyxHQUFHLENBQUMsSUFBSSxFQUFFO0FBQzFCLFFBQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDN0QsV0FBTyxDQUFDLG9CQUFvQixDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUM3RjtDQUNGLENBQUMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvZ3l1cm9iZW5qYW1pbi8uYXRvbS9wYWNrYWdlcy9idWlsZC9saWIvZ29vZ2xlLWFuYWx5dGljcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5mdW5jdGlvbiB1dWlkKCkge1xuICBmdW5jdGlvbiBzNCgpIHtcbiAgICByZXR1cm4gTWF0aC5mbG9vcigoMSArIE1hdGgucmFuZG9tKCkpICogMHgxMDAwMCkudG9TdHJpbmcoMTYpLnN1YnN0cmluZygxKTtcbiAgfVxuICByZXR1cm4gYCR7czQoKX0ke3M0KCl9LSR7czQoKX0tJHtzNCgpfS0ke3M0KCl9LSR7czQoKX0ke3M0KCl9JHtzNCgpfWA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdvb2dsZUFuYWx5dGljcyB7XG4gIHN0YXRpYyBnZXRDaWQoY2IpIHtcbiAgICBpZiAodGhpcy5jaWQpIHtcbiAgICAgIGNiKHRoaXMuY2lkKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXF1aXJlKCdnZXRtYWMnKS5nZXRNYWMoKGVycm9yLCBtYWNBZGRyZXNzKSA9PiB7XG4gICAgICByZXR1cm4gZXJyb3IgP1xuICAgICAgICBjYih0aGlzLmNpZCA9IHV1aWQoKSkgOlxuICAgICAgICBjYih0aGlzLmNpZCA9IHJlcXVpcmUoJ2NyeXB0bycpLmNyZWF0ZUhhc2goJ3NoYTEnKS51cGRhdGUobWFjQWRkcmVzcywgJ3V0ZjgnKS5kaWdlc3QoJ2hleCcpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyBzZW5kRXZlbnQoY2F0ZWdvcnksIGFjdGlvbiwgbGFiZWwsIHZhbHVlKSB7XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgdDogJ2V2ZW50JyxcbiAgICAgIGVjOiBjYXRlZ29yeSxcbiAgICAgIGVhOiBhY3Rpb25cbiAgICB9O1xuICAgIGlmIChsYWJlbCkge1xuICAgICAgcGFyYW1zLmVsID0gbGFiZWw7XG4gICAgfVxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgcGFyYW1zLmV2ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgdGhpcy5zZW5kKHBhcmFtcyk7XG4gIH1cblxuICBzdGF0aWMgc2VuZChwYXJhbXMpIHtcbiAgICBpZiAoIWF0b20ucGFja2FnZXMuZ2V0QWN0aXZlUGFja2FnZSgnbWV0cmljcycpKSB7XG4gICAgICAvLyBJZiB0aGUgbWV0cmljcyBwYWNrYWdlIGlzIGRpc2FibGVkLCB0aGVuIHVzZXIgaGFzIG9wdGVkIG91dC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBHb29nbGVBbmFseXRpY3MuZ2V0Q2lkKChjaWQpID0+IHtcbiAgICAgIE9iamVjdC5hc3NpZ24ocGFyYW1zLCB7IGNpZDogY2lkIH0sIEdvb2dsZUFuYWx5dGljcy5kZWZhdWx0UGFyYW1zKCkpO1xuICAgICAgdGhpcy5yZXF1ZXN0KCdodHRwczovL3d3dy5nb29nbGUtYW5hbHl0aWNzLmNvbS9jb2xsZWN0PycgKyByZXF1aXJlKCdxdWVyeXN0cmluZycpLnN0cmluZ2lmeShwYXJhbXMpKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN0YXRpYyByZXF1ZXN0KHVybCkge1xuICAgIGlmICghbmF2aWdhdG9yLm9uTGluZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnBvc3QodXJsKTtcbiAgfVxuXG4gIHN0YXRpYyBwb3N0KHVybCkge1xuICAgIGNvbnN0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIHhoci5vcGVuKCdQT1NUJywgdXJsKTtcbiAgICB4aHIuc2VuZChudWxsKTtcbiAgfVxuXG4gIHN0YXRpYyBkZWZhdWx0UGFyYW1zKCkge1xuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2FuYWx5dGljcy9kZXZndWlkZXMvY29sbGVjdGlvbi9wcm90b2NvbC92MS9wYXJhbWV0ZXJzXG4gICAgcmV0dXJuIHtcbiAgICAgIHY6IDEsXG4gICAgICB0aWQ6ICdVQS00NzYxNTcwMC01J1xuICAgIH07XG4gIH1cbn1cblxuYXRvbS5wYWNrYWdlcy5vbkRpZEFjdGl2YXRlUGFja2FnZSgocGtnKSA9PiB7XG4gIGlmICgnbWV0cmljcycgPT09IHBrZy5uYW1lKSB7XG4gICAgY29uc3QgYnVpbGRQYWNrYWdlID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCdidWlsZCcpO1xuICAgIHJlcXVpcmUoJy4vZ29vZ2xlLWFuYWx5dGljcycpLnNlbmRFdmVudCgnY29yZScsICdhY3RpdmF0ZWQnLCBidWlsZFBhY2thZ2UubWV0YWRhdGEudmVyc2lvbik7XG4gIH1cbn0pO1xuIl19