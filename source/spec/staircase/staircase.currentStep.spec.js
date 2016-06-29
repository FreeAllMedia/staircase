import Staircase from "../../lib/staircase.js";

describe("staircase.currentStep", () => {
	let staircase,
			actualCurrentStep,
			expectedCurrentStep;

	beforeEach(() => {
		staircase = new Staircase();

		expectedCurrentStep = staircase.step((done) => {
			actualCurrentStep = staircase.currentStep;
			done();
		}).lastStep;
	});

	it("should return the current running step", done => {
		staircase.results(error => {
			actualCurrentStep.should.eql(expectedCurrentStep);
			done(error);
		});
	});

	it("should return null when no steps are running", () => {
		(staircase.currentStep === null).should.be.true;
	});

	it("should return null after all steps are done running", done => {
		staircase.results(error => {
			(staircase.currentStep === null).should.be.true;
			done(error);
		});
	});
});
