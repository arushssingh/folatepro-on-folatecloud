import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Loader2, Globe, Smartphone, Layout, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Template } from '../constants/templates-types';
import { ProjectType } from '../types';
import { CanvasText } from './ui/canvas-text';
import { Spotlight } from './ui/spotlight-new';

interface PromptInputProps {
  onGenerate: (prompt: string, projectType: ProjectType) => void;
  onSelectTemplate: (template: Template) => void;
  isGenerating: boolean;
  projectType: ProjectType;
}

const PROJECT_TYPE_CONFIG = {
  [ProjectType.WEBSITE]: {
    label: 'Website',
    icon: Globe,
    placeholder: 'Describe the website you want to build...',
    subtitle: 'Generate beautiful, responsive landing pages from a single prompt.',
    buttonLabel: 'Build',
    buttonLabelActive: 'Building...',
  },
  [ProjectType.MOBILE_APP]: {
    label: 'Mobile App',
    icon: Smartphone,
    placeholder: 'Describe the mobile app you want — its screens, purpose, and style...',
    subtitle: 'Generate multi-screen mobile app UIs with navigation and real content.',
    buttonLabel: 'Build',
    buttonLabelActive: 'Building...',
  },
};

const TemplateCard: React.FC<{ template: Template; onSelect: (t: Template) => void; index: number }> = ({ template, onSelect, index }) => (
  <motion.button
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.04, duration: 0.25 }}
    whileHover={{ y: -2 }}
    onClick={() => onSelect(template)}
    className="group flex flex-col text-left p-5 rounded-xl border border-gray-200 dark:border-white/[0.07] hover:border-gray-300 dark:hover:border-white/[0.14] bg-white dark:bg-white/[0.02] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all duration-200"
  >
    <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-2.5">
      {template.category}
    </span>
    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
      {template.name}
    </h3>
    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed flex-1">
      {template.description}
    </p>
    <div className="mt-4 flex items-center gap-1 text-[10px] font-semibold text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
      Use template <ChevronRight className="w-3 h-3" />
    </div>
  </motion.button>
);

export const PromptInput: React.FC<PromptInputProps> = React.memo(({ onGenerate, onSelectTemplate, isGenerating, projectType }) => {
  const [prompt, setPrompt] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const config = PROJECT_TYPE_CONFIG[projectType];

  useEffect(() => {
    const loaders: Record<ProjectType, () => Promise<{ TEMPLATES: Template[] }>> = {
      [ProjectType.WEBSITE]:    () => import('../constants/templates-website'),
      [ProjectType.MOBILE_APP]: () => import('../constants/templates-mobile'),
    };
    setTemplates([]);
    loaders[projectType]().then(m => setTemplates(m.TEMPLATES));
  }, [projectType]);

  const handleAction = (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt, projectType);
    }
  };

  return (
    <div className="w-full flex flex-col items-center px-6 pt-20 pb-24 relative overflow-hidden">
      <Spotlight />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-3xl flex flex-col items-center text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 dark:text-white mb-5 leading-[1.1]">
          Generate at{' '}
          <CanvasText
            text="Lightning Speed"
            backgroundClassName="bg-blue-600 dark:bg-blue-700"
            colors={[
              'rgba(0, 153, 255, 1)',
              'rgba(0, 153, 255, 0.9)',
              'rgba(0, 153, 255, 0.8)',
              'rgba(0, 153, 255, 0.7)',
              'rgba(0, 153, 255, 0.6)',
              'rgba(0, 153, 255, 0.5)',
              'rgba(0, 153, 255, 0.4)',
              'rgba(0, 153, 255, 0.3)',
              'rgba(0, 153, 255, 0.2)',
              'rgba(0, 153, 255, 0.1)',
            ]}
            lineGap={4}
            animationDuration={5}
          />
        </h1>

        <AnimatePresence mode="wait">
          <motion.p
            key={projectType}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-base md:text-lg text-gray-500 dark:text-gray-400 font-light max-w-xl leading-relaxed"
          >
            {config.subtitle}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Input */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="w-full max-w-3xl relative"
      >
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) handleAction(e);
          }}
          placeholder={config.placeholder}
          className="w-full bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/[0.08] rounded-2xl text-gray-900 dark:text-white px-6 pt-5 pb-16 outline-none resize-none h-[140px] text-base font-light placeholder-gray-400 dark:placeholder-gray-600 focus:border-gray-400 dark:focus:border-white/20 focus:ring-0 transition-colors duration-150 shadow-sm dark:shadow-none"
          disabled={isGenerating}
        />
        <button
          onClick={() => handleAction()}
          disabled={isGenerating || !prompt.trim()}
          className={`absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
            prompt.trim() && !isGenerating
              ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 shadow-sm'
              : 'bg-gray-100 dark:bg-white/[0.05] text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          {isGenerating
            ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />{config.buttonLabelActive}</>
            : <>{config.buttonLabel}<ArrowRight className="w-3.5 h-3.5" /></>
          }
        </button>
      </motion.div>

      {/* Templates */}
      <div className="w-full max-w-5xl mt-20">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Layout className="w-4 h-4 text-gray-400 dark:text-gray-500" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Templates</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={projectType}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {templates.map((template, i) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={onSelectTemplate}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});
