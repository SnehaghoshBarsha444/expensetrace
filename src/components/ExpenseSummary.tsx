import { TrendingUp, Wallet, PieChart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ExpenseCategory, EXPENSE_CATEGORIES, getCategoryInfo } from '@/types/expense';
import { useCurrency } from '@/contexts/CurrencyContext';

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
  const { formatAmount } = useCurrency();

  // Get top categories sorted by amount
  const sortedCategories = Object.entries(expensesByCategory)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
      {/* Total Expenses Card */}
      <Card className="stat-card overflow-hidden group">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight gradient-text">
                {formatAmount(totalExpenses)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {expenseCount} transaction{expenseCount !== 1 ? 's' : ''} this period
              </p>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Expense Card */}
      <Card className="stat-card overflow-hidden group">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5 sm:space-y-2">
              <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">Average Expense</p>
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
                {formatAmount(expenseCount > 0 ? totalExpenses / expenseCount : 0)}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">per transaction</p>
            </div>
            <div className="p-2.5 sm:p-3 rounded-xl bg-accent group-hover:bg-accent/80 transition-colors">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories Breakdown Card */}
      <Card className="stat-card overflow-hidden sm:col-span-2 lg:col-span-1">
        <CardContent className="p-0">
          <div className="flex items-start justify-between mb-4">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground uppercase tracking-wide">Top Categories</p>
            <div className="p-2 rounded-lg bg-secondary">
              <PieChart className="h-4 w-4 text-secondary-foreground" />
            </div>
          </div>
          
          {sortedCategories.length > 0 ? (
            <div className="space-y-3 sm:space-y-3.5">
              {sortedCategories.map(([category, amount]) => {
                const categoryInfo = getCategoryInfo(category as ExpenseCategory);
                const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                
                return (
                  <div key={category} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="flex items-center gap-2">
                        <span className="text-base">{categoryInfo.emoji}</span>
                        <span className="font-medium text-foreground">{categoryInfo.label}</span>
                      </span>
                      <span className="text-muted-foreground tabular-nums font-medium">
                        {formatAmount(amount)}
                      </span>
                    </div>
                    <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-700 ease-out"
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
            <p className="text-xs sm:text-sm text-muted-foreground py-4 text-center">No data yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
