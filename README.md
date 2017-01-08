# StairCase: Portable Flow-Control

Create portable & reusable sequences of functions.

* Easy to use.
* 100% test coverage.
* 

## Getting Started

1. Install staircase
    ``` shell
    $ npm install staircase --save
    ```
2. Create a scheduler
3. Add steps to be called in series or parallel
4. Get the results

```javascript
import Scheduler from "staircase";

const scheduler = new Scheduler("Hello", "World")

.series(
    // Synchronous
    (argumentOne, argumentTwo) => {
        return argumentOne;
    },
    // Asynchronous
    (argumentOne, argumentTwo, done) => {
        done(null, argumentTwo);
    }
)

.parallel(
    // Synchronous
    (argumentOne, argumentTwo) => {
        return argumentOne;
    },
    // Asynchronous
    (argumentOne, argumentTwo, done) => {
        done(null, argumentTwo);
    }
)

.results((error, data) => {
    if (error) { throw error; }
    data; // ["Hello", "World", "Hello", "World"];
});
```

## Events

Set callback events to be called before and after each step.

```javascript
scheduler

.on("step:before", step => {
	step.name; // name of the step about to be executed
	step.arguments; // arguments about to be sent to the step
})

.on("step:after", step => {
	step.name; // name of the step about to be executed
	step.arguments; // arguments about to be sent to the step
	step.error; // error returned by the step
	step.data; // data returned by the step
	step.duration; // duration of the step execution in ms
});
```

## Apply Extra Arguments

It is possible to pass extra arguments to any step group by calling `.apply()` at the end of any `.series`, `.parallel`, or `.step` call.

```javascript
import Scheduler from "staircase";

const scheduler = new Scheduler("Hello", "World")

.series(
    (appliedArgumentOne, appliedArgumentTwo, argumentOne, argumentTwo) => {
        return argumentOne + appliedArgumentOne;
    },
    (appliedArgumentOne, appliedArgumentTwo, argumentOne, argumentTwo, done) => {
        done(null, argumentTwo + appliedArgumentTwo);
    }
).apply(",", "!")

.series(
    (appliedArgumentOne, argumentOne, argumentTwo) => {
        return "How are";
    },
    (appliedArgumentOne, argumentOne, argumentTwo, done) => {
        done(null, appliedArgumentOne + "?");
    }
).apply("things")

.results((error, data) => {
    if (error) { throw error; }
    data.join(" "); // "Hello, World! How are things?"
});
```
