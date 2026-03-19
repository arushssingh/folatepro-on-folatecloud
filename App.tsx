import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { PreviewWindow } from './components/PreviewWindow';
import { ChatInterface } from './components/ChatInterface';
import { CommunityChat } from './components/CommunityChat';
import { KidPlayground } from './components/KidPlayground';
import { AuthModal } from './components/AuthModal';
import { DeployModal } from './components/DeployModal';
import { MyProjects } from './components/MyProjects';
import { PreviewPlaceholder } from './components/PreviewPlaceholder';
import { Footer } from './components/Footer';
import {
  generateWebsiteCode, editWebsiteCode,
  generateMobileAppCode, editMobileAppCode,
} from './services/geminiService';
import { useAuth } from './contexts/AuthContext';
import { Message, FileSet, AppView, ProjectType, Project } from './types';
import type { Template } from './constants/templates-types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.GENERATOR);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingChars, setStreamingChars] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentFiles, setCurrentFiles] = useState<FileSet | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<string | undefined>();
  const [currentProjectSlug, setCurrentProjectSlug] = useState<string | undefined>();
  const [projectType, setProjectType] = useState<ProjectType>(ProjectType.WEBSITE);
  const { user } = useAuth();

  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle browser back button: reset to home instead of leaving the SPA
  useEffect(() => {
    const handlePopState = () => {
      if (messages.length > 0 || currentView !== AppView.GENERATOR) {
        setMessages([]);
        setCurrentFiles(null);
        setSidebarWidth(400);
        setCurrentView(AppView.GENERATOR);
        setCurrentProjectId(undefined);
        setCurrentProjectSlug(undefined);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [messages.length, currentView]);

  const toggleDarkMode = useCallback(() => setIsDarkMode(prev => !prev), []);

  const handleViewChange = useCallback((view: AppView) => {
    setCurrentView(view);
    if (view === AppView.MOBILE_APP) {
      setProjectType(ProjectType.MOBILE_APP);
    } else if (view === AppView.GENERATOR) {
      setProjectType(ProjectType.WEBSITE);
    }
  }, []);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => setIsResizing(false), []);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX;
      if (newWidth > 280 && newWidth < 800) {
        setSidebarWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  const getGenerator = useCallback((type: ProjectType) => {
    switch (type) {
      case ProjectType.MOBILE_APP: return generateMobileAppCode;
      default: return generateWebsiteCode;
    }
  }, []);

  const getEditor = useCallback((type: ProjectType) => {
    switch (type) {
      case ProjectType.MOBILE_APP: return editMobileAppCode;
      default: return editWebsiteCode;
    }
  }, []);

  const handleInitialGenerate = useCallback(async (prompt: string, type?: ProjectType) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const activeType = type ?? projectType;
    if (type) setProjectType(activeType);

    window.history.pushState({ view: 'generating' }, '', '/');
    setIsGenerating(true);
    if (currentView === AppView.COMMUNITY || currentView === AppView.PLAYGROUND) {
      setCurrentView(AppView.GENERATOR);
    }

    const userMsg: Message = { role: 'user', content: prompt };
    setMessages([userMsg]);

    try {
      const generate = getGenerator(activeType);
      const { files, explanation, testingInstructions } = await generate(prompt, (chars) => setStreamingChars(chars));
      setCurrentFiles(files);

      const aiMsg: Message = {
        role: 'assistant',
        content: `${explanation}\n\n**How to test:**\n${testingInstructions}`,
        files
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (err: any) {
      console.error("Generation Error:", err);
      let errorMessage = `I encountered an error: ${err.message || 'Unknown error'}`;

      if (err.message.includes('Proxying failed') || err.message.includes('Load failed')) {
        errorMessage = "Network Error: The request to Gemini API failed. Please ensure the API_KEY environment variable is set correctly.";
      }

      const errorMsg: Message = { role: 'assistant', content: errorMessage };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
      setStreamingChars(0);
    }
  }, [user, projectType, currentView, getGenerator]);

  const handleSelectTemplate = useCallback((template: Template) => {
    setCurrentFiles(template.files);
    setProjectType(template.projectType);
    setCurrentView(AppView.GENERATOR);
    setMessages([{
      role: 'assistant',
      content: `Template **${template.name}** loaded. What customizations would you like?`,
      files: template.files
    }]);
  }, []);

  const handleFollowUp = useCallback(async (prompt: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    if (!currentFiles) return;

    setIsGenerating(true);
    const userMsg: Message = { role: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);

    try {
      const edit = getEditor(projectType);
      const { files, explanation, testingInstructions } = await edit(currentFiles, prompt, (chars) => setStreamingChars(chars));
      setCurrentFiles(files);

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `${explanation}\n\n**Testing:**\n${testingInstructions}`,
        files
      }]);

    } catch (err: any) {
       console.error("Edit Error:", err);
       setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Update failed: ${err.message || 'Connection error. Check your API_KEY configuration.'}`
      }]);
    } finally {
      setIsGenerating(false);
      setStreamingChars(0);
    }
  }, [user, currentFiles, projectType, getEditor]);

  const handleReset = useCallback(() => {
    setMessages([]);
    setCurrentFiles(null);
    setSidebarWidth(400);
    setCurrentView(AppView.GENERATOR);
    setCurrentProjectId(undefined);
    setCurrentProjectSlug(undefined);
  }, []);

  const handleDeploy = useCallback(() => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowDeployModal(true);
  }, [user]);

  const handleDeployed = useCallback((project: { id: string; slug: string }) => {
    setCurrentProjectId(project.id);
    setCurrentProjectSlug(project.slug);
  }, []);

  const handleEditProject = useCallback((project: Project) => {
    setCurrentFiles(project.files);
    setCurrentProjectId(project.id);
    setCurrentProjectSlug(project.slug);
    setProjectType(ProjectType.WEBSITE);
    setCurrentView(AppView.GENERATOR);
    setMessages([{
      role: 'assistant',
      content: `Loaded project **${project.name}** for editing. Make changes via chat, then click **Update** to redeploy.`,
      files: project.files,
    }]);
  }, []);

  return (
    <div className={`h-screen flex flex-col font-sans overflow-hidden transition-colors duration-300 relative ${isDarkMode ? 'bg-transparent text-white' : 'bg-white text-gray-900'} ${isResizing ? 'cursor-col-resize select-none' : ''}`}>
      <Header
        onReset={handleReset}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        currentView={currentView}
        onViewChange={handleViewChange}
        user={user}
        onLoginClick={() => setShowAuthModal(true)}
      />

      <main className="flex-1 flex overflow-hidden relative z-10">
        <AnimatePresence mode="wait">
          {currentView === AppView.MY_PROJECTS ? (
            <motion.div key="my-projects" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <MyProjects isDarkMode={isDarkMode} onEditProject={handleEditProject} />
            </motion.div>
          ) : currentView === AppView.PLAYGROUND ? (
            <motion.div key="playground" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <KidPlayground onGenerate={handleInitialGenerate} isGenerating={isGenerating} isDarkMode={isDarkMode} />
            </motion.div>
          ) : currentView === AppView.COMMUNITY ? (
            <motion.div key="community" className="w-full h-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
              <CommunityChat isDarkMode={isDarkMode} />
            </motion.div>
          ) : messages.length === 0 ? (
            <motion.div
              key="landing"
              className="w-full h-full overflow-y-auto custom-scrollbar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
            >
              <PromptInput
                onGenerate={handleInitialGenerate}
                onSelectTemplate={handleSelectTemplate}
                isGenerating={isGenerating}
                projectType={projectType}
              />
              <Footer isDarkMode={isDarkMode} onViewChange={setCurrentView} />
            </motion.div>
          ) : (
            <motion.div
              key="workspace"
              className="w-full h-full flex"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <div
                ref={sidebarRef}
                style={{ width: sidebarWidth }}
                className={`h-full shrink-0 flex flex-col relative border-r ${isDarkMode ? 'border-white/[0.06] bg-[#050810]' : 'border-gray-100 bg-white'}`}
              >
                <ChatInterface
                  messages={messages}
                  onSendMessage={handleFollowUp}
                  isGenerating={isGenerating}
                  isDarkMode={isDarkMode}
                  projectType={projectType}
                  streamingChars={streamingChars}
                />

                <div
                  className={`absolute top-0 right-0 w-px h-full cursor-col-resize z-50 group transition-colors ${isDarkMode ? 'hover:bg-blue-500/50' : 'hover:bg-blue-400/50'}`}
                  onMouseDown={startResizing}
                >
                  <div className={`w-3.5 h-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 absolute top-1/2 -translate-y-1/2 -right-1.5 pointer-events-none transition-opacity ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200 shadow-sm'}`}>
                    <div className={`flex flex-col gap-0.5`}>
                      <div className={`w-0.5 h-2.5 rounded-full ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'}`} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 h-full min-w-[375px]">
                {currentFiles ? (
                  <PreviewWindow files={currentFiles} isDarkMode={isDarkMode} projectType={projectType} onFilesChange={setCurrentFiles} onDeploy={handleDeploy} currentProjectSlug={currentProjectSlug} />
                ) : (
                  <PreviewPlaceholder isGenerating={isGenerating} isDarkMode={isDarkMode} projectType={projectType} streamingChars={streamingChars} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        isDarkMode={isDarkMode}
      />

      {currentFiles && (
        <DeployModal
          isOpen={showDeployModal}
          onClose={() => setShowDeployModal(false)}
          isDarkMode={isDarkMode}
          files={currentFiles}
          projectId={currentProjectId}
          existingSlug={currentProjectSlug}
          onDeployed={handleDeployed}
        />
      )}
    </div>
  );
};

export default App;
