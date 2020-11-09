#!/usr/bin/env node

const calc = require('./calc');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json'));

const currencyFormat = new Intl.NumberFormat('en-NZ', {
  maximumFractionDigits: 0,
});
const revenue = calc.revenue(data.data);
console.log('Revenue: $%s', currencyFormat.format(revenue));
console.log('Expenses: $%s', currencyFormat.format(calc.expenses(data.data)));

const percentFormat = new Intl.NumberFormat('en-NZ', {
  maximumFractionDigits: 1,
});
console.log(
  'Gross Profit Margin: %s%%',
  percentFormat.format(100 * calc.grossProfitMargin(data.data, revenue))
);
