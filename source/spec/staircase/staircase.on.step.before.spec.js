import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("staircase.on('step:before', handler)", () => {
	let staircase,
			stepOne,
			stepTwo,
			listener,
			stepDetails;

	beforeEach(done => {
		stepOne = sinon.spy(callback => callback());
		stepTwo = sinon.spy((uno, dos, tres, callback) => callback());

		listener = sinon.spy(step => stepDetails.push(step));

		stepDetails = [];

		staircase = new Staircase();

		staircase
			.on("step:before", listener)
			.step(function nameTest(callback) { callback(); })
			.step(stepOne)
			.series(stepTwo).apply(1, 2, 3);

		staircase.results(done);
	});

	it("should call the provided listener before each step starts", () => {
		sinon.assert.callOrder(listener, stepOne, listener, stepTwo);
	});

	it("should call the listener with step details", () => {
		stepDetails.should.eql([
			{
				name: "nameTest",
				arguments: []
			},
			{
				name: "proxy", // due to sinon
				arguments: []
			},
			{
				name: "proxy", // due to sinon
				arguments: [1, 2, 3]
			}
		]);
	});
});
