'use strict'

// see https://github.com/trentm/node-bunyan#log-method-api
const LEVELS = ['fatal', 'error', 'warn', 'info', 'debug', 'trace']

// see https://github.com/trentm/node-bunyan#core-fields
const CORE_FIELDS = ['v', 'level', 'name', 'hostname', 'pid', 'time', 'msg', 'src']

const DEFAULT_WRAPPER_KEY = 'object'

const patch = (log, opts) => {
  opts = opts || {}
  const wrapperKey = opts.wrapperKey || DEFAULT_WRAPPER_KEY

  LEVELS.forEach(level => {
    const original = log[level].bind(log)

    log[level] = function (...args) {
      if (args[0] instanceof Error) {
        original(...args)
        return args[0]
      }

      let massagedArgs

      if (typeof args[0] === 'object') {
        if (opts.forceWrap || CORE_FIELDS.some(it => Object.keys(args[0]).includes(it))) {
          massagedArgs = [{ [wrapperKey]: args[0] }].concat(args.splice(1))
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
