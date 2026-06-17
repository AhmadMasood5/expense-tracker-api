const express = require('express');
const {
  validateExpense,
  calculateTotal,
  categorizeBySpending,
  formatCurrency,
  splitExpenseEqually,
} = require('./utils');

const app = express();
app.use(express.json());

let expenses = [];
let nextId = 1;

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Expense Tracker API</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 60px auto; padding: 0 20px; color: #1a1a1a; }
    h1 { font-size: 1.4rem; }
    code { background: #f2f2f2; padding: 2px 6px; border-radius: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e5e5; font-size: 0.9rem; }
    th { color: #666; }
  </style>
</head>
<body>
  <h1>Expense Tracker API</h1>
  <p>This is a REST API — there's no frontend UI. Use the endpoints below.</p>
  <table>
    <tr><th>Method</th><th>Path</th><th>Description</th></tr>
    <tr><td>GET</td><td><code>/api/health</code></td><td>Health check</td></tr>
    <tr><td>GET</td><td><code>/api/expenses</code></td><td>List all expenses</td></tr>
    <tr><td>POST</td><td><code>/api/expenses</code></td><td>Create an expense</td></tr>
    <tr><td>GET</td><td><code>/api/expenses/:id</code></td><td>Get a single expense</td></tr>
    <tr><td>DELETE</td><td><code>/api/expenses/:id</code></td><td>Delete an expense</td></tr>
    <tr><td>GET</td><td><code>/api/expenses/summary</code></td><td>Total + breakdown by category</td></tr>
    <tr><td>POST</td><td><code>/api/expenses/:id/split</code></td><td>Split an expense between N people</td></tr>
  </table>
</body>
</html>`);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/api/expenses', (req, res) => {
  const { valid, errors } = validateExpense(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }
  const expense = {
    id: nextId++,
    category: req.body.category,
    description: req.body.description,
    amount: Number(req.body.amount),
  };
  expenses.push(expense);
  res.status(201).json(expense);
});

app.get('/api/expenses/:id', (req, res) => {
  const expense = expenses.find((e) => e.id === Number(req.params.id));
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.json(expense);
});

app.delete('/api/expenses/:id', (req, res) => {
  const index = expenses.findIndex((e) => e.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  expenses.splice(index, 1);
  res.status(204).send();
});

app.get('/api/expenses/summary', (req, res) => {
  res.json({
    total: calculateTotal(expenses),
    byCategory: categorizeBySpending(expenses),
  });
});

app.post('/api/expenses/:id/split', (req, res) => {
  const expense = expenses.find((e) => e.id === Number(req.params.id));
  if (!expense) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  try {
    const share = splitExpenseEqually(expense.amount, req.body.numPeople);
    res.json({
      amountPerPerson: formatCurrency(share),
      numPeople: req.body.numPeople,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
