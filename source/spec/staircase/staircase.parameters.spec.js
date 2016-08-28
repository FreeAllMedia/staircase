import Staircase from "../../lib/staircase.js";

describe("staircase.parameters", () => {
	let staircase,
			parameters;

	beforeEach(() => {
		parameters = [1, 2, 3];
		staircase = new Staircase(...parameters);
	});

	it("should copy constructor parameters to .parameters", () => {
		staircase.parameters.should.eql(parameters);
	});

	it("should be read-only", () => {
		(() => {
			staircase.parameters = 3;
		}).should.throw();
	});
});
