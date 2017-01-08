import Staircase from "../../lib/staircase.js";

describe("staircase.lastStepGroup", () => {
	let staircase;

	beforeEach(() => {
		staircase = new Staircase()
		.step((done) => {
			done();
		});
	});

	it("should return the last step in the staircase", () => {
		const stepGroups = staircase.stepGroups();
		const lastStepGroup = stepGroups[stepGroups.length - 1];
		staircase.lastStepGroup.should.eql(lastStepGroup);
	});
});
