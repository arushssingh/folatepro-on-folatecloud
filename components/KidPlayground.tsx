import React, { useState, useMemo, useCallback } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Layout,
  Image as ImageIcon,
  Palette,
  Trash2,
  Sparkles,
  Plus,
  Rocket,
  Heart,
  Star,
  Gamepad2,
  Users,
  MessageCircle,
  Shapes,
  Gamepad,
  IceCream,
  Ghost,
  Target,
  Wand2,
  Smile,
  Globe,
  Loader2
} from 'lucide-react';

interface BlockType {
  id: string;
  label: string;
  icon: React.ReactNode;
  category: 'looks' | 'sections' | 'content' | 'fun';
  description: string;
}

const CATEGORIES = [
  { id: 'looks', label: 'Looks', color: 'bg-purple-500', icon: <Palette className="w-4 h-4" /> },
  { id: 'sections', label: 'Sections', color: 'bg-blue-500', icon: <Layout className="w-4 h-4" /> },
  { id: 'content', label: 'Content', color: 'bg-orange-500', icon: <Shapes className="w-4 h-4" /> },
  { id: 'fun', label: 'Fun Stuff', color: 'bg-pink-500', icon: <Star className="w-4 h-4" /> },
];

const ALL_BLOCKS: BlockType[] = [
  // LOOKS
  { id: 'rainbow', label: 'Rainbow Colors', icon: <Smile className="w-5 h-5" />, category: 'looks', description: 'Make everything super bright!' },
  { id: 'dark-neon', label: 'Gamer Neon', icon: <Gamepad2 className="w-5 h-5" />, category: 'looks', description: 'Dark theme with glowing lights' },
  { id: 'pastel', label: 'Sweet Pastel', icon: <IceCream className="w-5 h-5" />, category: 'looks', description: 'Soft and cute colors' },
  { id: 'minimal', label: 'Super Clean', icon: <Globe className="w-5 h-5" />, category: 'looks', description: 'Simple and professional' },

  // SECTIONS
  { id: 'hero', label: 'Giant Header', icon: <Rocket className="w-5 h-5" />, category: 'sections', description: 'A big title at the top' },
  { id: 'features', label: 'Feature Grid', icon: <Zap className="w-5 h-5" />, category: 'sections', description: 'Boxes showing what is cool' },
  { id: 'gallery', label: 'Photo Gallery', icon: <ImageIcon className="w-5 h-5" />, category: 'sections', description: 'A grid of beautiful pictures' },
  { id: 'pricing', label: 'Price Cards', icon: <Star className="w-5 h-5" />, category: 'sections', description: 'Monthly vs Yearly plans' },
  { id: 'team', label: 'Our Team', icon: <Users className="w-5 h-5" />, category: 'sections', description: 'Profiles of the creators' },
  { id: 'footer', label: 'Page Footer', icon: <Layout className="w-5 h-5" />, category: 'sections', description: 'The very end of the page' },

  // CONTENT
  { id: 'faq', label: 'Question Box', icon: <MessageCircle className="w-5 h-5" />, category: 'content', description: 'Answering common questions' },
  { id: 'stats', label: 'Number Stats', icon: <Target className="w-5 h-5" />, category: 'content', description: 'Show off big numbers' },
  { id: 'testimonials', label: 'Reviews', icon: <Heart className="w-5 h-5" />, category: 'content', description: 'What other kids say' },
  { id: 'contact', label: 'Contact Form', icon: <Plus className="w-5 h-5" />, category: 'content', description: 'Send us a message' },

  // FUN STUFF
  { id: 'animated', label: 'Magic Motion', icon: <Wand2 className="w-5 h-5" />, category: 'fun', description: 'Items that fly in and bounce' },
  { id: 'confetti', label: 'Confetti Party', icon: <Shapes className="w-5 h-5" />, category: 'fun', description: 'Celebration effects on click' },
  { id: 'ghost', label: 'Spooky Hover', icon: <Ghost className="w-5 h-5" />, category: 'fun', description: 'Elements that change when touched' },
  { id: 'music', label: 'Sound Waves', icon: <Gamepad className="w-5 h-5" />, category: 'fun', description: 'Add rhythmic visual patterns' },
];

interface KidPlaygroundProps {
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  isDarkMode: boolean;
}

