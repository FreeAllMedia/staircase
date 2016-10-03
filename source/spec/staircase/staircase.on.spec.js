import Staircase from "../../lib/staircase.js";

describe("staircase.on", () => {
	let staircase;

	beforeEach(() => {
		staircase = new Staircase();
	});

	it("should create a new event handler", done => {
		staircase.on("test", (one, two) => {
			[one, two].should.eql([1, 2]);
			done();
		});

		staircase.events.emit("test", 1, 2);
	});

	it("should return this to enable chaining", () => {
		staircase.on("something", () => {}).should.eql(staircase);
	});
});
