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

	describe("results(callback) (parallel)", () => {
		let callback,

				stepOne,
				stepTwo,
				stepThree;

		beforeEach(() => {
			function mockStepFunction(argumentOne, argumentTwo, argumentThree, stepDone) {
				setTimeout(() => {
					stepDone(null, 9);
				}, 100);
			}

			stepOne = sinon.spy(mockStepFunction);
			stepTwo = sinon.spy(mockStepFunction);
			stepThree = sinon.spy(mockStepFunction);
		});

		it("should return itself to enable chaining", () => {
			staircase.parallel(stepOne, stepTwo, stepThree).should.eql(staircase);
		});

		it("should return an array of all data returned by the step functions", done => {
			staircase
				.parallel(stepOne, stepTwo, stepThree)
				.results((error, data) => {
					data.should.eql([9, 9, 9]);
					done();
				});

				clock.tick(350);
		});

		it("should return aggregated data from chained calls", done => {
			staircase
				.parallel(stepOne, stepTwo)
				.parallel(stepThree)
				.results((error, data) => {
					data.should.eql([9, 9, 9]);
					done();
				});

				clock.tick(350);
		});

		it("should call all steps in parallel", done => {
			staircase
				.parallel(stepOne, stepTwo, stepThree)
				.results();

			clock.tick(50);

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
				.parallel(stepOne, stepTwo, stepThree)
				.results();

			clock.tick(50);

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

		it("should return nothing if no error occurs", done => {
			staircase
				.parallel(stepOne, stepTwo, stepThree)
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
				.parallel(stepOne, stepTwo, stepThree)
				.results(callback);

			clock.tick(250);
		});
	});
});
