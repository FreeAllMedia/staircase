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
				returnValue;

		beforeEach(() => {
			stepFunction = sinon.spy();

			returnValue = staircase.step(stepFunction);
		});

		it("should return the object instance to enable chaining", () => {
			returnValue.should.eql(staircase);
		});

		it("should add the step function to steps as a series", () => {
			staircase.steps.should.eql([
				{concurrency: "series", steps: [stepFunction]}
			]);
		});
	});
});
