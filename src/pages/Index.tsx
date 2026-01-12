import { Receipt, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExpenseForm } from '@/components/ExpenseForm';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseSummary } from '@/components/ExpenseSummary';
import { ExpenseCharts } from '@/components/ExpenseCharts';
import { BudgetManager } from '@/components/BudgetManager';
import { ExportButton } from '@/components/ExportButton';
import { AuthForm } from '@/components/AuthForm';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CurrencySelector } from '@/components/CurrencySelector';
import { NotificationManager } from '@/components/NotificationManager';
import { useAuth } from '@/hooks/useAuth';
import { useExpensesDb } from '@/hooks/useExpensesDb';
import { useBudgets } from '@/hooks/useBudgets';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Index = () => {
  const { user, isLoading: authLoading, signOut, isAuthenticated } = useAuth();
  const {
    expenses,
    isLoading: expensesLoading,
    addExpense,
    deleteExpense,
    getTotalExpenses,
    getExpensesByCategory,
  } = useExpensesDb();

  const {
    budgets,
    setBudget,
    deleteBudget,
  } = useBudgets();

  const { preferences, updatePreferences } = useUserPreferences();
  const { formatAmount } = useCurrency();

  const handleAddExpense = async (expense: Parameters<typeof addExpense>[0]) => {
    const result = await addExpense(expense);
    if (result) {
      toast({
        title: 'Expense added!',
        description: `${formatAmount(expense.amount)} added to ${expense.category}`,
      });

      // Update last expense date for daily reminder tracking
      await updatePreferences({ lastExpenseDate: format(new Date(), 'yyyy-MM-dd') });

      // Check budget alerts
      const budget = budgets.find(b => b.category === expense.category);
      if (budget) {
        const newTotal = (getExpensesByCategory()[expense.category] || 0) + expense.amount;
        const percentage = (newTotal / budget.limitAmount) * 100;

        if (percentage >= 100) {
          toast({
            title: '⚠️ Budget exceeded!',
            description: `You've exceeded your ${expense.category} budget.`,
            variant: 'destructive',
          });
        } else if (percentage >= 80) {
          toast({
            title: '⚠️ Approaching budget limit',
            description: `You've used ${percentage.toFixed(0)}% of your ${expense.category} budget.`,
          });
        }
      }
    }
  };

  const handleDeleteExpense = async (id: string) => {
    const success = await deleteExpense(id);
    if (success) {
      toast({
        title: 'Expense deleted',
        description: 'The expense has been removed.',
        variant: 'destructive',
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  const isLoading = expensesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading your expenses...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Receipt className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Expense Tracker</h1>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CurrencySelector />
              <NotificationManager 
                budgets={budgets}
                expensesByCategory={getExpensesByCategory()}
                lastExpenseDate={preferences?.lastExpenseDate}
              />
              <ThemeToggle />
              <ExportButton expenses={expenses} />
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Section */}
        <section className="animate-fade-in">
          <ExpenseSummary
            totalExpenses={getTotalExpenses()}
            expensesByCategory={getExpensesByCategory()}
            expenseCount={expenses.length}
          />
        </section>

        {/* Tabs for different views */}
        <Tabs defaultValue="expenses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="charts">Analytics</TabsTrigger>
            <TabsTrigger value="budgets">Budgets</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Add Expense Form */}
              <section className="lg:col-span-2 animate-slide-up">
                <Card className="glass-card sticky top-24">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Receipt className="h-5 w-5 text-primary" />
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
          </TabsContent>

          <TabsContent value="charts" className="animate-fade-in">
            <ExpenseCharts expenses={expenses} />
          </TabsContent>

          <TabsContent value="budgets" className="animate-fade-in">
            <BudgetManager
              budgets={budgets}
              expensesByCategory={getExpensesByCategory()}
              onSetBudget={setBudget}
              onDeleteBudget={deleteBudget}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-auto">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Your expenses are synced across all your devices.
            <span className="ml-1 text-primary">Secure and private.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
