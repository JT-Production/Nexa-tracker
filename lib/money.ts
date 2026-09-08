import { CurrencyCode, CurrencyMeta } from '@/types';

export const CURRENCY_METADATA: Record<CurrencyCode, CurrencyMeta> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', decimals: 2, flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', decimals: 2, flag: '🇪🇺' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', decimals: 2, flag: '🇬🇧' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', decimals: 2, flag: '🇳🇬' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', decimals: 2, flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', decimals: 2, flag: '🇦🇺' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen', decimals: 0, flag: '🇯🇵' },
  CHF: { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', decimals: 2, flag: '🇨🇭' },
  BTC: { code: 'BTC', symbol: '₿', name: 'Bitcoin', decimals: 8, flag: '⚡', isCrypto: true },
  ETH: { code: 'ETH', symbol: 'Ξ', name: 'Ethereum', decimals: 6, flag: '🔷', isCrypto: true },
  USDT: { code: 'USDT', symbol: '₮', name: 'Tether USD', decimals: 2, flag: '🟢', isCrypto: true },
};

// Base exchange rates relative to USD (1 USD = X Currency)
export const DEFAULT_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  NGN: 1540.0,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 155.4,
  CHF: 0.90,
  BTC: 0.000015, // ~$66,666 / BTC
  ETH: 0.00028,  // ~$3,570 / ETH
  USDT: 1.0,
};

/**
 * Converts a decimal unit amount (e.g. $12.50) into smallest unit integer (1250 cents)
 */
export function toSmallestUnit(amount: number, currency: CurrencyCode): number {
  const meta = CURRENCY_METADATA[currency] || CURRENCY_METADATA.USD;
  const factor = Math.pow(10, meta.decimals);
  return Math.round(amount * factor);
}

/**
 * Converts smallest unit integer (1250 cents) into regular float (12.50)
 */
export function fromSmallestUnit(smallestUnitAmount: number, currency: CurrencyCode): number {
  const meta = CURRENCY_METADATA[currency] || CURRENCY_METADATA.USD;
  const factor = Math.pow(10, meta.decimals);
  return smallestUnitAmount / factor;
}

/**
 * Formats a currency amount stored in smallest units
 */
export function formatMoney(
  smallestUnitAmount: number,
  currency: CurrencyCode,
  options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    compact?: boolean;
    signDisplay?: 'auto' | 'always' | 'never';
  }
): string {
  const meta = CURRENCY_METADATA[currency] || CURRENCY_METADATA.USD;
  const rawValue = fromSmallestUnit(smallestUnitAmount, currency);
  const isNegative = rawValue < 0;
  const absValue = Math.abs(rawValue);

  const showSymbol = options?.showSymbol !== false;
  const showCode = options?.showCode === true;
  const signDisplay = options?.signDisplay || 'auto';

  let formattedNumber = '';

  if (meta.isCrypto && meta.code === 'BTC') {
    formattedNumber = absValue.toLocaleString('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8,
    });
  } else if (meta.isCrypto && meta.code === 'ETH') {
    formattedNumber = absValue.toLocaleString('en-US', {
      minimumFractionDigits: 3,
      maximumFractionDigits: 6,
    });
  } else if (options?.compact && absValue >= 1_000_000) {
    formattedNumber = (absValue / 1_000_000).toFixed(2) + 'M';
  } else if (options?.compact && absValue >= 1_000) {
    formattedNumber = (absValue / 1_000).toFixed(1) + 'k';
  } else {
    formattedNumber = absValue.toLocaleString('en-US', {
      minimumFractionDigits: meta.decimals,
      maximumFractionDigits: meta.decimals,
    });
  }

  let sign = '';
  if (isNegative && signDisplay !== 'never') {
    sign = '-';
  } else if (signDisplay === 'always' && !isNegative) {
    sign = '+';
  }

  const symbolStr = showSymbol ? meta.symbol : '';
  const codeStr = showCode ? ` ${meta.code}` : '';

  // For symbols like NGN / CAD / AUD, standard display is Symbol + formattedNumber
  return `${sign}${symbolStr}${formattedNumber}${codeStr}`;
}

/**
 * Converts an amount from source currency to target currency using FX rates
 * Takes smallest units as input, returns smallest units in target currency.
 */
export function convertCurrencySmallestUnit(
  amountSmallestUnit: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (fromCurrency === toCurrency) {
    return amountSmallestUnit;
  }

  // 1. Convert source smallest unit to source standard decimal amount
  const fromDecimals = CURRENCY_METADATA[fromCurrency]?.decimals ?? 2;
  const fromStandard = amountSmallestUnit / Math.pow(10, fromDecimals);

  // 2. Convert to USD base
  const rateFromUSD = rates[fromCurrency] || 1.0;
  const amountInUSD = fromStandard / rateFromUSD;

  // 3. Convert USD base to target currency
  const rateToTarget = rates[toCurrency] || 1.0;
  const targetStandard = amountInUSD * rateToTarget;

  // 4. Convert to target smallest unit integer
  const toDecimals = CURRENCY_METADATA[toCurrency]?.decimals ?? 2;
  return Math.round(targetStandard * Math.pow(10, toDecimals));
}

/**
 * Calculates exchange rate from one currency to another
 */
export function getExchangeRate(
  from: CurrencyCode,
  to: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (from === to) return 1.0;
  const rateFrom = rates[from] || 1.0;
  const rateTo = rates[to] || 1.0;
  return rateTo / rateFrom;
}
