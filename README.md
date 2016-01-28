# Staircase.js

[![npm version](https://img.shields.io/npm/v/staircase.svg)](https://www.npmjs.com/package/staircase) [![license type](https://img.shields.io/npm/l/staircase.svg)](https://github.com/FreeAllMedia/staircase.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/staircase.svg)](https://www.npmjs.com/package/staircase) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg)

Organizes actions into steps

```javascript
import Staircase from "staircase";

const staircase = new Staircase;
staircase.saySomething(); // will output "Something"
```

# Quality and Compatibility

[![Build Status](https://travis-ci.org/FreeAllMedia/staircase.png?branch=master)](https://travis-ci.org/FreeAllMedia/staircase) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/staircase/badge.svg)](https://coveralls.io/r/FreeAllMedia/staircase) [![Code Climate](https://codeclimate.com/github/FreeAllMedia/staircase/badges/gpa.svg)](https://codeclimate.com/github/FreeAllMedia/staircase)  [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/staircase/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/staircase)  [![Dependency Status](https://david-dm.org/FreeAllMedia/staircase.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/staircase?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/staircase/dev-status.svg)](https://david-dm.org/FreeAllMedia/staircase?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)
![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)


[![Sauce Test Status](https://saucelabs.com/browser-matrix/staircase.svg)](https://saucelabs.com/u/staircase)


*If your platform is not listed above, you can test your local environment for compatibility by copying and pasting the following commands into your terminal:*

```
npm install staircase
cd node_modules/staircase
gulp test-local
```

# Installation

Copy and paste the following command into your terminal to install Staircase:

```
npm install staircase --save
```

## Import / Require

```
// ES6
import staircase from "staircase";
```

```
// ES5
var staircase = require("staircase");
```

```
// Require.js
define(["require"] , function (require) {
    var staircase = require("staircase");
});
```

# Getting Started

## More insights

In order to say something, you should know that `staircase()` ... (add your test here)

# How to Contribute

See something that could use improvement? Have a great feature idea? We listen!

You can submit your ideas through our [issues system](https://github.com/FreeAllMedia/staircase/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

We always aim to be friendly and helpful.

## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using Staircase.js on a platform we aren't automatically testing for.

```
npm test
```
