import Staircase from "../../lib/staircase.js";
import StepGroupSetter from "../../lib/stepGroupSetter.js";

describe("staircase.series(...steps)", () => {
	let staircase,
			parameters,
			steps;

	beforeEach(() => {
		parameters = [1, 2, 3];

		staircase = new Staircase(...parameters);

		steps = [
			(one, two, three, done) => done(),
			(one, two, three, done) => done(),
			(one, two, three, done) => done()
		];
	});

	it("should return a StepGroupSetter instance", () => {
		staircase
			.series(...steps)
				.should.be.instanceOf(StepGroupSetter);
	});

	it("should add the step functions to steps as a series", () => {
		staircase
			.series(...steps)
			.stepGroups()
				.should.eql([
					{ type: "series", steps: steps }
				]);
	});
});
