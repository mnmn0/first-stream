import type {Project} from '@/types/project';
import {useHttp} from './use-http';
import {AxiosError} from 'axios';

export const useProject = (projectId?: string) => {
  const http = useHttp();

  const {
    data: projects,
    error: projectsError,
    isLoading: projectsLoading,
    mutate: mutateProjects,
  } = http.get<Project[]>('/api/projects');

  const {
    data: project,
    error,
    isLoading,
    mutate,
  } = http.get<Project>(projectId ? `/api/projects/${projectId}` : null);

  return {
    // 単一プロジェクトの取得
    project,
    isError: error instanceof AxiosError,
    isLoading,
    mutate,

    // プロジェクト一覧の取得
    projects,
    projectsError,
    projectsLoading,
    mutateProjects,
  };
};
