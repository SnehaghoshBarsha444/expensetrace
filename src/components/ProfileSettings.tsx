import { useState, useEffect } from 'react';
import { User, Mail, DollarSign, Wallet, Save, Loader2, Settings, Lock, Eye, EyeOff } from 'lucide-react';
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
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { CURRENCIES, Currency } from '@/types/currency';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ProfileSettings = () => {
  const { user } = useAuth();
  const { preferences, updatePreferences, isLoading: prefsLoading } = useUserPreferences();
  
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [monthlyBudget, setMonthlyBudget] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});

  // Load current preferences when dialog opens
  useEffect(() => {
    if (open && preferences) {
      loadCurrentValues();
    }
    // Reset password fields when dialog closes
    if (!open) {
      resetPasswordFields();
    }
  }, [open, preferences]);

  const loadCurrentValues = async () => {
    if (!user) return;
    
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

  const resetPasswordFields = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordErrors({});
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
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

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!user || !validateForm()) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({
          username: username.trim() || null,
          preferred_currency: currency,
          monthly_budget: monthlyBudget ? Number(monthlyBudget) : null,
        })
        .eq('user_id', user.id);

      if (error) throw error;

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

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    
    setIsChangingPassword(true);
    try {
      // First verify current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });

      if (signInError) {
        setPasswordErrors({ currentPassword: 'Current password is incorrect' });
        setIsChangingPassword(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      toast({
        title: 'Password changed',
        description: 'Your password has been updated successfully.',
      });
      
      resetPasswordFields();
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Error changing password',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsChangingPassword(false);
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
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
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

            {/* Save Profile Button */}
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

            <Separator className="my-6" />

            {/* Password Change Section */}
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Change Password
              </h3>

              {/* Current Password */}
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password (min 6 characters)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.newPassword}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-destructive">{passwordErrors.confirmPassword}</p>
                )}
              </div>

              {/* Change Password Button */}
              <Button 
                onClick={handleChangePassword} 
                disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                variant="outline"
                className="w-full"
              >
                {isChangingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Change Password
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
