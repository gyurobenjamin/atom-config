'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var StatusBarView = (function () {
  function StatusBarView(statusBar) {
    _classCallCheck(this, StatusBarView);

    this.statusBar = statusBar;
    this.elements = {};
    this.tasks = [];

    this.setupView();
    this.tile = this.statusBar.addRightTile({ item: this.elements.root, priority: -1000 });
  }

  _createClass(StatusBarView, [{
    key: 'setupView',
    value: function setupView() {
      this.elements.root = document.createElement('div');
      this.elements.gear = document.createElement('span');

      this.elements.root.classList.add('inline-block', 'busy');
      this.elements.gear.classList.add('icon-gear');

      this.elements.root.appendChild(this.elements.gear);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this.tile.destroy();
      this.tooltip && this.tooltip.dispose();
    }
  }, {
    key: 'beginTask',
    value: function beginTask(task) {
      this.tasks.push(_extends({}, task, {
        finished: false
      }));

      this.tasks = this.tasks.slice(-atom.config.get('busy.taskBacklog'));

      this.elements.gear.classList.add('is-busy');

      this.setTooltip();
    }
  }, {
    key: 'endTask',
    value: function endTask(endedTask) {
      var index = this.tasks.findIndex(function (t) {
        return t.uniqueId === endedTask.uniqueId;
      });
      this.tasks[index] = _extends({}, endedTask, { finished: true });

      if (!this.tasks.find(function (t) {
        return !t.finished;
      })) {
        this.elements.gear.classList.remove('is-busy');
      }

      this.setTooltip();
    }
  }, {
    key: 'buildTooltipRow',
    value: function buildTooltipRow(task) {
      var classes = ['icon-gear', 'spin'];
      if (task.finished && task.success) {
        classes = ['icon-check'];
      } else if (task.finished && !task.success) {
        classes = ['icon-x', 'text-error'];
      }

      var durationText = task.finished ? '(' + ((task.time.end - task.time.start) / 1000).toFixed(1) + ' s)' : '';

      return '<span class="' + classes.join(' ') + '"></span> ' + task.description + ' ' + durationText;
    }
  }, {
    key: 'setTooltip',
    value: function setTooltip() {
      this.tooltip && this.tooltip.dispose();
      var title = this.tasks.map(this.buildTooltipRow.bind(this)).join('<br />');
      this.tooltip = atom.tooltips.add(this.elements.root, { title: title });
    }
  }]);

  return StatusBarView;
})();

