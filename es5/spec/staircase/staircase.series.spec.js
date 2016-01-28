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
	    parameters = undefined;

	beforeEach(function () {
		parameters = [1, 2, 3];
		staircase = new (_bind.apply(_libStaircaseJs2["default"], [null].concat(_toConsumableArray(parameters))))();
	});

	describe(".series(...stepFunctions)", function () {
		var stepFunctions = undefined,
		    stepOne = undefined,
		    stepTwo = undefined,
		    stepThree = undefined,
		    returnValue = undefined;

		beforeEach(function () {
			var _staircase;

			stepOne = _sinon2["default"].spy();
			stepTwo = _sinon2["default"].spy();
			stepThree = _sinon2["default"].spy();

			stepFunctions = [stepOne, stepTwo, stepThree];

			returnValue = (_staircase = staircase).series.apply(_staircase, _toConsumableArray(stepFunctions));
		});

		it("should return the object instance to enable chaining", function () {
			returnValue.should.eql(staircase);
		});

		it("should add the step functions to steps as a series", function () {
			staircase.steps.should.eql([{ concurrency: "series", steps: stepFunctions }]);
		});
	});
});