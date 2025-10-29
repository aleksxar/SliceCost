import { describe, it, expect } from 'vitest';
import { calculateCosts, validateMinutes, validatePositiveNumber, formatCurrency } from './calculations';
import type { ParameterConfig } from './calculations';

const defaultConfig: ParameterConfig = {
  enabled: {
    pricePerKg: true,
    pricePerHour: true,
    flatWorkFee: true,
    electricityConsumption: true,
    electricityPrice: true,
    markup: true,
  },
  value: {
    pricePerKg: 100,
    pricePerHour: 2,
    flatWorkFee: 3,
    electricityConsumption: 150,
    electricityPrice: 1.5,
    markup: 20,
  },
};

describe('calculateCosts', () => {
  it('calculates costs correctly with all parameters enabled', () => {
    const result = calculateCosts(500, 2, 30, defaultConfig);
    
    // Material: (500/1000) * 100 = 50
    expect(result.materialCost).toBe(50);
    
    // Print time: 2.5 * 2 = 5
    expect(result.printTimeCost).toBe(5);
    
    // Electricity: (150/1000) * 2.5 * 1.5 = 0.5625
    expect(result.electricityCost).toBe(0.5625);
    
    // Flat fee: 3
    expect(result.flatWorkFee).toBe(3);
    
    // Subtotal: 50 + 5 + 0.5625 + 3 = 58.5625
    expect(result.subtotal).toBe(58.5625);
    
    // Markup: 58.5625 * 0.2 = 11.7125
    expect(result.markupAmount).toBe(11.7125);
    
    // Total: 58.5625 + 11.7125 = 70.275
    expect(result.total).toBe(70.275);
  });

  it('excludes disabled parameters from calculation', () => {
    const config: ParameterConfig = {
      ...defaultConfig,
      enabled: {
        ...defaultConfig.enabled,
        flatWorkFee: false,
        markup: false,
      },
    };

    const result = calculateCosts(500, 2, 30, config);
    
    expect(result.flatWorkFee).toBe(0);
    expect(result.markupAmount).toBe(0);
    expect(result.subtotal).toBe(55.5625); // 50 + 5 + 0.5625
    expect(result.total).toBe(55.5625);
  });

  it('handles zero values correctly', () => {
    const result = calculateCosts(0, 0, 0, defaultConfig);
    
    expect(result.materialCost).toBe(0);
    expect(result.printTimeCost).toBe(0);
    expect(result.electricityCost).toBe(0);
    expect(result.flatWorkFee).toBe(3); // Flat fee still applies
    expect(result.subtotal).toBe(3);
    expect(result.markupAmount).toBe(0.6); // 20% of 3
    expect(result.total).toBe(3.6);
  });

  it('converts minutes to hours correctly', () => {
    const result = calculateCosts(0, 1, 30, defaultConfig);
    
    // 1.5 hours * 2 $/hour = 3
    expect(result.printTimeCost).toBe(3);
    
    // (150/1000) * 1.5 * 1.5 = 0.3375
    expect(result.electricityCost).toBe(0.3375);
  });
});

describe('validateMinutes', () => {
  it('accepts valid minute values', () => {
    expect(validateMinutes('0')).toBe(true);
    expect(validateMinutes('30')).toBe(true);
    expect(validateMinutes('59')).toBe(true);
    expect(validateMinutes('')).toBe(true);
  });

  it('rejects invalid minute values', () => {
    expect(validateMinutes('60')).toBe(false);
    expect(validateMinutes('-1')).toBe(false);
    expect(validateMinutes('abc')).toBe(false);
  });
});

describe('validatePositiveNumber', () => {
  it('accepts valid positive numbers', () => {
    expect(validatePositiveNumber('0')).toBe(true);
    expect(validatePositiveNumber('1.5')).toBe(true);
    expect(validatePositiveNumber('100')).toBe(true);
    expect(validatePositiveNumber('')).toBe(true);
  });

  it('rejects negative numbers', () => {
    expect(validatePositiveNumber('-1')).toBe(false);
    expect(validatePositiveNumber('-0.5')).toBe(false);
  });

  it('rejects non-numeric values', () => {
    expect(validatePositiveNumber('abc')).toBe(false);
    expect(validatePositiveNumber('1.2.3')).toBe(false);
  });
});

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(12.34)).toBe('$12.34');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(1000.5)).toBe('$1,000.50');
  });
});