exports['default'] = StatusBarView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1c3kvbGliL3N0YXR1cy1iYXItdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7OztJQUVTLGFBQWE7QUFFckIsV0FGUSxhQUFhLENBRXBCLFNBQVMsRUFBRTswQkFGSixhQUFhOztBQUc5QixRQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztBQUMzQixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsUUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2pCLFFBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztHQUN4Rjs7ZUFUa0IsYUFBYTs7V0FXdkIscUJBQUc7QUFDVixVQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRXBELFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3pELFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTlDLFVBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3BEOzs7V0FFTSxtQkFBRztBQUNSLFVBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEIsVUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQ3hDOzs7V0FFUSxtQkFBQyxJQUFJLEVBQUU7QUFDZCxVQUFJLENBQUMsS0FBSyxDQUFDLElBQUksY0FDVixJQUFJO0FBQ1AsZ0JBQVEsRUFBRSxLQUFLO1NBQ2YsQ0FBQzs7QUFFSCxVQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDOztBQUVwRSxVQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU1QyxVQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7S0FDbkI7OztXQUVNLGlCQUFDLFNBQVMsRUFBRTtBQUNqQixVQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxRQUFRO09BQUEsQ0FBQyxDQUFDO0FBQzNFLFVBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLGdCQUFRLFNBQVMsSUFBRSxRQUFRLEVBQUUsSUFBSSxHQUFFLENBQUM7O0FBRXJELFVBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLENBQUM7ZUFBSSxDQUFDLENBQUMsQ0FBQyxRQUFRO09BQUEsQ0FBQyxFQUFFO0FBQ3RDLFlBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7T0FDaEQ7O0FBRUQsVUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0tBQ25COzs7V0FFYyx5QkFBQyxJQUFJLEVBQUU7QUFDcEIsVUFBSSxPQUFPLEdBQUcsQ0FBRSxXQUFXLEVBQUUsTUFBTSxDQUFFLENBQUM7QUFDdEMsVUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUc7QUFDbEMsZUFBTyxHQUFHLENBQUUsWUFBWSxDQUFFLENBQUM7T0FDNUIsTUFBTSxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO0FBQ3pDLGVBQU8sR0FBRyxDQUFFLFFBQVEsRUFBRSxZQUFZLENBQUUsQ0FBQztPQUN0Qzs7QUFFRCxVQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsUUFBUSxTQUM1QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUEsR0FBSSxJQUFJLENBQUEsQ0FBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLFdBQVEsRUFBRSxDQUFDOztBQUV0RSwrQkFBdUIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsa0JBQWEsSUFBSSxDQUFDLFdBQVcsU0FBSSxZQUFZLENBQUc7S0FDekY7OztXQUVTLHNCQUFHO0FBQ1gsVUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3ZDLFVBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFHLElBQUksQ0FBQyxlQUFlLE1BQXBCLElBQUksRUFBaUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEUsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEtBQUssRUFBTCxLQUFLLEVBQUUsQ0FBQyxDQUFDO0tBQ2pFOzs7U0FwRWtCLGFBQWE7OztxQkFBYixhQUFhIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1c3kvbGliL3N0YXR1cy1iYXItdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0dXNCYXJWaWV3IHtcblxuICBjb25zdHJ1Y3RvcihzdGF0dXNCYXIpIHtcbiAgICB0aGlzLnN0YXR1c0JhciA9IHN0YXR1c0JhcjtcbiAgICB0aGlzLmVsZW1lbnRzID0ge307XG4gICAgdGhpcy50YXNrcyA9IFtdO1xuXG4gICAgdGhpcy5zZXR1cFZpZXcoKTtcbiAgICB0aGlzLnRpbGUgPSB0aGlzLnN0YXR1c0Jhci5hZGRSaWdodFRpbGUoeyBpdGVtOiB0aGlzLmVsZW1lbnRzLnJvb3QsIHByaW9yaXR5OiAtMTAwMCB9KTtcbiAgfVxuXG4gIHNldHVwVmlldygpIHtcbiAgICB0aGlzLmVsZW1lbnRzLnJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmVsZW1lbnRzLmdlYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG5cbiAgICB0aGlzLmVsZW1lbnRzLnJvb3QuY2xhc3NMaXN0LmFkZCgnaW5saW5lLWJsb2NrJywgJ2J1c3knKTtcbiAgICB0aGlzLmVsZW1lbnRzLmdlYXIuY2xhc3NMaXN0LmFkZCgnaWNvbi1nZWFyJyk7XG5cbiAgICB0aGlzLmVsZW1lbnRzLnJvb3QuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50cy5nZWFyKTtcbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy50aWxlLmRlc3Ryb3koKTtcbiAgICB0aGlzLnRvb2x0aXAgJiYgdGhpcy50b29sdGlwLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIGJlZ2luVGFzayh0YXNrKSB7XG4gICAgdGhpcy50YXNrcy5wdXNoKHtcbiAgICAgIC4uLnRhc2ssXG4gICAgICBmaW5pc2hlZDogZmFsc2VcbiAgICB9KTtcblxuICAgIHRoaXMudGFza3MgPSB0aGlzLnRhc2tzLnNsaWNlKC1hdG9tLmNvbmZpZy5nZXQoJ2J1c3kudGFza0JhY2tsb2cnKSk7XG5cbiAgICB0aGlzLmVsZW1lbnRzLmdlYXIuY2xhc3NMaXN0LmFkZCgnaXMtYnVzeScpO1xuXG4gICAgdGhpcy5zZXRUb29sdGlwKCk7XG4gIH1cblxuICBlbmRUYXNrKGVuZGVkVGFzaykge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy50YXNrcy5maW5kSW5kZXgodCA9PiB0LnVuaXF1ZUlkID09PSBlbmRlZFRhc2sudW5pcXVlSWQpO1xuICAgIHRoaXMudGFza3NbaW5kZXhdID0geyAuLi5lbmRlZFRhc2ssIGZpbmlzaGVkOiB0cnVlIH07XG5cbiAgICBpZiAoIXRoaXMudGFza3MuZmluZCh0ID0+ICF0LmZpbmlzaGVkKSkge1xuICAgICAgdGhpcy5lbGVtZW50cy5nZWFyLmNsYXNzTGlzdC5yZW1vdmUoJ2lzLWJ1c3knKTtcbiAgICB9XG5cbiAgICB0aGlzLnNldFRvb2x0aXAoKTtcbiAgfVxuXG4gIGJ1aWxkVG9vbHRpcFJvdyh0YXNrKSB7XG4gICAgbGV0IGNsYXNzZXMgPSBbICdpY29uLWdlYXInLCAnc3BpbicgXTtcbiAgICBpZiAodGFzay5maW5pc2hlZCAmJiB0YXNrLnN1Y2Nlc3MgKSB7XG4gICAgICBjbGFzc2VzID0gWyAnaWNvbi1jaGVjaycgXTtcbiAgICB9IGVsc2UgaWYgKHRhc2suZmluaXNoZWQgJiYgIXRhc2suc3VjY2Vzcykge1xuICAgICAgY2xhc3NlcyA9IFsgJ2ljb24teCcsICd0ZXh0LWVycm9yJyBdO1xuICAgIH1cblxuICAgIGNvbnN0IGR1cmF0aW9uVGV4dCA9IHRhc2suZmluaXNoZWQgP1xuICAgICAgYCgkeygodGFzay50aW1lLmVuZCAtIHRhc2sudGltZS5zdGFydCkgLyAxMDAwKS50b0ZpeGVkKDEpfSBzKWAgOiAnJztcblxuICAgIHJldHVybiBgPHNwYW4gY2xhc3M9XCIke2NsYXNzZXMuam9pbignICcpfVwiPjwvc3Bhbj4gJHt0YXNrLmRlc2NyaXB0aW9ufSAke2R1cmF0aW9uVGV4dH1gO1xuICB9XG5cbiAgc2V0VG9vbHRpcCgpIHtcbiAgICB0aGlzLnRvb2x0aXAgJiYgdGhpcy50b29sdGlwLmRpc3Bvc2UoKTtcbiAgICBjb25zdCB0aXRsZSA9IHRoaXMudGFza3MubWFwKDo6dGhpcy5idWlsZFRvb2x0aXBSb3cpLmpvaW4oJzxiciAvPicpO1xuICAgIHRoaXMudG9vbHRpcCA9IGF0b20udG9vbHRpcHMuYWRkKHRoaXMuZWxlbWVudHMucm9vdCwgeyB0aXRsZSB9KTtcbiAgfVxufVxuIl19