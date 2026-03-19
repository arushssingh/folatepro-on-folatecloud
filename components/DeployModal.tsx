import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, Rocket, Check, Copy, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import { FileSet } from '../types';
import { bundleFilesToHtml, deployProject, checkSlugAvailable } from '../services/deployService';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  files: FileSet;
  projectId?: string;
  existingSlug?: string;
  onDeployed: (project: { id: string; slug: string }) => void;
}

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;
const BASE_URL = 'folate.pro';

export const DeployModal: React.FC<DeployModalProps> = ({
  isOpen,
  onClose,
  isDarkMode,
  files,
  projectId,
  existingSlug,
  onDeployed,
}) => {
  const [slug, setSlug] = useState(existingSlug || '');
  const [name, setName] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const checkTimerRef = useRef<ReturnType<typeof setTimeout>>();
  const isUpdate = Boolean(projectId);

  useEffect(() => {
    if (isOpen) {
      setSlug(existingSlug || '');
      setName('');
      setSlugStatus(existingSlug ? 'available' : 'idle');
      setDeployedUrl(null);
      setError(null);
      setIsDeploying(false);
      setCopied(false);
    }
  }, [isOpen, existingSlug]);

  const validateAndCheckSlug = useCallback((value: string) => {
    setSlug(value);
    setError(null);

    if (checkTimerRef.current) clearTimeout(checkTimerRef.current);

    if (!value) {
      setSlugStatus('idle');
      return;
    }

    if (!SLUG_REGEX.test(value)) {
      setSlugStatus('invalid');
      return;
    }

    // Skip availability check for existing slug on update
    if (isUpdate && value === existingSlug) {
      setSlugStatus('available');
      return;
    }

    setSlugStatus('checking');
    checkTimerRef.current = setTimeout(async () => {
      try {
        const available = await checkSlugAvailable(value);
        setSlugStatus(available ? 'available' : 'taken');
      } catch {
        setSlugStatus('idle');
      }
    }, 400);
  }, [isUpdate, existingSlug]);

  const handleDeploy = async () => {
    if (!slug || slugStatus !== 'available' || !name.trim()) return;

    setIsDeploying(true);
    setError(null);

    try {
      const compiledHtml = bundleFilesToHtml(files);
      const project = await deployProject({
        slug,
        name: name.trim(),
        files,
        compiledHtml,
        projectId,
      });
      const url = `https://${BASE_URL}/s/${project.slug}`;
      setDeployedUrl(url);
      onDeployed({ id: project.id, slug: project.slug });
    } catch (err: any) {
      setError(err.message || 'Deploy failed');
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopy = () => {
    if (!deployedUrl) return;
    navigator.clipboard.writeText(deployedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const slugStatusIcon = () => {
    switch (slugStatus) {
      case 'checking':
        return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
      case 'available':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'taken':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const canDeploy = slug && slugStatus === 'available' && name.trim() && !isDeploying;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md mx-4 rounded-2xl border shadow-2xl ${isDarkMode ? 'bg-[#0a0e1a] border-white/10' : 'bg-white border-gray-200'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDarkMode ? 'border-white/[0.06]' : 'border-gray-100'}`}>
          <div className="flex items-center gap-2.5">
            <Rocket className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {isUpdate ? 'Update Deploy' : 'Deploy Site'}
            </h2>
          </div>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-white/5 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {deployedUrl ? (
            /* Success state */
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-500" />
              </div>
              <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {isUpdate ? 'Site updated!' : 'Site deployed!'}
              </p>
              <div className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
                <span className={`text-sm flex-1 truncate ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{deployedUrl}</span>
                <button onClick={handleCopy} className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                </button>
                <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className={`p-1.5 rounded-md transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-200'}`}>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              </div>
              <button
                onClick={onClose}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${isDarkMode ? 'bg-white/5 text-gray-300 hover:bg-white/10' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Done
              </button>
            </div>
          ) : (
            /* Form state */
            <>
              {/* Project name */}
              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="My awesome site"
                  className={`w-full px-3 py-2.5 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder-gray-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                />
              </div>

              {/* Slug */}
              <div>
                <label className={`text-sm font-medium mb-1.5 block ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  URL Slug
                </label>
                <div className="relative">
                  <div className={`flex items-center rounded-lg border overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                    <span className={`px-3 py-2.5 text-sm shrink-0 ${isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
                      {BASE_URL}/s/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      onChange={e => validateAndCheckSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="my-site"
                      disabled={isUpdate && Boolean(existingSlug)}
                      className={`flex-1 px-3 py-2.5 text-sm focus:outline-none ${isDarkMode ? 'bg-transparent text-white placeholder-gray-600' : 'bg-white text-gray-900 placeholder-gray-400'} ${isUpdate && existingSlug ? 'opacity-60 cursor-not-allowed' : ''}`}
                    />
                    <div className="pr-3">{slugStatusIcon()}</div>
                  </div>
                </div>
                {slugStatus === 'invalid' && (
                  <p className="text-xs text-yellow-500 mt-1">3-50 chars: lowercase letters, numbers, hyphens. Must start/end with letter or number.</p>
                )}
                {slugStatus === 'taken' && (
                  <p className="text-xs text-red-500 mt-1">This slug is already taken. Try another one.</p>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              <button
                onClick={handleDeploy}
                disabled={!canDeploy}
                className={`w-full py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  canDeploy
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDarkMode ? 'bg-white/5 text-gray-600 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isUpdate ? 'Updating...' : 'Deploying...'}
                  </>
                ) : (
                  <>
                    <Rocket className="w-4 h-4" />
                    {isUpdate ? 'Update Site' : 'Deploy Site'}
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
