
import privateData from "incognito";
import Async from "flowsync";
import Component from "mrt";

import StepGroupSetter from "./stepGroupSetter.js";

const setupStepGroup = Symbol(),
			runStep = Symbol(),
			runSteps = Symbol(),
			reorderStepGroup = Symbol();

export default class Staircase extends Component {
	initialize(...initialArguments) {
		const _ = privateData(this);

		_.context = this;
		_.currentStep = null;
		_.stepIndex = 0;

		this.link("series", StepGroupSetter).apply(this, "series");
		this.link("parallel", StepGroupSetter).apply(this, "parallel");

		this.properties(
			"arguments"
		).multi.aggregate.flat;

		this.properties("stepGroups")
			.multi.aggregate.flat
			.then(this[reorderStepGroup]);

		this.arguments(...initialArguments);
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
		const stepGroups = this.stepGroups();
		return stepGroups[stepGroups.length - 1];
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
		this.stepGroups({
			type: "series",
			steps: [ newStep ]
		});

		return this;
	}

	results(callback) {
		this[runSteps](callback);
	}

	/**
	 * Steps
	 */

	[runSteps](callback, stepIndex = 0, data = []) {
		const stepGroups = this.stepGroups();
		const stepGroup = stepGroups[stepIndex];

		if (stepGroup) {
			this[setupStepGroup](stepGroup, (error, newData) => {
				data.push(newData);
				if (error) {
					finished(error);
				} else {
					if (this.stepGroups().length - 1 > stepIndex) {
						this[runSteps](callback, stepIndex + 1, data);
					} else {
						finished(null, data);
					}
				}
			});
		} else {
			finished(null);
		}

		function finished(error, finishedData) {
			if (callback) {
				const flattenedData = [].concat.apply([], finishedData);
				callback(error, flattenedData);
			}
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

		const stepArguments = this.arguments().concat([clearCurrentStep]);

		_.currentStep = stepGroup;
		_.after = _.currentStep;

		step.call(context, ...stepArguments);
	}

	/**
	 * Step Groups
	 */

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

		switch (stepGroup.type) {
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

	[reorderStepGroup](stepGroup) {
		const _ = privateData(this);

		if (_.after) {
			const stepGroups = this.stepGroups();

			const originalIndex = stepGroups.indexOf(stepGroup);

			stepGroups.splice(originalIndex, 1);

			const afterIndex = stepGroups.indexOf(_.after) + 1;

			stepGroups.splice(afterIndex, 0, stepGroup);
		}

		_.after = stepGroup;
	}
}
