import Staircase from "../../lib/staircase.js";

describe("staircase.currentStepGroup", () => {
	let staircase,
			actualCurrentStep,
			expectedCurrentStep;

	beforeEach(() => {
		staircase = new Staircase();

		expectedCurrentStep = staircase.step((done) => {
			actualCurrentStep = staircase.currentStepGroup;
			done();
		}).lastStepGroup;
	});

	it("should return the current running step", done => {
		staircase.results(error => {
			actualCurrentStep.should.eql(expectedCurrentStep);
			done(error);
		});
	});

	it("should return null when no steps are running", () => {
		(staircase.currentStepGroup === null).should.be.true;
	});

	it("should return null after all steps are done running", done => {
		staircase.results(error => {
			(staircase.currentStepGroup === null).should.be.true;
			done(error);
		});
	});
});
