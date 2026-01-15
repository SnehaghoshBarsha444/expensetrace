import { useState, useEffect } from 'react';
import { User, Mail, DollarSign, Wallet, Save, Loader2, Settings } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { CURRENCIES, Currency } from '@/types/currency';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Validation schema
const profileSchema = z.object({
  username: z.string().trim().max(50, 'Username must be less than 50 characters').optional(),
  preferredCurrency: z.string(),
  monthlyBudget: z.number().min(0, 'Budget must be positive').optional().nullable(),
});

export const ProfileSettings = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences, isLoading: prefsLoading } = useUserPreferences();
  
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [username, setUsername] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load current preferences when dialog opens
  useEffect(() => {
    if (open && preferences) {
      loadCurrentValues();
    }
  }, [open, preferences]);

  const loadCurrentValues = async () => {
    if (!user) return;
    
    // Fetch the latest data including new fields
    const { data } = await supabase
      .from('user_preferences')
      .select('username, monthly_budget, preferred_currency')
      .eq('user_id', user.id)
      .single();
    
    if (data) {
      setUsername(data.username || '');
      setCurrency((data.preferred_currency as Currency) || 'USD');
      setMonthlyBudget(data.monthly_budget ? String(data.monthly_budget) : '');
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (username && username.length > 50) {
      newErrors.username = 'Username must be less than 50 characters';
    }
    
    if (monthlyBudget && (isNaN(Number(monthlyBudget)) || Number(monthlyBudget) < 0)) {
      newErrors.monthlyBudget = 'Please enter a valid positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user || !validateForm()) return;
    
    setIsSaving(true);
    try {
      // Update preferences in database
      const { error } = await supabase
        .from('user_preferences')
        .update({
          username: username.trim() || null,
          preferred_currency: currency,
          monthly_budget: monthlyBudget ? Number(monthlyBudget) : null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

      // Also update the context
      await updatePreferences({ preferredCurrency: currency });

      toast({
        title: 'Settings saved',
        description: 'Your profile settings have been updated successfully.',
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error saving settings',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Profile Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Settings
          </DialogTitle>
          <DialogDescription>
            Update your profile information and preferences
          </DialogDescription>
        </DialogHeader>

        {prefsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-5 py-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Username
              </Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={50}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>

            {/* Email (read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                Email
              </Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed here
              </p>
            </div>

            {/* Currency Preference */}
            <div className="space-y-2">
              <Label htmlFor="currency" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Preferred Currency
              </Label>
              <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{c.symbol}</span>
                        <span>{c.name}</span>
                        <span className="text-muted-foreground">({c.code})</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Monthly Budget */}
            <div className="space-y-2">
              <Label htmlFor="monthlyBudget" className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                Monthly Budget
              </Label>
              <Input
                id="monthlyBudget"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter your monthly budget"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
              />
              {errors.monthlyBudget && (
                <p className="text-sm text-destructive">{errors.monthlyBudget}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Optional: Set an overall monthly spending limit
              </p>
            </div>

            {/* Save Button */}
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
