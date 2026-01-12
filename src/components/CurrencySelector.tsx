import { DollarSign } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CURRENCIES, Currency } from '@/types/currency';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from '@/hooks/use-toast';

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = async (value: Currency) => {
    const success = await setCurrency(value);
    if (success) {
      toast({
        title: 'Currency updated',
        description: `Your preferred currency is now ${CURRENCIES.find(c => c.code === value)?.name}`,
      });
    } else {
      toast({
        title: 'Failed to update currency',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Select value={currency} onValueChange={handleCurrencyChange}>
      <SelectTrigger className="w-[100px]">
        <SelectValue>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            {currency}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((curr) => (
          <SelectItem key={curr.code} value={curr.code}>
            <span className="flex items-center gap-2">
              <span className="font-medium">{curr.symbol}</span>
              <span>{curr.code}</span>
              <span className="text-muted-foreground text-xs">({curr.name})</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
