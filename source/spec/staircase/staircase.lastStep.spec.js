import Staircase from "../../lib/staircase.js";

describe("staircase.lastStep", () => {
	let staircase;

	beforeEach(() => {
		staircase = new Staircase()
		.step((done) => {
			done();
		});
	});

	it("should return the last step in the staircase", () => {
		const lastStep = staircase.steps[staircase.steps.length - 1];
		staircase.lastStep.should.eql(lastStep);
	});
});
