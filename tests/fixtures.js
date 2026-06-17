// Test data generated to exercise normal, edge, and invalid cases
// across the expense-tracker utility functions.

const validExpense = {
  amount: 49.99,
  category: 'Groceries',
  description: 'Weekly grocery shopping',
};

const invalidExpenseMissingFields = {
  amount: 20,
  category: '',
  description: '',
};

const invalidExpenseNonNumericAmount = {
  amount: 'fifty',
  category: 'Travel',
  description: 'Taxi fare',
};

const edgeExpenseZeroAmount = {
  amount: 0,
  category: 'Misc',
  description: 'Free sample',
};

const sampleExpenseList = [
  { id: 1, category: 'Groceries', amount: 50 },
  { id: 2, category: 'Groceries', amount: 25 },
  { id: 3, category: 'Travel', amount: 100 },
  { id: 4, category: 'Entertainment', amount: 30 },
];

module.exports = {
  validExpense,
  invalidExpenseMissingFields,
  invalidExpenseNonNumericAmount,
  edgeExpenseZeroAmount,
  sampleExpenseList,
};
