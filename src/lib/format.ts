export function formatBalance(value: string | number, digits = 4): string {
  const n = typeof value === 'string' ? Number(value) : value;
  if (!Number.isFinite(n)) return '0';
  if (n === 0) return '0';
  if (n < 0.0001) return '<0.0001';
  return n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: digits,
  });
}

export function formatFiat(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Mock USD prices for demo display when price APIs are unavailable */
export const MOCK_PRICES: Record<string, number> = {
  ETH: 3245.12,
  POL: 0.42,
  BNB: 582.3,
  USDT: 1,
  USDC: 1,
  DAI: 1,
};

export function estimateUsd(amount: string, symbol: string): number {
  const price = MOCK_PRICES[symbol.toUpperCase()] ?? 0;
  return Number(amount) * price;
}
