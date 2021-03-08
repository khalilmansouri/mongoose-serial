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

