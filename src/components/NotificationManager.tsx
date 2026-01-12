import { useState, useEffect, useCallback } from 'react';
import { Bell, BellRing, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface NotificationManagerProps {
  budgets: { category: string; limitAmount: number }[];
  expensesByCategory: Record<string, number>;
  lastExpenseDate?: string | null;
}

export const NotificationManager = ({
  budgets,
  expensesByCategory,
  lastExpenseDate,
}: NotificationManagerProps) => {
  const { preferences, updatePreferences } = useUserPreferences();
  const [hasUnread, setHasUnread] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Check for budget alerts
  const budgetAlerts = budgets.filter(budget => {
    const spent = expensesByCategory[budget.category] || 0;
    return spent >= budget.limitAmount;
  });

  // Check if daily reminder is needed
  const today = format(new Date(), 'yyyy-MM-dd');
  const needsDailyReminder = preferences?.dailyReminderEnabled && 
    lastExpenseDate !== today;

  // Update hasUnread when alerts change
  useEffect(() => {
    if (budgetAlerts.length > 0 || needsDailyReminder) {
      setHasUnread(true);
    }
  }, [budgetAlerts.length, needsDailyReminder]);

  // Handle enabling daily reminders
  const handleToggleReminder = async (enabled: boolean) => {
    const success = await updatePreferences({ dailyReminderEnabled: enabled });
    if (success) {
      toast({
        title: enabled ? 'Daily reminders enabled' : 'Daily reminders disabled',
        description: enabled 
          ? 'You will be reminded to log your expenses daily.' 
          : 'Daily expense reminders have been turned off.',
      });
    }
  };

  // Handle reminder time change
  const handleTimeChange = async (time: string) => {
    const success = await updatePreferences({ dailyReminderTime: time + ':00' });
    if (success) {
      toast({
        title: 'Reminder time updated',
        description: `Daily reminder set for ${time}`,
      });
    }
  };

  // Show budget exceeded notification
  const showBudgetAlert = useCallback(() => {
    if (budgetAlerts.length > 0) {
      toast({
        title: '⚠️ Budget Alerts',
        description: `${budgetAlerts.length} category budget(s) exceeded!`,
        variant: 'destructive',
      });
    }
  }, [budgetAlerts]);

  // Show daily reminder notification
  const showDailyReminder = useCallback(() => {
    if (needsDailyReminder) {
      toast({
        title: '📝 Daily Expense Reminder',
        description: "Don't forget to log your expenses for today!",
      });
    }
  }, [needsDailyReminder]);

  // Show alerts when component mounts or when open
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
    }
  }, [isOpen]);

  const reminderTime = preferences?.dailyReminderTime?.slice(0, 5) || '20:00';

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          {hasUnread ? (
            <BellRing className="h-4 w-4 animate-pulse" />
          ) : (
            <Bell className="h-4 w-4" />
          )}
          {hasUnread && (
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Budget Alerts */}
          {budgetAlerts.length > 0 && (
            <div className="rounded-lg bg-destructive/10 p-3 space-y-2">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium text-sm">Budget Exceeded</span>
              </div>
              <ul className="space-y-1">
                {budgetAlerts.map(alert => (
                  <li key={alert.category} className="text-sm text-muted-foreground">
                    • {alert.category} is over budget
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Daily Reminder */}
          {needsDailyReminder && (
            <div className="rounded-lg bg-primary/10 p-3">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="font-medium text-sm">Daily Reminder</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                You haven't logged any expenses today.
              </p>
            </div>
          )}

          {budgetAlerts.length === 0 && !needsDailyReminder && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No new notifications
            </p>
          )}

          {/* Settings */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="text-sm font-medium text-foreground">Reminder Settings</h4>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminder" className="text-sm">
                Daily expense reminder
              </Label>
              <Switch
                id="daily-reminder"
                checked={preferences?.dailyReminderEnabled || false}
                onCheckedChange={handleToggleReminder}
              />
            </div>

            {preferences?.dailyReminderEnabled && (
              <div className="flex items-center gap-2">
                <Label htmlFor="reminder-time" className="text-sm whitespace-nowrap">
                  Remind at
                </Label>
                <Input
                  id="reminder-time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="w-auto"
                />
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            {budgetAlerts.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={showBudgetAlert}
              >
                View Budget Alerts
              </Button>
            )}
            {needsDailyReminder && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={showDailyReminder}
              >
                Log Expense
              </Button>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
