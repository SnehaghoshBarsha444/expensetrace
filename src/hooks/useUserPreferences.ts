import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Currency } from '@/types/currency';

export interface UserPreferences {
  id: string;
  userId: string;
  preferredCurrency: Currency;
  theme: 'light' | 'dark' | 'system';
  dailyReminderEnabled: boolean;
  dailyReminderTime: string;
  lastExpenseDate: string | null;
}

interface DbPreferences {
  id: string;
  user_id: string;
  preferred_currency: string;
  theme: string;
  daily_reminder_enabled: boolean;
  daily_reminder_time: string;
  last_expense_date: string | null;
}

const mapDbToPreferences = (db: DbPreferences): UserPreferences => ({
  id: db.id,
  userId: db.user_id,
  preferredCurrency: db.preferred_currency as Currency,
  theme: db.theme as 'light' | 'dark' | 'system',
  dailyReminderEnabled: db.daily_reminder_enabled,
  dailyReminderTime: db.daily_reminder_time,
  lastExpenseDate: db.last_expense_date,
});

export const useUserPreferences = () => {
  const { user, isAuthenticated } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences
  useEffect(() => {
    const loadPreferences = async () => {
      if (!isAuthenticated || !user) {
        setPreferences(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setPreferences(mapDbToPreferences(data as DbPreferences));
        } else {
          // Create default preferences
          const { data: newData, error: insertError } = await supabase
            .from('user_preferences')
            .insert({
              user_id: user.id,
              preferred_currency: 'USD',
              theme: 'system',
              daily_reminder_enabled: false,
              daily_reminder_time: '20:00:00',
            })
            .select()
            .single();

          if (insertError) throw insertError;
          if (newData) {
            setPreferences(mapDbToPreferences(newData as DbPreferences));
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [isAuthenticated, user]);

  const updatePreferences = useCallback(async (
    updates: Partial<Pick<UserPreferences, 'preferredCurrency' | 'theme' | 'dailyReminderEnabled' | 'dailyReminderTime' | 'lastExpenseDate'>>
  ): Promise<boolean> => {
    if (!user || !preferences) return false;

    const dbUpdates: Record<string, unknown> = {};
    if (updates.preferredCurrency !== undefined) {
      dbUpdates.preferred_currency = updates.preferredCurrency;
    }
    if (updates.theme !== undefined) {
      dbUpdates.theme = updates.theme;
    }
    if (updates.dailyReminderEnabled !== undefined) {
      dbUpdates.daily_reminder_enabled = updates.dailyReminderEnabled;
    }
    if (updates.dailyReminderTime !== undefined) {
      dbUpdates.daily_reminder_time = updates.dailyReminderTime;
    }
    if (updates.lastExpenseDate !== undefined) {
      dbUpdates.last_expense_date = updates.lastExpenseDate;
    }

    try {
      const { error } = await supabase
        .from('user_preferences')
        .update(dbUpdates)
        .eq('user_id', user.id);

      if (error) throw error;

      setPreferences(prev => prev ? { ...prev, ...updates } : null);
      return true;
    } catch (error) {
      console.error('Error updating preferences:', error);
      return false;
    }
  }, [user, preferences]);

  return {
    preferences,
    isLoading,
    updatePreferences,
    currency: preferences?.preferredCurrency || 'USD',
    theme: preferences?.theme || 'system',
  };
};
