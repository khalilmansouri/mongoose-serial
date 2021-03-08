# Mongoose-Serial

Mongoose Serial number generator plugin based on multiple format

## Exmaple

Basic : 
```ts
const mongooseSerial = require("mongoose-serial")

let invoiceSchema = new mongoose.Schema({
  serialNumber: String,
  ht: Number,
  ttc: Number,
});

// 
invoiceSchema.plugin(mongooseSerial, { field:"serialNumber"});


let invoice1 = new Invoice({ ht: 10000, ttc: 10010 });
let invoice2 = new Invoice({ ht: 12000, ttc: 12010 });

await invoice1.save() // { serial: "0000000001:", ht: 10000, ttc: 10010}

await invoice2.save() // { serial: "0000000002:", ht: 10000, ttc: 10010}

```


Advanced :
```ts
const mongooseSerial = require("mongoose-serial")

let invoiceSchema = new mongoose.Schema({
  serialNumber: String,
  ht: Number,
  ttc: Number,
});

// Generate serial number with the prefix "INVOICE" and initialte the the counter that contains 5 digits every new month, all separated by the separator "-"
invoiceSchema.plugin(mongooseSerial, { field:"serialNumber", prefix:"INVOICE", initCount:"monthly" , separator: "-", digits:5});


let invoice1 = new Invoice({ ht: 10000, ttc: 10010 });
let invoice2 = new Invoice({ ht: 12000, ttc: 12010 });

await invoice1.save() // { serial: "INVOICE-2021-03-00001:", ht: 10000, ttc: 10010}

await invoice2.save() // { serial: "INVOICE-2021-03-00002:", ht: 10000, ttc: 10010}

```

