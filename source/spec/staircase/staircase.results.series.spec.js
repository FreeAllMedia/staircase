import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("staircase.results(callback) (series)", () => {
	let staircase,
			parameters,
			clock,
			callback,
			stepOne,
			stepTwo,
			stepThree;

	beforeEach(() => {
		clock = sinon.useFakeTimers(Date.now());
		parameters = [1, 2, 3];
		staircase = new Staircase(...parameters);
	});

	afterEach(() => {
		clock.restore();
	});

	function mockStepFunction(argumentOne, argumentTwo, argumentThree, stepDone) {
		this.context = this;
		setTimeout(() => {
			stepDone(null, 9);
		}, 100);
	}

	beforeEach(() => {
		stepOne = sinon.spy(mockStepFunction);
		stepTwo = sinon.spy(mockStepFunction);
		stepThree = sinon.spy(mockStepFunction);
	});

	it("should return itself to enable chaining", () => {
		staircase.series(stepOne, stepTwo, stepThree).should.eql(staircase);
	});

	it("should return aggregated data from chained calls", done => {
		staircase
			.series(stepOne, stepTwo)
			.series(stepThree)
			.results((error, data) => {
				data.should.eql([9, 9, 9]);
				done();
			});

			clock.tick(350);
	});

	it("should return an array of all data returned by the step functions", done => {
		staircase
			.series(stepOne, stepTwo, stepThree)
			.results((error, data) => {
				data.should.eql([9, 9, 9]);
				done();
			});

			clock.tick(350);
	});

	it("should not call the steps in parallel", done => {
		staircase
			.series(stepOne, stepTwo, stepThree)
			.results();

		clock.tick(50);

		const actualStepResults = {
			stepOneCalled: stepOne.called,
			stepTwoCalled: stepTwo.called,
			stepThreeCalled: stepThree.called
		};

		const expectedStepResults = {
			stepOneCalled: true,
			stepTwoCalled: false,
			stepThreeCalled: false
		};

		actualStepResults.should.eql(expectedStepResults);

		done();
	});

	it("should not call step three in parallel", done => {
		staircase
			.series(stepOne, stepTwo, stepThree)
			.results();

		clock.tick(150);

		const actualStepResults = {
			stepOneCalled: stepOne.called,
			stepTwoCalled: stepTwo.called,
			stepThreeCalled: stepThree.called
		};

		const expectedStepResults = {
			stepOneCalled: true,
			stepTwoCalled: true,
			stepThreeCalled: false
		};

		actualStepResults.should.eql(expectedStepResults);

		done();
	});

	it("should call all steps", done => {
		staircase
			.series(stepOne, stepTwo, stepThree)
			.results();

		clock.tick(250);

		const actualStepResults = {
			stepOneCalled: stepOne.called,
			stepTwoCalled: stepTwo.called,
			stepThreeCalled: stepThree.called
		};

		const expectedStepResults = {
			stepOneCalled: true,
			stepTwoCalled: true,
			stepThreeCalled: true
		};

		actualStepResults.should.eql(expectedStepResults);

		done();
	});

	it("should call each step function with .parameters as the arguments", () => {
		staircase
			.series(stepOne, stepTwo, stepThree)
			.results();

		clock.tick(250);

		const actualStepResults = {
			stepOneCalled: stepOne.calledWith(...parameters),
			stepTwoCalled: stepTwo.calledWith(...parameters),
			stepThreeCalled: stepThree.calledWith(...parameters)
		};

		const expectedStepResults = {
			stepOneCalled: true,
			stepTwoCalled: true,
			stepThreeCalled: true
		};

		actualStepResults.should.eql(expectedStepResults);

	});

	it("should cancel step execution upon a step error", () => {
		stepOne = sinon.spy((argumentOne, argumentTwo, argumentThree, stepDone) => {
			stepDone(new Error());
		});

		staircase
			.series(stepOne, stepTwo, stepThree)
			.results();

		clock.tick(250);

		const actualStepResults = {
			stepOneCalled: stepOne.called,
			stepTwoCalled: stepTwo.called,
			stepThreeCalled: stepThree.called
		};

		const expectedStepResults = {
			stepOneCalled: true,
			stepTwoCalled: false,
			stepThreeCalled: false
		};

		actualStepResults.should.eql(expectedStepResults);
	});

	it("should return nothing if no error occurs", done => {
		staircase
			.series(stepOne, stepTwo, stepThree)
			.results();

		clock.tick(350);

		done();
	});

	it("should return the step error if it occurs", done => {
		const error = new Error();

		stepOne = (argumentOne, argumentTwo, argumentThree, stepDone) => {
			stepDone(error);
		};

		callback = (resultsError) => {
			resultsError.should.eql(error);
			done();
		};

		staircase
			.series(stepOne, stepTwo, stepThree)
			.results(callback);

		clock.tick(250);
	});

	it("should use a provided context object when provided as the last argument", done => {
		const contextObject = {};
		staircase
			.series(stepOne, stepTwo, stepThree, contextObject)
			.results(error => {
				contextObject.context.should.eql(contextObject);
				done(error);
			});

		clock.tick(350);
	});
});
