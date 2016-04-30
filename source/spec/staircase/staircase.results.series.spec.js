import Staircase from "../../lib/staircase.js";
import sinon from "sinon";

describe("Staircase(...options)", () => {
	let staircase,
			parameters,

			clock;

	beforeEach(() => {
		clock = sinon.useFakeTimers(Date.now());
		parameters = [1, 2, 3];
		staircase = new Staircase(...parameters);
	});

	afterEach(() => {
		clock.restore();
	});

	describe("results(callback) (series)", () => {
		let callback,

				stepOne,
				stepTwo,
				stepThree;

		beforeEach(() => {
			function mockStepFunction(argumentOne, argumentTwo, argumentThree, stepDone) {
				setTimeout(stepDone, 100);
			}

			stepOne = sinon.spy(mockStepFunction);
			stepTwo = sinon.spy(mockStepFunction);
			stepThree = sinon.spy(mockStepFunction);
		});

		it("should not call step two or three in parallel", done => {
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
	});
});
