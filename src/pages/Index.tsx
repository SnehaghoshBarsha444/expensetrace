import { DollarSign, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseSummary } from '@/components/ExpenseSummary';
import { useExpenses } from '@/hooks/useExpenses';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
    getTotalExpenses,
    getExpensesByCategory,
  } = useExpenses();

  const handleAddExpense = (expense: Parameters<typeof addExpense>[0]) => {
    addExpense(expense);
    toast({
      title: 'Expense added!',
      description: `$${expense.amount.toFixed(2)} added to ${expense.category}`,
    });
  };

  const handleDeleteExpense = (id: string) => {
    deleteExpense(id);
    toast({
      title: 'Expense deleted',
      description: 'The expense has been removed.',
      variant: 'destructive',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Expense Tracker</h1>
              <p className="text-sm text-muted-foreground">Track your spending effortlessly</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Section */}
        <section className="animate-fade-in">
          <ExpenseSummary
            totalExpenses={getTotalExpenses()}
            expensesByCategory={getExpensesByCategory()}
            expenseCount={expenses.length}
          />
        </section>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Add Expense Form */}
          <section className="lg:col-span-2 animate-slide-up">
            <Card className="glass-card sticky top-24">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="h-5 w-5 text-primary" />
                  Add Expense
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseForm onSubmit={handleAddExpense} />
              </CardContent>
            </Card>
          </section>

          {/* Expense List */}
          <section className="lg:col-span-3 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <Card className="glass-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Receipt className="h-5 w-5 text-primary" />
                  Recent Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} />
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container max-w-5xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Data is saved locally in your browser. 
            <span className="ml-1 text-primary">Your expenses are private.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
