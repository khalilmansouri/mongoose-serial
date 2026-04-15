import { expect } from "chai";
import { plugin, InitCounter } from '../index';

import mongoose from 'mongoose';
let connection: any;

const options = {
  field: 'serial',
  prefix: "Invoice",
  separator: "-",
  digits: 5,
  initCounter: InitCounter.NEVER,
  ignoreIncrementOnEdit: false
};

before(async function () {
  connection = mongoose.createConnection('mongodb://127.0.0.1/mongoose-serial-without-date');
  await connection.asPromise();
});

after(async function () {
  await connection.db.dropDatabase();
  await connection.close();
});

describe('Mongoose-serial : Without dates', function () {

  it('should save the Invoices', async function () {
    const invoiceSchema = new mongoose.Schema({
      serial: String,
      ht: Number,
      ttc: Number,
    });
    invoiceSchema.plugin(plugin, options);
    const Invoice = connection.model('Invoice', invoiceSchema);

    const invoice1 = await new Invoice({ ht: 10000, ttc: 10010 }).save();
    const invoice2 = await new Invoice({ ht: 12000, ttc: 12010 }).save();
    await new Invoice({ ht: 13000, ttc: 12010 }).save();
    await new Invoice({ ht: 14000, ttc: 12010 }).save();

    expect(invoice1).to.have.property('ht', 10000);
    expect(invoice2).to.have.property('ht', 12000);
    expect(invoice1.serial).to.be.a('string');
    expect(invoice2.serial).to.be.a('string');
  });
});
