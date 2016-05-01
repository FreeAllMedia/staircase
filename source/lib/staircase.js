import privateData from "incognito";
import Async from "flowsync";

const runStep = Symbol(),
			runSteps = Symbol();

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

	results(callback) {
		this[runSteps](callback);
	}

	[runSteps](callback, extraStepCount = 0) {
		const steps = this.steps.slice(-extraStepCount);

		const initialStepCount = this.steps.length;

		Async.mapSeries(steps, (stepGroup, done) => {
			switch (stepGroup.concurrency) {
				case "series":
					Async.mapSeries(
						stepGroup.steps,
						this[runStep].bind(this),
						(error) => {
							done(error);
						}
					);
			}
		}, (error) => {
			if (!error) {
				extraStepCount = this.steps.length - initialStepCount;
				if (extraStepCount > 0) {
					this[runSteps](callback, extraStepCount);
				} else {
					if (callback) {	callback();	}
				}
			} else {
				if (callback) {	callback(error); }
			}
		});
	}

	[runStep](step, done) {
		const parameters = privateData(this).parameters;
		const stepArguments = parameters.concat([done]);
		step.call(this, ...stepArguments);
	}
}
