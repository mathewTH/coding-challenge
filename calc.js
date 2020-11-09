/**
 * filter out revenue entries and add total_value to calculate revenue
 * @param  {Array} dataEntries array of data entries
 * @return {Number}            calculated revenue
 */
function revenue(dataEntries) {
  return dataEntries
    .filter(entry => entry.account_category === 'revenue')
    .reduce((accumulator, entry) => entry.total_value + accumulator, 0);
}

/**
 * filter out expense entries and add total_value to calculate expenses
 * @param  {Array} dataEntries array of data entries
 * @return {Number}            calculated expenses
 */
function expenses(dataEntries) {
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
function grossProfitMargin(dataEntries, revenue) {
  const salesDebits = dataEntries
    .filter(
      entry => entry.account_type === 'sales' && entry.value_type === 'debit'
    )
    .reduce((accumulator, entry) => entry.total_value + accumulator, 0);
  return salesDebits / revenue;
}

module.exports = {
  revenue,
  expenses,
  grossProfitMargin,
};
