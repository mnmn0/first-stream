import { Project } from '@/types/project';
import { useHttp } from './use-http';

export const useProject = () => {
  const http = useHttp();

  return {
    projects: http.get<Project[]>('/api/projects'),
    getUser: (projectId: string) => http.get<Project>(`/api/projects/${projectId}`),
  };
}
