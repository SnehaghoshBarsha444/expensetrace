import { ArrowRight, BarChart3, Shield, Wallet, Globe, TrendingUp } from 'lucide-react';
import logo from '@/assets/logo.png';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
}

export const LandingPage = ({ onGetStarted }: LandingPageProps) => {
  const features = [
    {
      icon: Wallet,
      title: 'Track Expenses',
      description: 'Easily log and categorize your daily expenses with a simple, intuitive interface.',
    },
    {
      icon: BarChart3,
      title: 'Visual Analytics',
      description: 'Understand your spending patterns with beautiful charts and detailed breakdowns.',
    },
    {
      icon: TrendingUp,
      title: 'Budget Management',
      description: 'Set spending limits by category and get alerts when approaching your budget.',
    },
    {
      icon: Globe,
      title: 'Multi-Currency',
      description: 'Support for 20+ currencies with built-in converter for international tracking.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your financial data is encrypted and synced securely across all devices.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <img src={logo} alt="ExpenseTrace" className="h-10 w-auto" />
            <Button onClick={onGetStarted} variant="outline" size="sm">
              Sign In
            </Button>
          </nav>
        </div>

        <div className="container max-w-6xl mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Smart expense tracking made simple
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Take Control of Your{' '}
              <span className="gradient-text">Finances</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Track expenses, manage budgets, and gain insights into your spending habits. 
              All in one beautiful, secure application.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button onClick={onGetStarted} size="lg" className="gap-2 text-base">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="text-base" onClick={onGetStarted}>
                Sign In
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              No credit card required • Free forever for personal use
            </p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything you need to manage expenses
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you understand and optimize your spending.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="glass-card hover-lift border-border/50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-8 md:p-12 text-center space-y-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Ready to take control of your finances?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Join thousands of users who are already tracking their expenses smarter with ExpenseTrace.
                </p>
                <Button onClick={onGetStarted} size="lg" className="gap-2">
                  Start Tracking Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <img src={logo} alt="ExpenseTrace" className="h-8 w-auto opacity-70" />
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ExpenseTrace. Your data stays private and secure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
