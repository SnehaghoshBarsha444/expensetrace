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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="page-container py-4 sm:py-6 relative z-10">
          <nav className="flex items-center justify-between">
            <img src={logo} alt="ExpenseTrace" className="h-8 sm:h-10 w-auto" />
            <Button onClick={onGetStarted} variant="outline" size="sm" className="font-medium">
              Sign In
            </Button>
          </nav>
        </div>

        <div className="page-container py-12 sm:py-16 md:py-20 lg:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left side - Text content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-accent/80 text-accent-foreground text-xs sm:text-sm font-medium animate-fade-in backdrop-blur-sm border border-accent-foreground/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Smart expense tracking made simple
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] tracking-tight text-balance animate-fade-in-up">
                Take Control of Your{' '}
                <span className="gradient-text">Finances</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                Track expenses, manage budgets, and gain insights into your spending habits. 
                All in one beautiful, secure application.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <Button onClick={onGetStarted} size="lg" className="gap-2 text-sm sm:text-base font-semibold hover-lift h-11 sm:h-12 px-6 sm:px-8">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="text-sm sm:text-base font-medium hover-lift h-11 sm:h-12 px-6 sm:px-8" onClick={onGetStarted}>
                  Sign In
                </Button>
              </div>

              <p className="text-xs sm:text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '300ms' }}>
                ✓ No credit card required • ✓ Free forever for personal use
              </p>
            </div>

            {/* Right side - Hero illustration */}
            <div className="relative hidden lg:block animate-scale-in" style={{ animationDelay: '200ms' }}>
              <div className="relative">
                {/* Glow effect behind image */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl transform scale-95" />
                
                {/* Floating animation wrapper */}
                <div className="relative animate-float">
                  <img 
                    src={heroIllustration} 
                    alt="ExpenseTrace Dashboard Preview" 
                    className="w-full h-auto rounded-2xl shadow-2xl border border-border/30"
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/15 rounded-full blur-2xl animate-pulse-soft" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/40 rounded-full blur-2xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30 relative">
        <div className="page-container">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
              Everything you need to manage expenses
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Powerful features designed to help you understand and optimize your spending.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title} 
                className="glass-card-elevated hover-lift border-border/40 animate-fade-in-up"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CardContent className="p-5 sm:p-6 space-y-3 sm:space-y-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="page-container">
          <Card className="glass-card-elevated overflow-hidden border-border/40">
            <CardContent className="p-6 sm:p-8 md:p-12 lg:p-16 text-center space-y-5 sm:space-y-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
              <div className="relative">
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4 text-balance">
                  Ready to take control of your finances?
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-xl mx-auto text-pretty">
                  Join thousands of users who are already tracking their expenses smarter with ExpenseTrace.
                </p>
                <Button onClick={onGetStarted} size="lg" className="gap-2 font-semibold hover-lift h-11 sm:h-12 px-6 sm:px-8">
                  Start Tracking Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 sm:py-8 bg-card/50">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <img src={logo} alt="ExpenseTrace" className="h-7 sm:h-8 w-auto opacity-70" />
            <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
              © {new Date().getFullYear()} ExpenseTrace. Your data stays private and secure.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
