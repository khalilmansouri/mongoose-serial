import { expect } from "chai";

const async = require('async')
const mongoose = require('mongoose')
const { plugin, addZeros, extractCounter } = require('../')
let connection: any;
const should = require('chai').should()


let options = { field: 'serial', prefix: "Invoice", format: "PREFIX", separator: "-", digits: 5 }

before(function (done) {
  connection = mongoose.createConnection('mongodb://127.0.0.1/mongoose-serial', { useNewUrlParser: true, useUnifiedTopology: true });
  connection.on('error', console.error.bind(console));
  connection.once('open', function () {
    done();
  });
});

after(function (done) {
  connection.db.dropDatabase(function (err: any) {
    if (err) return done(err);
    connection.close(done);
  });
});

// afterEach(function (done) {
//   connection.model('Invoice').collection.drop(function () {
//     delete connection.models.Invoice;
//     done()
//   });
// });


describe('helper-functions', function () {
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

  it('should extract and increment counter number', () => {
    let serial = "INVOICE-000301"
    let ret = extractCounter(options, serial)
    expect(ret).to.equal('00302')
  })
})

describe('mongoose-serial', function () {

  it('should save the Invoices', function (done) {

    // create invoice model
    var invoiceSchema = new mongoose.Schema({
      serial: String,
      ht: Number,
      ttc: Number,
    });
    invoiceSchema.plugin(plugin, options);
    let Invoice = connection.model('Invoice', invoiceSchema);
    let invoice1 = new Invoice({ ht: 10000, ttc: 10010 });
    let invoice2 = new Invoice({ ht: 12000, ttc: 12010 });
    let invoice3 = new Invoice({ ht: 13000, ttc: 12010 });
    let invoice4 = new Invoice({ ht: 14000, ttc: 12010 });


    // insert some invoices
    async.series({
      invoice1: function (cb: any) {
        invoice1.save(cb);
      },
      invoice2: function (cb: any) {
        invoice2.save(cb);
      },
      invoice3: function (cb: any) {
        invoice3.save(cb);
      },
      invoice4: function (cb: any) {
        invoice4.save(cb);
      }
    }, assert);

    // assert
    function assert(err: any, results: any) {
      should.not.exist(err);
      results.invoice1.should.have.property('ht', 10000);
      results.invoice2.should.have.property('ht', 12000);
      done();
    }

  });

})