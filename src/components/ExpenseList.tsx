import { useState } from 'react';
import { Trash2, Filter, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Expense, ExpenseCategory, EXPENSE_CATEGORIES, getCategoryInfo } from '@/types/expense';
import { useCurrency } from '@/contexts/CurrencyContext';
import { format, parseISO } from 'date-fns';
import { ExpenseEditDialog } from './ExpenseEditDialog';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onEdit: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => Promise<boolean>;
}

export const ExpenseList = ({ expenses, onDelete, onEdit }: ExpenseListProps) => {
  const [filterCategory, setFilterCategory] = useState<ExpenseCategory | 'all'>('all');
  const { formatAmount } = useCurrency();

  const filteredExpenses = filterCategory === 'all' 
    ? expenses 
    : expenses.filter(e => e.category === filterCategory);

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">💸</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No expenses yet</h3>
        <p className="text-muted-foreground">Add your first expense to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <Select 
          value={filterCategory} 
          onValueChange={(v) => setFilterCategory(v as ExpenseCategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
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
        {filterCategory !== 'all' && (
          <span className="text-sm text-muted-foreground">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Expense Items */}
      <div className="space-y-3">
        {filteredExpenses.map((expense, index) => {
          const categoryInfo = getCategoryInfo(expense.category);
          
          return (
            <div
              key={expense.id}
              className="group flex items-center justify-between p-4 rounded-xl bg-card border border-border hover-lift animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center gap-4">
                {/* Category Icon */}
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${categoryInfo.color}15` }}
                >
                  {categoryInfo.emoji}
                </div>
                
                {/* Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="font-medium"
                      style={{ 
                        backgroundColor: `${categoryInfo.color}15`,
                        color: categoryInfo.color,
                      }}
                    >
                      {categoryInfo.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(parseISO(expense.date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {expense.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {expense.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Amount */}
                <span className="text-lg font-bold text-foreground tabular-nums mr-2">
                  {formatAmount(expense.amount)}
                </span>

                {/* Edit Button */}
                <ExpenseEditDialog
                  expense={expense}
                  onEdit={onEdit}
                  trigger={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-primary"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  }
                />

                {/* Delete Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this expense? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(expense.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExpenses.length === 0 && expenses.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No expenses in this category
        </div>
      )}
    </div>
  );
};
