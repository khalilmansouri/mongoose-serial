const async = require('async')
const mongoose = require('mongoose')
const { plugin } = require('../lib')
let connection;
const should = require('chai').should()

before(function (done) {
  connection = mongoose.createConnection('mongodb://127.0.0.1/mongoose-serial', { useNewUrlParser: true, useUnifiedTopology: true });
  connection.on('error', console.error.bind(console));
  connection.once('open', function () {
    done();
  });
});

after(function (done) {
  connection.db.dropDatabase(function (err) {
    if (err) return done(err);
    connection.close(done);
  });
});

afterEach(function (done) {
  connection.model('User').collection.drop(function () {
    delete connection.models.User;
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
    invoiceSchema.plugin(plugin, {field:'serial', prefix:"USER", format:"PREFIX"});
    var User = connection.model('User', invoiceSchema),
    invoice1 = new User({ ht: 10000, ttc: 10010 }),
    invoice2 = new User({ ht: 12000, ttc: 12010 });


    // insert some invoices
    async.series({
      invoice1: function (cb) {
        invoice1.save(cb);
      },
      invoice2: function (cb) {
        invoice2.save(cb);
      }
    }, assert);

    // assert
    function assert(err, results) {
      should.not.exist(err);
      results.invoice1.should.have.property('ht', 10000);
      results.invoice2.should.have.property('ht', 12000);
      done();
    }

  });

})