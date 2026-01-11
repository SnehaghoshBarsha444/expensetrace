import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Expense, ExpenseCategory } from '@/types/expense';
import { useAuth } from './useAuth';

interface DbExpense {
  id: string;
  user_id: string;
  date: string;
  category: string;
  amount: number;
  description: string | null;
  created_at: string;
}

const mapDbToExpense = (dbExpense: DbExpense): Expense => ({
  id: dbExpense.id,
  date: dbExpense.date,
  category: dbExpense.category as ExpenseCategory,
  amount: Number(dbExpense.amount),
  description: dbExpense.description || '',
  createdAt: dbExpense.created_at,
});

export const useExpensesDb = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load expenses from database
  useEffect(() => {
    if (!user) {
      setExpenses([]);
      setIsLoading(false);
      return;
    }

    const loadExpenses = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Failed to load expenses:', error);
      } else {
        setExpenses((data || []).map(mapDbToExpense));
      }
      setIsLoading(false);
    };

    loadExpenses();
  }, [user]);

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('expenses')
      .insert({
        user_id: user.id,
        date: expense.date,
        category: expense.category,
        amount: expense.amount,
        description: expense.description || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add expense:', error);
      return null;
    }

    const newExpense = mapDbToExpense(data);
    setExpenses(prev => [newExpense, ...prev]);
    return newExpense;
  }, [user]);

  const deleteExpense = useCallback(async (id: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to delete expense:', error);
      return false;
    }

    setExpenses(prev => prev.filter(e => e.id !== id));
    return true;
  }, [user]);

  const updateExpense = useCallback(async (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>) => {
    if (!user) return false;

    const { error } = await supabase
      .from('expenses')
      .update({
        date: updates.date,
        category: updates.category,
        amount: updates.amount,
        description: updates.description,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to update expense:', error);
      return false;
    }

    setExpenses(prev =>
      prev.map(e => e.id === id ? { ...e, ...updates } : e)
    );
    return true;
  }, [user]);

  const getTotalExpenses = useCallback(() => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  }, [expenses]);

  const getExpensesByCategory = useCallback(() => {
    const byCategory: Record<string, number> = {};
    expenses.forEach(expense => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount;
    });
    return byCategory;
  }, [expenses]);

  const getExpensesByMonth = useCallback(() => {
    const byMonth: Record<string, number> = {};
    expenses.forEach(expense => {
      const month = expense.date.substring(0, 7);
      byMonth[month] = (byMonth[month] || 0) + expense.amount;
    });
    return byMonth;
  }, [expenses]);

  return {
    expenses,
    isLoading,
    addExpense,
    deleteExpense,
    updateExpense,
    getTotalExpenses,
    getExpensesByCategory,
    getExpensesByMonth,
  };
};
