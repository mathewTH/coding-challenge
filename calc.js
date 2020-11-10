const totalValueSumAccumulator = (accumulator, record) =>
  record.total_value + accumulator;

/**
 * filter out revenue records and add total_value to calculate revenue
 * @param  {Array} dataRecords array of data records
 * @return {Number}            calculated revenue
 */
function revenue(dataRecords) {
  return dataRecords
    .filter(record => record.account_category === 'revenue')
    .reduce(totalValueSumAccumulator, 0);
}

/**
 * filter out expense records and add total_value to calculate expenses
 * @param  {Array} dataRecords array of data records
 * @return {Number}            calculated expenses
 */
function expenses(dataRecords) {
  return dataRecords
    .filter(record => record.account_category === 'expense')
    .reduce(totalValueSumAccumulator, 0);
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
    .reduce(totalValueSumAccumulator, 0);
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

function workingCapitalRatio(dataRecords) {
  const isAsset = record =>
    record.account_category === 'assets' &&
    ['current', 'bank', 'current_accounts_receivable'].includes(
      record.account_type
    );
  const assetDebits = dataRecords
    .filter(record => isAsset(record) && record.value_type === 'debit')
    .reduce(totalValueSumAccumulator, 0);
  const assetCredits = dataRecords
    .filter(record => isAsset(record) && record.value_type === 'credit')
    .reduce(totalValueSumAccumulator, 0);
  const assets = assetDebits - assetCredits;

  const isLiability = record =>
    record.account_category === 'liability' &&
    ['current', 'current_accounts_payable'].includes(record.account_type);
  const liabilityDebits = dataRecords
    .filter(record => isLiability(record) && record.value_type === 'debit')
    .reduce(totalValueSumAccumulator, 0);
  const liabilityCredits = dataRecords
    .filter(record => isLiability(record) && record.value_type === 'credit')
    .reduce(totalValueSumAccumulator, 0);
  const liabilities = liabilityDebits - liabilityCredits;

  return assets / liabilities;
}

module.exports = {
  revenue,
  expenses,
  grossProfitMargin,
  netProfitMargin,
  workingCapitalRatio,
};
