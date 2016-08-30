import Component from "mrt";

export default class StepGroupSetter extends Component {
	initialize(staircase, type, ...steps) {
		this.stepGroup = {
			type: type,
			steps
		};

		staircase.stepGroups(this.stepGroup);
	}

	apply(...extraArguments) {
		this.stepGroup.extraArguments = extraArguments;
		return this;
	}
}
