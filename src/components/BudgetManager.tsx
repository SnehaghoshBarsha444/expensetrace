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
        description: `Budget for ${getCategoryInfo(selectedCategory).label} set to $${budgetAmount}`,
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  const categoriesWithBudgets = EXPENSE_CATEGORIES.filter(cat =>
    budgets.some(b => b.category === cat.value)
  );

  const categoriesWithoutBudgets = EXPENSE_CATEGORIES.filter(cat =>
    !budgets.some(b => b.category === cat.value)
  );

  return (
    <Card className="glass-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Target className="h-5 w-5 text-primary" />
            Budget Limits
          </CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="h-4 w-4" />
                Set Budget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Set Category Budget</DialogTitle>
                <DialogDescription>
                  Set a monthly spending limit for a category. You'll be alerted when approaching the limit.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={selectedCategory} 
                    onValueChange={(v) => setSelectedCategory(v as ExpenseCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <span className="flex items-center gap-2">
                            <span>{cat.emoji}</span>
                            <span>{cat.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Monthly Limit ($)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="500.00"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveBudget} disabled={isLoading}>
                  Save Budget
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No budgets set yet</p>
            <p className="text-sm text-muted-foreground">
              Set spending limits for your categories to track your budget
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const categoryInfo = getCategoryInfo(budget.category);
              const spent = expensesByCategory[budget.category] || 0;
              const percentage = Math.min((spent / budget.limitAmount) * 100, 100);
              const remaining = budget.limitAmount - spent;

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{categoryInfo.emoji}</span>
                      <span className="font-medium text-foreground">{categoryInfo.label}</span>
                      {getStatusIcon(spent, budget.limitAmount)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(spent)} / {formatCurrency(budget.limitAmount)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteBudget(budget.category)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={percentage} 
                      className="h-2"
                    />
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all ${getProgressColor(spent, budget.limitAmount)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {remaining < 0 && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Over budget by {formatCurrency(Math.abs(remaining))}
                    </p>
                  )}
                  {remaining > 0 && remaining < budget.limitAmount * 0.2 && (
                    <p className="text-sm text-orange-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Only {formatCurrency(remaining)} remaining
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
