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

  describe('Working Capital Ratio', () => {
    const assetDebit1 = {
      account_category: 'assets',
      account_type: 'current',
      value_type: 'debit',
      total_value: 1,
    };
    const assetDebit2 = {
      account_category: 'assets',
      account_type: 'current_accounts_receivable',
      value_type: 'debit',
      total_value: 2,
    };
    const assetDebit3 = {
      account_category: 'assets',
      account_type: 'bank',
      value_type: 'debit',
      total_value: 3,
    };
    const assetCredit1 = {
      account_category: 'assets',
      account_type: 'bank',
      value_type: 'credit',
      total_value: 1,
    };
    const assetCredit2 = {
      account_category: 'assets',
      account_type: 'current',
      value_type: 'credit',
      total_value: 2,
    };
    const assetCredit3 = {
      account_category: 'assets',
      account_type: 'current_accounts_receivable',
      value_type: 'credit',
      total_value: 3,
    };

    const liabilityDebit1 = {
      account_category: 'liability',
      account_type: 'current',
      value_type: 'debit',
      total_value: 1,
    };
    const liabilityDebit2 = {
      account_category: 'liability',
      account_type: 'current_accounts_payable',
      value_type: 'debit',
      total_value: 2,
    };
    const liabilityCredit1 = {
      account_category: 'liability',
      account_type: 'current_accounts_payable',
      value_type: 'credit',
      total_value: 1,
    };
    const liabilityCredit2 = {
      account_category: 'liability',
      account_type: 'current',
      value_type: 'credit',
      total_value: 2,
    };

    describe('Assets', () => {
      test('no records', () => {
        expect(calc.netAssets([])).toEqual(0);
      });
      test('single debit', () => {
        expect(calc.netAssets([assetDebit1])).toEqual(1);
      });
      test('single credit', () => {
        expect(calc.netAssets([assetCredit1])).toEqual(-1);
      });
      test('multiple account type debits', () => {
        expect(calc.netAssets([assetDebit1, assetDebit2, assetDebit3])).toEqual(
          6
        );
      });
      test('multiple account type credits', () => {
        expect(
          calc.netAssets([assetCredit1, assetCredit2, assetCredit3])
        ).toEqual(-6);
      });
      test('mixed records', () => {
        expect(
          calc.netAssets([
            assetDebit1,
            { ...assetDebit1, account_category: 'expense' },
            { ...assetCredit2, account_type: '' },
            assetCredit3,
            liabilityCredit1,
            liabilityDebit2,
          ])
        ).toEqual(-2);
      });
    });

    describe('Liabilities', () => {
      test('no records', () => {
        expect(calc.netLiabilities([])).toEqual(0);
      });
      test('single debit', () => {
        expect(calc.netLiabilities([liabilityDebit1])).toEqual(1);
      });
      test('single credit', () => {
        expect(calc.netLiabilities([liabilityCredit1])).toEqual(-1);
      });
      test('multiple account type debits', () => {
        expect(calc.netLiabilities([liabilityDebit1, liabilityDebit2])).toEqual(
          3
        );
      });
      test('multiple account type credits', () => {
        expect(
          calc.netLiabilities([liabilityCredit1, liabilityCredit2])
        ).toEqual(-3);
      });
      test('mixed records', () => {
        expect(
          calc.netLiabilities([
            liabilityDebit1,
            { ...liabilityDebit1, account_category: 'expense' },
            liabilityCredit2,
            { ...liabilityCredit2, account_type: '' },
            assetCredit3,
          ])
        ).toEqual(-1);
      });
    });

    test.each([
      ['no records', [], NaN],
      ['single asset debit', [assetDebit3], Infinity],
      ['single asset credit', [assetCredit2], -Infinity],
      ['single liability debit', [liabilityDebit2], 0],
      ['single liability credit', [liabilityCredit1], -0],
    ])('%s', (name, records, expected) => {
      expect(calc.workingCapitalRatio(records)).toEqual(expected);
    });
    test('mixed records', () => {
      expect(
        calc.workingCapitalRatio([
          assetDebit2,
          assetDebit3,
          assetCredit1,
          { ...assetDebit2, account_category: 'expense' },
          liabilityDebit2,
          liabilityDebit2,
          liabilityDebit1,
          liabilityCredit2,
          {
            liabilityCredit1,
            account_type: 'current_accounts_receivable',
          },
        ])
      ).toBeCloseTo(4 / 3);
    });
  });
});
