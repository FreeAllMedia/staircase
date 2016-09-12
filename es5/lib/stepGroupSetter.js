"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mrt = require("mrt");

var _mrt2 = _interopRequireDefault(_mrt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StepGroupSetter = function (_Component) {
	_inherits(StepGroupSetter, _Component);

	function StepGroupSetter() {
		_classCallCheck(this, StepGroupSetter);

		return _possibleConstructorReturn(this, (StepGroupSetter.__proto__ || Object.getPrototypeOf(StepGroupSetter)).apply(this, arguments));
	}

	_createClass(StepGroupSetter, [{
		key: "initialize",
		value: function initialize(staircase, type) {
			for (var _len = arguments.length, steps = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				steps[_key - 2] = arguments[_key];
			}

			this.stepGroup = {
				type: type,
				steps: steps
			};

			staircase.stepGroups(this.stepGroup);
		}
	}, {
		key: "apply",
		value: function apply() {
			for (var _len2 = arguments.length, extraArguments = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				extraArguments[_key2] = arguments[_key2];
			}

			this.stepGroup.extraArguments = extraArguments;
			return this;
		}
	}]);

	return StepGroupSetter;
}(_mrt2.default);

exports.default = StepGroupSetter;