import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProjectContext } from '@/contexts/ProjectContext';
import { toast } from '@/hooks/use-toast';

const PROJECT_ICONS = ['📊', '💼', '🏠', '✈️', '🎓', '🛒', '💰', '🎯', '🚗', '🏥'];

const QUICK_START_TEMPLATES = [
  { name: 'Personal', icon: '🏠', description: 'Track personal daily expenses' },
  { name: 'Business', icon: '💼', description: 'Manage business-related costs' },
  { name: 'Travel', icon: '✈️', description: 'Track vacation and travel expenses' },
];

export const ProjectOnboarding = () => {
  const { createProject } = useProjectContext();
  const [mode, setMode] = useState<'templates' | 'custom'>('templates');
  const [formData, setFormData] = useState({ name: '', icon: '📊' });
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateFromTemplate = async (template: typeof QUICK_START_TEMPLATES[0]) => {
    setIsCreating(true);
    const result = await createProject(template.name, template.description, template.icon);
    if (result) {
      toast({
        title: 'Project created!',
        description: `"${result.name}" is ready to use.`,
      });
    }
    setIsCreating(false);
  };

  const handleCreateCustom = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a project name.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    const result = await createProject(formData.name.trim(), undefined, formData.icon);
    if (result) {
      toast({
        title: 'Project created!',
        description: `"${result.name}" is ready to use.`,
      });
    }
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg glass-card animate-fade-in">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FolderPlus className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Create Your First Project</CardTitle>
          <CardDescription>
            Projects help you organize expenses separately. Create one to get started!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mode === 'templates' ? (
            <>
              <div className="space-y-3">
                {QUICK_START_TEMPLATES.map((template) => (
                  <button
                    key={template.name}
                    className="w-full p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-left flex items-center gap-4 disabled:opacity-50"
                    onClick={() => handleCreateFromTemplate(template)}
                    disabled={isCreating}
                  >
                    <span className="text-3xl">{template.icon}</span>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="text-center">
                <Button variant="link" onClick={() => setMode('custom')}>
                  Or create a custom project
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Choose an icon</Label>
                  <div className="flex flex-wrap gap-2">
                    {PROJECT_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`p-2 rounded-md border text-xl transition-colors ${
                          formData.icon === icon
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, icon }))}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="e.g., Side Hustle, Groceries, Kids"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setMode('templates')}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleCreateCustom} disabled={isCreating}>
                  Create Project
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
