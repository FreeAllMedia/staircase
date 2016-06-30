import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("staircase.step(stepFunction)", () => {
		let staircase;

	beforeEach(() => {
		staircase = new Staircase();
	});

	it("should be able to add a step from within another step", done => {
		const stepFunctionOne = stepDone => {
			staircase.step(stepFunctionTwo);
			stepDone();
		};

		const stepFunctionTwo = sinon.spy(stepDone => {
			stepDone();
		});

		staircase
		.step(stepFunctionOne)
		.results(error => {
			stepFunctionTwo.called.should.be.true;

			done(error);
		});
	});

	it("should rearrange sub-steps into the right order", done => {
		const callOrder = [];
		const stepFunctionOne = function one(stepDone) {
			callOrder.push(1);
			stepDone();
		};
		const stepFunctionTwo = function two(stepDone) {
			callOrder.push(2);
			stepDone();
		};
		const stepFunctionThree = function three(stepDone) {
			callOrder.push(3);
			stepDone();
		};
		const stepFunctionFour = function four(stepDone) {
			callOrder.push(4);
			stepDone();
		};
		const stepFunctionFive = function five(stepDone) {
			callOrder.push(5);
			stepDone();
		};
		const stepFunctionSix = function six(stepDone) {
			callOrder.push(6);
			stepDone();
		};

		staircase
		.step(stepFunctionOne)
		.step(function onePointFive(stepDone) {
			staircase
			.step(stepFunctionTwo)
			.step(function twoPointFive(stepDoneAgain) {
				staircase.step(stepFunctionThree);
				stepDoneAgain();
			});
			stepDone();
		})
		.step(function threePointFive(stepDone) {
			staircase
			.step(stepFunctionFour)
			.step(function fourPointFive(stepDoneAgain) {
				staircase.step(stepFunctionFive);
				stepDoneAgain();
			});
			stepDone();
		})
		.step(stepFunctionSix)
		.results(error => {
			callOrder.should.eql([1, 2, 3, 4, 5, 6]);

			done(error);
		});
	});
});
