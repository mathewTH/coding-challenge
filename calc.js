/**
 * filter out revenue records and add total_value to calculate revenue
 * @param  {Array} dataRecords array of data records
 * @return {Number}            calculated revenue
 */
function revenue(dataRecords) {
  return dataRecords
    .filter(record => record.account_category === 'revenue')
    .reduce((accumulator, record) => record.total_value + accumulator, 0);
}

/**
 * filter out expense records and add total_value to calculate expenses
 * @param  {Array} dataRecords array of data records
 * @return {Number}            calculated expenses
 */
function expenses(dataRecords) {
  return dataRecords
    .filter(record => record.account_category === 'expense')
    .reduce((accumulator, record) => record.total_value + accumulator, 0);
}

/**
 * add sales debits and divide by revenue
 * @param  {Array} dataRecords array of data records
 * @param  {Number} revenue     calculated revenue
 * @return {Number}             calculated gross profit margin
 */
function grossProfitMargin(dataRecords, revenue) {
  const salesDebits = dataRecords
    .filter(
      record => record.account_type === 'sales' && record.value_type === 'debit'
    )
    .reduce((accumulator, record) => record.total_value + accumulator, 0);
  return salesDebits / revenue;
}

/**
 * calculates net profit margin from revenue and expenses
 * @param  {Number} revenue  calculated revenue
 * @param  {Number} expenses calculated expenses
 * @return {Number}          calculated net profit margin
 */
function netProfitMargin(revenue, expenses) {
  return (revenue - expenses) / revenue;
}

module.exports = {
  revenue,
  expenses,
  grossProfitMargin,
  netProfitMargin,
};
