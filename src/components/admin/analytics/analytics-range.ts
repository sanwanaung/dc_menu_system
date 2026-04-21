import { endOfDay, isValid, parseISO, startOfDay, subDays } from "date-fns";

export type AnalyticsSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type AnalyticsRangePreset = "7d" | "30d" | "90d" | "ytd" | "custom";

export type AnalyticsRange = {
  from: Date;
  to: Date;
  preset: AnalyticsRangePreset;
  fromParam: string;
  toParam: string;
};

function pickSingle(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function formatParamDate(date: Date) {
  // YYYY-MM-DD keeps URLs readable and stable.
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function clampRange({ from, to }: { from: Date; to: Date }) {
  const maxDays = 366;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diffDays = Math.floor((to.getTime() - from.getTime()) / msPerDay) + 1;
  if (diffDays <= maxDays) return { from, to };
  return { from: startOfDay(subDays(to, maxDays - 1)), to };
}

export function parseAnalyticsRange(
  searchParams: AnalyticsSearchParams | undefined,
  now = new Date(),
): AnalyticsRange {
  const presetRaw = pickSingle(searchParams?.preset);
  const preset: AnalyticsRangePreset =
    presetRaw === "7d" ||
    presetRaw === "30d" ||
    presetRaw === "90d" ||
    presetRaw === "ytd" ||
    presetRaw === "custom"
      ? presetRaw
      : "30d";

  const today = startOfDay(now);
  const defaultTo = endOfDay(today);
  const defaultFrom =
    preset === "7d"
      ? startOfDay(subDays(today, 6))
      : preset === "90d"
        ? startOfDay(subDays(today, 89))
        : preset === "ytd"
          ? startOfDay(new Date(today.getFullYear(), 0, 1))
          : startOfDay(subDays(today, 29));

  const fromParam = pickSingle(searchParams?.from);
  const toParam = pickSingle(searchParams?.to);

  const fromParsed = fromParam ? parseISO(fromParam) : null;
  const toParsed = toParam ? parseISO(toParam) : null;

  let from =
    fromParsed && isValid(fromParsed) ? startOfDay(fromParsed) : defaultFrom;
  let to = toParsed && isValid(toParsed) ? endOfDay(toParsed) : defaultTo;

  if (from.getTime() > to.getTime()) {
    const tmp = from;
    from = startOfDay(to);
    to = endOfDay(tmp);
  }

  const clamped = clampRange({ from, to });

  return {
    from: clamped.from,
    to: clamped.to,
    preset: fromParam || toParam ? "custom" : preset,
    fromParam: formatParamDate(clamped.from),
    toParam: formatParamDate(clamped.to),
  };
}

export function buildRangeQueryString(range: AnalyticsRange) {
  const params = new URLSearchParams();
  params.set("from", range.fromParam);
  params.set("to", range.toParam);
  params.set("preset", range.preset);
  return params.toString();
}