export const KidPlayground: React.FC<KidPlaygroundProps> = ({ onGenerate, isGenerating, isDarkMode }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('looks');
  const [activeStack, setActiveStack] = useState<BlockType[]>([]);

  const filteredBlocks = useMemo(() => 
    ALL_BLOCKS.filter(b => b.category === selectedCategory),
    [selectedCategory]
  );

  const addBlock = useCallback((block: BlockType) => {
    setActiveStack(prev => [...prev, { ...block, id: `${block.id}-${Date.now()}` }]);
  }, []);

  const removeBlock = useCallback((id: string) => {
    setActiveStack(prev => prev.filter(b => b.id !== id));
  }, []);

  const handleBuild = useCallback(() => {
    if (activeStack.length === 0) return;

    const themes = activeStack.filter(b => b.category === 'looks').map(b => b.label);
    const sections = activeStack.filter(b => b.category === 'sections' || b.category === 'content').map(b => b.label);
    const fun = activeStack.filter(b => b.category === 'fun').map(b => b.label);

    const promptParts = [];
    if (themes.length) promptParts.push(`Use a ${themes.join(' and ')} visual style.`);
    if (sections.length) promptParts.push(`Create a website with these sections in order: ${sections.join(', ')}.`);
    if (fun.length) promptParts.push(`Include interactive features like: ${fun.join(', ')}.`);

    const finalPrompt = `Kid-Friendly Website Build Request:\n${promptParts.join('\n')}\nMake it fun, vibrant, and highly engaging for a young audience!`;

    onGenerate(finalPrompt);
  }, [activeStack, onGenerate]);

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f0f0f0] dark:bg-[#0c0c0c]">
      {/* Category Sidebar (Thin Scratch-style) */}
      <div className={`w-16 flex flex-col items-center py-6 gap-6 shrink-0 z-30 transition-colors ${isDarkMode ? 'bg-[#181818]' : 'bg-white border-r border-gray-200'}`}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className="flex flex-col items-center gap-1 group"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all shadow-md group-hover:scale-110 group-active:scale-95 ${cat.color} ${selectedCategory === cat.id ? 'ring-4 ring-offset-2 ring-blue-500 dark:ring-offset-[#181818]' : 'opacity-70'}`}>
              {cat.icon}
            </div>
            <span className={`text-[8px] font-black uppercase tracking-tighter ${selectedCategory === cat.id ? 'text-blue-500' : 'text-gray-400'}`}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>

      {/* Block Palette Area */}
      <div className={`w-64 shrink-0 flex flex-col p-4 z-20 transition-colors ${isDarkMode ? 'bg-[#1c1c1c]' : 'bg-gray-50 border-r border-gray-200 shadow-inner'}`}>
        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
          {CATEGORIES.find(c => c.id === selectedCategory)?.label} Blocks
        </h2>
        
        <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-1">
          {filteredBlocks.map((block) => (
            <button
              key={block.id}
              onClick={() => addBlock(block)}
              className={`group flex items-center gap-3 p-2 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-95 ${
                isDarkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-white shadow-sm ${CATEGORIES.find(c => c.id === block.category)?.color}`}>
                {block.icon}
              </div>
              <div className="flex flex-col">
                <span className={`font-black text-[11px] uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{block.label}</span>
                <span className="text-[9px] text-gray-500 font-medium line-clamp-1">{block.description}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Workspace Background */}
        <div className={`absolute inset-0 pointer-events-none ${isDarkMode ? 'bg-[radial-gradient(#ffffff08_1px,transparent_1px)]' : 'bg-[radial-gradient(#00000008_1px,transparent_1px)]'}`} style={{ backgroundSize: '24px 24px' }} />

        {/* Toolbar */}
        <div className="p-6 flex items-center justify-between relative z-10 bg-transparent">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-[#1c1c1c] text-blue-500' : 'bg-white text-blue-600'}`}>
               <Gamepad className="w-7 h-7" />
            </div>
            <div className="flex flex-col">
              <h1 className={`text-2xl font-black tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Website Script Builder
              </h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Stack blocks to build your vision</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button
              onClick={() => setActiveStack([])}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isDarkMode ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-200'}`}
            >
              Clear Script
            </button>
            <button
              onClick={handleBuild}
              disabled={activeStack.length === 0 || isGenerating}
              className={`group flex items-center gap-3 px-8 py-4 rounded-[1.5rem] font-black text-sm tracking-wider uppercase transition-all shadow-2xl relative overflow-hidden ${
                activeStack.length > 0 && !isGenerating
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 text-white hover:scale-105 active:scale-95 shadow-blue-500/30'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
              }`}
            >
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Deploying...</span>
                  </motion.div>
                ) : (
                  <motion.div key="ready" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-bounce" />
                    <span>Go Live!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* The Stack Area */}
        <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar relative z-10">
          {activeStack.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center opacity-30 gap-6">
              <div className="w-32 h-32 rounded-[2.5rem] border-4 border-dashed border-gray-400 flex items-center justify-center">
                <Layout className="w-12 h-12" />
              </div>
              <div className="text-center">
                <p className="font-black text-xl uppercase tracking-widest text-gray-500 mb-2">Workspace Empty</p>
                <p className="text-sm font-medium text-gray-400">Click some blocks on the left to start your script!</p>
              </div>
            </div>
          ) : (
            <Reorder.Group axis="y" values={activeStack} onReorder={setActiveStack} className="flex flex-col gap-0 max-w-xl mx-auto items-center">
              {activeStack.map((item, index) => {
                const catInfo = CATEGORIES.find(c => c.id === item.category);
                return (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    className={`group w-full relative flex items-center justify-between p-4 cursor-grab active:cursor-grabbing transition-all border-x border-t last:border-b
                      ${index === 0 ? 'rounded-t-[1.5rem]' : ''}
                      ${index === activeStack.length - 1 ? 'rounded-b-[1.5rem]' : ''}
                      ${isDarkMode ? 'bg-[#181818] border-white/5 hover:bg-[#202020]' : 'bg-white border-gray-200 hover:border-blue-300'}
                    `}
                  >
                    {/* Scratch-style Notch */}
                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 rounded-b-full transition-colors ${catInfo?.color} opacity-20`} />
                    
                    <div className="flex items-center gap-6">
                      <div className={`w-10 h-10 ${catInfo?.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {item.label}
                        </span>
                        <span className="text-[10px] text-gray-500 font-bold uppercase">{catInfo?.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                       <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                          <button
                            onClick={() => removeBlock(item.id)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                       <div className="flex flex-col gap-0.5 opacity-20">
                          <div className="w-4 h-0.5 bg-gray-400 rounded-full" />
                          <div className="w-4 h-0.5 bg-gray-400 rounded-full" />
                          <div className="w-4 h-0.5 bg-gray-400 rounded-full" />
                       </div>
                    </div>
                  </Reorder.Item>
                );
              })}
            </Reorder.Group>
          )}
        </div>
      </div>
    </div>
  );
};

