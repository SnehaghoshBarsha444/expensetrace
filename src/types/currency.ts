export type Currency = 'USD' | 'EUR' | 'INR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' | 'SGD' | 'HKD' | 'KRW' | 'MXN' | 'BRL' | 'ZAR' | 'SEK' | 'NOK' | 'DKK' | 'NZD' | 'AED';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'zh-HK' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', locale: 'es-MX' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
];

// Fixed exchange rates (relative to USD)
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  JPY: 149.50,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.88,
  CNY: 7.24,
  SGD: 1.34,
  HKD: 7.82,
  KRW: 1320.50,
  MXN: 17.15,
  BRL: 4.97,
  ZAR: 18.65,
  SEK: 10.42,
  NOK: 10.58,
  DKK: 6.87,
  NZD: 1.63,
  AED: 3.67,
};

export const getCurrencyInfo = (code: Currency): CurrencyInfo => {
  return CURRENCIES.find(c => c.code === code) || CURRENCIES[0];
};

export const formatCurrency = (amount: number, currency: Currency): string => {
  const info = getCurrencyInfo(currency);
  return new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: info.code,
  }).format(amount);
};

export const convertCurrency = (
  amount: number, 
  fromCurrency: Currency, 
  toCurrency: Currency
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
  return amountInUSD * EXCHANGE_RATES[toCurrency];
};
