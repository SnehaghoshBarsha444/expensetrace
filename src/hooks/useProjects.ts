import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/project';
import { useAuth } from './useAuth';

interface DbProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  icon: string;
  created_at: string;
  updated_at: string;
}

const mapDbToProject = (dbProject: DbProject): Project => ({
  id: dbProject.id,
  name: dbProject.name,
  description: dbProject.description,
  icon: dbProject.icon,
  createdAt: dbProject.created_at,
  updatedAt: dbProject.updated_at,
});

export const useProjects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load projects from database
  useEffect(() => {
    if (!user) {
      setProjects([]);
      setSelectedProjectId(null);
      setIsLoading(false);
      return;
    }

    const loadProjects = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Failed to load projects:', error);
      } else {
        const mappedProjects = (data || []).map(mapDbToProject);
        setProjects(mappedProjects);
        
        // Auto-select first project or restore from localStorage
        const savedProjectId = localStorage.getItem(`selectedProject_${user.id}`);
        if (savedProjectId && mappedProjects.some(p => p.id === savedProjectId)) {
          setSelectedProjectId(savedProjectId);
        } else if (mappedProjects.length > 0) {
          setSelectedProjectId(mappedProjects[0].id);
        }
      }
      setIsLoading(false);
    };

    loadProjects();
  }, [user]);

  // Save selected project to localStorage
  useEffect(() => {
    if (user && selectedProjectId) {
      localStorage.setItem(`selectedProject_${user.id}`, selectedProjectId);
    }
  }, [user, selectedProjectId]);

  const createProject = useCallback(async (name: string, description?: string, icon?: string) => {
    if (!user) return null;

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        icon: icon || '📊',
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to create project:', error);
      return null;
    }

    const newProject = mapDbToProject(data);
    setProjects(prev => [newProject, ...prev]);
    setSelectedProjectId(newProject.id);
    return newProject;
  }, [user]);

  const updateProject = useCallback(async (id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'icon'>>) => {
    if (!user) return false;

    const { error } = await supabase
      .from('projects')
      .update({
        name: updates.name,
        description: updates.description,
        icon: updates.icon,
      })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to update project:', error);
      return false;
    }

    setProjects(prev =>
      prev.map(p => p.id === id ? { ...p, ...updates } : p)
    );
    return true;
  }, [user]);

  const deleteProject = useCallback(async (id: string) => {
    if (!user) return false;

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Failed to delete project:', error);
      return false;
    }

    setProjects(prev => {
      const remaining = prev.filter(p => p.id !== id);
      if (selectedProjectId === id && remaining.length > 0) {
        setSelectedProjectId(remaining[0].id);
      } else if (remaining.length === 0) {
        setSelectedProjectId(null);
      }
      return remaining;
    });
    return true;
  }, [user, selectedProjectId]);

  const selectProject = useCallback((id: string) => {
    if (projects.some(p => p.id === id)) {
      setSelectedProjectId(id);
    }
  }, [projects]);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || null;

  return {
    projects,
    selectedProject,
    selectedProjectId,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
  };
};
