'use strict'

const patch = log => {
  // see https://github.com/trentm/node-bunyan#log-method-api
  const LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']

  // see https://github.com/trentm/node-bunyan#core-fields
  const CORE_FIELDS = ['v', 'level', 'name', 'hostname', 'pid', 'time', 'msg', 'src']

  LEVELS.forEach(level => {
    const original = log[level].bind(log)

    log[level] = function (...args) {
      let massagedArgs

      if (typeof args[0] === 'object') {
        if (CORE_FIELDS.some(it => Object.keys(args[0]).includes(it))) {
          massagedArgs = [{ object: args[0] }].concat(args.splice(1))
        }
      }
      massagedArgs = massagedArgs || args

      const retval = original(...massagedArgs)
      return retval !== undefined ? retval : args[0]
    }

    log[level] = log[level].bind(log)
  })

  return log
}

module.exports = patch
