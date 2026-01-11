import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Expense, getCategoryInfo } from '@/types/expense';
import { format, parseISO } from 'date-fns';
import { toast } from '@/hooks/use-toast';

interface ExportButtonProps {
  expenses: Expense[];
}

export const ExportButton = ({ expenses }: ExportButtonProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const exportToCSV = () => {
    if (expenses.length === 0) {
      toast({
        title: 'No expenses to export',
        description: 'Add some expenses first.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      const headers = ['Date', 'Category', 'Amount', 'Description', 'Created At'];
      const rows = expenses.map(e => [
        format(parseISO(e.date), 'yyyy-MM-dd'),
        getCategoryInfo(e.category).label,
        e.amount.toFixed(2),
        `"${e.description.replace(/"/g, '""')}"`,
        format(new Date(e.createdAt), 'yyyy-MM-dd HH:mm:ss'),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `expenses_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: 'Export successful!',
        description: 'Your expenses have been downloaded as CSV.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export expenses. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (expenses.length === 0) {
      toast({
        title: 'No expenses to export',
        description: 'Add some expenses first.',
        variant: 'destructive',
      });
      return;
    }

    setIsExporting(true);

    try {
      // Generate PDF-like HTML content and trigger print
      const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
      
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Expense Report - ${format(new Date(), 'MMMM yyyy')}</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
            }
            h1 {
              color: #10b981;
              border-bottom: 2px solid #10b981;
              padding-bottom: 10px;
            }
            .summary {
              background: #f0fdf4;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
            }
            .summary h2 {
              margin: 0 0 10px 0;
              color: #047857;
            }
            .summary p {
              margin: 5px 0;
              font-size: 18px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th {
              background: #10b981;
              color: white;
              padding: 12px;
              text-align: left;
            }
            td {
              padding: 12px;
              border-bottom: 1px solid #e5e7eb;
            }
            tr:nth-child(even) {
              background: #f9fafb;
            }
            .amount {
              font-weight: bold;
              color: #047857;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>💰 Expense Report</h1>
          <p>Generated on ${format(new Date(), 'MMMM d, yyyy')}</p>
          
          <div class="summary">
            <h2>Summary</h2>
            <p><strong>Total Expenses:</strong> ${formatCurrency(totalAmount)}</p>
            <p><strong>Number of Transactions:</strong> ${expenses.length}</p>
            <p><strong>Average per Transaction:</strong> ${formatCurrency(totalAmount / expenses.length)}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map(e => `
                <tr>
                  <td>${format(parseISO(e.date), 'MMM d, yyyy')}</td>
                  <td>${getCategoryInfo(e.category).emoji} ${getCategoryInfo(e.category).label}</td>
                  <td>${e.description || '-'}</td>
                  <td class="amount">${formatCurrency(e.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Expense Tracker - Your personal finance companion</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      toast({
        title: 'PDF Ready',
        description: 'Use the print dialog to save as PDF.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={isExporting}>
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV} className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="gap-2">
          <FileText className="h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
