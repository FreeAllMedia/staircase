import Async from "flowsync";

let a = [1, 2, 3];

Async.mapSeries(a, (value, done) => {
	console.log(value);
	a.push(4);
	done();
}, () => {
	console.log("OKAY!");
});
