# Staircase.js

``` javascript
import Action from "staircase";

import { fetchAccount, authenticateAccount, authorizeAccount, logEvents } from "./sharedSteps.js";

function createItem(event, context, done) {
	// Do something
	done();
}

export function handler(event, context) {
	context.permissions = ["create:something"];

	const action = new Action(event, context);

	action
		.step(fetchAccount)
		.series(
			authenticateAccount,
			authorizeAccount,
			createItem
		)
		.results((error, data) => {
			if (error) {
				context.fail(error);
			} else {
				context.succeed();
			}
		});
}
```
