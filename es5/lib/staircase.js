"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

var _events = require("events");

var _events2 = _interopRequireDefault(_events);

var _stepGroupSetter = require("./stepGroupSetter.js");

var _stepGroupSetter2 = _interopRequireDefault(_stepGroupSetter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var setupStepGroup = Symbol(),
    runStep = Symbol(),
    runSteps = Symbol(),
    reorderStepGroup = Symbol();

var Staircase = function (_Component) {
	_inherits(Staircase, _Component);

	function Staircase() {
		_classCallCheck(this, Staircase);

		return _possibleConstructorReturn(this, (Staircase.__proto__ || Object.getPrototypeOf(Staircase)).apply(this, arguments));
	}

	_createClass(Staircase, [{
		key: "initialize",
		value: function initialize() {
			var _ = (0, _incognito2.default)(this);

			_.context = this;
			_.currentStep = null;
			_.currentStepGroup = null;
			_.stepIndex = 0;

			this.events = new _events2.default();

			this.link("series", _stepGroupSetter2.default).apply(this, "series");
			this.link("parallel", _stepGroupSetter2.default).apply(this, "parallel");

			this.properties("arguments").multi.aggregate.flat;

			this.properties("stepGroups").multi.aggregate.flat.then(this[reorderStepGroup]);

			this.arguments.apply(this, arguments);
		}
	}, {
		key: "on",
		value: function on(name, listener) {
			this.events.on(name, listener);
			return this;
		}
	}, {
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
			this.stepGroups({
				type: "series",
				steps: [newStep]
			});

			return this;
		}
	}, {
		key: "results",
		value: function results(callback) {
			this[runSteps](callback);
		}

		/**
   * Steps
   */

	}, {
		key: runSteps,
		value: function value(callback) {
			var _this2 = this;

			var stepIndex = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
			var data = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];

			var stepGroups = this.stepGroups();
			var stepGroup = stepGroups[stepIndex];

			if (stepGroup) {
				this[setupStepGroup](stepGroup, function (error, newData) {
					data.push(newData);
					if (error) {
						finished(error);
					} else {
						if (_this2.stepGroups().length - 1 > stepIndex) {
							_this2[runSteps](callback, stepIndex + 1, data);
						} else {
							finished(null, data);
						}
					}
				});
			} else {
				finished(null);
			}

			function finished(error, finishedData) {
				if (callback) {
					var flattenedData = [].concat.apply([], finishedData);
					callback(error, flattenedData);
				}
			}
		}
	}, {
		key: runStep,
		value: function value(stepData, done) {
			var _this3 = this;

			var step = stepData[0];
			var context = stepData[1];
			var stepGroup = stepData[2];

			var _ = (0, _incognito2.default)(this);

			var originalAfter = _.after;

			function clearCurrentStep(error, data) {
				_.currentStep = null;
				_.currentStepGroup = null;
				_.after = originalAfter;

				done(error, data);
			}

			var stepArguments = stepGroup.extraArguments || [];

			stepArguments = this.arguments().concat(stepArguments);

			_.currentStep = step;
			_.currentStepGroup = stepGroup;
			_.after = _.currentStepGroup;

			this.events.emit("step:before", {
				name: step.name,
				arguments: stepArguments
			});

			var startTime = new Date();

			var fullArguments = stepArguments.concat([function (error, data) {
				var endTime = new Date();
				var timeDifference = endTime - startTime;

				_this3.events.emit("step:after", {
					name: step.name,
					arguments: stepArguments,
					error: error,
					data: data,
					duration: timeDifference
				});

				clearCurrentStep(error, data);
			}]);

			step.call.apply(step, [context].concat(_toConsumableArray(fullArguments)));
		}

		/**
   * Step Groups
   */

	}, {
		key: setupStepGroup,
		value: function value(stepGroup, done) {
			var _ = (0, _incognito2.default)(this);

			var contextObject = _.context;

			var steps = stepGroup.steps;

			var lastStep = steps[steps.length - 1];

			if (typeof lastStep !== "function") {
				contextObject = steps.pop();
			}

			steps = steps.map(function (step) {
				return [step, contextObject, stepGroup];
			});

			switch (stepGroup.type) {
				case "series":
					_flowsync2.default.mapSeries(steps, this[runStep].bind(this), done);
					break;
				case "parallel":
					_flowsync2.default.mapParallel(steps, this[runStep].bind(this), done);
			}
		}
	}, {
		key: reorderStepGroup,
		value: function value(stepGroup) {
			var _ = (0, _incognito2.default)(this);

			if (_.after) {
				var stepGroups = this.stepGroups();
				var originalIndex = stepGroups.indexOf(stepGroup);
				stepGroups.splice(originalIndex, 1);

				var afterIndex = stepGroups.indexOf(_.after) + 1;
				stepGroups.splice(afterIndex, 0, stepGroup);
			}

			_.after = stepGroup;
		}
	}, {
		key: "currentStepGroup",
		get: function get() {
			return (0, _incognito2.default)(this).currentStepGroup;
		}
	}, {
		key: "lastStepGroup",
		get: function get() {
			var stepGroups = this.stepGroups();
			return stepGroups[stepGroups.length - 1];
		}
	}, {
		key: "currentStep",
		get: function get() {
			return (0, _incognito2.default)(this).currentStep;
		}
	}, {
		key: "lastStep",
		get: function get() {
			var steps = this.lastStepGroup.steps;
			return steps[steps.length - 1];
		}
	}, {
		key: "append",
		get: function get() {
			(0, _incognito2.default)(this).after = null;
			return this;
		}
	}]);

	return Staircase;
}(_mrt2.default);

exports.default = Staircase;