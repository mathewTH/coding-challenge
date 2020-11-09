#!/usr/bin/env node

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json'));
const numberFormat = new Intl.NumberFormat('en-NZ', {
  maximumFractionDigits: 0,
});

console.log('Revenue: $%s', numberFormat.format(calcRevenue(data.data)));
console.log('Expenses: $%s', numberFormat.format(calcExpenses(data.data)));

/**
 * filter out revenue entries and add total_value to calculate revenue
 * @param  {Array} dataEntries array of data entries
 * @return {Number}            calculated revenue
 */
function calcRevenue(dataEntries) {
  return dataEntries
    .filter(entry => entry.account_category === 'revenue')
    .reduce((accumulator, entry) => entry.total_value + accumulator, 0);
}

/**
 * filter out expense entries and add total_value to calculate expenses
 * @param  {Array} dataEntries array of data entries
 * @return {Number}            calculated expenses
 */
function calcExpenses(dataEntries) {
  return dataEntries
    .filter(entry => entry.account_category === 'expense')
    .reduce((accumulator, entry) => entry.total_value + accumulator, 0);
}
