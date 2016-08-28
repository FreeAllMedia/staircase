import Staircase from "../../lib/staircase.js";

describe("staircase.results(callback)", () => {
	let staircase;

	beforeEach(() => {
		staircase = new Staircase();
	});

	it("should run without errors when there are no steps", done => {
		staircase.results(error => {
			done(error);
		});
	});
});
