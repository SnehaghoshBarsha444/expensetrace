import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowRightLeft, Calculator } from 'lucide-react';
import { CURRENCIES, Currency, convertCurrency, formatCurrency, getCurrencyInfo } from '@/types/currency';

export const CurrencyConverter = () => {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [toCurrency, setToCurrency] = useState<Currency>('EUR');
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);

  const handleConvert = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      const result = convertCurrency(numAmount, fromCurrency, toCurrency);
      setConvertedAmount(result);
    }
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setConvertedAmount(null);
  };

  const fromInfo = getCurrencyInfo(fromCurrency);
  const toInfo = getCurrencyInfo(toCurrency);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calculator className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {fromInfo.symbol}
            </span>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setConvertedAmount(null);
              }}
              className="pl-10"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
          </div>
        </div>

        <div className="flex items-end gap-2">
          <div className="flex-1 space-y-2">
            <Label>From</Label>
            <Select
              value={fromCurrency}
              onValueChange={(value: Currency) => {
                setFromCurrency(value);
                setConvertedAmount(null);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="shrink-0"
            title="Swap currencies"
          >
            <ArrowRightLeft className="h-4 w-4" />
          </Button>

          <div className="flex-1 space-y-2">
            <Label>To</Label>
            <Select
              value={toCurrency}
              onValueChange={(value: Currency) => {
                setToCurrency(value);
                setConvertedAmount(null);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleConvert} className="w-full">
          Convert
        </Button>

        {convertedAmount !== null && (
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground mb-1">
              {formatCurrency(parseFloat(amount), fromCurrency)} =
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(convertedAmount, toCurrency)}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Rate: 1 {fromCurrency} = {(convertCurrency(1, fromCurrency, toCurrency)).toFixed(4)} {toCurrency}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
