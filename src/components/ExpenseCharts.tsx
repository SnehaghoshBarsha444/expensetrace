import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, PieChartIcon, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import { Expense, EXPENSE_CATEGORIES, getCategoryInfo } from '@/types/expense';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';

interface ExpenseChartsProps {
  expenses: Expense[];
}

export const ExpenseCharts = ({ expenses }: ExpenseChartsProps) => {
  // Calculate monthly spending trend (last 6 months)
  const monthlyData = useMemo(() => {
    const now = new Date();
    const sixMonthsAgo = subMonths(now, 5);
    const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now });

    return months.map(month => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      
      const total = expenses
        .filter(e => {
          const date = parseISO(e.date);
          return date >= monthStart && date <= monthEnd;
        })
        .reduce((sum, e) => sum + e.amount, 0);

      return {
        month: format(month, 'MMM yyyy'),
        amount: total,
      };
    });
  }, [expenses]);

  // Calculate category distribution for pie chart
  const categoryData = useMemo(() => {
    const byCategory: Record<string, number> = {};
    expenses.forEach(e => {
      byCategory[e.category] = (byCategory[e.category] || 0) + e.amount;
    });

    return Object.entries(byCategory)
      .map(([category, amount]) => ({
        name: getCategoryInfo(category as any).label,
        value: amount,
        color: getCategoryInfo(category as any).color,
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  // Weekly comparison data
  const weeklyData = useMemo(() => {
    const weeks: Record<string, number> = {};
    
    expenses.forEach(e => {
      const date = parseISO(e.date);
      const weekStart = format(date, 'wo');
      const year = format(date, 'yyyy');
      const key = `W${weekStart} ${year}`;
      weeks[key] = (weeks[key] || 0) + e.amount;
    });

    return Object.entries(weeks)
      .slice(-8)
      .map(([week, amount]) => ({ week, amount }));
  }, [expenses]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (expenses.length === 0) {
    return (
      <Card className="glass-card-elevated">
        <CardContent className="py-12 sm:py-16 text-center">
          <div className="p-4 rounded-full bg-muted inline-flex mb-4">
            <BarChart3 className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Add some expenses to see charts and analytics</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
      {/* Monthly Spending Trend */}
      <Card className="glass-card-elevated">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="section-header">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            Spending Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickFormatter={formatCurrency}
                  tickMargin={8}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Amount']}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorAmount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown Pie Chart */}
      <Card className="glass-card-elevated">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="section-header">
            <div className="p-2 rounded-lg bg-primary/10">
              <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            Category Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Spent']}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{ fontSize: '12px' }}
                  formatter={(value) => (
                    <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Comparison */}
      <Card className="glass-card-elevated lg:col-span-2">
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="section-header">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            Weekly Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] sm:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="week" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickMargin={8}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  tickFormatter={formatCurrency}
                  tickMargin={8}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '10px',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [formatCurrency(value), 'Spent']}
                />
                <Bar 
                  dataKey="amount" 
                  fill="hsl(var(--primary))" 
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
