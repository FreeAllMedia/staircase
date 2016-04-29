import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("Staircase(...options)", () => {
	let staircase,
			parameters;

	beforeEach(() => {
		parameters = [1, 2, 3];
		staircase = new Staircase(...parameters);
	});

	describe(".step(stepFunction)", () => {
		let stepFunction,
				returnValue,
				step;

		beforeEach(() => {
			stepFunction = () => {};
			returnValue = staircase.step(stepFunction);
			step = staircase.steps[0];
		});

		it("should return the object instance to enable chaining", () => {
			returnValue.should.eql(staircase);
		});

		it("should add the step function to steps as a series", () => {
			step.concurrency.should.eql("series");
		});

		it("should add the step function to steps", () => {
			step.steps.should.eql([stepFunction]);
		});
	});
});
