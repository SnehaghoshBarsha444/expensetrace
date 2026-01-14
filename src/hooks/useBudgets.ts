import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExpenseCategory } from '@/types/expense';
import { useAuth } from './useAuth';

export interface Budget {
  id: string;
  category: ExpenseCategory;
  limitAmount: number;
  createdAt: string;
  updatedAt: string;
}

interface DbBudget {
  id: string;
  user_id: string;
  project_id: string | null;
  category: string;
  limit_amount: number;
  created_at: string;
  updated_at: string;
}

const mapDbToBudget = (dbBudget: DbBudget): Budget => ({
  id: dbBudget.id,
  category: dbBudget.category as ExpenseCategory,
  limitAmount: Number(dbBudget.limit_amount),
  createdAt: dbBudget.created_at,
  updatedAt: dbBudget.updated_at,
});

export const useBudgets = (projectId: string | null) => {
  const { user } = useAuth();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !projectId) {
      setBudgets([]);
      setIsLoading(false);
      return;
    }

    const loadBudgets = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id)
        .eq('project_id', projectId);

      if (error) {
        console.error('Failed to load budgets:', error);
      } else {
        setBudgets((data || []).map(mapDbToBudget));
      }
      setIsLoading(false);
    };

    loadBudgets();
  }, [user, projectId]);

  const setBudget = useCallback(async (category: ExpenseCategory, limitAmount: number) => {
    if (!user || !projectId) return null;

    const existingBudget = budgets.find(b => b.category === category);

    if (existingBudget) {
      // Update existing budget
      const { data, error } = await supabase
        .from('budgets')
        .update({ limit_amount: limitAmount })
        .eq('id', existingBudget.id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update budget:', error);
        return null;
      }

      const updatedBudget = mapDbToBudget(data);
      setBudgets(prev => prev.map(b => b.id === updatedBudget.id ? updatedBudget : b));
      return updatedBudget;
    } else {
      // Create new budget
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: user.id,
          project_id: projectId,
          category,
          limit_amount: limitAmount,
        })
        .select()
        .single();

      if (error) {
        console.error('Failed to create budget:', error);
        return null;
      }

      const newBudget = mapDbToBudget(data);
      setBudgets(prev => [...prev, newBudget]);
      return newBudget;
    }
  }, [user, projectId, budgets]);

  const deleteBudget = useCallback(async (category: ExpenseCategory) => {
    if (!user) return false;

    const budget = budgets.find(b => b.category === category);
    if (!budget) return false;

    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', budget.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to delete budget:', error);
      return false;
    }

    setBudgets(prev => prev.filter(b => b.id !== budget.id));
    return true;
  }, [user, budgets]);

  const getBudgetForCategory = useCallback((category: ExpenseCategory) => {
    return budgets.find(b => b.category === category);
  }, [budgets]);

  return {
    budgets,
    isLoading,
    setBudget,
    deleteBudget,
    getBudgetForCategory,
  };
};
