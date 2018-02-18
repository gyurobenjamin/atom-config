
/* eslint no-console:0 */
'use strict';

// Imports

function _classCallCheck(instance, Constructor) {
	if (!(instance instanceof Constructor)) {
		throw new TypeError("Cannot call a class as a function");
	}
}

function _possibleConstructorReturn(self, call) {
	if (!self) {
		throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	}return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
	if (typeof superClass !== "function" && superClass !== null) {
		throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
	}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var pathUtil = require('path');

// Helper class to display nested error in a sensible way

var DetailedError = (function (_Error) {
	_inherits(DetailedError, _Error);

	function DetailedError(message, /* :string */details /* :Object */) {
		_classCallCheck(this, DetailedError);

		Object.keys(details).forEach(function (key) {
			var data = details[key];
			var value = require('util').inspect(data.stack || data.message || data);
			message += '\n' + key + ': ' + value;
		});
		return _possibleConstructorReturn(this, (DetailedError.__proto__ || Object.getPrototypeOf(DetailedError)).call(this, message));
	}

	return DetailedError;
})(Error);

// Environment fetching

var blacklist = process && process.env && process.env.EDITIONS_SYNTAX_BLACKLIST && process.env.EDITIONS_SYNTAX_BLACKLIST.split(',');

// Cache of which syntax combinations are supported or unsupported, hash of booleans
var syntaxFailedCombitions = {}; // sorted lowercase syntax combination => Error instance of failure
var syntaxBlacklist = {};
syntaxBlacklist["import"] = new Error('The import syntax is skipped as the module package.json field eliminates the need for autoloader support');
syntaxBlacklist.coffeescript = new Error('The coffeescript syntax is skipped as we want to use a precompiled edition rather than compiling at runtime');
syntaxBlacklist.typescript = new Error('The typescript syntax is skipped as we want to use a precompiled edition rather than compiling at runtime');

// Blacklist non-esnext node versions from esnext
if (process && process.versions && process.versions.node) {
	var EARLIEST_ESNEXT_NODE_VERSION = [0, 12];
	var NODE_VERSION = process.versions.node.split('.').map(function (n) {
		return parseInt(n, 10);
	});
	var ESNEXT_UNSUPPORTED = NODE_VERSION[0] < EARLIEST_ESNEXT_NODE_VERSION[0] || NODE_VERSION[0] === EARLIEST_ESNEXT_NODE_VERSION[0] && NODE_VERSION[1] < EARLIEST_ESNEXT_NODE_VERSION[1];
	if (ESNEXT_UNSUPPORTED) syntaxBlacklist.esnext = new Error('The esnext syntax is skipped on early node versions as attempting to use esnext features will output debugging information on these node versions');
}

// Check the environment configuration for a syntax blacklist
if (blacklist) {
	for (var i = 0; i < blacklist.length; ++i) {
		var syntax = blacklist[i].trim().toLowerCase();
		syntaxBlacklist[syntax] = new DetailedError('The EDITIONS_SYNTAX_BLACKLIST environment variable has blacklisted an edition syntax:', { syntax: syntax, blacklist: blacklist });
	}
}

/* ::
type edition = {
	name:number,
	description?:string,
	directory?:string,
	entry?:string,
	syntaxes?:Array<string>
};
type options = {
	cwd?:string,
	package?:string,
	entry?:string,
	require:function
};
*/

/**
 * Cycle through the editions and require the correct one
 * @protected internal function that is untested for public consumption
 * @param {edition} edition - the edition entry
 * @param {Object} opts - the following options
 * @param {string} opts.require - the require method of the calling module, used to ensure require paths remain correct
 * @param {string} [opts.cwd] - if provided, this will be the cwd for entries
 * @param {string} [opts.entry] - if provided, should be a relative or absolute path to the entry point of the edition
 * @param {string} [opts.package] - if provided, should be the name of the package that we are loading the editions for
 * @returns {*}
 */
function requireEdition(edition, /* :edition */opts /* :options */) /* :any */{
	// Prevent require from being included in debug logs
	Object.defineProperty(opts, 'require', { value: opts.require, enumerable: false });

	// Get the correct entry path
	// As older versions o
	var cwd = opts.cwd || '';
	var dir = edition.directory || '';
	var entry = opts.entry || edition.entry || '';
	if (dir && entry && entry.indexOf(dir + '/') === 0) entry = entry.substring(dir.length + 1);
	// ^ this should not be needed, but as previous versions of editions included the directory inside the entry
	// it unfortunately is, as such this is a stepping stone for the new format, the new format being
	// if entry is specified by itself, it is cwd => entry
	// if entry is specified with a directory, it is cwd => dir => entry
	// if entry is not specified but dir is, it is cwd => dir
	// if neither entry nor dir are specified, we have a problem
	if (!dir && !entry) {
		var editionFailure = new DetailedError('Skipped edition due to no entry or directory being specified:', { edition: edition, cwd: cwd, dir: dir, entry: entry });
		throw editionFailure;
	}
	var entryPath = pathUtil.resolve(cwd, dir, entry);

	// Check syntax support
	// Convert syntaxes into a sorted lowercase string
	var syntaxes = edition.syntaxes && edition.syntaxes.map(function (i) {
		return i.toLowerCase();
	}).sort();
	var syntaxCombination = syntaxes && syntaxes.join(', ');
	if (syntaxes && syntaxCombination) {
		// Check if any of the syntaxes are unsupported
		var unsupportedSyntaxes = syntaxes.filter(function (i) {
			return syntaxBlacklist[i.toLowerCase()];
		});
		if (unsupportedSyntaxes.length) {
			var _editionFailure = new DetailedError('Skipped edition due to it containing an unsupported syntax:', { edition: edition, unsupportedSyntaxes: unsupportedSyntaxes });
			throw _editionFailure;
		}
		// Is this syntax combination unsupported? If so skip it with a soft failure to try the next edition
		else if (syntaxFailedCombitions[syntaxCombination]) {
				var previousCombinationFailure = syntaxFailedCombitions[syntaxCombination];
				var _editionFailure2 = new DetailedError('Skipped edition due to its syntax combinatiom failing previously:', { edition: edition, previousCombinationFailure: previousCombinationFailure });
				throw _editionFailure2;
			}
	}

	// Try and load this syntax combination
	try {
		return opts.require(entryPath);
	} catch (error) {
		// Note the error with more details
		var _editionFailure3 = new DetailedError('Failed to load the edition due to a load error:', { edition: edition, error: error.stack });

		// Blacklist the combination, even if it may have worked before
		// Perhaps in the future note if that if it did work previously, then we should instruct module owners to be more specific with their syntaxes
		if (syntaxCombination) syntaxFailedCombitions[syntaxCombination] = _editionFailure3;

		// Continue to the next edition
		throw _editionFailure3;
	}
}

/**
 * Cycle through the editions and require the correct one
 * @protected internal function that is untested for public consumption
 * @param {Array<edition>} editions - an array of edition entries
 * @param {Object} opts - the following options
 * @param {string} opts.require - the require method of the calling module, used to ensure require paths remain correct
 * @param {string} [opts.cwd] - if provided, this will be the cwd for entries
 * @param {string} [opts.entry] - if provided, should be a relative path to the entry point of the edition
 * @param {string} [opts.package] - if provided, should be the name of the package that we are loading the editions for
 * @returns {*}
 */
function requireEditions(editions, /* :Array<edition> */opts /* :options */) /* :any */{
	// Extract
	if (opts["package"] == null) opts["package"] = 'custom runtime package';

	// Check
	if (!editions || editions.length === 0) {
		throw new DetailedError('No editions were specified:', { opts: opts });
	}

	// Note the last error message
	var editionFailures = [];

	// Cycle through the editions
	for (var _i = 0; _i < editions.length; ++_i) {
		var edition = editions[_i];
		try {
			return requireEdition(edition, opts);
		} catch (err) {
			editionFailures.push(err);
		}
	}

	// Through the error as no edition loaded
	throw new DetailedError('There are no suitable editions for this environment:', { opts: opts, editions: editions, failures: editionFailures });
}

/**
 * Cycle through the editions for a package and require the correct one
 * @param {string} cwd - the path of the package, used to load package.json:editions and handle relative edition entry points
 * @param {function} require - the require method of the calling module, used to ensure require paths remain correct
 * @param {string} [entry] - an optional override for the entry of an edition, requires the edition to specify a `directory` property
 * @returns {*}
 */
function requirePackage(cwd, /* :string */require, /* :function */entry /* :: ?:string */) /* :any */{
	// Load the package.json file to fetch `name` for debugging and `editions` for loading
	var packagePath = pathUtil.resolve(cwd, 'package.json');

	var _require = require(packagePath),
	    name = _require.name,
	    editions = _require.editions;

	var opts /* :options */ = { cwd: cwd, require: require };
	if (name) opts["package"] = name;
	if (entry) opts.entry = entry;
	return requireEditions(editions, opts);
}

// Exports
module.exports = { requireEdition: requireEdition, requireEditions: requireEditions, requirePackage: requirePackage };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL25vZGVfbW9kdWxlcy9lZGl0aW9ucy9lczIwMTUvaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxZQUFZLENBQUM7Ozs7QUFJYixTQUFTLGVBQWUsQ0FBQyxRQUFRLEVBQUUsV0FBVyxFQUFFO0FBQUUsS0FBSSxFQUFFLFFBQVEsWUFBWSxXQUFXLENBQUEsQUFBQyxFQUFFO0FBQUUsUUFBTSxJQUFJLFNBQVMsQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO0VBQUU7Q0FBRTs7QUFFekosU0FBUywwQkFBMEIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFO0FBQUUsS0FBSSxDQUFDLElBQUksRUFBRTtBQUFFLFFBQU0sSUFBSSxjQUFjLENBQUMsMkRBQTJELENBQUMsQ0FBQztFQUFFLEFBQUMsT0FBTyxJQUFJLEtBQUssT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVUsQ0FBQSxBQUFDLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztDQUFFOztBQUVoUCxTQUFTLFNBQVMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFO0FBQUUsS0FBSSxPQUFPLFVBQVUsS0FBSyxVQUFVLElBQUksVUFBVSxLQUFLLElBQUksRUFBRTtBQUFFLFFBQU0sSUFBSSxTQUFTLENBQUMsMERBQTBELEdBQUcsT0FBTyxVQUFVLENBQUMsQ0FBQztFQUFFLEFBQUMsUUFBUSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQyxBQUFDLElBQUksVUFBVSxFQUFFLE1BQU0sQ0FBQyxjQUFjLEdBQUcsTUFB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QUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxDQUFDLENBQUM7Q0FDL0k7Ozs7Ozs7OztBQVNELFNBQVMsY0FBYyxDQUFDLEdBQUcsZUFBZ0IsT0FBTyxpQkFBa0IsS0FBSyw4QkFBOEI7O0FBRXRHLEtBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUV4RCxLQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDO0tBQy9CLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSTtLQUNwQixRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQzs7QUFFakMsS0FBSSxJQUFJLGtCQUFrQixFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQ3pELEtBQUksSUFBSSxFQUFFLElBQUksV0FBUSxHQUFHLElBQUksQ0FBQztBQUM5QixLQUFJLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUM5QixRQUFPLGVBQWUsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7Q0FDdkM7OztBQUdELE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxjQUFjLEVBQUUsY0FBYyxFQUFFLGVBQWUsRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBRSxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9neXVyb2JlbmphbWluLy5hdG9tL3BhY2thZ2VzL2J1aWxkL25vZGVfbW9kdWxlcy9lZGl0aW9ucy9lczIwMTUvaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBAZmxvdyAqL1xuLyogZXNsaW50IG5vLWNvbnNvbGU6MCAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBJbXBvcnRzXG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHNlbGYsIGNhbGwpIHsgaWYgKCFzZWxmKSB7IHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTsgfSByZXR1cm4gY2FsbCAmJiAodHlwZW9mIGNhbGwgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjsgfVxuXG5mdW5jdGlvbiBfaW5oZXJpdHMoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHsgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTsgfSBzdWJDbGFzcy5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHsgY29uc3RydWN0b3I6IHsgdmFsdWU6IHN1YkNsYXNzLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH0pOyBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7IH1cblxudmFyIHBhdGhVdGlsID0gcmVxdWlyZSgncGF0aCcpO1xuXG4vLyBIZWxwZXIgY2xhc3MgdG8gZGlzcGxheSBuZXN0ZWQgZXJyb3IgaW4gYSBzZW5zaWJsZSB3YXlcblxudmFyIERldGFpbGVkRXJyb3IgPSBmdW5jdGlvbiAoX0Vycm9yKSB7XG5cdF9pbmhlcml0cyhEZXRhaWxlZEVycm9yLCBfRXJyb3IpO1xuXG5cdGZ1bmN0aW9uIERldGFpbGVkRXJyb3IobWVzc2FnZSAvKiA6c3RyaW5nICovLCBkZXRhaWxzIC8qIDpPYmplY3QgKi8pIHtcblx0XHRfY2xhc3NDYWxsQ2hlY2sodGhpcywgRGV0YWlsZWRFcnJvcik7XG5cblx0XHRPYmplY3Qua2V5cyhkZXRhaWxzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHZhciBkYXRhID0gZGV0YWlsc1trZXldO1xuXHRcdFx0dmFyIHZhbHVlID0gcmVxdWlyZSgndXRpbCcpLmluc3BlY3QoZGF0YS5zdGFjayB8fCBkYXRhLm1lc3NhZ2UgfHwgZGF0YSk7XG5cdFx0XHRtZXNzYWdlICs9ICdcXG4nICsga2V5ICsgJzogJyArIHZhbHVlO1xuXHRcdH0pO1xuXHRcdHJldHVybiBfcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoRGV0YWlsZWRFcnJvci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKERldGFpbGVkRXJyb3IpKS5jYWxsKHRoaXMsIG1lc3NhZ2UpKTtcblx0fVxuXG5cdHJldHVybiBEZXRhaWxlZEVycm9yO1xufShFcnJvcik7XG5cbi8vIEVudmlyb25tZW50IGZldGNoaW5nXG5cblxudmFyIGJsYWNrbGlzdCA9IHByb2Nlc3MgJiYgcHJvY2Vzcy5lbnYgJiYgcHJvY2Vzcy5lbnYuRURJVElPTlNfU1lOVEFYX0JMQUNLTElTVCAmJiBwcm9jZXNzLmVudi5FRElUSU9OU19TWU5UQVhfQkxBQ0tMSVNULnNwbGl0KCcsJyk7XG5cbi8vIENhY2hlIG9mIHdoaWNoIHN5bnRheCBjb21iaW5hdGlvbnMgYXJlIHN1cHBvcnRlZCBvciB1bnN1cHBvcnRlZCwgaGFzaCBvZiBib29sZWFuc1xudmFyIHN5bnRheEZhaWxlZENvbWJpdGlvbnMgPSB7fTsgLy8gc29ydGVkIGxvd2VyY2FzZSBzeW50YXggY29tYmluYXRpb24gPT4gRXJyb3IgaW5zdGFuY2Ugb2YgZmFpbHVyZVxudmFyIHN5bnRheEJsYWNrbGlzdCA9IHt9O1xuc3ludGF4QmxhY2tsaXN0LmltcG9ydCA9IG5ldyBFcnJvcignVGhlIGltcG9ydCBzeW50YXggaXMgc2tpcHBlZCBhcyB0aGUgbW9kdWxlIHBhY2thZ2UuanNvbiBmaWVsZCBlbGltaW5hdGVzIHRoZSBuZWVkIGZvciBhdXRvbG9hZGVyIHN1cHBvcnQnKTtcbnN5bnRheEJsYWNrbGlzdC5jb2ZmZWVzY3JpcHQgPSBuZXcgRXJyb3IoJ1RoZSBjb2ZmZWVzY3JpcHQgc3ludGF4IGlzIHNraXBwZWQgYXMgd2Ugd2FudCB0byB1c2UgYSBwcmVjb21waWxlZCBlZGl0aW9uIHJhdGhlciB0aGFuIGNvbXBpbGluZyBhdCBydW50aW1lJyk7XG5zeW50YXhCbGFja2xpc3QudHlwZXNjcmlwdCA9IG5ldyBFcnJvcignVGhlIHR5cGVzY3JpcHQgc3ludGF4IGlzIHNraXBwZWQgYXMgd2Ugd2FudCB0byB1c2UgYSBwcmVjb21waWxlZCBlZGl0aW9uIHJhdGhlciB0aGFuIGNvbXBpbGluZyBhdCBydW50aW1lJyk7XG5cbi8vIEJsYWNrbGlzdCBub24tZXNuZXh0IG5vZGUgdmVyc2lvbnMgZnJvbSBlc25leHRcbmlmIChwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9ucy5ub2RlKSB7XG5cdHZhciBFQVJMSUVTVF9FU05FWFRfTk9ERV9WRVJTSU9OID0gWzAsIDEyXTtcblx0dmFyIE5PREVfVkVSU0lPTiA9IHByb2Nlc3MudmVyc2lvbnMubm9kZS5zcGxpdCgnLicpLm1hcChmdW5jdGlvbiAobikge1xuXHRcdHJldHVybiBwYXJzZUludChuLCAxMCk7XG5cdH0pO1xuXHR2YXIgRVNORVhUX1VOU1VQUE9SVEVEID0gTk9ERV9WRVJTSU9OWzBdIDwgRUFSTElFU1RfRVNORVhUX05PREVfVkVSU0lPTlswXSB8fCBOT0RFX1ZFUlNJT05bMF0gPT09IEVBUkxJRVNUX0VTTkVYVF9OT0RFX1ZFUlNJT05bMF0gJiYgTk9ERV9WRVJTSU9OWzFdIDwgRUFSTElFU1RfRVNORVhUX05PREVfVkVSU0lPTlsxXTtcblx0aWYgKEVTTkVYVF9VTlNVUFBPUlRFRCkgc3ludGF4QmxhY2tsaXN0LmVzbmV4dCA9IG5ldyBFcnJvcignVGhlIGVzbmV4dCBzeW50YXggaXMgc2tpcHBlZCBvbiBlYXJseSBub2RlIHZlcnNpb25zIGFzIGF0dGVtcHRpbmcgdG8gdXNlIGVzbmV4dCBmZWF0dXJlcyB3aWxsIG91dHB1dCBkZWJ1Z2dpbmcgaW5mb3JtYXRpb24gb24gdGhlc2Ugbm9kZSB2ZXJzaW9ucycpO1xufVxuXG4vLyBDaGVjayB0aGUgZW52aXJvbm1lbnQgY29uZmlndXJhdGlvbiBmb3IgYSBzeW50YXggYmxhY2tsaXN0XG5pZiAoYmxhY2tsaXN0KSB7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgYmxhY2tsaXN0Lmxlbmd0aDsgKytpKSB7XG5cdFx0dmFyIHN5bnRheCA9IGJsYWNrbGlzdFtpXS50cmltKCkudG9Mb3dlckNhc2UoKTtcblx0XHRzeW50YXhCbGFja2xpc3Rbc3ludGF4XSA9IG5ldyBEZXRhaWxlZEVycm9yKCdUaGUgRURJVElPTlNfU1lOVEFYX0JMQUNLTElTVCBlbnZpcm9ubWVudCB2YXJpYWJsZSBoYXMgYmxhY2tsaXN0ZWQgYW4gZWRpdGlvbiBzeW50YXg6JywgeyBzeW50YXg6IHN5bnRheCwgYmxhY2tsaXN0OiBibGFja2xpc3QgfSk7XG5cdH1cbn1cblxuLyogOjpcbnR5cGUgZWRpdGlvbiA9IHtcblx0bmFtZTpudW1iZXIsXG5cdGRlc2NyaXB0aW9uPzpzdHJpbmcsXG5cdGRpcmVjdG9yeT86c3RyaW5nLFxuXHRlbnRyeT86c3RyaW5nLFxuXHRzeW50YXhlcz86QXJyYXk8c3RyaW5nPlxufTtcbnR5cGUgb3B0aW9ucyA9IHtcblx0Y3dkPzpzdHJpbmcsXG5cdHBhY2thZ2U/OnN0cmluZyxcblx0ZW50cnk/OnN0cmluZyxcblx0cmVxdWlyZTpmdW5jdGlvblxufTtcbiovXG5cbi8qKlxuICogQ3ljbGUgdGhyb3VnaCB0aGUgZWRpdGlvbnMgYW5kIHJlcXVpcmUgdGhlIGNvcnJlY3Qgb25lXG4gKiBAcHJvdGVjdGVkIGludGVybmFsIGZ1bmN0aW9uIHRoYXQgaXMgdW50ZXN0ZWQgZm9yIHB1YmxpYyBjb25zdW1wdGlvblxuICogQHBhcmFtIHtlZGl0aW9ufSBlZGl0aW9uIC0gdGhlIGVkaXRpb24gZW50cnlcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gdGhlIGZvbGxvd2luZyBvcHRpb25zXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5yZXF1aXJlIC0gdGhlIHJlcXVpcmUgbWV0aG9kIG9mIHRoZSBjYWxsaW5nIG1vZHVsZSwgdXNlZCB0byBlbnN1cmUgcmVxdWlyZSBwYXRocyByZW1haW4gY29ycmVjdFxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmN3ZF0gLSBpZiBwcm92aWRlZCwgdGhpcyB3aWxsIGJlIHRoZSBjd2QgZm9yIGVudHJpZXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5lbnRyeV0gLSBpZiBwcm92aWRlZCwgc2hvdWxkIGJlIGEgcmVsYXRpdmUgb3IgYWJzb2x1dGUgcGF0aCB0byB0aGUgZW50cnkgcG9pbnQgb2YgdGhlIGVkaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5wYWNrYWdlXSAtIGlmIHByb3ZpZGVkLCBzaG91bGQgYmUgdGhlIG5hbWUgb2YgdGhlIHBhY2thZ2UgdGhhdCB3ZSBhcmUgbG9hZGluZyB0aGUgZWRpdGlvbnMgZm9yXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gcmVxdWlyZUVkaXRpb24oZWRpdGlvbiAvKiA6ZWRpdGlvbiAqLywgb3B0cyAvKiA6b3B0aW9ucyAqLykgLyogOmFueSAqL3tcblx0Ly8gUHJldmVudCByZXF1aXJlIGZyb20gYmVpbmcgaW5jbHVkZWQgaW4gZGVidWcgbG9nc1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkob3B0cywgJ3JlcXVpcmUnLCB7IHZhbHVlOiBvcHRzLnJlcXVpcmUsIGVudW1lcmFibGU6IGZhbHNlIH0pO1xuXG5cdC8vIEdldCB0aGUgY29ycmVjdCBlbnRyeSBwYXRoXG5cdC8vIEFzIG9sZGVyIHZlcnNpb25zIG9cblx0dmFyIGN3ZCA9IG9wdHMuY3dkIHx8ICcnO1xuXHR2YXIgZGlyID0gZWRpdGlvbi5kaXJlY3RvcnkgfHwgJyc7XG5cdHZhciBlbnRyeSA9IG9wdHMuZW50cnkgfHwgZWRpdGlvbi5lbnRyeSB8fCAnJztcblx0aWYgKGRpciAmJiBlbnRyeSAmJiBlbnRyeS5pbmRleE9mKGRpciArICcvJykgPT09IDApIGVudHJ5ID0gZW50cnkuc3Vic3RyaW5nKGRpci5sZW5ndGggKyAxKTtcblx0Ly8gXiB0aGlzIHNob3VsZCBub3QgYmUgbmVlZGVkLCBidXQgYXMgcHJldmlvdXMgdmVyc2lvbnMgb2YgZWRpdGlvbnMgaW5jbHVkZWQgdGhlIGRpcmVjdG9yeSBpbnNpZGUgdGhlIGVudHJ5XG5cdC8vIGl0IHVuZm9ydHVuYXRlbHkgaXMsIGFzIHN1Y2ggdGhpcyBpcyBhIHN0ZXBwaW5nIHN0b25lIGZvciB0aGUgbmV3IGZvcm1hdCwgdGhlIG5ldyBmb3JtYXQgYmVpbmdcblx0Ly8gaWYgZW50cnkgaXMgc3BlY2lmaWVkIGJ5IGl0c2VsZiwgaXQgaXMgY3dkID0+IGVudHJ5XG5cdC8vIGlmIGVudHJ5IGlzIHNwZWNpZmllZCB3aXRoIGEgZGlyZWN0b3J5LCBpdCBpcyBjd2QgPT4gZGlyID0+IGVudHJ5XG5cdC8vIGlmIGVudHJ5IGlzIG5vdCBzcGVjaWZpZWQgYnV0IGRpciBpcywgaXQgaXMgY3dkID0+IGRpclxuXHQvLyBpZiBuZWl0aGVyIGVudHJ5IG5vciBkaXIgYXJlIHNwZWNpZmllZCwgd2UgaGF2ZSBhIHByb2JsZW1cblx0aWYgKCFkaXIgJiYgIWVudHJ5KSB7XG5cdFx0dmFyIGVkaXRpb25GYWlsdXJlID0gbmV3IERldGFpbGVkRXJyb3IoJ1NraXBwZWQgZWRpdGlvbiBkdWUgdG8gbm8gZW50cnkgb3IgZGlyZWN0b3J5IGJlaW5nIHNwZWNpZmllZDonLCB7IGVkaXRpb246IGVkaXRpb24sIGN3ZDogY3dkLCBkaXI6IGRpciwgZW50cnk6IGVudHJ5IH0pO1xuXHRcdHRocm93IGVkaXRpb25GYWlsdXJlO1xuXHR9XG5cdHZhciBlbnRyeVBhdGggPSBwYXRoVXRpbC5yZXNvbHZlKGN3ZCwgZGlyLCBlbnRyeSk7XG5cblx0Ly8gQ2hlY2sgc3ludGF4IHN1cHBvcnRcblx0Ly8gQ29udmVydCBzeW50YXhlcyBpbnRvIGEgc29ydGVkIGxvd2VyY2FzZSBzdHJpbmdcblx0dmFyIHN5bnRheGVzID0gZWRpdGlvbi5zeW50YXhlcyAmJiBlZGl0aW9uLnN5bnRheGVzLm1hcChmdW5jdGlvbiAoaSkge1xuXHRcdHJldHVybiBpLnRvTG93ZXJDYXNlKCk7XG5cdH0pLnNvcnQoKTtcblx0dmFyIHN5bnRheENvbWJpbmF0aW9uID0gc3ludGF4ZXMgJiYgc3ludGF4ZXMuam9pbignLCAnKTtcblx0aWYgKHN5bnRheGVzICYmIHN5bnRheENvbWJpbmF0aW9uKSB7XG5cdFx0Ly8gQ2hlY2sgaWYgYW55IG9mIHRoZSBzeW50YXhlcyBhcmUgdW5zdXBwb3J0ZWRcblx0XHR2YXIgdW5zdXBwb3J0ZWRTeW50YXhlcyA9IHN5bnRheGVzLmZpbHRlcihmdW5jdGlvbiAoaSkge1xuXHRcdFx0cmV0dXJuIHN5bnRheEJsYWNrbGlzdFtpLnRvTG93ZXJDYXNlKCldO1xuXHRcdH0pO1xuXHRcdGlmICh1bnN1cHBvcnRlZFN5bnRheGVzLmxlbmd0aCkge1xuXHRcdFx0dmFyIF9lZGl0aW9uRmFpbHVyZSA9IG5ldyBEZXRhaWxlZEVycm9yKCdTa2lwcGVkIGVkaXRpb24gZHVlIHRvIGl0IGNvbnRhaW5pbmcgYW4gdW5zdXBwb3J0ZWQgc3ludGF4OicsIHsgZWRpdGlvbjogZWRpdGlvbiwgdW5zdXBwb3J0ZWRTeW50YXhlczogdW5zdXBwb3J0ZWRTeW50YXhlcyB9KTtcblx0XHRcdHRocm93IF9lZGl0aW9uRmFpbHVyZTtcblx0XHR9XG5cdFx0Ly8gSXMgdGhpcyBzeW50YXggY29tYmluYXRpb24gdW5zdXBwb3J0ZWQ/IElmIHNvIHNraXAgaXQgd2l0aCBhIHNvZnQgZmFpbHVyZSB0byB0cnkgdGhlIG5leHQgZWRpdGlvblxuXHRcdGVsc2UgaWYgKHN5bnRheEZhaWxlZENvbWJpdGlvbnNbc3ludGF4Q29tYmluYXRpb25dKSB7XG5cdFx0XHRcdHZhciBwcmV2aW91c0NvbWJpbmF0aW9uRmFpbHVyZSA9IHN5bnRheEZhaWxlZENvbWJpdGlvbnNbc3ludGF4Q29tYmluYXRpb25dO1xuXHRcdFx0XHR2YXIgX2VkaXRpb25GYWlsdXJlMiA9IG5ldyBEZXRhaWxlZEVycm9yKCdTa2lwcGVkIGVkaXRpb24gZHVlIHRvIGl0cyBzeW50YXggY29tYmluYXRpb20gZmFpbGluZyBwcmV2aW91c2x5OicsIHsgZWRpdGlvbjogZWRpdGlvbiwgcHJldmlvdXNDb21iaW5hdGlvbkZhaWx1cmU6IHByZXZpb3VzQ29tYmluYXRpb25GYWlsdXJlIH0pO1xuXHRcdFx0XHR0aHJvdyBfZWRpdGlvbkZhaWx1cmUyO1xuXHRcdFx0fVxuXHR9XG5cblx0Ly8gVHJ5IGFuZCBsb2FkIHRoaXMgc3ludGF4IGNvbWJpbmF0aW9uXG5cdHRyeSB7XG5cdFx0cmV0dXJuIG9wdHMucmVxdWlyZShlbnRyeVBhdGgpO1xuXHR9IGNhdGNoIChlcnJvcikge1xuXHRcdC8vIE5vdGUgdGhlIGVycm9yIHdpdGggbW9yZSBkZXRhaWxzXG5cdFx0dmFyIF9lZGl0aW9uRmFpbHVyZTMgPSBuZXcgRGV0YWlsZWRFcnJvcignRmFpbGVkIHRvIGxvYWQgdGhlIGVkaXRpb24gZHVlIHRvIGEgbG9hZCBlcnJvcjonLCB7IGVkaXRpb246IGVkaXRpb24sIGVycm9yOiBlcnJvci5zdGFjayB9KTtcblxuXHRcdC8vIEJsYWNrbGlzdCB0aGUgY29tYmluYXRpb24sIGV2ZW4gaWYgaXQgbWF5IGhhdmUgd29ya2VkIGJlZm9yZVxuXHRcdC8vIFBlcmhhcHMgaW4gdGhlIGZ1dHVyZSBub3RlIGlmIHRoYXQgaWYgaXQgZGlkIHdvcmsgcHJldmlvdXNseSwgdGhlbiB3ZSBzaG91bGQgaW5zdHJ1Y3QgbW9kdWxlIG93bmVycyB0byBiZSBtb3JlIHNwZWNpZmljIHdpdGggdGhlaXIgc3ludGF4ZXNcblx0XHRpZiAoc3ludGF4Q29tYmluYXRpb24pIHN5bnRheEZhaWxlZENvbWJpdGlvbnNbc3ludGF4Q29tYmluYXRpb25dID0gX2VkaXRpb25GYWlsdXJlMztcblxuXHRcdC8vIENvbnRpbnVlIHRvIHRoZSBuZXh0IGVkaXRpb25cblx0XHR0aHJvdyBfZWRpdGlvbkZhaWx1cmUzO1xuXHR9XG59XG5cbi8qKlxuICogQ3ljbGUgdGhyb3VnaCB0aGUgZWRpdGlvbnMgYW5kIHJlcXVpcmUgdGhlIGNvcnJlY3Qgb25lXG4gKiBAcHJvdGVjdGVkIGludGVybmFsIGZ1bmN0aW9uIHRoYXQgaXMgdW50ZXN0ZWQgZm9yIHB1YmxpYyBjb25zdW1wdGlvblxuICogQHBhcmFtIHtBcnJheTxlZGl0aW9uPn0gZWRpdGlvbnMgLSBhbiBhcnJheSBvZiBlZGl0aW9uIGVudHJpZXNcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRzIC0gdGhlIGZvbGxvd2luZyBvcHRpb25zXG4gKiBAcGFyYW0ge3N0cmluZ30gb3B0cy5yZXF1aXJlIC0gdGhlIHJlcXVpcmUgbWV0aG9kIG9mIHRoZSBjYWxsaW5nIG1vZHVsZSwgdXNlZCB0byBlbnN1cmUgcmVxdWlyZSBwYXRocyByZW1haW4gY29ycmVjdFxuICogQHBhcmFtIHtzdHJpbmd9IFtvcHRzLmN3ZF0gLSBpZiBwcm92aWRlZCwgdGhpcyB3aWxsIGJlIHRoZSBjd2QgZm9yIGVudHJpZXNcbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5lbnRyeV0gLSBpZiBwcm92aWRlZCwgc2hvdWxkIGJlIGEgcmVsYXRpdmUgcGF0aCB0byB0aGUgZW50cnkgcG9pbnQgb2YgdGhlIGVkaXRpb25cbiAqIEBwYXJhbSB7c3RyaW5nfSBbb3B0cy5wYWNrYWdlXSAtIGlmIHByb3ZpZGVkLCBzaG91bGQgYmUgdGhlIG5hbWUgb2YgdGhlIHBhY2thZ2UgdGhhdCB3ZSBhcmUgbG9hZGluZyB0aGUgZWRpdGlvbnMgZm9yXG4gKiBAcmV0dXJucyB7Kn1cbiAqL1xuZnVuY3Rpb24gcmVxdWlyZUVkaXRpb25zKGVkaXRpb25zIC8qIDpBcnJheTxlZGl0aW9uPiAqLywgb3B0cyAvKiA6b3B0aW9ucyAqLykgLyogOmFueSAqL3tcblx0Ly8gRXh0cmFjdFxuXHRpZiAob3B0cy5wYWNrYWdlID09IG51bGwpIG9wdHMucGFja2FnZSA9ICdjdXN0b20gcnVudGltZSBwYWNrYWdlJztcblxuXHQvLyBDaGVja1xuXHRpZiAoIWVkaXRpb25zIHx8IGVkaXRpb25zLmxlbmd0aCA9PT0gMCkge1xuXHRcdHRocm93IG5ldyBEZXRhaWxlZEVycm9yKCdObyBlZGl0aW9ucyB3ZXJlIHNwZWNpZmllZDonLCB7IG9wdHM6IG9wdHMgfSk7XG5cdH1cblxuXHQvLyBOb3RlIHRoZSBsYXN0IGVycm9yIG1lc3NhZ2Vcblx0dmFyIGVkaXRpb25GYWlsdXJlcyA9IFtdO1xuXG5cdC8vIEN5Y2xlIHRocm91Z2ggdGhlIGVkaXRpb25zXG5cdGZvciAodmFyIF9pID0gMDsgX2kgPCBlZGl0aW9ucy5sZW5ndGg7ICsrX2kpIHtcblx0XHR2YXIgZWRpdGlvbiA9IGVkaXRpb25zW19pXTtcblx0XHR0cnkge1xuXHRcdFx0cmV0dXJuIHJlcXVpcmVFZGl0aW9uKGVkaXRpb24sIG9wdHMpO1xuXHRcdH0gY2F0Y2ggKGVycikge1xuXHRcdFx0ZWRpdGlvbkZhaWx1cmVzLnB1c2goZXJyKTtcblx0XHR9XG5cdH1cblxuXHQvLyBUaHJvdWdoIHRoZSBlcnJvciBhcyBubyBlZGl0aW9uIGxvYWRlZFxuXHR0aHJvdyBuZXcgRGV0YWlsZWRFcnJvcignVGhlcmUgYXJlIG5vIHN1aXRhYmxlIGVkaXRpb25zIGZvciB0aGlzIGVudmlyb25tZW50OicsIHsgb3B0czogb3B0cywgZWRpdGlvbnM6IGVkaXRpb25zLCBmYWlsdXJlczogZWRpdGlvbkZhaWx1cmVzIH0pO1xufVxuXG4vKipcbiAqIEN5Y2xlIHRocm91Z2ggdGhlIGVkaXRpb25zIGZvciBhIHBhY2thZ2UgYW5kIHJlcXVpcmUgdGhlIGNvcnJlY3Qgb25lXG4gKiBAcGFyYW0ge3N0cmluZ30gY3dkIC0gdGhlIHBhdGggb2YgdGhlIHBhY2thZ2UsIHVzZWQgdG8gbG9hZCBwYWNrYWdlLmpzb246ZWRpdGlvbnMgYW5kIGhhbmRsZSByZWxhdGl2ZSBlZGl0aW9uIGVudHJ5IHBvaW50c1xuICogQHBhcmFtIHtmdW5jdGlvbn0gcmVxdWlyZSAtIHRoZSByZXF1aXJlIG1ldGhvZCBvZiB0aGUgY2FsbGluZyBtb2R1bGUsIHVzZWQgdG8gZW5zdXJlIHJlcXVpcmUgcGF0aHMgcmVtYWluIGNvcnJlY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBbZW50cnldIC0gYW4gb3B0aW9uYWwgb3ZlcnJpZGUgZm9yIHRoZSBlbnRyeSBvZiBhbiBlZGl0aW9uLCByZXF1aXJlcyB0aGUgZWRpdGlvbiB0byBzcGVjaWZ5IGEgYGRpcmVjdG9yeWAgcHJvcGVydHlcbiAqIEByZXR1cm5zIHsqfVxuICovXG5mdW5jdGlvbiByZXF1aXJlUGFja2FnZShjd2QgLyogOnN0cmluZyAqLywgcmVxdWlyZSAvKiA6ZnVuY3Rpb24gKi8sIGVudHJ5IC8qIDo6ID86c3RyaW5nICovKSAvKiA6YW55ICove1xuXHQvLyBMb2FkIHRoZSBwYWNrYWdlLmpzb24gZmlsZSB0byBmZXRjaCBgbmFtZWAgZm9yIGRlYnVnZ2luZyBhbmQgYGVkaXRpb25zYCBmb3IgbG9hZGluZ1xuXHR2YXIgcGFja2FnZVBhdGggPSBwYXRoVXRpbC5yZXNvbHZlKGN3ZCwgJ3BhY2thZ2UuanNvbicpO1xuXG5cdHZhciBfcmVxdWlyZSA9IHJlcXVpcmUocGFja2FnZVBhdGgpLFxuXHQgICAgbmFtZSA9IF9yZXF1aXJlLm5hbWUsXG5cdCAgICBlZGl0aW9ucyA9IF9yZXF1aXJlLmVkaXRpb25zO1xuXG5cdHZhciBvcHRzIC8qIDpvcHRpb25zICovID0geyBjd2Q6IGN3ZCwgcmVxdWlyZTogcmVxdWlyZSB9O1xuXHRpZiAobmFtZSkgb3B0cy5wYWNrYWdlID0gbmFtZTtcblx0aWYgKGVudHJ5KSBvcHRzLmVudHJ5ID0gZW50cnk7XG5cdHJldHVybiByZXF1aXJlRWRpdGlvbnMoZWRpdGlvbnMsIG9wdHMpO1xufVxuXG4vLyBFeHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IHsgcmVxdWlyZUVkaXRpb246IHJlcXVpcmVFZGl0aW9uLCByZXF1aXJlRWRpdGlvbnM6IHJlcXVpcmVFZGl0aW9ucywgcmVxdWlyZVBhY2thZ2U6IHJlcXVpcmVQYWNrYWdlIH07Il19