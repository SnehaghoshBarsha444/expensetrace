import React, { createContext, useContext, ReactNode } from 'react';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/project';

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  selectedProjectId: string | null;
  isLoading: boolean;
  createProject: (name: string, description?: string, icon?: string) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Pick<Project, 'name' | 'description' | 'icon'>>) => Promise<boolean>;
  deleteProject: (id: string) => Promise<boolean>;
  selectProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const projectsState = useProjects();

  return (
    <ProjectContext.Provider value={projectsState}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectContext = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjectContext must be used within a ProjectProvider');
  }
  return context;
};
