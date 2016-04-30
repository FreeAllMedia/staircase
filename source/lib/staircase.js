import privateData from "incognito";
import Async from "flowsync";

const createStepTask = Symbol();

export default class Staircase {
	constructor(...parameters) {
		const _ = privateData(this);
		_.parameters = parameters;

		this.steps = [];
	}

	get parameters() {
		return privateData(this).parameters;
	}

	step(newStep) {
		this.series(newStep);
		return this;
	}

	series(...steps) {
		this.steps.push({
			concurrency: "series",
			steps: steps
		});
		return this;
	}

	runSteps(callback, extraStepCount = 0) {
		const initialStepCount = this.steps.length;
		Async.mapSeries(this.steps, (stepGroup, done) => {
			Async.series(stepGroup.steps, done);
		}, () => {
			extraStepCount = this.steps.length - initialStepCount;
			if (extraStepCount > 0) {
				this.runSteps(callback, extraStepCount);
			} else {
				callback();
			}
		});
	}

	results(callback) {
		this.runSteps(callback);
	}

	[createStepTask](step) {
		return (done) => {
			const stepArguments = this.parameters.concat([done]);
			step.call(this, ...stepArguments);
		};
	}
}
