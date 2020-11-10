#!/usr/bin/env node

const calc = require('./calc');
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json'));

const currencyFormat = new Intl.NumberFormat('en-NZ', {
  maximumFractionDigits: 0,
});
const revenue = calc.revenue(data.data);
const expenses = calc.expenses(data.data);
console.log('Revenue: $%s', currencyFormat.format(revenue));
console.log('Expenses: $%s', currencyFormat.format(expenses));

const percentFormat = new Intl.NumberFormat('en-NZ', {
  maximumFractionDigits: 1,
});
console.log(
  'Gross Profit Margin: %s%%',
  percentFormat.format(100 * calc.grossProfitMargin(data.data, revenue))
);
console.log(
  'Net Profit Margin: %s%%',
  percentFormat.format(100 * calc.netProfitMargin(revenue, expenses))
);
console.log(
  'Working Capital Ratio: %s%%',
  percentFormat.format(100 * calc.workingCapitalRatio(data.data))
);
