import { expect } from "chai";
const { addZeros, extractCounter, InitCounter } = require('../')

let options = { field: 'serial', prefix: "Invoice", format: "PREFIX", separator: "-", digits: 5, initCounter: "daily", ignoreIncrementOnEdit: false}

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
      const date = new Date().getDate();
    let serial = ["INVOICE", "2021", "03", date, "00301"].join(options.separator)
    let ret = extractCounter({ ...options, initCounter: InitCounter.DAILY }, serial)
    expect(ret).to.equal('00001')
  })

  it('should extract and increment counter number monthly', () => {
    const month = addZeros(new Date().getMonth() + 1, 2)
    let serial = ["INVOICE", "2021", month, "00301"].join(options.separator)
    let ret = extractCounter({ ...options, initCounter: "monthly" }, serial)
    expect(ret).to.equal('00302')
  })

  it('should extract and increment counter number yearly', () => {
    const year = new Date().getFullYear().toString()
    let serial = ["INVOICE", year, "00301"].join(options.separator)
    let ret = extractCounter({ ...options, initCounter: "yearly" }, serial)
    expect(ret).to.equal('00302')
  })

  it('should extract and increment counter number with 10 digits', () => {
    let serial = ["INVOICE", "2021", "00301"].join(options.separator)
    let ret = extractCounter({ ...options, initCounter: undefined, digits: undefined }, serial)
    expect(ret).to.equal('0000000302')
  })
})

