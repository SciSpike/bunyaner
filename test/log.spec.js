/* global describe, it, beforeEach, afterEach */
'use strict'

const chai = require('chai')
chai.use(require('dirty-chai'))
const expect = chai.expect

const intercept = require('intercept-stdout')

const log = require('./log.js')

describe('unit tests of logger', () => {
  let unintercept
  let stdout

  beforeEach(() => {
    unintercept = intercept(text => {
      stdout = text
    })
  })

  afterEach(() => {
    unintercept()
  })

  it('should work with an Error object', () => {
    const msg = 'a foo message'
    const expected = new Error(msg)

    const actual = log.error(expected)
    expect(actual).to.equal(expected)

    const json = JSON.parse(stdout)

    expect(json.err).to.deep.equal({ name: 'Error', message: actual.message, stack: actual.stack })
    expect(json.msg).to.equal(actual.message)
  })

  it('should work with an Error subclass object', () => {
    const NAME = 'SubError'
    const CODE = 'E_SUBERROR'

    class SubError extends Error {
      constructor (msg) {
        super(msg)
        this.name = NAME
        this.code = CODE
      }
    }

    const msg = 'a foo message'
    const expected = new SubError(msg)
    expect(expected.name).to.equal(NAME)
    expect(expected.code).to.equal(CODE)

    const actual = log.error(expected)
    expect(actual).to.equal(expected)

    const json = JSON.parse(stdout)

    expect(json.err).to.deep.equal({
      message: actual.message,
      name: actual.name,
      stack: actual.stack,
      code: actual.code
    })
    expect(json.msg).to.equal(actual.message)
  })

  it('should work with a nonconflicting object', () => {
    const expected = { foo: 'bar', nested: { sna: 'fu' } }
    const msg = 'a foo message'

    const actual = log.info(expected, msg)

    expect(actual).to.deep.equal(expected)

    const json = JSON.parse(stdout)

    expect(json.foo).to.equal(expected.foo)
    expect(json.nested.sna).to.equal(expected.nested.sna)
    expect(json.msg).to.equal(msg)
  })

  it('should work with a conflicting object', () => {
    const expected = { v: 'v' }
    const msg = 'a v message'

    const actual = log.info(expected, msg)
    expect(actual).to.equal(expected)

    const json = JSON.parse(stdout)

    expect(json.object).to.deep.equal(JSON.parse(JSON.stringify(expected)))
    expect(json.msg).to.equal(msg)
  })

  it('should work with a string', () => {
    const expected = 'a plain old string'

    const actual = log.info(expected)
    expect(actual).to.equal(expected)

    const json = JSON.parse(stdout)

    expect(json.msg).to.equal(expected)
  })

  it('should work with multiple strings', () => {
    const strings = ['a plain old string', 'with another string', 'and a third string']
    const expected = strings.join(' ')

    const actual = log.info(...strings)
    expect(actual).to.equal(strings[0])

    const json = JSON.parse(stdout)

    expect(json.msg).to.equal(expected)
  })
})
