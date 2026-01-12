export type Currency = 'USD' | 'EUR' | 'INR' | 'GBP';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  locale: string;
}

export const CURRENCIES: CurrencyInfo[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
];

// Fixed exchange rates (relative to USD)
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  INR: 83.12,
  GBP: 0.79,
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
