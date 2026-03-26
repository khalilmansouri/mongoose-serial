# Mongoose-Serial

A powerful Mongoose plugin for generating auto-incrementing serial numbers with flexible formatting options. Perfect for invoices, orders, tickets, and any document that needs unique sequential identifiers.

[![npm version](https://badge.fury.io/js/mongoose-serial.svg)](https://badge.fury.io/js/mongoose-serial)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🚀 **Auto-incrementing serial numbers** with customizable formatting
- 📅 **Time-based counter reset** (yearly, monthly, daily, hourly, or never)
- 🎨 **Flexible formatting** with prefixes, separators, and zero-padding
- 🔧 **TypeScript support** with full type definitions
- 🛡️ **Robust error handling** and validation
- 📦 **Zero dependencies** (except Mongoose)
- ⚡ **High performance** with optimized database queries

## Installation

```bash
npm install mongoose-serial
```

## Quick Start

### Basic Usage

```typescript
import mongoose from 'mongoose';
import mongooseSerial from 'mongoose-serial';

const invoiceSchema = new mongoose.Schema({
  serialNumber: String,
  amount: Number,
  customer: String,
});

// Apply the plugin
invoiceSchema.plugin(mongooseSerial, { field: 'serialNumber' });

const Invoice = mongoose.model('Invoice', invoiceSchema);

// Create invoices
const invoice1 = new Invoice({ amount: 100, customer: 'John Doe' });
const invoice2 = new Invoice({ amount: 200, customer: 'Jane Smith' });

await invoice1.save(); // serialNumber: "0000000001"
await invoice2.save(); // serialNumber: "0000000002"
```

### Advanced Usage with Time-based Reset

```typescript
import mongoose from 'mongoose';
import mongooseSerial, { InitCounter } from 'mongoose-serial';

const invoiceSchema = new mongoose.Schema({
  serialNumber: String,
  amount: Number,
  customer: String,
});

// Monthly reset with prefix and custom formatting
invoiceSchema.plugin(mongooseSerial, {
  field: 'serialNumber',
  prefix: 'INV',
  separator: '-',
  digits: 5,
  initCounter: InitCounter.MONTHLY,
  ignoreIncrementOnEdit: true
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

// In March 2024
const invoice1 = new Invoice({ amount: 100, customer: 'John' });
await invoice1.save(); // serialNumber: "INV-2024-03-00001"

// In April 2024 (counter resets)
const invoice2 = new Invoice({ amount: 200, customer: 'Jane' });
await invoice2.save(); // serialNumber: "INV-2024-04-00001"
```

## API Reference

### Plugin Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `field` | `string` | `"serialNumber"` | The field name to store the serial number |
| `prefix` | `string` | `""` | Prefix for the serial number |
| `separator` | `string` | `"-"` | Separator between parts |
| `digits` | `number` | `10` | Number of digits for the counter (1-20) |
| `initCounter` | `InitCounter` | `InitCounter.NEVER` | When to reset the counter |
| `ignoreIncrementOnEdit` | `boolean` | `true` | Skip increment on document updates |
| `getCurrentDate` | `() => Date` | `() => new Date()` | Custom date function (useful for testing) |

### InitCounter Enum

```typescript
enum InitCounter {
  NEVER = "never",     // Never reset (default)
  YEARLY = "yearly",   // Reset every year
  MONTHLY = "monthly", // Reset every month
  DAILY = "daily",     // Reset every day
  HOURLY = "hourly"    // Reset every hour
}
```

## Examples

### Different Time Periods

```typescript
// Yearly reset
invoiceSchema.plugin(mongooseSerial, {
  field: 'serialNumber',
  prefix: 'INV',
  initCounter: InitCounter.YEARLY
});
// Result: "INV-2024-00001", "INV-2024-00002", "INV-2025-00001"

// Daily reset
orderSchema.plugin(mongooseSerial, {
  field: 'orderNumber',
  prefix: 'ORD',
  initCounter: InitCounter.DAILY
});
// Result: "ORD-2024-03-15-00001", "ORD-2024-03-16-00001"
```

### Custom Formatting

```typescript
// Custom separator and digits
ticketSchema.plugin(mongooseSerial, {
  field: 'ticketNumber',
  prefix: 'TKT',
  separator: '/',
  digits: 6,
  initCounter: InitCounter.MONTHLY
});
// Result: "TKT/2024/03/000001"
```

### Without Prefix or Date

```typescript
// Simple counter without prefix or date
simpleSchema.plugin(mongooseSerial, {
  field: 'id',
  digits: 8
});
// Result: "00000001", "00000002"
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import mongooseSerial, { SerialOptions, InitCounter } from 'mongoose-serial';

const options: SerialOptions = {
  field: 'serialNumber',
  prefix: 'INV',
  initCounter: InitCounter.MONTHLY,
  digits: 5
};

invoiceSchema.plugin(mongooseSerial, options);
```

## Error Handling

The plugin includes robust error handling:

```typescript
try {
  invoiceSchema.plugin(mongooseSerial, { field: 'serialNumber' });
} catch (error) {
  console.error('Plugin configuration error:', error.message);
}
```

Common validation errors:
- Field must exist in schema
- Field must be of type String
- Digits must be between 1 and 20
- Separator must be a single character

## Performance Considerations

- Uses efficient database queries with sorting
- Minimal memory footprint
- Optimized for high-concurrency scenarios
- Safe for concurrent document creation

## Migration from v1.0.x

The new version is mostly backward compatible, but some options have been renamed:

```typescript
// Old (v1.0.x)
schema.plugin(mongooseSerial, {
  initCount: "monthly"  // ❌ Deprecated
});

// New (v1.1.x)
schema.plugin(mongooseSerial, {
  initCounter: InitCounter.MONTHLY  // ✅ New
});
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