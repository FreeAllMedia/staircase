import Staircase from "../../lib/staircase.js";

describe("Staircase(...options)", () => {
	let staircase;

	beforeEach(() => {
		staircase = new Staircase();
	});

	describe("results(callback)", () => {
		it("should run without errors when there are no steps", done => {
			staircase.results(error => {
				done(error);
			});
		});
	});
});
