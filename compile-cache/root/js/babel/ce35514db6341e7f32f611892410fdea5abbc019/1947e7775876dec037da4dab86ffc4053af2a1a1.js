Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getTerminalViews = getTerminalViews;
exports.destroyTerminalView = destroyTerminalView;
exports.runInTerminal = runInTerminal;
exports.consumeRunInTerminal = consumeRunInTerminal;

/**
 * Copyright (C) 2016 Ivan Kravets. All rights reserved.
 *
 * This source file is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License version 2
 * as published by the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

var _atom = require('atom');

'use babel';

var currentService = null;

function isEnabled() {
  return Boolean(currentService);
}

function getTerminalViews() {
  if (isEnabled()) {
    return currentService.getTerminalViews();
  } else {
    return -1;
  }
}

function destroyTerminalView(view) {
  if (isEnabled()) {
    return currentService.destroyTerminalView(view);
  } else {
    return -1;
  }
}

function runInTerminal(commands) {
  if (isEnabled()) {
    return currentService.run(commands);
  } else {
    return -1;
  }
}

function consumeRunInTerminal(service) {
  // Only first registered provider will be consumed
  if (isEnabled()) {
    console.warn('Multiple terminal providers found.');
    return new _atom.Disposable(function () {});
  }

  currentService = service;

  return new _atom.Disposable(function () {
    // Executed when provider package is deactivated
    currentService = null;
  });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL3BsYXRmb3JtaW8taWRlL2xpYi90ZXJtaW5hbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O29CQW1CeUIsTUFBTTs7QUFuQi9CLFdBQVcsQ0FBQzs7QUFxQlosSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDOztBQUUxQixTQUFTLFNBQVMsR0FBRztBQUNuQixTQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztDQUNoQzs7QUFFTSxTQUFTLGdCQUFnQixHQUFHO0FBQ2pDLE1BQUksU0FBUyxFQUFFLEVBQUU7QUFDZixXQUFPLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0dBQzFDLE1BQU07QUFDTCxXQUFPLENBQUMsQ0FBQyxDQUFDO0dBQ1g7Q0FDRjs7QUFFTSxTQUFTLG1CQUFtQixDQUFDLElBQUksRUFBRTtBQUN4QyxNQUFJLFNBQVMsRUFBRSxFQUFFO0FBQ2YsV0FBTyxjQUFjLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDakQsTUFBTTtBQUNMLFdBQU8sQ0FBQyxDQUFDLENBQUM7R0FDWDtDQUNGOztBQUVNLFNBQVMsYUFBYSxDQUFDLFFBQVEsRUFBRTtBQUN0QyxNQUFJLFNBQVMsRUFBRSxFQUFFO0FBQ2YsV0FBTyxjQUFjLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3JDLE1BQU07QUFDTCxXQUFPLENBQUMsQ0FBQyxDQUFDO0dBQ1g7Q0FDRjs7QUFFTSxTQUFTLG9CQUFvQixDQUFFLE9BQU8sRUFBRTs7QUFFN0MsTUFBSSxTQUFTLEVBQUUsRUFBRTtBQUNmLFdBQU8sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQztBQUNuRCxXQUFPLHFCQUFlLFlBQU0sRUFBRSxDQUFDLENBQUM7R0FDakM7O0FBRUQsZ0JBQWMsR0FBRyxPQUFPLENBQUM7O0FBRXpCLFNBQU8scUJBQWUsWUFBTTs7QUFFMUIsa0JBQWMsR0FBRyxJQUFJLENBQUM7R0FDdkIsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiL1VzZXJzL2d5dXJvYmVuamFtaW4vLmF0b20vcGFja2FnZXMvcGxhdGZvcm1pby1pZGUvbGliL3Rlcm1pbmFsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8qKlxuICogQ29weXJpZ2h0IChDKSAyMDE2IEl2YW4gS3JhdmV0cy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBmaWxlIGlzIGZyZWUgc29mdHdhcmU7IHlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vclxuICogbW9kaWZ5IGl0IHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgdmVyc2lvbiAyXG4gKiBhcyBwdWJsaXNoZWQgYnkgdGhlIEZyZWUgU29mdHdhcmUgRm91bmRhdGlvbi5cbiAqXG4gKiBUaGlzIHByb2dyYW0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbiAqIGJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG4gKiBNRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbiAqIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG4gKlxuICogWW91IHNob3VsZCBoYXZlIHJlY2VpdmVkIGEgY29weSBvZiB0aGUgR05VIEdlbmVyYWwgUHVibGljIExpY2Vuc2UgYWxvbmdcbiAqIHdpdGggdGhpcyBwcm9ncmFtOyBpZiBub3QsIHdyaXRlIHRvIHRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIEluYy4sXG4gKiA1MSBGcmFua2xpbiBTdHJlZXQsIEZpZnRoIEZsb29yLCBCb3N0b24sIE1BIDAyMTEwLTEzMDEgVVNBLlxuICovXG5cbmltcG9ydCB7RGlzcG9zYWJsZX0gZnJvbSAnYXRvbSc7XG5cbmxldCBjdXJyZW50U2VydmljZSA9IG51bGw7XG5cbmZ1bmN0aW9uIGlzRW5hYmxlZCgpIHtcbiAgcmV0dXJuIEJvb2xlYW4oY3VycmVudFNlcnZpY2UpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVybWluYWxWaWV3cygpIHtcbiAgaWYgKGlzRW5hYmxlZCgpKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRTZXJ2aWNlLmdldFRlcm1pbmFsVmlld3MoKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lUZXJtaW5hbFZpZXcodmlldykge1xuICBpZiAoaXNFbmFibGVkKCkpIHtcbiAgICByZXR1cm4gY3VycmVudFNlcnZpY2UuZGVzdHJveVRlcm1pbmFsVmlldyh2aWV3KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJ1bkluVGVybWluYWwoY29tbWFuZHMpIHtcbiAgaWYgKGlzRW5hYmxlZCgpKSB7XG4gICAgcmV0dXJuIGN1cnJlbnRTZXJ2aWNlLnJ1bihjb21tYW5kcyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lUnVuSW5UZXJtaW5hbCAoc2VydmljZSkge1xuICAvLyBPbmx5IGZpcnN0IHJlZ2lzdGVyZWQgcHJvdmlkZXIgd2lsbCBiZSBjb25zdW1lZFxuICBpZiAoaXNFbmFibGVkKCkpIHtcbiAgICBjb25zb2xlLndhcm4oJ011bHRpcGxlIHRlcm1pbmFsIHByb3ZpZGVycyBmb3VuZC4nKTtcbiAgICByZXR1cm4gbmV3IERpc3Bvc2FibGUoKCkgPT4ge30pO1xuICB9XG5cbiAgY3VycmVudFNlcnZpY2UgPSBzZXJ2aWNlO1xuXG4gIHJldHVybiBuZXcgRGlzcG9zYWJsZSgoKSA9PiB7XG4gICAgLy8gRXhlY3V0ZWQgd2hlbiBwcm92aWRlciBwYWNrYWdlIGlzIGRlYWN0aXZhdGVkXG4gICAgY3VycmVudFNlcnZpY2UgPSBudWxsO1xuICB9KTtcbn1cbiJdfQ==