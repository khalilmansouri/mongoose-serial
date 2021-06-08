import { expect } from "chai";
const { addZeros, extractCounter, InitCounter } = require('../')

let options = { field: 'serial', prefix: "Invoice", format: "PREFIX", separator: "-", digits: 5, initCounter: "daily", updateExistingRecord: false}

describe('Helper-functions', function () {
  it('should add lead zeros to integer number', () => {
    let count = 3
    let size = 5
    let ret = addZeros(count, size)
    expect(ret).to.equal('00003')

    count = 300
    size = 6
    ret = addZeros(count, size)
    expect(ret).to.equal('000300')

  })

  it('should extract and increment counter number daily', () => {
    let serial = ["INVOICE", "2021", "03", "07", "00301"].join(options.separator)
    let ret = extractCounter({ ...options, initCounter: InitCounter.DAILY }, serial)
    expect(ret).to.equal('00001')
  })

  it('should extract and increment counter number monthly', () => {
    let serial = ["INVOICE", "2021", "05", "00301"].join(options.separator)
    let ret = extractCounter({ ...options, initCounter: "monthly" }, serial)
    expect(ret).to.equal('00302')
  })

  it('should extract and increment counter number yearly', () => {
    let serial = ["INVOICE", "2021", "00301"].join(options.separator)
    let ret = extractCounter({ ...options, initCounter: "yearly" }, serial)
    expect(ret).to.equal('00302')
  })

  it('should extract and increment counter number with 1o digits', () => {
    let serial = ["INVOICE", "2021", "00301"].join(options.separator)
    let ret = extractCounter({ ...options, initCounter: undefined, digits: undefined }, serial)
    expect(ret).to.equal('0000000302')
  })
})

