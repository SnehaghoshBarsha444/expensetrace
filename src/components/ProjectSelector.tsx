import { useState } from 'react';
import { Plus, ChevronDown, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useProjectContext } from '@/contexts/ProjectContext';
import { toast } from '@/hooks/use-toast';

const PROJECT_ICONS = ['📊', '💼', '🏠', '✈️', '🎓', '🛒', '💰', '🎯', '🚗', '🏥'];

export const ProjectSelector = () => {
  const {
    projects,
    selectedProject,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
  } = useProjectContext();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '📊' });

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a project name.',
        variant: 'destructive',
      });
      return;
    }

    const result = await createProject(formData.name.trim(), formData.description.trim(), formData.icon);
    if (result) {
      toast({
        title: 'Project created',
        description: `"${result.name}" has been created.`,
      });
      setIsCreateOpen(false);
      setFormData({ name: '', description: '', icon: '📊' });
    }
  };

  const handleEdit = async () => {
    if (!editingProject || !formData.name.trim()) return;

    const success = await updateProject(editingProject, {
      name: formData.name.trim(),
      description: formData.description.trim() || null,
      icon: formData.icon,
    });

    if (success) {
      toast({
        title: 'Project updated',
        description: 'Your changes have been saved.',
      });
      setIsEditOpen(false);
      setEditingProject(null);
      setFormData({ name: '', description: '', icon: '📊' });
    }
  };

  const handleDelete = async () => {
    if (!editingProject) return;

    const success = await deleteProject(editingProject);
    if (success) {
      toast({
        title: 'Project deleted',
        description: 'The project and all its data have been removed.',
        variant: 'destructive',
      });
      setIsDeleteOpen(false);
      setEditingProject(null);
    }
  };

  const openEdit = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      setEditingProject(projectId);
      setFormData({
        name: project.name,
        description: project.description || '',
        icon: project.icon,
      });
      setIsEditOpen(true);
    }
  };

  const openDelete = (projectId: string) => {
    setEditingProject(projectId);
    setIsDeleteOpen(true);
  };

  if (isLoading) {
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <span className="animate-pulse">Loading...</span>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1 sm:gap-2 min-w-0 sm:min-w-[120px] md:min-w-[140px] max-w-[100px] sm:max-w-[140px] md:max-w-[180px] justify-between h-7 sm:h-8 md:h-9 px-2 sm:px-3"
          >
            {selectedProject ? (
              <>
                <span className="flex items-center gap-1 sm:gap-2 min-w-0">
                  <span className="flex-shrink-0 text-sm sm:text-base">{selectedProject.icon}</span>
                  <span className="truncate text-xs sm:text-sm">{selectedProject.name}</span>
                </span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50 flex-shrink-0 ml-0.5" />
              </>
            ) : (
              <>
                <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate text-xs sm:text-sm">No Project</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 opacity-50 flex-shrink-0 ml-0.5" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[220px]">
          {projects.map((project) => (
            <DropdownMenuItem
              key={project.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => selectProject(project.id)}
            >
              <span className="flex items-center gap-2">
                <span>{project.icon}</span>
                <span className="truncate max-w-[120px]">{project.name}</span>
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(project.id);
                  }}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDelete(project.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </DropdownMenuItem>
          ))}
          {projects.length > 0 && <DropdownMenuSeparator />}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              setFormData({ name: '', description: '', icon: '📊' });
              setIsCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Project Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Create a workspace to organize expenses and budgets separately.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Icon</Label>
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
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="e.g., Personal, Business, Vacation"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="What is this project for?"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate}>Create Project</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Icon</Label>
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
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the project and all its expenses and budgets. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
