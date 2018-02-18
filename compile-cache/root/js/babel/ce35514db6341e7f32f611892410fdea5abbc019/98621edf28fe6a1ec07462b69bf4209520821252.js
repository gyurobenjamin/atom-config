'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  panelVisibility: {
    title: 'Panel Visibility',
    description: 'Set when the build panel should be visible.',
    type: 'string',
    'default': 'Toggle',
    'enum': ['Toggle', 'Keep Visible', 'Show on Error', 'Hidden'],
    order: 1
  },
  hidePanelHeading: {
    title: 'Hide panel heading',
    description: 'Set whether to hide the build command and control buttons in the build panel',
    type: 'boolean',
    'default': false,
    order: 2
  },
  buildOnSave: {
    title: 'Automatically build on save',
    description: 'Automatically build your project each time an editor is saved.',
    type: 'boolean',
    'default': false,
    order: 3
  },
  saveOnBuild: {
    title: 'Automatically save on build',
    description: 'Automatically save all edited files when triggering a build.',
    type: 'boolean',
    'default': false,
    order: 4
  },
  matchedErrorFailsBuild: {
    title: 'Any matched error will fail the build',
    description: 'Even if the build has a return code of zero it is marked as "failed" if any error is being matched in the output.',
    type: 'boolean',
    'default': true,
    order: 5
  },
  scrollOnError: {
    title: 'Automatically scroll on build error',
    description: 'Automatically scroll to first matched error when a build failed.',
    type: 'boolean',
    'default': false,
    order: 6
  },
  stealFocus: {
    title: 'Steal Focus',
    description: 'Steal focus when opening build panel.',
    type: 'boolean',
    'default': true,
    order: 7
  },
  overrideThemeColors: {
    title: 'Override Theme Colors',
    description: 'Override theme background- and text color inside the terminal',
    type: 'boolean',
    'default': true,
    order: 8
  },
  selectTriggers: {
    title: 'Selecting new target triggers the build',
    description: 'When selecting a new target (through status-bar, cmd-alt-t, etc), the newly selected target will be triggered.',
    type: 'boolean',
    'default': true,
    order: 9
  },
  refreshOnShowTargetList: {
    title: 'Refresh targets when the target list is shown',
    description: 'When opening the targets menu, the targets will be refreshed.',
    type: 'boolean',
    'default': false,
    order: 10
  },
  notificationOnRefresh: {
    title: 'Show notification when targets are refreshed',
    description: 'When targets are refreshed a notification with information about the number of targets will be displayed.',
    type: 'boolean',
    'default': false,
    order: 11
  },
  beepWhenDone: {
    title: 'Beep when the build completes',
    description: 'Make a "beep" notification sound when the build is complete - in success or failure.',
    type: 'boolean',
    'default': false,
    order: 12
  },
  panelOrientation: {
    title: 'Panel Orientation',
    description: 'Where to attach the build panel',
    type: 'string',
    'default': 'Bottom',
    'enum': ['Bottom', 'Top', 'Left', 'Right'],
    order: 13
  },
  statusBar: {
    title: 'Status Bar',
    description: 'Where to place the status bar. Set to `Disable` to disable status bar display.',
    type: 'string',
    'default': 'Left',
    'enum': ['Left', 'Right', 'Disable'],
    order: 14
  },
  statusBarPriority: {
    title: 'Priority on Status Bar',
    description: 'Lower priority tiles are placed further to the left/right, depends on where you choose to place Status Bar.',
    type: 'number',
    'default': -1000,
    order: 15
  },
  terminalScrollback: {
    title: 'Terminal Scrollback Size',
    description: 'Max number of lines of build log kept in the terminal',
    type: 'number',
    'default': 1000,
    order: 16
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL2xpYi9jb25maWcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRztBQUNiLGlCQUFlLEVBQUU7QUFDZixTQUFLLEVBQUUsa0JBQWtCO0FBQ3pCLGVBQVcsRUFBRSw2Q0FBNkM7QUFDMUQsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLFFBQVE7QUFDakIsWUFBTSxDQUFFLFFBQVEsRUFBRSxjQUFjLEVBQUUsZUFBZSxFQUFFLFFBQVEsQ0FBRTtBQUM3RCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0Qsa0JBQWdCLEVBQUU7QUFDaEIsU0FBSyxFQUFFLG9CQUFvQjtBQUMzQixlQUFXLEVBQUUsOEVBQThFO0FBQzNGLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGFBQVcsRUFBRTtBQUNYLFNBQUssRUFBRSw2QkFBNkI7QUFDcEMsZUFBVyxFQUFFLGdFQUFnRTtBQUM3RSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxhQUFXLEVBQUU7QUFDWCxTQUFLLEVBQUUsNkJBQTZCO0FBQ3BDLGVBQVcsRUFBRSw4REFBOEQ7QUFDM0UsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0Qsd0JBQXNCLEVBQUU7QUFDdEIsU0FBSyxFQUFFLHVDQUF1QztBQUM5QyxlQUFXLEVBQUUsbUhBQW1IO0FBQ2hJLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGVBQWEsRUFBRTtBQUNiLFNBQUssRUFBRSxxQ0FBcUM7QUFDNUMsZUFBVyxFQUFFLGtFQUFrRTtBQUMvRSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxZQUFVLEVBQUU7QUFDVixTQUFLLEVBQUUsYUFBYTtBQUNwQixlQUFXLEVBQUUsdUNBQXVDO0FBQ3BELFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELHFCQUFtQixFQUFFO0FBQ25CLFNBQUssRUFBRSx1QkFBdUI7QUFDOUIsZUFBVyxFQUFFLCtEQUErRDtBQUM1RSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxnQkFBYyxFQUFFO0FBQ2QsU0FBSyxFQUFFLHlDQUF5QztBQUNoRCxlQUFXLEVBQUUsZ0hBQWdIO0FBQzdILFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELHlCQUF1QixFQUFFO0FBQ3ZCLFNBQUssRUFBRSwrQ0FBK0M7QUFDdEQsZUFBVyxFQUFFLCtEQUErRDtBQUM1RSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCx1QkFBcUIsRUFBRTtBQUNyQixTQUFLLEVBQUUsOENBQThDO0FBQ3JELGVBQVcsRUFBRSwyR0FBMkc7QUFDeEgsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0QsY0FBWSxFQUFFO0FBQ1osU0FBSyxFQUFFLCtCQUErQjtBQUN0QyxlQUFXLEVBQUUsc0ZBQXNGO0FBQ25HLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLEVBQUU7R0FDVjtBQUNELGtCQUFnQixFQUFFO0FBQ2hCLFNBQUssRUFBRSxtQkFBbUI7QUFDMUIsZUFBVyxFQUFFLGlDQUFpQztBQUM5QyxRQUFJLEVBQUUsUUFBUTtBQUNkLGVBQVMsUUFBUTtBQUNqQixZQUFNLENBQUUsUUFBUSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFFO0FBQzFDLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxXQUFTLEVBQUU7QUFDVCxTQUFLLEVBQUUsWUFBWTtBQUNuQixlQUFXLEVBQUUsZ0ZBQWdGO0FBQzdGLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxNQUFNO0FBQ2YsWUFBTSxDQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFFO0FBQ3BDLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxtQkFBaUIsRUFBRTtBQUNqQixTQUFLLEVBQUUsd0JBQXdCO0FBQy9CLGVBQVcsRUFBRSw2R0FBNkc7QUFDMUgsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLENBQUMsSUFBSTtBQUNkLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCxvQkFBa0IsRUFBRTtBQUNsQixTQUFLLEVBQUUsMEJBQTBCO0FBQ2pDLGVBQVcsRUFBRSx1REFBdUQ7QUFDcEUsUUFBSSxFQUFFLFFBQVE7QUFDZCxlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsRUFBRTtHQUNWO0NBQ0YiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvYnVpbGQvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHBhbmVsVmlzaWJpbGl0eToge1xuICAgIHRpdGxlOiAnUGFuZWwgVmlzaWJpbGl0eScsXG4gICAgZGVzY3JpcHRpb246ICdTZXQgd2hlbiB0aGUgYnVpbGQgcGFuZWwgc2hvdWxkIGJlIHZpc2libGUuJyxcbiAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICBkZWZhdWx0OiAnVG9nZ2xlJyxcbiAgICBlbnVtOiBbICdUb2dnbGUnLCAnS2VlcCBWaXNpYmxlJywgJ1Nob3cgb24gRXJyb3InLCAnSGlkZGVuJyBdLFxuICAgIG9yZGVyOiAxXG4gIH0sXG4gIGhpZGVQYW5lbEhlYWRpbmc6IHtcbiAgICB0aXRsZTogJ0hpZGUgcGFuZWwgaGVhZGluZycsXG4gICAgZGVzY3JpcHRpb246ICdTZXQgd2hldGhlciB0byBoaWRlIHRoZSBidWlsZCBjb21tYW5kIGFuZCBjb250cm9sIGJ1dHRvbnMgaW4gdGhlIGJ1aWxkIHBhbmVsJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDJcbiAgfSxcbiAgYnVpbGRPblNhdmU6IHtcbiAgICB0aXRsZTogJ0F1dG9tYXRpY2FsbHkgYnVpbGQgb24gc2F2ZScsXG4gICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IGJ1aWxkIHlvdXIgcHJvamVjdCBlYWNoIHRpbWUgYW4gZWRpdG9yIGlzIHNhdmVkLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiAzXG4gIH0sXG4gIHNhdmVPbkJ1aWxkOiB7XG4gICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IHNhdmUgb24gYnVpbGQnLFxuICAgIGRlc2NyaXB0aW9uOiAnQXV0b21hdGljYWxseSBzYXZlIGFsbCBlZGl0ZWQgZmlsZXMgd2hlbiB0cmlnZ2VyaW5nIGEgYnVpbGQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDRcbiAgfSxcbiAgbWF0Y2hlZEVycm9yRmFpbHNCdWlsZDoge1xuICAgIHRpdGxlOiAnQW55IG1hdGNoZWQgZXJyb3Igd2lsbCBmYWlsIHRoZSBidWlsZCcsXG4gICAgZGVzY3JpcHRpb246ICdFdmVuIGlmIHRoZSBidWlsZCBoYXMgYSByZXR1cm4gY29kZSBvZiB6ZXJvIGl0IGlzIG1hcmtlZCBhcyBcImZhaWxlZFwiIGlmIGFueSBlcnJvciBpcyBiZWluZyBtYXRjaGVkIGluIHRoZSBvdXRwdXQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogNVxuICB9LFxuICBzY3JvbGxPbkVycm9yOiB7XG4gICAgdGl0bGU6ICdBdXRvbWF0aWNhbGx5IHNjcm9sbCBvbiBidWlsZCBlcnJvcicsXG4gICAgZGVzY3JpcHRpb246ICdBdXRvbWF0aWNhbGx5IHNjcm9sbCB0byBmaXJzdCBtYXRjaGVkIGVycm9yIHdoZW4gYSBidWlsZCBmYWlsZWQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDZcbiAgfSxcbiAgc3RlYWxGb2N1czoge1xuICAgIHRpdGxlOiAnU3RlYWwgRm9jdXMnLFxuICAgIGRlc2NyaXB0aW9uOiAnU3RlYWwgZm9jdXMgd2hlbiBvcGVuaW5nIGJ1aWxkIHBhbmVsLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDdcbiAgfSxcbiAgb3ZlcnJpZGVUaGVtZUNvbG9yczoge1xuICAgIHRpdGxlOiAnT3ZlcnJpZGUgVGhlbWUgQ29sb3JzJyxcbiAgICBkZXNjcmlwdGlvbjogJ092ZXJyaWRlIHRoZW1lIGJhY2tncm91bmQtIGFuZCB0ZXh0IGNvbG9yIGluc2lkZSB0aGUgdGVybWluYWwnLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA4XG4gIH0sXG4gIHNlbGVjdFRyaWdnZXJzOiB7XG4gICAgdGl0bGU6ICdTZWxlY3RpbmcgbmV3IHRhcmdldCB0cmlnZ2VycyB0aGUgYnVpbGQnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBzZWxlY3RpbmcgYSBuZXcgdGFyZ2V0ICh0aHJvdWdoIHN0YXR1cy1iYXIsIGNtZC1hbHQtdCwgZXRjKSwgdGhlIG5ld2x5IHNlbGVjdGVkIHRhcmdldCB3aWxsIGJlIHRyaWdnZXJlZC4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA5XG4gIH0sXG4gIHJlZnJlc2hPblNob3dUYXJnZXRMaXN0OiB7XG4gICAgdGl0bGU6ICdSZWZyZXNoIHRhcmdldHMgd2hlbiB0aGUgdGFyZ2V0IGxpc3QgaXMgc2hvd24nLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBvcGVuaW5nIHRoZSB0YXJnZXRzIG1lbnUsIHRoZSB0YXJnZXRzIHdpbGwgYmUgcmVmcmVzaGVkLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiAxMFxuICB9LFxuICBub3RpZmljYXRpb25PblJlZnJlc2g6IHtcbiAgICB0aXRsZTogJ1Nob3cgbm90aWZpY2F0aW9uIHdoZW4gdGFyZ2V0cyBhcmUgcmVmcmVzaGVkJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZW4gdGFyZ2V0cyBhcmUgcmVmcmVzaGVkIGEgbm90aWZpY2F0aW9uIHdpdGggaW5mb3JtYXRpb24gYWJvdXQgdGhlIG51bWJlciBvZiB0YXJnZXRzIHdpbGwgYmUgZGlzcGxheWVkLicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiAxMVxuICB9LFxuICBiZWVwV2hlbkRvbmU6IHtcbiAgICB0aXRsZTogJ0JlZXAgd2hlbiB0aGUgYnVpbGQgY29tcGxldGVzJyxcbiAgICBkZXNjcmlwdGlvbjogJ01ha2UgYSBcImJlZXBcIiBub3RpZmljYXRpb24gc291bmQgd2hlbiB0aGUgYnVpbGQgaXMgY29tcGxldGUgLSBpbiBzdWNjZXNzIG9yIGZhaWx1cmUuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDEyXG4gIH0sXG4gIHBhbmVsT3JpZW50YXRpb246IHtcbiAgICB0aXRsZTogJ1BhbmVsIE9yaWVudGF0aW9uJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZXJlIHRvIGF0dGFjaCB0aGUgYnVpbGQgcGFuZWwnLFxuICAgIHR5cGU6ICdzdHJpbmcnLFxuICAgIGRlZmF1bHQ6ICdCb3R0b20nLFxuICAgIGVudW06IFsgJ0JvdHRvbScsICdUb3AnLCAnTGVmdCcsICdSaWdodCcgXSxcbiAgICBvcmRlcjogMTNcbiAgfSxcbiAgc3RhdHVzQmFyOiB7XG4gICAgdGl0bGU6ICdTdGF0dXMgQmFyJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZXJlIHRvIHBsYWNlIHRoZSBzdGF0dXMgYmFyLiBTZXQgdG8gYERpc2FibGVgIHRvIGRpc2FibGUgc3RhdHVzIGJhciBkaXNwbGF5LicsXG4gICAgdHlwZTogJ3N0cmluZycsXG4gICAgZGVmYXVsdDogJ0xlZnQnLFxuICAgIGVudW06IFsgJ0xlZnQnLCAnUmlnaHQnLCAnRGlzYWJsZScgXSxcbiAgICBvcmRlcjogMTRcbiAgfSxcbiAgc3RhdHVzQmFyUHJpb3JpdHk6IHtcbiAgICB0aXRsZTogJ1ByaW9yaXR5IG9uIFN0YXR1cyBCYXInLFxuICAgIGRlc2NyaXB0aW9uOiAnTG93ZXIgcHJpb3JpdHkgdGlsZXMgYXJlIHBsYWNlZCBmdXJ0aGVyIHRvIHRoZSBsZWZ0L3JpZ2h0LCBkZXBlbmRzIG9uIHdoZXJlIHlvdSBjaG9vc2UgdG8gcGxhY2UgU3RhdHVzIEJhci4nLFxuICAgIHR5cGU6ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IC0xMDAwLFxuICAgIG9yZGVyOiAxNVxuICB9LFxuICB0ZXJtaW5hbFNjcm9sbGJhY2s6IHtcbiAgICB0aXRsZTogJ1Rlcm1pbmFsIFNjcm9sbGJhY2sgU2l6ZScsXG4gICAgZGVzY3JpcHRpb246ICdNYXggbnVtYmVyIG9mIGxpbmVzIG9mIGJ1aWxkIGxvZyBrZXB0IGluIHRoZSB0ZXJtaW5hbCcsXG4gICAgdHlwZTogJ251bWJlcicsXG4gICAgZGVmYXVsdDogMTAwMCxcbiAgICBvcmRlcjogMTZcbiAgfVxufTtcbiJdfQ==