# Mongoose-Serial

Mongoose Serial number generator plugin based on multiple format

## Exmaple

```ts
const mongooseSerial = require("mongoose-serial")

let invoiceSchema = new mongoose.Schema({
  serial: String,
  ht: Number,
  ttc: Number,
});

invoiceSchema.plugin(mongooseSerial, { field:"serial", prefix:"INVOICE", initCount:"monthly" , separator: "-", digits:5});


let invoice1 = new Invoice({ ht: 10000, ttc: 10010 });
let invoice2 = new Invoice({ ht: 12000, ttc: 12010 });

await invoice1.save() // { serial: "INVOICE-2021-03-00001:", ht: 10000, ttc: 10010}

await invoice2.save() // { serial: "INVOICE-2021-03-00002:", ht: 10000, ttc: 10010}

```

