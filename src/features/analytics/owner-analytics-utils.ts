import Decimal from "decimal.js";

export const analyticsPeriods = ["7d", "30d", "90d", "ytd"] as const;
export type AnalyticsPeriod = (typeof analyticsPeriods)[number];

export type DateRange = {
  key: AnalyticsPeriod;
  start: Date;
  end: Date;
  comparisonStart: Date | null;
  comparisonEnd: Date | null;
};

const JAKARTA_OFFSET_HOURS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

function jakartaDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);

  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day") };
}

function jakartaDayStart({ year, month, day }: { year: number; month: number; day: number }) {
  return new Date(Date.UTC(year, month - 1, day, -JAKARTA_OFFSET_HOURS));
}

export function parseAnalyticsPeriod(value?: string): AnalyticsPeriod {
  return analyticsPeriods.includes(value as AnalyticsPeriod) ? (value as AnalyticsPeriod) : "30d";
}

export function getAnalyticsDateRange(period: AnalyticsPeriod, now = new Date()): DateRange {
  const today = jakartaDateParts(now);
  const end = new Date(jakartaDayStart(today).getTime() + DAY_MS);

  if (period === "ytd") {
    const start = jakartaDayStart({ year: today.year, month: 1, day: 1 });
    const comparisonStart = jakartaDayStart({ year: today.year - 1, month: 1, day: 1 });
    const comparisonEnd = new Date(comparisonStart.getTime() + (end.getTime() - start.getTime()));
    return { key: period, start, end, comparisonStart, comparisonEnd };
  }

  const duration = period === "7d" ? 7 : period === "90d" ? 90 : 30;
  const start = new Date(end.getTime() - duration * DAY_MS);
  return {
    key: period,
    start,
    end,
    comparisonStart: new Date(start.getTime() - duration * DAY_MS),
    comparisonEnd: start,
  };
}

export function sumMoney(values: Array<Decimal.Value | null | undefined>) {
  return values.reduce<Decimal>((sum, value) => sum.plus(value ?? 0), new Decimal(0));
}

export function remainingInvoiceAmount(total: Decimal.Value, paidAmount: Decimal.Value) {
  return Decimal.max(new Decimal(total).minus(paidAmount), 0);
}

export function percentageOf(numerator: number, denominator: number) {
  if (denominator === 0) return null;
  return Math.round((numerator / denominator) * 100);
}
