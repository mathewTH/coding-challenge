#!/usr/bin/env node

const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json'));

const currencyFormat = new Intl.NumberFormat('en-NZ', {
  maximumFractionDigits: 0,
});
const revenue = calcRevenue(data.data);
console.log('Revenue: $%s', currencyFormat.format(revenue));
console.log('Expenses: $%s', currencyFormat.format(calcExpenses(data.data)));

const percentFormat = new Intl.NumberFormat('en-NZ', {
  maximumFractionDigits: 1,
});
console.log(
  'Gross Profit Margin: %s%%',
  percentFormat.format(100*calcGrossProfitMargin(data.data, revenue))
);

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

/**
 * add sales debits and divide by revenue
 * @param  {Array} dataEntries array of data entries
 * @param  {Number} revenue     calculated revenue
 * @return {Number}             calculated gross profit margin
 */
function calcGrossProfitMargin(dataEntries, revenue) {
  const salesDebits = dataEntries
    .filter(
      entry => entry.account_type === 'sales' && entry.value_type === 'debit'
    )
    .reduce((accumulator, entry) => entry.total_value + accumulator, 0);
  return salesDebits / revenue;
}
