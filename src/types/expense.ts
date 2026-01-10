export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  createdAt: string;
}

export type ExpenseCategory = 
  | 'food'
  | 'transportation'
  | 'entertainment'
  | 'utilities'
  | 'shopping'
  | 'healthcare'
  | 'education'
  | 'other';

export const EXPENSE_CATEGORIES: { value: ExpenseCategory; label: string; emoji: string; color: string }[] = [
  { value: 'food', label: 'Food & Dining', emoji: '🍔', color: 'hsl(25 95% 53%)' },
  { value: 'transportation', label: 'Transportation', emoji: '🚗', color: 'hsl(210 100% 50%)' },
  { value: 'entertainment', label: 'Entertainment', emoji: '🎬', color: 'hsl(280 70% 50%)' },
  { value: 'utilities', label: 'Utilities', emoji: '💡', color: 'hsl(45 100% 50%)' },
  { value: 'shopping', label: 'Shopping', emoji: '🛍️', color: 'hsl(340 80% 55%)' },
  { value: 'healthcare', label: 'Healthcare', emoji: '💊', color: 'hsl(0 70% 50%)' },
  { value: 'education', label: 'Education', emoji: '📚', color: 'hsl(200 80% 45%)' },
  { value: 'other', label: 'Other', emoji: '📌', color: 'hsl(220 10% 50%)' },
];

export const getCategoryInfo = (category: ExpenseCategory) => {
  return EXPENSE_CATEGORIES.find(c => c.value === category) || EXPENSE_CATEGORIES[EXPENSE_CATEGORIES.length - 1];
};
