import Staircase from "../../lib/staircase.js";

describe("staircase.arguments", () => {
	let staircase,
			initialArguments;

	beforeEach(() => {
		initialArguments = [1, 2, 3];
		staircase = new Staircase(...initialArguments);
	});

	it("should copy constructor arguments to .arguments()", () => {
		staircase.arguments().should.eql(initialArguments);
	});

	it("should aggregate additional arguments to .arguments()", () => {
		const newArguments = [4, 5, 6];
		const aggregatedArguments = initialArguments.concat(newArguments);

		staircase
			.arguments(...newArguments)
			.arguments().should.eql(aggregatedArguments);
	});
});
