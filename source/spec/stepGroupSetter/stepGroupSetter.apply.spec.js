import Staircase from "../../lib/staircase.js";
import StepGroupSetter from "../../lib/stepGroupSetter.js";
import sinon from "sinon";

describe("stepGroupSetter.apply(...extraArguments)", () => {
	let staircase,
			stepGroupSetter,
			initialArguments,
			extraArguments,
			type,
			steps;

	beforeEach(() => {
		initialArguments = [1];
		extraArguments = [2, 3];

		staircase = new Staircase(...initialArguments);

		type = "series";

		steps = [
			sinon.spy((one, two, three, done) => done()),
			sinon.spy((one, two, three, done) => done()),
			sinon.spy((one, two, three, done) => done())
		];

		stepGroupSetter = new StepGroupSetter(staircase, type, ...steps);

		stepGroupSetter.apply(...extraArguments);
	});

	it("should not add the extra arguments to .arguments()", () => {
		staircase.arguments().should.eql(initialArguments);
	});

	it("should add the step functions to staircase.stepGroups as a series with extra arguments", () => {
		staircase.stepGroups().should.eql([
			{ type: type, steps: steps, extraArguments: extraArguments }
		]);
	});

	it("should call each step with the extra arguments", done => {
		staircase.results(() => {
			steps.forEach(step => {
				step.calledWith(1, 2, 3).should.be.true;
			});
			done();
		});
	});
});
