import Staircase from "../../lib/staircase.js";

describe("staircase.stepGroups([...stepGroups])", () => {
	let staircase,
			stepGroup;

	beforeEach(() => {
		staircase = new Staircase();

		stepGroup = {
			type: "series",
			steps: [
				() => {},
				() => {},
				() => {}
			]
		};
	});

	it("should set a single step", () => {
		staircase.stepGroups(stepGroup);
		staircase.stepGroups().should.eql([ stepGroup ]);
	});

	it("should accept multiple stepGroups", () => {
		staircase.stepGroups(stepGroup, stepGroup);
		staircase.stepGroups().should.eql([ stepGroup, stepGroup ]);
	});

	it("should aggregate and flatten stepGroups", () => {
		const groupOne = Object.assign({}, stepGroup);
		const groupTwo = Object.assign({}, stepGroup);
		const groupThree = Object.assign({}, stepGroup);

		staircase
			.stepGroups(groupOne)
			.stepGroups(groupTwo, groupThree)
			.stepGroups().should.eql([ groupOne, groupTwo, groupThree ]);
	});

	it("should return the staircase instance to enable chaining", () => {
		staircase.stepGroups(stepGroup).should.eql(staircase);
	});
});
