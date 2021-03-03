const async = require('async')
const mongoose = require('mongoose')
const { plugin } = require('../')
let connection: any;
const should = require('chai').should()

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

afterEach(function (done) {
  connection.model('Invoice').collection.drop(function () {
    delete connection.models.Invoice;
    done()
  });
});

describe('mongoose-serial', function () {

  it('should save the Invoices', function (done) {

    // create invoice model
    var invoiceSchema = new mongoose.Schema({
      serial: String,
      ht: Number,
      ttc: Number,
    });
    invoiceSchema.plugin(plugin, { field: 'serial', prefix: "Invoice", format: "PREFIX" });
    var Invoice = connection.model('Invoice', invoiceSchema),
      invoice1 = new Invoice({ ht: 10000, ttc: 10010 }),
      invoice2 = new Invoice({ ht: 12000, ttc: 12010 });


    // insert some invoices
    async.series({
      invoice1: function (cb: any) {
        invoice1.save(cb);
      },
      invoice2: function (cb: any) {
        invoice2.save(cb);
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