import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("staircase.after(step)", () => {
	let staircase,
			targetStep,
			stepOne,
			stepTwo,
			stepThree,
			stepFour;

	beforeEach(() => {
		staircase = new Staircase();

		stepOne = sinon.spy(function one(done){ done(); });
		stepTwo = sinon.spy(function two(done){ done(); });
		stepThree = sinon.spy(function three(done){ done(); });
		stepFour = sinon.spy(function four(done){ done(); });

		targetStep = staircase.step(stepOne).lastStep;

		staircase.step(stepThree);
	});

	it("should return itself to enable chaining", () => {
		staircase.after(targetStep).should.eql(staircase);
	});

	it("should insert each subsequent step after the target step", done => {
		staircase
		.after(targetStep)
		.step(stepTwo)
		.results(error => {
			sinon.assert.callOrder(stepOne, stepTwo, stepThree);
			done(error);
		});
	});

	it("should stop inserting each subsequent step after the target step after .append is called", done => {
		staircase
		.after(targetStep)
			.step(stepTwo)
		.append
			.step(stepFour)
		.results(error => {
			sinon.assert.callOrder(stepOne, stepTwo, stepThree, stepFour);
			done(error);
		});
	});
});
