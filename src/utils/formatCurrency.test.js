import { describe, it, expect } from 'vitest';
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  it('formats a positive number as BRL', () => {
    expect(formatCurrency(1234.5)).toBe('R$ 1.234,50');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00');
  });

  it('falls back to zero for non-numeric input', () => {
    expect(formatCurrency(undefined)).toBe('R$ 0,00');
    expect(formatCurrency(NaN)).toBe('R$ 0,00');
  });
});
