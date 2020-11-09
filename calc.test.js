const calc = require('./calc');

describe('Calculations', () => {
  const revenue1 = {
    account_category: 'revenue',
    total_value: 1,
  };
  const revenue2 = {
    account_category: 'revenue',
    total_value: 2,
  };
  const expense1 = {
    account_category: 'expense',
    total_value: 1,
  };
  const expense2 = {
    account_category: 'expense',
    total_value: 2,
  };

  describe('Revenue', () => {
    test('no records', () => {
      expect(calc.revenue([])).toEqual(0);
    });
    test('single record', () => {
      expect(calc.revenue([revenue1])).toEqual(1);
    });
    test('multiple records', () => {
      expect(calc.revenue([revenue1, revenue1, revenue2])).toEqual(4);
    });
    test('ignore other records', () => {
      expect(calc.revenue([revenue1, expense1])).toEqual(1);
    });
    test('add mixed records', () => {
      expect(calc.revenue([revenue1, expense1, revenue2, expense1])).toEqual(3);
    });
  });

  describe('Expenses', () => {
    test('no records', () => {
      expect(calc.expenses([])).toEqual(0);
    });
    test('single record', () => {
      expect(calc.expenses([expense1])).toEqual(1);
    });
    test('multiple records', () => {
      expect(calc.expenses([expense1, expense1, expense2])).toEqual(4);
    });
    test('ignore other records', () => {
      expect(calc.expenses([revenue1, expense1])).toEqual(1);
    });
    test('add mixed records', () => {
      expect(calc.expenses([revenue1, expense1, expense2, expense1])).toEqual(
        4
      );
    });
  });

  describe('Gross Profit Margin', () => {
    const salesDebit1 = {
      account_type: 'sales',
      value_type: 'debit',
      total_value: 1,
    };
    const salesCredit1 = {
      account_type: 'sales',
      value_type: 'credit',
      total_value: 1,
    };
    test('no records', () => {
      expect(calc.grossProfitMargin([], 1)).toBeCloseTo(0);
    });
    test('single sales debit', () => {
      expect(calc.grossProfitMargin([salesDebit1], 1)).toBeCloseTo(1);
    });
    test('multiple records', () => {
      expect(calc.grossProfitMargin([salesDebit1, salesDebit1], 1)).toBeCloseTo(
        2
      );
    });
    test('ignore sales credit', () => {
      expect(
        calc.grossProfitMargin([salesCredit1, salesDebit1], 1)
      ).toBeCloseTo(1);
    });
    test('add mixed records', () => {
      expect(
        calc.grossProfitMargin(
          [revenue1, salesDebit1, expense2, salesCredit1, salesDebit1],
          1
        )
      ).toBeCloseTo(2);
    });
    test('divide by revenue', () => {
      expect(calc.grossProfitMargin([salesDebit1, salesDebit1], 4)).toBeCloseTo(
        0.5
      );
    });
    test('revenue zero', () => {
      expect(calc.grossProfitMargin([salesDebit1, salesDebit1], 0)).toEqual(
        Infinity
      );
    });
  });

  describe('Net Profit Margin', () => {
    test.each([
      [2, 1, 0.5],
      [2, 3, -0.5],
      [4, 4, 0],
      [3, 0, 1],
    ])('Revenue: %i, Expenses: %i', (revenue, expenses, expectedMargin) => {
      expect(calc.netProfitMargin(revenue, expenses)).toBeCloseTo(
        expectedMargin
      );
    });
    test.each([
      [0, 0, NaN],
      [0, 3, -Infinity],
    ])('Revenue: %i, Expenses: %i', (revenue, expenses, expectedMargin) => {
      expect(calc.netProfitMargin(revenue, expenses)).toEqual(expectedMargin);
    });
  });
});
