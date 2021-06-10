import { expect, assert } from "chai";

const async = require('async')
const mongoose = require('mongoose')
const { plugin } = require('../')
let connection: any;
const should = require('chai').should()


let options = { field: 'serial', prefix: "Invoice", separator: "-", digits: 5, initCounter: "monthly", ignoreIncrementOnEdit: false }

// create invoice model
var invoiceSchema = new mongoose.Schema({
    serial: String,
    ht: Number,
    ttc: Number,
});

before(function (done) {
  connection = mongoose.createConnection('mongodb://127.0.0.1/mongoose-serial-basic', { useNewUrlParser: true, useUnifiedTopology: true });
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



describe('Mongoose-serial', function () {

  it('should save the Invoices', function (done) {

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

  it('should not increment Invoices on edit operation', function (done) {

    // set updateExisitingRecord to true
    options.ignoreIncrementOnEdit = true;

    invoiceSchema.plugin(plugin, options);
    let Invoice = connection.model('Invoice2', invoiceSchema);
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
    }, assertRecord);

    // assert
    function assertRecord(err: any, results: any) {
      should.not.exist(err);
      results.invoice1.should.have.property('ht', 10000);
      results.invoice2.should.have.property('ht', 12000);
      done();
    }

    // retrieve any existing invoice record
    Invoice.findOne({ht:12000})
    .then(function(data: any) {
        const serial = data.serial;
        data.ht = 15000;
        data.save().then(function() {
            Invoice.findOne({ht: 15000})
            .then(function(verifyData: any) {
                assert(serial === verifyData.serial, 'Edit operation should not increment invoice serial');
            })
            .catch(function(error: any){ throw error});
        })
    })
    .catch(function(error: any){throw error});
  });
})
