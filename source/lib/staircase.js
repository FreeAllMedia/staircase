import privateData from "incognito";
import Async from "flowsync";

const runStep = Symbol(),
			runSteps = Symbol();

export default class Staircase {
	constructor(...parameters) {
		const _ = privateData(this);
		_.parameters = parameters;
		_.context = this;

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

	[runSteps](callback, extraStepCount = 0) {
		const steps = this.steps.slice(-extraStepCount);

		const initialStepCount = this.steps.length;

		Async.mapSeries(steps, (stepGroup, done) => {
			switch (stepGroup.concurrency) {
				case "series":
					Async.mapSeries(
						stepGroup.steps,
						this[runStep].bind(this),
						done
					);
					break;
				case "parallel":
					Async.mapParallel(
						stepGroup.steps,
						this[runStep].bind(this),
						done
					);
			}
		}, (error, data) => {
			if (!error) {
				extraStepCount = this.steps.length - initialStepCount;
				if (extraStepCount > 0) {
					this[runSteps](callback, extraStepCount);
				} else {
					const flattenedData = [].concat.apply([], data);
					if (callback) {	callback(null, flattenedData);	}
				}
			} else {
				if (callback) {	callback(error); }
			}
		});
	}

	[runStep](step, done) {
		const _ = privateData(this);
		const parameters = _.parameters;
		const stepArguments = parameters.concat([done]);
		step.call(_.context, ...stepArguments);
	}
}
