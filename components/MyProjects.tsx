import React, { useEffect, useState } from 'react';
import { ExternalLink, Pencil, Loader2, FolderOpen, Clock } from 'lucide-react';
import { Project } from '../types';
import { fetchProjects } from '../services/deployService';

interface MyProjectsProps {
  isDarkMode: boolean;
  onEditProject: (project: Project) => void;
}

const BASE_URL = 'https://folate.pro';

export const MyProjects: React.FC<MyProjectsProps> = ({ isDarkMode, onEditProject }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className={`w-6 h-6 animate-spin ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>{error}</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center h-full gap-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <FolderOpen className="w-12 h-12" />
        <p className="text-sm">No deployed projects yet</p>
        <p className="text-xs">Generate a site and click the rocket to deploy it.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-5xl mx-auto">
        <h2 className={`text-xl font-semibold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          My Projects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <div
              key={project.id}
              className={`rounded-xl border p-4 flex flex-col gap-3 transition-colors ${isDarkMode ? 'bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12]' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <h3 className={`font-medium text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {project.name}
                  </h3>
                  <p className={`text-xs mt-0.5 truncate ${isDarkMode ? 'text-blue-400/80' : 'text-blue-600'}`}>
                    /s/{project.slug}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-xs shrink-0 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Clock className="w-3 h-3" />
                  {formatDate(project.updated_at)}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-auto pt-1">
                <button
                  onClick={() => onEditProject(project)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors ${isDarkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-50 text-gray-700 hover:bg-gray-100'}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <a
                  href={`${BASE_URL}/s/${project.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
