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
		const stepGroups = staircase.stepGroups();
		const lastStep = stepGroups[stepGroups.length - 1];
		staircase.lastStep.should.eql(lastStep);
	});
});
