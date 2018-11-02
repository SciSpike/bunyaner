'use strict'

const bunyan = require('bunyan')
const patch = require('..')

const log = patch(bunyan.createLogger({
  name: 'foobar',
  serializers: bunyan.stdSerializers
}))

module.exports = log
