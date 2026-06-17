const {
  validateExpense,
  calculateTotal,
  categorizeBySpending,
  applyDiscount,
  formatCurrency,
  splitExpenseEqually,
} = require('../src/utils');

const {
  validExpense,
  invalidExpenseMissingFields,
  invalidExpenseNonNumericAmount,
  edgeExpenseZeroAmount,
  sampleExpenseList,
} = require('./fixtures');

describe('validateExpense', () => {
  test('normal case: accepts a well-formed expense', () => {
    const result = validateExpense(validExpense);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('edge case: rejects a zero amount', () => {
    const result = validateExpense(edgeExpenseZeroAmount);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Amount must be greater than zero.');
  });

  test('invalid case: rejects missing category and description', () => {
    const result = validateExpense(invalidExpenseMissingFields);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2);
  });

  test('invalid case: rejects a non-numeric amount', () => {
    const result = validateExpense(invalidExpenseNonNumericAmount);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Amount must be a valid number.');
  });
});

describe('calculateTotal', () => {
  test('normal case: sums multiple expenses', () => {
    expect(calculateTotal(sampleExpenseList)).toBe(205);
  });

  test('edge case: empty array returns 0', () => {
    expect(calculateTotal([])).toBe(0);
  });

  test('edge case: single-item array returns that amount', () => {
    expect(calculateTotal([{ amount: 42 }])).toBe(42);
  });
});

describe('categorizeBySpending', () => {
  test('normal case: groups and sums by category', () => {
    const result = categorizeBySpending(sampleExpenseList);
    expect(result).toEqual({
      Groceries: 75,
      Travel: 100,
      Entertainment: 30,
    });
  });

  test('edge case: empty array returns empty object', () => {
    expect(categorizeBySpending([])).toEqual({});
  });
});

describe('applyDiscount', () => {
  test('normal case: applies a 10% discount', () => {
    expect(applyDiscount(100, 10)).toBe(90);
  });

  test('edge case: 0% discount returns original amount', () => {
    expect(applyDiscount(100, 0)).toBe(100);
  });

  test('edge case: 100% discount returns 0', () => {
    expect(applyDiscount(100, 100)).toBe(0);
  });

  test('invalid case: throws on out-of-range percentage', () => {
    expect(() => applyDiscount(100, 150)).toThrow('Percentage must be between 0 and 100.');
  });

  test('invalid case: throws on non-numeric input', () => {
    expect(() => applyDiscount('100', 10)).toThrow('Amount and percentage must be numbers.');
  });
});

describe('formatCurrency', () => {
  test('normal case: formats a typical amount', () => {
    expect(formatCurrency(49.9)).toBe('$49.90');
  });

  test('edge case: formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  test('invalid case: throws on non-numeric input', () => {
    expect(() => formatCurrency('abc')).toThrow('Amount must be a valid number.');
  });
});

describe('splitExpenseEqually', () => {
  test('normal case: splits evenly between people', () => {
    expect(splitExpenseEqually(100, 4)).toBe(25);
  });

  test('edge case: splitting between 1 person returns full amount', () => {
    expect(splitExpenseEqually(60, 1)).toBe(60);
  });

  test('invalid case: throws on zero people', () => {
    expect(() => splitExpenseEqually(100, 0)).toThrow('Number of people must be a positive integer.');
  });

  test('invalid case: throws on negative people', () => {
    expect(() => splitExpenseEqually(100, -2)).toThrow('Number of people must be a positive integer.');
  });
});
