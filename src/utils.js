/**
 * Validates an expense object before it's stored.
 *
 * Refactored from an earlier version that only returned a single generic
 * error message. This version checks each field independently, reports
 * specific errors, and correctly handles edge cases like non-numeric
 * amounts and whitespace-only strings.
 */
function validateExpense(expense) {
  const errors = [];

  const amount = Number(expense.amount);
  if (expense.amount === undefined || expense.amount === null || Number.isNaN(amount)) {
    errors.push('Amount must be a valid number.');
  } else if (amount <= 0) {
    errors.push('Amount must be greater than zero.');
  }

  if (typeof expense.category !== 'string' || expense.category.trim() === '') {
    errors.push('Category is required and must be a non-empty string.');
  }

  if (typeof expense.description !== 'string' || expense.description.trim() === '') {
    errors.push('Description is required and must be a non-empty string.');
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Sums the amount field across a list of expenses.
 */
function calculateTotal(expenses) {
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].amount;
  }
  return total;
}

/**
 * Groups expenses by category and sums spend per category.
 */
function categorizeBySpending(expenses) {
  const result = {};
  for (const exp of expenses) {
    if (!result[exp.category]) {
      result[exp.category] = 0;
    }
    result[exp.category] += exp.amount;
  }
  return result;
}

/**
 * Applies a percentage discount to an amount.
 */
function applyDiscount(amount, percentage) {
  if (typeof amount !== 'number' || typeof percentage !== 'number') {
    throw new Error('Amount and percentage must be numbers.');
  }
  if (percentage < 0 || percentage > 100) {
    throw new Error('Percentage must be between 0 and 100.');
  }
  return amount - (amount * percentage) / 100;
}

/**
 * Formats a number as a USD currency string.
 */
function formatCurrency(amount) {
  if (typeof amount !== 'number' || Number.isNaN(amount)) {
    throw new Error('Amount must be a valid number.');
  }
  return '$' + amount.toFixed(2);
}

/**
 * Splits an expense equally between a number of people.
 */
function splitExpenseEqually(amount, numPeople) {
  if (!Number.isInteger(numPeople) || numPeople <= 0) {
    throw new Error('Number of people must be a positive integer.');
  }
  return amount / numPeople;
}

module.exports = {
  validateExpense,
  calculateTotal,
  categorizeBySpending,
  applyDiscount,
  formatCurrency,
  splitExpenseEqually,
};
