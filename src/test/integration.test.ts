import { expect } from 'chai';
import mongoose from 'mongoose';
import { plugin, InitCounter } from '../index';

describe('Integration Tests - Plugin Functionality', () => {
  let schema: mongoose.Schema;

  beforeEach(() => {
    // Create a fresh schema for each test
    schema = new mongoose.Schema({
      serialNumber: String,
      name: String,
      amount: Number
    });
  });

  it('should apply plugin without errors', () => {
    expect(() => {
      schema.plugin(plugin, { field: 'serialNumber' });
    }).to.not.throw();
  });

  it('should validate field exists in schema', () => {
    const invalidSchema = new mongoose.Schema({
      name: String
    });

    expect(() => {
      invalidSchema.plugin(plugin, { field: 'serialNumber' });
    }).to.throw("Field 'serialNumber' does not exist in schema");
  });

  it('should validate field is string type', () => {
    const invalidSchema = new mongoose.Schema({
      serialNumber: Number
    });

    expect(() => {
      invalidSchema.plugin(plugin, { field: 'serialNumber' });
    }).to.throw("Field 'serialNumber' must be of type String");
  });

  it('should validate options', () => {
    expect(() => {
      schema.plugin(plugin, { field: '' });
    }).to.throw('Field name is required');

    expect(() => {
      schema.plugin(plugin, { field: 'serialNumber', digits: 0 });
    }).to.throw('Digits must be between 1 and 20');

    expect(() => {
      schema.plugin(plugin, { field: 'serialNumber', digits: 21 });
    }).to.throw('Digits must be between 1 and 20');

    expect(() => {
      schema.plugin(plugin, { field: 'serialNumber', separator: '--' });
    }).to.throw('Separator must be a single character');

    expect(() => {
      schema.plugin(plugin, { field: 'serialNumber', startFrom: -1 });
    }).to.throw('startFrom must be a non-negative integer');

    expect(() => {
      schema.plugin(plugin, { field: 'serialNumber', startFrom: 1.5 });
    }).to.throw('startFrom must be a non-negative integer');
  });

  it('should work with different InitCounter values', () => {
    expect(() => {
      schema.plugin(plugin, { 
        field: 'serialNumber', 
        initCounter: InitCounter.YEARLY 
      });
    }).to.not.throw();

    expect(() => {
      schema.plugin(plugin, { 
        field: 'serialNumber', 
        initCounter: InitCounter.MONTHLY 
      });
    }).to.not.throw();

    expect(() => {
      schema.plugin(plugin, { 
        field: 'serialNumber', 
        initCounter: InitCounter.DAILY 
      });
    }).to.not.throw();

    expect(() => {
      schema.plugin(plugin, { 
        field: 'serialNumber', 
        initCounter: InitCounter.HOURLY 
      });
    }).to.not.throw();

    expect(() => {
      schema.plugin(plugin, { 
        field: 'serialNumber', 
        initCounter: InitCounter.NEVER 
      });
    }).to.not.throw();
  });

  it('should work with custom options', () => {
    expect(() => {
      schema.plugin(plugin, {
        field: 'serialNumber',
        prefix: 'INV',
        separator: '/',
        digits: 6,
        initCounter: InitCounter.MONTHLY,
        ignoreIncrementOnEdit: false,
        getCurrentDate: () => new Date('2024-03-15')
      });
    }).to.not.throw();
  });
});
