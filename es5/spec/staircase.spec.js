"use strict";

var _bind = Function.prototype.bind;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

var _libStaircaseJs = require("../lib/staircase.js");

var _libStaircaseJs2 = _interopRequireDefault(_libStaircaseJs);

describe("Staircase(...options)", function () {
	var staircase = undefined,
	    parameters = undefined;

	beforeEach(function () {
		parameters = [1, 2, 3];
		staircase = new (_bind.apply(_libStaircaseJs2["default"], [null].concat(_toConsumableArray(parameters))))();
	});

	describe(".constructor(...parameters)", function () {
		it("should copy constructor parameters to .parameters", function () {
			staircase.parameters.should.eql(parameters);
		});
	});

	describe(".parameters", function () {
		it("should be set by the constructor", function () {
			staircase.should.have.property("parameters");
		});

		it("should be read-only", function () {
			(function () {
				staircase.parameters = 3;
			}).should["throw"]();
		});
	});
});