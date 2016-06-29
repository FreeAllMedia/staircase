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
		_.context = this;
		_.currentStep = null;

		this.steps = [];
	}

	_createClass(Staircase, [{
		key: "context",
		value: function context(newContext) {
			var _ = (0, _incognito2.default)(this);
			if (newContext) {
				_.context = newContext;
				return this;
			} else {
				return _.context;
			}
		}
	}, {
		key: "after",
		value: function after(targetStep) {
			var _ = (0, _incognito2.default)(this);
			if (targetStep) {
				_.after = targetStep;
				return this;
			} else {
				return _.after;
			}
		}
	}, {
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

			var _ = (0, _incognito2.default)(this);
			if (_.after) {
				steps.forEach(function (step) {
					_.after.steps.push(step);
				});
			} else {
				this.steps.push({
					concurrency: "series",
					steps: steps
				});
			}

			return this;
		}
	}, {
		key: "parallel",
		value: function parallel() {
			for (var _len3 = arguments.length, steps = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
				steps[_key3] = arguments[_key3];
			}

			this.steps.push({
				concurrency: "parallel",
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

			var _ = (0, _incognito2.default)(this);

			var stepGroups = this.steps.slice(-extraStepCount);

			var initialStepCount = this.steps.length;

			_flowsync2.default.mapSeries(stepGroups, function (stepGroup, done) {

				var contextObject = _.context;

				var steps = stepGroup.steps;

				var lastStep = steps[steps.length - 1];

				if (typeof lastStep !== "function") {
					contextObject = steps.pop();
				}

				steps = steps.map(function (step) {
					return [step, contextObject, stepGroup];
				});

				switch (stepGroup.concurrency) {
					case "series":
						_flowsync2.default.mapSeries(steps, _this[runStep].bind(_this), done);
						break;
					case "parallel":
						_flowsync2.default.mapParallel(steps, _this[runStep].bind(_this), done);
				}
			}, function (error, data) {
				if (!error) {
					extraStepCount = _this.steps.length - initialStepCount;
					if (extraStepCount > 0) {
						_this[runSteps](callback, extraStepCount);
					} else {
						var flattenedData = [].concat.apply([], data);
						if (callback) {
							callback(null, flattenedData);
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
		value: function value(stepData, done) {
			var step = stepData[0];
			var context = stepData[1];
			var stepGroup = stepData[2];

			var _ = (0, _incognito2.default)(this);

			function clearCurrentStep(error, data) {
				_.currentStep = null;
				done(error, data);
			}

			var stepArguments = _.parameters.concat([clearCurrentStep]);

			_.currentStep = stepGroup;

			step.call.apply(step, [context].concat(_toConsumableArray(stepArguments)));
		}
	}, {
		key: "currentStep",
		get: function get() {
			return (0, _incognito2.default)(this).currentStep;
		}
	}, {
		key: "lastStep",
		get: function get() {
			return this.steps[this.steps.length - 1];
		}
	}, {
		key: "parameters",
		get: function get() {
			return (0, _incognito2.default)(this).parameters;
		}
	}, {
		key: "append",
		get: function get() {
			(0, _incognito2.default)(this).after = null;
			return this;
		}
	}]);

	return Staircase;
}();

exports.default = Staircase;