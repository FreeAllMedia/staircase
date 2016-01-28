"use strict";

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _staircaseJs = require("./staircase.js");

var _staircaseJs2 = _interopRequireDefault(_staircaseJs);

var action = new _staircaseJs2["default"](1, 2, 3);

action.series(function (one, two, three, done) {
	console.log([one, two, three]);
	done();
}, function (one, two, three, done) {
	console.log([one, two, three]);
	done();
}, function (one, two, three, done) {
	console.log([one, two, three]);
	done();
}).results(function (error) {
	if (error) {
		throw error;
	}
	console.log("SERIES COMPLETE!");
});