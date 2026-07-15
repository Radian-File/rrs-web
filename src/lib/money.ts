import Decimal from "decimal.js";

export type MoneyInput = Decimal.Value;

export type QuotationLineInput = {
  quantity: MoneyInput;
  unitPrice: MoneyInput;
};

export type QuotationTotals = {
  subtotal: Decimal;
  discount: Decimal;
  tax: Decimal;
  total: Decimal;
};

export function calculateQuotationTotals(
  items: QuotationLineInput[],
  discount: MoneyInput = 0,
  tax: MoneyInput = 0,
): QuotationTotals {
  const subtotal = items.reduce(
    (sum, item) => sum.plus(new Decimal(item.quantity).times(item.unitPrice)),
    new Decimal(0),
  );
  const safeDiscount = new Decimal(discount);
  const safeTax = new Decimal(tax);

  if (subtotal.isNegative() || safeDiscount.isNegative() || safeTax.isNegative()) {
    throw new Error("Financial values cannot be negative.");
  }

  if (safeDiscount.greaterThan(subtotal)) {
    throw new Error("Discount cannot exceed subtotal.");
  }

  return {
    subtotal,
    discount: safeDiscount,
    tax: safeTax,
    total: subtotal.minus(safeDiscount).plus(safeTax),
  };
}

export function toMidtransAmount(value: MoneyInput) {
  const amount = new Decimal(value);

  if (!amount.isInteger() || amount.isNegative()) {
    throw new Error("Midtrans IDR amount must be a non-negative integer.");
  }

  return amount.toNumber();
}
