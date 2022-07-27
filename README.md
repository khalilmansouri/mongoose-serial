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
const mongoose = require("mongoose")
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

invoiceSchema.plugin(mongooseSerial, { field:"serialNumber"});
let Invoice = connection.model('Invoice', invoiceSchema);


let invoice1 = new Invoice({ ht: 10000, ttc: 10010 });
let invoice2 = new Invoice({ ht: 12000, ttc: 12010 });

await invoice1.save() // { serialNumber: "0000000001:", ht: 10000, ttc: 10010}

await invoice2.save() // { serialNumber: "0000000002:", ht: 10000, ttc: 10010}

```


Advanced :
```ts
const mongoose = require("mongoose")
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

let billSchema = new mongoose.Schema({
  billNumber: String,
  amount : Number
});

// Generate serial number with the prefix "INVOICE" and initialte the the counter that contains 5 digits every new month, all separated by the separator "-"
/**
 * Options:
 *    field :  The field name to be set as serial number, the field must be type string in mongoose schema
 *    prefix : String the prefix the serial number 
 *    initCount : Init the counter to one monthly or daily or yearly separator to separate deferente part of the serial number
 *    digits : Number of digits the counter shoud have 
 */
invoiceSchema.plugin(mongooseSerial, { field:"serialNumber", prefix:"INVOICE", initCount:"monthly" , separator: "-", digits:5});
let Invoice = connection.model('Invoice', invoiceSchema);

invoiceSchema.plugin(mongooseSerial, { field:"serialNumber", prefix:"BILL", initCount:"yearly" , separator: "/", digits:7});
let Bill = connection.model('Bill', invoiceSchema);


let invoice1 = new Invoice({ ht: 10000, ttc: 10010 });
let invoice2 = new Invoice({ ht: 12000, ttc: 12010 });

let bill1 = new Bill({ amount: 100 });
let bill2 = new Bill({ amount: 120 });

await invoice1.save() // { serialNumber: "INVOICE-2021-03-00001:", ht: 10000, ttc: 10010}

await invoice2.save() // { serialNumber: "INVOICE-2021-03-00002:", ht: 10000, ttc: 10010}

await bill1.save() // { billNumber: "BILL/2021/0000001:", amount: 100}

await bill2.save() // { billNumber: "BILL/2021/0000002:", amount: 120}

```

### Contributing
- Fork this Repo first
- Clone your Repo
- Install dependencies by `$ npm install`
- Checkout a feature branch
- Feel free to add your features
- Make sure your features are fully tested
- Publish your local branch, Open a pull request
- Enjoy hacking <3

### The MIT License (MIT)

Copyright (c) 2021 KHALIL MANSOURI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.