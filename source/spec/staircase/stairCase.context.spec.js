import Staircase from "../../lib/staircase.js";

describe("Staircase(...options)", () => {
	let staircase,
			contextObject;

	beforeEach(() => {
		contextObject = {};
		staircase = new Staircase();
	});

	it("should return itself to enable chaining", () => {
		staircase.context(contextObject).should.eql(staircase);
	});

	it("should return the context when no value is provided", () => {
		staircase.context(contextObject);
		staircase.context().should.eql(contextObject);
	});

	it("should call all steps with the provided context", done => {
		staircase
			.context(contextObject)
			.step(function (stepDone) {
				this.called = true;
				stepDone();
			});

		staircase.results(error => {
			contextObject.called.should.be.true;
			done(error);
		});
	});

	it("should use itself as the context by default", done => {
		staircase.step(function (stepDone) {
			this.called = true;
			stepDone();
		});

		staircase.results(error => {
			staircase.called.should.be.true;
			done(error);
		});
	});
});
