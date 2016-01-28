
import Staircase from "action-component";

import { authenticateAccount, authorizeAccount, logEvents } from "./sharedSteps.js";

export function handler(event, context) {
	context.permissions = ["create:something"];

	const action = new Staircase(event, context);

	action
		.series(authenticateAccount, authorizeAccount)
		.parallel(doSomething, doSomethingElseAtTheSameTime)
		.results((error, data) => {
			if (error) {
				context.fail(error);
			} else {
				context.succeed();
			}
		});
}
