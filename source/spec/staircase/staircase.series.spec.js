import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("staircase.series(...stepFunctions)", () => {
	let staircase,
			parameters,
			stepFunctions,
			stepOne,
			stepTwo,
			stepThree,
			returnValue;

	beforeEach(() => {
		parameters = [1, 2, 3];

		staircase = new Staircase(...parameters);

		stepOne = sinon.spy();
		stepTwo = sinon.spy();
		stepThree = sinon.spy();

		stepFunctions = [stepOne, stepTwo, stepThree];

		returnValue = staircase.series(...stepFunctions);
	});

	it("should return the object instance to enable chaining", () => {
		returnValue.should.eql(staircase);
	});

	it("should add the step functions to steps as a series", () => {
		staircase.steps.should.eql([
			{concurrency: "series", steps: stepFunctions}
		]);
	});
});
