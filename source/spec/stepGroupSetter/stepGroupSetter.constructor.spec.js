import Staircase from "../../lib/staircase.js";
import StepGroupSetter from "../../lib/stepGroupSetter.js";
import sinon from "sinon";
import Component from "mrt";

describe("StepGroupSetter(staircase, ...steps)", () => {
	let staircase,
			stepGroupSetter,
			initialArguments,
			type,
			steps;

	beforeEach(() => {
		initialArguments = [1, 2, 3];

		staircase = new Staircase(...initialArguments);

		type = "parallel";

		steps = [
			sinon.spy((one, two, three, done) => done()),
			sinon.spy((one, two, three, done) => done()),
			sinon.spy((one, two, three, done) => done())
		];

		stepGroupSetter = new StepGroupSetter(staircase, type, ...steps);
	});

	it("should be an mrt component", () => {
		stepGroupSetter.should.be.instanceOf(Component);
	});

	it("should add the step functions to staircase.steps as a series", () => {
		staircase.stepGroups().should.eql([
			{ type: type, steps: steps }
		]);
	});
});
