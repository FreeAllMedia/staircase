# StairCase.js

Create reusable & portable collections of functions with built-in flow control.

1. Creates an object you can add asynchronous functions to.
2. You tell the object which concurrencies to use for the functions.
3. Get the `.results(callback)` of the entire workflow.

# Installation

``` shell
$ npm install staircase --save
```

# Example

``` javascript
import Action from "staircase";

import {
	fetchAccount,
	authenticateAccount,
	authorizeAccount,
	logEvents,
	openConnections,
	closeConnections
} from "./sharedSteps.js";



/**
 * Any arguments sent to the constructor are also sent
 * to each step function before the callback argument
 */
const action = new Action(event, context);

/**
 * Step functions receive the constructor arguments first,
 * then a node-standard callback (error, data)
 */
function createItem(event, context, done) {
	// Do something
	done();
}

/**
 * Chain together a workflow for each step function.
 *
 * This does not execute the workflow, yet.
 */
action
	// These steps will be run in series:
	.series(
		openConnections,
		fetchAccount
	)
	// After the previous group of steps have completed,
	// these steps will be run in parallel:
	.parallel(
		authenticateAccount,
		authorizeAccount
	)
	// After the previous group of steps have completed,
	// this single step will be run
	.step(
		createItem
	)
	// Finally, when the previous step completes,
	// these steps will be run in parallel
	.parallel(
		logEvents,
		closeConnections
	);

/**
 * Now `action` is portable and can be executed for results whenever needed.
 *
 * data returned by the steps will be available in the `data` argument as an array of values.
 */
action
	.results((error, data) => {
		if (error) { throw error };

		console.log("data:", data);
	});
```
