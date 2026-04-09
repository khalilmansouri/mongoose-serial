import { expect } from 'chai';
import { addZeros, extractCounter, InitCounter, SerialOptions } from '../index';

describe('Unit Tests - Core Functions', () => {
  describe('addZeros', () => {
    it('should add leading zeros to a number', () => {
      expect(addZeros(1, 5)).to.equal('00001');
      expect(addZeros(123, 6)).to.equal('000123');
      expect(addZeros(999, 3)).to.equal('999');
    });

    it('should handle edge cases', () => {
      expect(addZeros(0, 3)).to.equal('000');
      expect(addZeros(123, 0)).to.equal('123');
      expect(addZeros(123, -1)).to.equal('123');
    });
  });

  describe('extractCounter', () => {
    const baseOptions: Required<SerialOptions> = {
      field: 'serial',
      prefix: 'TEST',
      format: '',
      separator: '-',
      initCounter: InitCounter.NEVER,
      digits: 5,
      ignoreIncrementOnEdit: true,
      getCurrentDate: () => new Date('2024-03-15T10:00:00Z'),
      startFrom: 1
    };

    it('should return 1 for null serial', () => {
      const result = extractCounter(baseOptions, null);
      expect(result).to.equal('00001');
    });

    it('should return startFrom for null serial', () => {
      const options = { ...baseOptions, startFrom: 100 };
      const result = extractCounter(options, null);
      expect(result).to.equal('00100');
    });

    it('should increment counter for existing serial', () => {
      const result = extractCounter(baseOptions, 'TEST-00001');
      expect(result).to.equal('00002');
    });

    it('should handle yearly reset', () => {
      const options = { ...baseOptions, initCounter: InitCounter.YEARLY };
      const result = extractCounter(options, 'TEST-2023-00001');
      expect(result).to.equal('00001'); // Should reset for new year
    });

    it('should handle monthly reset', () => {
      const options = { ...baseOptions, initCounter: InitCounter.MONTHLY };
      const result = extractCounter(options, 'TEST-2024-02-00001');
      expect(result).to.equal('00001'); // Should reset for new month
    });

    it('should handle daily reset', () => {
      const options = { ...baseOptions, initCounter: InitCounter.DAILY };
      const result = extractCounter(options, 'TEST-2024-03-14-00001');
      expect(result).to.equal('00001'); // Should reset for new day
    });

    it('should handle hourly reset', () => {
      const options = { ...baseOptions, initCounter: InitCounter.HOURLY };
      const result = extractCounter(options, 'TEST-2024-03-15-09-00001');
      expect(result).to.equal('00001'); // Should reset for new hour
    });

    it('should reset to startFrom on period rollover', () => {
      const options = { ...baseOptions, initCounter: InitCounter.YEARLY, startFrom: 50 };
      const result = extractCounter(options, 'TEST-2023-00050');
      expect(result).to.equal('00050'); // resets to startFrom, not 1
    });

    it('should handle invalid counter gracefully using startFrom', () => {
      const options = { ...baseOptions, startFrom: 10 };
      const result = extractCounter(options, 'TEST-INVALID');
      expect(result).to.equal('00010');
    });

    it('should not reset for same time period', () => {
      const options = { ...baseOptions, initCounter: InitCounter.MONTHLY };
      const result = extractCounter(options, 'TEST-2024-03-00001');
      expect(result).to.equal('00002'); // Should increment, not reset
    });

  });

  describe('InitCounter enum', () => {
    it('should have correct values', () => {
      expect(InitCounter.NEVER).to.equal('never');
      expect(InitCounter.YEARLY).to.equal('yearly');
      expect(InitCounter.MONTHLY).to.equal('monthly');
      expect(InitCounter.DAILY).to.equal('daily');
      expect(InitCounter.HOURLY).to.equal('hourly');
    });
  });
});
