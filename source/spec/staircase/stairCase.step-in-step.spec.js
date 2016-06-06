import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("Staircase(...options)", () => {
	let staircase,
			parameters;

	beforeEach(() => {
		staircase = new Staircase();
	});

	describe(".step(stepFunction)", () => {
		let stepFunctionOne,
				stepFunctionTwo;

		beforeEach(() => {
			stepFunctionOne = function (done) {
				this.step(stepFunctionTwo);
				done();
			};

			stepFunctionTwo = sinon.spy(function (done) {
				done();
			});

			staircase.step(stepFunctionOne);
		});

		it("should be able to add a step from within another step", done => {
			staircase.results(error => {
				stepFunctionTwo.called.should.be.true;

				done(error);
			});
		});
	});
});
