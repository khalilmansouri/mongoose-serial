import { expect } from "chai";
import { plugin, InitCounter, extractCounter } from '../index';

import mongoose from 'mongoose';
let connection: any;

before(async function () {
  connection = mongoose.createConnection('mongodb://127.0.0.1/mongoose-serial-start-from');
  await connection.asPromise();
});

after(async function () {
  await connection.db.dropDatabase();
  await connection.close();
});

describe('Mongoose-serial with startFrom', function () {

  it('should start counter at startFrom value', async function () {
    const schema = new mongoose.Schema({ serial: String, amount: Number });
    schema.plugin(plugin, {
      field: 'serial',
      prefix: 'INV',
      separator: '-',
      digits: 5,
      startFrom: 100,
    });
    const Invoice = connection.model('InvoiceStartFrom', schema);

    const doc1 = await new Invoice({ amount: 1000 }).save();
    const doc2 = await new Invoice({ amount: 2000 }).save();
    const doc3 = await new Invoice({ amount: 3000 }).save();

    expect(doc1.serial).to.match(/-00100$/);
    expect(doc2.serial).to.match(/-00101$/);
    expect(doc3.serial).to.match(/-00102$/);
  });

  it('should reset to startFrom on period rollover', async function () {
    const schema = new mongoose.Schema({ serial: String, amount: Number });
    const pastDate = new Date('2023-01-15T10:00:00Z');
    const futureDate = new Date('2025-06-01T10:00:00Z');

    schema.plugin(plugin, {
      field: 'serial',
      separator: '-',
      digits: 5,
      initCounter: InitCounter.YEARLY,
      startFrom: 50,
      getCurrentDate: () => pastDate,
    });
    const Invoice = connection.model('InvoiceReset', schema);

    // Save one in the "past"
    await new Invoice({ amount: 1000 }).save();

    // Now simulate a year rollover by updating the date function on the options
    // We create a second model with a different date to verify reset behavior via extractCounter directly
    const opts = {
      field: 'serial',
      prefix: '',
      format: '',
      separator: '-',
      digits: 5,
      initCounter: InitCounter.YEARLY,
      startFrom: 50,
      ignoreIncrementOnEdit: true,
      getCurrentDate: () => futureDate,
    };

    // A serial from a different year should reset to startFrom
    const next = extractCounter(opts, '2023-00050');
    expect(next).to.equal('00050');
  });

  it('should default startFrom to 1 when not provided', async function () {
    const schema = new mongoose.Schema({ serial: String, amount: Number });
    schema.plugin(plugin, {
      field: 'serial',
      separator: '-',
      digits: 5,
    });
    const Invoice = connection.model('InvoiceDefault', schema);

    const doc = await new Invoice({ amount: 500 }).save();
    expect(doc.serial).to.equal('00001');
  });
});
