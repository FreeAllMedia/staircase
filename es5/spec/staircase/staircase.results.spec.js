"use strict";

var _bind = Function.prototype.bind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _libStaircaseJs = require("../../lib/staircase.js");

var _libStaircaseJs2 = _interopRequireDefault(_libStaircaseJs);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

describe("Staircase(...options)", function () {
	var staircase = undefined,
	    parameters = undefined,
	    clock = undefined;

	beforeEach(function () {
		clock = _sinon2["default"].useFakeTimers(Date.now());
		parameters = [1, 2, 3];
		staircase = new (_bind.apply(_libStaircaseJs2["default"], [null].concat(_toConsumableArray(parameters))))();
	});

	afterEach(function () {
		clock.restore();
	});

	describe(".results(callback)", function () {
		var callback = undefined,
		    stepOne = undefined,
		    stepTwo = undefined,
		    stepThree = undefined;

		beforeEach(function () {
			function mockStepFunction(argumentOne, argumentTwo, argumentThree, stepDone) {
				setTimeout(stepDone, 100);
			}

			stepOne = _sinon2["default"].spy(mockStepFunction);
			stepTwo = _sinon2["default"].spy(mockStepFunction);
			stepThree = _sinon2["default"].spy(mockStepFunction);
		});

		it("should not call step two or three in parallel", function (done) {
			staircase.series(stepOne, stepTwo, stepThree).results();

			clock.tick(50);

			var actualStepResults = {
				stepOneCalled: stepOne.called,
				stepTwoCalled: stepTwo.called,
				stepThreeCalled: stepThree.called
			};

			var expectedStepResults = {
				stepOneCalled: true,
				stepTwoCalled: false,
				stepThreeCalled: false
			};

			actualStepResults.should.eql(expectedStepResults);

			done();
		});

		it("should not call step three in parallel", function (done) {
			staircase.series(stepOne, stepTwo, stepThree).results();

			clock.tick(150);

			var actualStepResults = {
				stepOneCalled: stepOne.called,
				stepTwoCalled: stepTwo.called,
				stepThreeCalled: stepThree.called
			};

			var expectedStepResults = {
				stepOneCalled: true,
				stepTwoCalled: true,
				stepThreeCalled: false
			};

			actualStepResults.should.eql(expectedStepResults);

			done();
		});

		it("should call all steps", function (done) {
			staircase.series(stepOne, stepTwo, stepThree).results();

			clock.tick(250);

			var actualStepResults = {
				stepOneCalled: stepOne.called,
				stepTwoCalled: stepTwo.called,
				stepThreeCalled: stepThree.called
			};

			var expectedStepResults = {
				stepOneCalled: true,
				stepTwoCalled: true,
				stepThreeCalled: true
			};

			actualStepResults.should.eql(expectedStepResults);

			done();
		});

		it("should call each step function with .parameters as the arguments", function () {
			var _stepOne, _stepTwo, _stepThree;

			staircase.series(stepOne, stepTwo, stepThree).results();

			clock.tick(250);

			var actualStepResults = {
				stepOneCalled: (_stepOne = stepOne).calledWith.apply(_stepOne, _toConsumableArray(parameters)),
				stepTwoCalled: (_stepTwo = stepTwo).calledWith.apply(_stepTwo, _toConsumableArray(parameters)),
				stepThreeCalled: (_stepThree = stepThree).calledWith.apply(_stepThree, _toConsumableArray(parameters))
			};

			var expectedStepResults = {
				stepOneCalled: true,
				stepTwoCalled: true,
				stepThreeCalled: true
			};

			actualStepResults.should.eql(expectedStepResults);
		});

		it("should cancel step execution upon a step error", function () {
			stepOne = _sinon2["default"].spy(function (argumentOne, argumentTwo, argumentThree, stepDone) {
				stepDone(new Error());
			});

			staircase.series(stepOne, stepTwo, stepThree).results();

			clock.tick(250);

			var actualStepResults = {
				stepOneCalled: stepOne.called,
				stepTwoCalled: stepTwo.called,
				stepThreeCalled: stepThree.called
			};

			var expectedStepResults = {
				stepOneCalled: true,
				stepTwoCalled: false,
				stepThreeCalled: false
			};

			actualStepResults.should.eql(expectedStepResults);
		});

		it("should return the step error if it occurs", function (done) {
			var error = new Error();

			stepOne = function (argumentOne, argumentTwo, argumentThree, stepDone) {
				stepDone(error);
			};

			callback = function (resultsError) {
				resultsError.should.eql(error);
				done();
			};

			staircase.series(stepOne, stepTwo, stepThree).results(callback);

			clock.tick(250);
		});
	});
});