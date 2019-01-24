'use strict'

const bunyan = require('bunyan')
const patch = require('..')

const log = customKey => patch(bunyan.createLogger({
  name: 'foobar',
  serializers: bunyan.stdSerializers
}), {
  forceWrap: true,
  wrapperKey: customKey
})

module.exports = log
