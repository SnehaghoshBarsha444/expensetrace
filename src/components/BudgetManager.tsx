import { useState } from 'react';
import { Target, AlertTriangle, CheckCircle, Settings2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { ExpenseCategory, EXPENSE_CATEGORIES, getCategoryInfo } from '@/types/expense';
import { Budget } from '@/hooks/useBudgets';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from '@/hooks/use-toast';

interface BudgetManagerProps {
  budgets: Budget[];
  expensesByCategory: Record<string, number>;
  onSetBudget: (category: ExpenseCategory, amount: number) => Promise<Budget | null>;
  onDeleteBudget: (category: ExpenseCategory) => Promise<boolean>;
}

export const BudgetManager = ({
  budgets,
  expensesByCategory,
  onSetBudget,
  onDeleteBudget,
}: BudgetManagerProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('food');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { formatAmount, currency } = useCurrency();

  const handleSaveBudget = async () => {
    if (!budgetAmount || parseFloat(budgetAmount) <= 0) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid budget amount.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const result = await onSetBudget(selectedCategory, parseFloat(budgetAmount));
    setIsLoading(false);

    if (result) {
      toast({
        title: 'Budget saved!',
        description: `Budget for ${getCategoryInfo(selectedCategory).label} set to ${formatAmount(parseFloat(budgetAmount))}`,
      });
      setIsDialogOpen(false);
      setBudgetAmount('');
    } else {
      toast({
        title: 'Failed to save budget',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteBudget = async (category: ExpenseCategory) => {
    const success = await onDeleteBudget(category);
    if (success) {
      toast({
        title: 'Budget removed',
        description: `Budget for ${getCategoryInfo(category).label} has been removed.`,
      });
    }
  };

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) return 'bg-destructive';
    if (percentage >= 80) return 'bg-orange-500';
    return 'bg-primary';
  };

  const getStatusIcon = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 100) {
      return <AlertTriangle className="h-4 w-4 text-destructive" />;
    }
    if (percentage >= 80) {
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-primary" />;
  };

  return (
    <Card className="glass-card-elevated">
      <CardHeader className="pb-3 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="section-header">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            Budget Limits
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto h-9 sm:h-10">
                <Settings2 className="h-4 w-4" />
                Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Set Category Budget</DialogTitle>
                <DialogDescription className="text-sm">
                  Set a monthly spending limit for a category. You'll be alerted when approaching the limit.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-sm">Category</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(v) => setSelectedCategory(v as ExpenseCategory)}
                  >
                    <SelectTrigger className="h-10 sm:h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span className="text-base">{cat.emoji}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Monthly Limit ({currency})</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="500.00"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    className="h-10 sm:h-11 text-base"
                  />
                </div>
              </div>
              <DialogFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleSaveBudget} disabled={isLoading} className="w-full sm:w-auto">
                  Save Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {budgets.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <div className="p-4 rounded-full bg-muted inline-flex mb-4">
              <Target className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mb-2">No budgets set yet</p>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xs mx-auto">
              Set spending limits for your categories to track your budget
            </p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {budgets.map((budget) => {
              const categoryInfo = getCategoryInfo(budget.category);
              const spent = expensesByCategory[budget.category] || 0;
              const percentage = Math.min((spent / budget.limitAmount) * 100, 100);
              const remaining = budget.limitAmount - spent;

              return (
                <div key={budget.id} className="space-y-2 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <span className="text-lg sm:text-xl">{categoryInfo.emoji}</span>
                      <span className="font-medium text-sm sm:text-base text-foreground truncate">{categoryInfo.label}</span>
                      {getStatusIcon(spent, budget.limitAmount)}
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                      <span className="text-xs sm:text-sm text-muted-foreground tabular-nums">
                        {formatAmount(spent)} / {formatAmount(budget.limitAmount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 sm:h-8 sm:w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteBudget(budget.category)}
                      >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={percentage} 
                      className="h-2 sm:h-2.5"
                    />
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${getProgressColor(spent, budget.limitAmount)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {remaining < 0 && (
                    <p className="text-xs sm:text-sm text-destructive flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Over budget by {formatAmount(Math.abs(remaining))}
                    </p>
                  )}
                  {remaining > 0 && remaining < budget.limitAmount * 0.2 && (
                    <p className="text-xs sm:text-sm text-orange-500 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      Only {formatAmount(remaining)} remaining
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
