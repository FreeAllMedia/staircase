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
		const _ = privateData(this);
		if (_.after) {
			steps.forEach(step => {
				_.after.steps.push(step);
			});
		} else {
			this.steps.push({
				concurrency: "series",
				steps: steps
			});
		}

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
		const _ = privateData(this);

		const stepGroups = this.steps.slice(-extraStepCount);

		const initialStepCount = this.steps.length;

		Async.mapSeries(stepGroups, (stepGroup, done) => {

			let contextObject = _.context;

			let steps = stepGroup.steps;

			const lastStep = steps[steps.length - 1];

			if (typeof lastStep !== "function") {
				contextObject = steps.pop();
			}

			steps = steps.map(step => {
				return [step, contextObject];
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

	[runStep](stepAndContext, done) {
		const step = stepAndContext[0];
		const context = stepAndContext[1];

		const _ = privateData(this);
		const stepArguments = _.parameters.concat([done]);

		step.call(context, ...stepArguments);
	}
}
