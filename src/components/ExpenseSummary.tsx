import { TrendingUp, Wallet, PieChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseCategory, EXPENSE_CATEGORIES, getCategoryInfo } from '@/types/expense';

interface ExpenseSummaryProps {
  totalExpenses: number;
  expensesByCategory: Record<string, number>;
  expenseCount: number;
}

export const ExpenseSummary = ({ 
  totalExpenses, 
  expensesByCategory, 
  expenseCount 
}: ExpenseSummaryProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Get top categories sorted by amount
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Expenses Card */}
      <Card className="glass-card hover-lift overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
              <p className="text-3xl font-bold tracking-tight gradient-text">
                {formatCurrency(totalExpenses)}
              </p>
              <p className="text-sm text-muted-foreground">
                {expenseCount} transaction{expenseCount !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Expense Card */}
      <Card className="glass-card hover-lift overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Average Expense</p>
              <p className="text-3xl font-bold tracking-tight text-foreground">
                {formatCurrency(expenseCount > 0 ? totalExpenses / expenseCount : 0)}
              </p>
              <p className="text-sm text-muted-foreground">per transaction</p>
            </div>
            <div className="p-3 rounded-xl bg-accent">
              <TrendingUp className="h-6 w-6 text-accent-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Breakdown Card */}
      <Card className="glass-card hover-lift overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground">Top Categories</p>
            <div className="p-2 rounded-lg bg-secondary">
              <PieChart className="h-4 w-4 text-secondary-foreground" />
            </div>
          </div>
          
          {sortedCategories.length > 0 ? (
            <div className="space-y-3">
              {sortedCategories.map(([category, amount]) => {
                const categoryInfo = getCategoryInfo(category as ExpenseCategory);
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{categoryInfo.emoji}</span>
                        <span className="font-medium text-foreground">{categoryInfo.label}</span>
                      </span>
                      <span className="text-muted-foreground tabular-nums">
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: categoryInfo.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
