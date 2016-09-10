import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("staircase.step(stepFunction)", () => {
	let staircase,
			parameters,
			stepFunction,
			returnValue;

	beforeEach(() => {
		parameters = [1, 2, 3];

		staircase = new Staircase(...parameters);

		stepFunction = sinon.spy();

		returnValue = staircase.step(stepFunction);
	});

	it("should return the object instance to enable chaining", () => {
		returnValue.should.eql(staircase);
	});

	it("should add the step function to steps as a series", () => {
		staircase.stepGroups().should.eql([
			{type: "series", steps: [stepFunction]}
		]);
	});
});
