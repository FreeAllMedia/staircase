"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var runStep = Symbol(),
    runSteps = Symbol();

var Staircase = function () {
	function Staircase() {
		_classCallCheck(this, Staircase);

		var _ = (0, _incognito2.default)(this);

		for (var _len = arguments.length, parameters = Array(_len), _key = 0; _key < _len; _key++) {
			parameters[_key] = arguments[_key];
		}

		_.parameters = parameters;

		this.steps = [];
	}

	_createClass(Staircase, [{
		key: "step",
		value: function step(newStep) {
			this.series(newStep);
			return this;
		}
	}, {
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
			this[runSteps](callback);
		}
	}, {
		key: runSteps,
		value: function value(callback) {
			var _this = this;

			var extraStepCount = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

			var steps = this.steps.slice(-extraStepCount);

			var initialStepCount = this.steps.length;

			_flowsync2.default.mapSeries(steps, function (stepGroup, done) {
				switch (stepGroup.concurrency) {
					case "series":
						_flowsync2.default.mapSeries(stepGroup.steps, _this[runStep].bind(_this), function (error) {
							done(error);
						});
				}
			}, function (error) {
				if (!error) {
					extraStepCount = _this.steps.length - initialStepCount;
					if (extraStepCount > 0) {
						_this[runSteps](callback, extraStepCount);
					} else {
						if (callback) {
							callback();
						}
					}
				} else {
					if (callback) {
						callback(error);
					}
				}
			});
		}
	}, {
		key: runStep,
		value: function value(step, done) {
			var parameters = (0, _incognito2.default)(this).parameters;
			var stepArguments = parameters.concat([done]);
			step.call.apply(step, [this].concat(_toConsumableArray(stepArguments)));
		}
	}, {
		key: "parameters",
		get: function get() {
			return (0, _incognito2.default)(this).parameters;
		}
	}]);

	return Staircase;
}();

exports.default = Staircase;