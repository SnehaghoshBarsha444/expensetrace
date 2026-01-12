import React, { createContext, useContext, ReactNode } from 'react';
import { Currency, formatCurrency as formatCurrencyUtil, convertCurrency } from '@/types/currency';
import { useUserPreferences } from '@/hooks/useUserPreferences';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => Promise<boolean>;
  formatAmount: (amount: number) => string;
  convertAmount: (amount: number, fromCurrency: Currency) => number;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const { preferences, updatePreferences, isLoading } = useUserPreferences();
  
  const currency = preferences?.preferredCurrency || 'USD';

  const setCurrency = async (newCurrency: Currency): Promise<boolean> => {
    return updatePreferences({ preferredCurrency: newCurrency });
  };

  const formatAmount = (amount: number): string => {
    return formatCurrencyUtil(amount, currency);
  };

  const convertAmount = (amount: number, fromCurrency: Currency): number => {
    return convertCurrency(amount, fromCurrency, currency);
  };

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      setCurrency, 
      formatAmount, 
      convertAmount,
      isLoading 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
