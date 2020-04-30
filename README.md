# bunyaner

## Deprecation Notice:
This module has been superceded by [@northscaler/bunyaner](https://www.npmjs.com/package/@northscaler/bunyaner) and will no longer be maintained.


### Breaking changes in @northscaler/bunyaner:
The following breaking changes need to be addressed when upgrading to `@northscaler/bunyaner`:

* The function exported by `require(@northscaler/bunyaner)` uses deconstruction instead of positional parameters.
* All object payloads, including `Error`s, are placed under the `payload` field; the field name is configurable via option `payloadKey`.
* When an `Error` is logged, there is a new `isError` field in the log record that contains the boolean Literal `true` (not a string); the field name is configurable via option `errorIndicatorKey`.
* It is also configurable whether you want to include `isError: false` when non-`Error`s are logged using 
option `alwaysShowErrorIndicator`. 

## Overview
Make [bunyan](https://www.npmjs.com/package/bunyan)'s log level methods much mo' betta' with mo' bunyan-y flavor:

* always returns the first argument given
* if any key on `arguments[0]` conflicts with bunyan's [core logging fields](https://github.com/trentm/node-bunyan#core-fields), wraps `arguments[0]` with `{ object: arguments[0] }` in the logging level call

## TL;DR
Install `bunyan` (if you haven't already) & `bunyaner`:
```bash
$ npm i --save bunyan
$ npm i --save bunyaner
```
Create a file that your module will use to get a logger:
```javascript
// log.js
const bunyan = require('bunyan')
const bunyaner = require('bunyaner')

module.exports = bunyaner(bunyan.createLogger({
  name: 'foobar',
  serializers: bunyan.stdSerializers
  // ...other buyan options
}))
```
Now use it:
```javascript
const log = require('./log')

let gameState = log.info({
  game: 'zork',
  player: 'querky123'
}) // logs state object & returns it

// ...querky123 plays game to level 5...

gameState = log.info({
  game: 'zork',
  player: 'querky123',
  level: 5 // <- conflicts with bunyan core logging field, but no matter!
}) // logs gameState as { object: gameState } & returns gameState

if (gameState.badness) {
  // log method logs given error, then returns it so it can be thrown
  throw log.error(new Error('boom'))
}
```
