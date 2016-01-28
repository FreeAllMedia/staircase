import Staircase from "../lib/staircase.js";

describe("Staircase(...options)", () => {
	let staircase,
			parameters;

	beforeEach(() => {
		parameters = [1, 2, 3];
		staircase = new Staircase(...parameters);
	});

	describe(".constructor(...parameters)", () => {
		it("should copy constructor parameters to .parameters", () => {
			staircase.parameters.should.eql(parameters);
		});
	});

	describe(".parameters", () => {
		it("should be set by the constructor", () => {
			staircase.should.have.property("parameters");
		});

		it("should be read-only", () => {
			() => {
				staircase.parameters = 3;
			}.should.throw();
		});
	});
});
