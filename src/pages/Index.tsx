import { useState } from 'react';
import { Receipt, LogOut } from 'lucide-react';
import logo from '@/assets/logo.png';
import { ProfileSettings } from '@/components/ProfileSettings';
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
import { LandingPage } from '@/components/LandingPage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CurrencySelector } from '@/components/CurrencySelector';
import { NotificationManager } from '@/components/NotificationManager';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { ProjectSelector } from '@/components/ProjectSelector';
import { ProjectOnboarding } from '@/components/ProjectOnboarding';
import { useAuth } from '@/hooks/useAuth';
import { useExpensesDb } from '@/hooks/useExpensesDb';
import { useBudgets } from '@/hooks/useBudgets';
import { useUserPreferences } from '@/hooks/useUserPreferences';
import { useProjectContext } from '@/contexts/ProjectContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);
  const { user, isLoading: authLoading, signOut, isAuthenticated } = useAuth();
  const { selectedProject, selectedProjectId, projects, isLoading: projectsLoading } = useProjectContext();
  
  const {
    expenses,
    isLoading: expensesLoading,
    addExpense,
    deleteExpense,
    updateExpense,
    getTotalExpenses,
    getExpensesByCategory,
  } = useExpensesDb(selectedProjectId);

  const {
    budgets,
    setBudget,
    deleteBudget,
  } = useBudgets(selectedProjectId);

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

  const handleEditExpense = async (id: string, updates: Parameters<typeof updateExpense>[1]) => {
    const success = await updateExpense(id, updates);
    if (success) {
      toast({
        title: 'Expense updated',
        description: 'Your expense has been successfully updated.',
      });
    } else {
      toast({
        title: 'Failed to update expense',
        description: 'Please try again.',
        variant: 'destructive',
      });
    }
    return success;
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
    if (showAuth) {
      return <AuthForm />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // Show project loading state
  if (projectsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading projects...</div>
      </div>
    );
  }

  // Show onboarding if no projects exist
  if (projects.length === 0) {
    return <ProjectOnboarding />;
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/80 backdrop-blur-lg sticky top-0 z-50 shadow-sm">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-3 md:py-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Logo & Project */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
              <img src={logo} alt="ExpenseTrace" className="h-7 sm:h-8 md:h-10 w-auto flex-shrink-0" />
              <div className="flex flex-col min-w-0 flex-1">
                <ProjectSelector />
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 truncate hidden md:block">{user?.email}</p>
              </div>
            </div>
            
            {/* Right: Actions - Icon only on mobile */}
            <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1.5 flex-shrink-0">
              {/* Desktop only: Currency & Notifications */}
              <div className="hidden lg:flex items-center gap-1.5">
                <CurrencySelector />
                <NotificationManager 
                  budgets={budgets}
                  expensesByCategory={getExpensesByCategory()}
                  lastExpenseDate={preferences?.lastExpenseDate}
                />
              </div>
              <ThemeToggle />
              <ProfileSettings />
              <ExportButton expenses={expenses} />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut} 
                className="h-8 w-8 sm:h-9 sm:w-9 text-muted-foreground hover:text-foreground"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile/Tablet: Currency & Notifications row */}
          <div className="flex items-center gap-1.5 sm:gap-2 mt-2 pt-2 border-t border-border/30 lg:hidden">
            <CurrencySelector />
            <NotificationManager 
              budgets={budgets}
              expensesByCategory={getExpensesByCategory()}
              lastExpenseDate={preferences?.lastExpenseDate}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 page-container py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 lg:space-y-10">
        {/* Project Header */}
        {selectedProject && (
          <div className="animate-fade-in-up">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold flex items-center gap-2.5 text-foreground">
              <span className="text-2xl sm:text-3xl">{selectedProject.icon}</span>
              {selectedProject.name}
            </h1>
            {selectedProject.description && (
              <p className="text-muted-foreground mt-1.5 text-sm sm:text-base max-w-2xl">{selectedProject.description}</p>
            )}
          </div>
        )}

        {/* Summary Section */}
        <section className="animate-fade-in-up" style={{ animationDelay: '50ms' }}>
          <ExpenseSummary
            totalExpenses={getTotalExpenses()}
            expensesByCategory={getExpensesByCategory()}
            expenseCount={expenses.length}
          />
        </section>

        {/* Tabs for different views */}
        <Tabs defaultValue="expenses" className="space-y-5 sm:space-y-6 lg:space-y-8">
          <TabsList className="grid w-full grid-cols-4 max-w-lg h-11 sm:h-12 p-1 bg-muted/50">
            <TabsTrigger value="expenses" className="text-xs sm:text-sm font-medium">Expenses</TabsTrigger>
            <TabsTrigger value="charts" className="text-xs sm:text-sm font-medium">Analytics</TabsTrigger>
            <TabsTrigger value="budgets" className="text-xs sm:text-sm font-medium">Budgets</TabsTrigger>
            <TabsTrigger value="converter" className="text-xs sm:text-sm font-medium">Converter</TabsTrigger>
          </TabsList>

          <TabsContent value="expenses" className="space-y-5 sm:space-y-6 lg:space-y-8 mt-0">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-8">
              {/* Add Expense Form */}
              <section className="lg:col-span-2 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <Card className="glass-card-elevated lg:sticky lg:top-24">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="section-header">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      Add Expense
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ExpenseForm onSubmit={handleAddExpense} />
                  </CardContent>
                </Card>
              </section>

              {/* Expense List */}
              <section className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
                <Card className="glass-card-elevated">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="section-header">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      Recent Expenses
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />
                  </CardContent>
                </Card>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="animate-fade-in mt-0">
            <ExpenseCharts expenses={expenses} />
          </TabsContent>

          <TabsContent value="budgets" className="animate-fade-in mt-0">
            <BudgetManager
              budgets={budgets}
              expensesByCategory={getExpensesByCategory()}
              onSetBudget={setBudget}
              onDeleteBudget={deleteBudget}
            />
          </TabsContent>

          <TabsContent value="converter" className="animate-fade-in mt-0">
            <div className="max-w-md mx-auto">
              <CurrencyConverter />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-auto bg-card/50">
        <div className="page-container py-5 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Your expenses are synced across all your devices.
            <span className="ml-1 text-primary font-medium">Secure and private.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
