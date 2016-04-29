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

	results(callback) {
		this.steps.forEach(stepGroup => {
			switch(stepGroup.concurrency) {
				case "series":
					const stepTasks = stepGroup.steps.map(this[createStepTask], this);
					Async.series(stepTasks, callback);
					break;
			}
		});
	}

	[createStepTask](step) {
		return (done) => {
			const stepArguments = this.parameters.concat([done]);
			step(...stepArguments);
		};
	}
}
