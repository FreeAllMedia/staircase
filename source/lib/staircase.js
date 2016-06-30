import privateData from "incognito";
import Async from "flowsync";

const setupStepGroup = Symbol(),
			addStep = Symbol(),
			runStep = Symbol(),
			runSteps = Symbol();

export default class Staircase {
	constructor(...parameters) {
		const _ = privateData(this);
		_.parameters = parameters;
		_.context = this;
		_.currentStep = null;
		_.index = 0;
		_.stepIndex = 0;

		this.steps = [];
	}

	context(newContext) {
		const _ = privateData(this);
		if (newContext) {
			_.context = newContext;
			return this;
		} else {
			return _.context;
		}
	}

	get currentStep() {
		return privateData(this).currentStep;
	}

	get lastStep() {
		return this.steps[this.steps.length - 1];
	}

	get parameters() {
		return privateData(this).parameters;
	}

	get append() {
		privateData(this).after = null;
		return this;
	}

	after(targetStep) {
		const _ = privateData(this);
		if (targetStep) {
			_.after = targetStep;
			return this;
		} else {
			return _.after;
		}
	}

	step(newStep) {
		this.series(newStep);
		return this;
	}

	series(...steps) {
		this[addStep]({
			concurrency: "series",
			steps: steps
		});

		return this;
	}

	parallel(...steps) {
		this.steps.push({
			concurrency: "parallel",
			steps: steps
		});
		return this;
	}

	results(callback) {

		this[runSteps](callback);
	}

	[runSteps](callback, stepIndex = 0, data = []) {
		const stepGroup = this.steps[stepIndex];

		this[setupStepGroup](stepGroup, (error, newData) => {
			data.push(newData);
			if (error) {
				finished(error);
			} else {
				if (this.steps.length - 1 > stepIndex) {
					this[runSteps](callback, stepIndex + 1, data);
				} else {
					finished(null, data);
				}
			}
		});

		function finished(error, finishedData) {
			if (callback) {
				const flattenedData = [].concat.apply([], finishedData);
				callback(error, flattenedData);
			}
		}
	}

	[setupStepGroup](stepGroup, done) {
		const _ = privateData(this);

		let contextObject = _.context;

		let steps = stepGroup.steps;

		const lastStep = steps[steps.length - 1];

		if (typeof lastStep !== "function") {
			contextObject = steps.pop();
		}

		steps = steps.map(step => {
			return [step, contextObject, stepGroup];
		});

		switch (stepGroup.concurrency) {
			case "series":
				Async.mapSeries(
					steps,
					this[runStep].bind(this),
					done
				);
				break;
			case "parallel":
				Async.mapParallel(
					steps,
					this[runStep].bind(this),
					done
				);
		}
	}

	[runStep](stepData, done) {
		const step = stepData[0];
		const context = stepData[1];
		const stepGroup = stepData[2];

		const _ = privateData(this);

		const originalAfter = _.after;

		function clearCurrentStep(error, data) {
			_.currentStep = null;
			_.after = originalAfter;

			done(error, data);
		}

		const stepArguments = _.parameters.concat([clearCurrentStep]);

		_.currentStep = stepGroup;
		_.after = _.currentStep;

		step.call(context, ...stepArguments);
	}

	[addStep](step) {
		const _ = privateData(this);

		step.index = _.index;
		_.index += 1;

		if (_.after) {
			const afterIndex = this.steps.indexOf(_.after) + 1;

			this.steps.splice(afterIndex, 0, step);
			_.after = step;
		} else {
			_.after = step;
			this.steps.push(step);
		}
	}
}
