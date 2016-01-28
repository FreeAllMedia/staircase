"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var createStepTask = Symbol();

var Staircase = (function () {
	function Staircase() {
		_classCallCheck(this, Staircase);

		var _ = (0, _incognito2["default"])(this);

		for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
			parameters[_key] = arguments[_key];
		}

		_.parameters = parameters;

		this.steps = [];
	}

	_createClass(Staircase, [{
		key: "series",
		value: function series() {
			for (var _len2 = arguments.length, steps = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				steps[_key2] = arguments[_key2];
			}

			this.steps.push({
				concurrency: "series",
				steps: steps
			});
			return this;
		}
	}, {
		key: "results",
		value: function results(callback) {
			var _this = this;

			this.steps.forEach(function (stepGroup) {
				switch (stepGroup.concurrency) {
					case "series":
						var stepTasks = stepGroup.steps.map(_this[createStepTask], _this);
						_flowsync2["default"].series(stepTasks, callback);
						break;
				}
			});
		}
	}, {
		key: createStepTask,
		value: function value(step) {
			var _this2 = this;

			return function (done) {
				var stepArguments = _this2.parameters.concat([done]);
				step.apply(undefined, _toConsumableArray(stepArguments));
			};
		}
	}, {
		key: "parameters",
		get: function get() {
			return (0, _incognito2["default"])(this).parameters;
		}
	}]);

	return Staircase;
})();

exports["default"] = Staircase;
module.exports = exports["default"];