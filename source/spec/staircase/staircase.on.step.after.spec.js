import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("staircase.on('step:after', handler)", () => {
	let staircase,
			stepOne,
			stepTwo,
			listener,
			stepDetails,
			data,
			clock;

	beforeEach(done => {
		clock = sinon.useFakeTimers();

		stepOne = sinon.spy(callback => callback());
		stepTwo = sinon.spy((uno, dos, tres, callback) => callback());

		listener = sinon.spy(step => stepDetails.push(step));

		stepDetails = [];

		data = { hello: "world" };

		staircase = new Staircase();

		staircase
			.on("step:after", listener)
			.step(function nameTest(callback) {
				clock.tick(500);
				callback(null, data);
			})
			.step(stepOne)
			.series(stepTwo).apply(1, 2, 3);

		staircase.results(done);
	});

	afterEach(() => clock.restore());

	it("should call the provided listener after each step finishes", () => {
		sinon.assert.callOrder(stepOne, listener, stepTwo, listener);
	});

	it("should call the listener with step names", () => {
		stepDetails[0].name.should.eql("nameTest");
	});

	it("should call the listener with the step arguments", () => {
		stepDetails.map(step => step.arguments).should.eql([
			[],
			[],
			[1, 2, 3]
		]);
	});

	it("should call the listener with the step return data", () => {
		stepDetails[0].data.should.eql(data);
	});

	it("should call the listener with the step return error", done => {
		const returnError = new Error();

		stepDetails = [];

		staircase = new Staircase();

		staircase
			.on("step:after", listener)
			.step(function nameTest(callback) {
				clock.tick(500);
				callback(returnError, data);
			});

		staircase.results(() => {
			stepDetails[0].error.should.eql(returnError);
			done();
		});
	});

	it("should call the listener with the step duration in ms", () => {
		stepDetails[0].duration.should.eql(500);
	});
});
