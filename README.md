# Mongoose-Serial

Mongoose Serial number generator plugin based on multiple format

[![codecov](https://codecov.io/gh/khalilmansouri/mongoose-serial/branch/master/graph/badge.svg?token=970SOP1NKU)](https://codecov.io/gh/khalilmansouri/mongoose-serial)
[![Build Status](https://travis-ci.org/khalilmansouri/mongoose-serial.svg?branch=master)](https://travis-ci.org/khalilmansouri/mongoose-serial)
[![npm version](https://badge.fury.io/js/mongoose-serial.svg)](https://badge.fury.io/js/mongoose-serial)

## Installation

[![NPM](https://nodei.co/npm/mongoose-serial.png)](https://nodei.co/npm/mongoose-serial/)

>npm install mongoose-serial


## Exmaple

Basic : 
```ts
const mongooseSerial = require("mongoose-serial")
// mongodb database uri
const DB_URI = process.env.DB_URI
// mongoose connedtion
let connection = mongoose.createConnection(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


let invoiceSchema = new mongoose.Schema({
  serialNumber: String,
  ht: Number,
  ttc: Number,
});

let Invoice = connection.model('Invoice', invoiceSchema);
invoiceSchema.plugin(mongooseSerial, { field:"serialNumber"});


let invoice1 = new Invoice({ ht: 10000, ttc: 10010 });
let invoice2 = new Invoice({ ht: 12000, ttc: 12010 });

await invoice1.save() // { serialNumber: "0000000001:", ht: 10000, ttc: 10010}

await invoice2.save() // { serialNumber: "0000000002:", ht: 10000, ttc: 10010}

```


Advanced :
```ts
const mongooseSerial = require("mongoose-serial")
// mongoose connedtion
let connection = mongoose.createConnection('mongodb://127.0.0.1/db', { useNewUrlParser: true, useUnifiedTopology: true });

let invoiceSchema = new mongoose.Schema({
  serialNumber: String,
  ht: Number,
  ttc: Number,
});

let billSchema = new mongoose.Schema({
  billNumber: String,
  amount : Number
});

// Generate serial number with the prefix "INVOICE" and initialte the the counter that contains 5 digits every new month, all separated by the separator "-"
/**
 * Options:
 * field : Specialy the field name to be a serialized, the field must be type string in mongoose schema
 * prefix : string the prefix the serial number 
 * initCount : init the counter to one monthly or daily or yearly
 * separator to separate deferente part of the serial number
 * digits : number of digits the counter shoud have 
 */
let Invoice = connection.model('Invoice', invoiceSchema);
invoiceSchema.plugin(mongooseSerial, { field:"serialNumber", prefix:"INVOICE", initCount:"monthly" , separator: "-", digits:5});

let Bill = connection.model('Bill', invoiceSchema);
invoiceSchema.plugin(mongooseSerial, { field:"serialNumber", prefix:"BILL", initCount:"yearly" , separator: "/", digits:7});


let invoice1 = new Invoice({ ht: 10000, ttc: 10010 });
let invoice2 = new Invoice({ ht: 12000, ttc: 12010 });

let bill1 = new Bill({ amount: 100 });
let bill2 = new Bill({ amount: 120 });

await invoice1.save() // { serialNumber: "INVOICE-2021-03-00001:", ht: 10000, ttc: 10010}

await invoice2.save() // { serialNumber: "INVOICE-2021-03-00002:", ht: 10000, ttc: 10010}

await bill1.save() // { billNumber: "BILL/2021/0000001:", amount: 100}

await bill2.save() // { billNumber: "BILL/2021/0000002:", amount: 120}

```

