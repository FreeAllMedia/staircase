import Staircase from "../../lib/staircase.js";

import EventEmitter from "events";

describe("staircase.events", () => {
	it("should return staircase's event emitter", () => {
		const staircase = new Staircase();
		staircase.events.should.be.instanceOf(EventEmitter);
	});
});
