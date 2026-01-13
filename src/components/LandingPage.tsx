import { ArrowRight, BarChart3, Shield, Wallet, Globe, TrendingUp } from 'lucide-react';
import logo from '@/assets/logo.png';
import heroIllustration from '@/assets/hero-illustration.png';
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

        <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Smart expense tracking made simple
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-slide-up">
                Take Control of Your{' '}
                <span className="gradient-text">Finances</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
                Track expenses, manage budgets, and gain insights into your spending habits. 
                All in one beautiful, secure application.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <Button onClick={onGetStarted} size="lg" className="gap-2 text-base hover-lift">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="text-base hover-lift" onClick={onGetStarted}>
                  Sign In
                </Button>
              </div>

              <p className="text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
                No credit card required • Free forever for personal use
              </p>
            </div>

            {/* Right side - Hero illustration */}
            <div className="relative lg:block animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl transform scale-95" />
                
                {/* Floating animation wrapper */}
                <div className="relative animate-float">
                  <img 
                    src={heroIllustration} 
                    alt="ExpenseTrace Dashboard Preview" 
                    className="w-full h-auto rounded-2xl shadow-2xl border border-border/20"
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl animate-pulse" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
            </div>
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
