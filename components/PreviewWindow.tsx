import React, { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { MobilePreview } from './MobilePreview';
import {
  Monitor,
  Smartphone,
  Tablet,
  Code2,
  Eye,
  FolderOpen,
  FileCode,
  FileJson,
  FileType,
  Image as ImageIcon,
  Folder,
  ChevronRight,
  ChevronDown,
  Box,
  Moon,
  Sun,
  RotateCw,
  Download,
  Rocket,
  AlertTriangle,
  Globe,
  MousePointer2,
  X
} from 'lucide-react';
const Editor = React.lazy(() => import('@monaco-editor/react'));

const MONACO_OPTIONS = {
  minimap: { enabled: false },
  fontSize: 14,
  padding: { top: 20 },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  fontFamily: 'JetBrains Mono, monospace',
  lineNumbers: 'on' as const,
  renderLineHighlight: 'all' as const,
  wordWrap: 'on' as const,
};
import JSZip from 'jszip';
import { DeviceView, FileSet, ViewMode, FileContent, ProjectType } from '../types';

interface PreviewWindowProps {
  files: FileSet;
  isDarkMode: boolean;
  projectType?: ProjectType;
  onFilesChange?: (files: FileSet) => void;
  onDeploy?: () => void;
  currentProjectSlug?: string;
}

interface SelectedElement {
  tagName: string;
  id: string;
  className: string;
  textContent: string;
  outerHTML: string;
  selector: string;
}

const INSPECTOR_SCRIPT = `(function(){var active=false,overlay=null,selectedEl=null;function getOverlay(){if(!overlay){overlay=document.createElement('div');overlay.style.cssText='position:fixed;pointer-events:none;z-index:99999;box-sizing:border-box;border:2px solid #3b82f6;background:rgba(59,130,246,0.07);border-radius:3px;display:none;';document.body.appendChild(overlay);}return overlay;}function positionOverlay(el){var r=el.getBoundingClientRect(),o=getOverlay();o.style.top=r.top+window.scrollY+'px';o.style.left=r.left+window.scrollX+'px';o.style.width=r.width+'px';o.style.height=r.height+'px';o.style.display='block';}document.addEventListener('mousemove',function(e){if(!active)return;var t=e.target;if(t===document.body||t===document.documentElement||t===overlay)return;positionOverlay(t);},true);document.addEventListener('click',function(e){if(!active)return;e.preventDefault();e.stopPropagation();var el=e.target;if(el===overlay)return;selectedEl=el;window.parent.postMessage({type:'ELEMENT_SELECTED',tagName:el.tagName.toLowerCase(),id:el.id||'',className:(typeof el.className==='string'?el.className:''),textContent:(el.childNodes.length===1&&el.childNodes[0].nodeType===3?el.textContent.trim():''),outerHTML:el.outerHTML},'*');},true);window.addEventListener('message',function(e){if(e.data&&e.data.type==='INSPECTOR_TOGGLE'){active=e.data.active;document.body.style.cursor=active?'pointer':'';if(!active&&overlay)overlay.style.display='none';}if(e.data&&e.data.type==='APPLY_PREVIEW'&&selectedEl){if(e.data.textContent!==undefined&&selectedEl.childNodes.length===1&&selectedEl.childNodes[0].nodeType===3)selectedEl.textContent=e.data.textContent;if(e.data.className!==undefined)selectedEl.className=e.data.className;positionOverlay(selectedEl);}});})();`;

// File Tree Types
interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  isOpen?: boolean;
}

const getFileIcon = (filename: string) => {
  if (filename.endsWith('.html')) return <FileCode className="w-4 h-4 text-orange-500" />;
  if (filename.endsWith('.css')) return <FileType className="w-4 h-4 text-blue-400" />;
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return <FileCode className="w-4 h-4 text-yellow-400" />;
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return <FileCode className="w-4 h-4 text-blue-600" />;
  if (filename.endsWith('.py')) return <FileCode className="w-4 h-4 text-green-400" />;
  if (filename.endsWith('.json')) return <FileJson className="w-4 h-4 text-green-500" />;
  if (filename.endsWith('.md')) return <FileType className="w-4 h-4 text-gray-500" />;
  if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return <FileJson className="w-4 h-4 text-pink-400" />;
  if (filename.endsWith('.txt') || filename.endsWith('.env.example')) return <FileType className="w-4 h-4 text-gray-400" />;
  if (filename.match(/\.(jpg|jpeg|png|gif|svg)$/)) return <ImageIcon className="w-4 h-4 text-purple-500" />;
  return <FileCode className="w-4 h-4 text-gray-400" />;
};

// Helper to escape regex special characters
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const buildFileTree = (files: string[]): TreeNode[] => {
  const root: TreeNode[] = [];
  
  files.forEach(path => {
    const parts = path.split('/');
    let currentLevel = root;
    
    parts.forEach((part, index) => {
      const isFile = index === parts.length - 1;
      const existingNode = currentLevel.find(node => node.name === part);
      
      if (existingNode) {
        if (!isFile) {
          currentLevel = existingNode.children!;
        }
      } else {
        const newNode: TreeNode = {
          name: part,
          path: parts.slice(0, index + 1).join('/'),
          type: isFile ? 'file' : 'folder',
          children: isFile ? undefined : [],
          isOpen: true // Default open
        };
        currentLevel.push(newNode);
        if (!isFile) {
          currentLevel = newNode.children!;
        }
      }
    });
  });

  // Sort: Folders first, then files
  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'folder' ? -1 : 1;
    });
    nodes.forEach(node => {
      if (node.children) sortNodes(node.children);
    });
  };

  sortNodes(root);
  return root;
};

// Memoized File Tree Item
const FileTreeItem: React.FC<{ 
  node: TreeNode; 
  level: number; 
  activeFile: string; 
  onSelect: (path: string) => void;
  onToggle: (path: string) => void; 
  isDarkMode: boolean;
}> = React.memo(({ node, level, activeFile, onSelect, onToggle, isDarkMode }) => {
  const isSelected = activeFile === node.path;
  
  return (
    <div>
      <div
        className={`flex items-center gap-1.5 py-1.5 px-3 mx-1 cursor-pointer transition-colors text-sm rounded-md
          ${isSelected
            ? isDarkMode ? 'bg-blue-900/30 text-blue-300 font-medium' : 'bg-blue-50 text-blue-700 font-medium'
            : isDarkMode ? 'text-gray-400 hover:bg-[#2a2a2a] hover:text-gray-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => {
          if (node.type === 'folder') {
            onToggle(node.path);
          } else {
            onSelect(node.path);
          }
        }}
      >
        {node.type === 'folder' && (
          <span className="text-gray-400 shrink-0">
            {node.isOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </span>
        )}
        
        {node.type === 'folder' ? (
           node.isOpen ? <FolderOpen className="w-4 h-4 text-blue-400" /> : <Folder className="w-4 h-4 text-blue-400" />
        ) : (
           getFileIcon(node.name)
        )}
        
        <span className="truncate">{node.name}</span>
      </div>
      
      {node.type === 'folder' && node.isOpen && node.children?.map(child => (
        <FileTreeItem 
          key={child.path} 
          node={child} 
          level={level + 1} 
          activeFile={activeFile}
          onSelect={onSelect}
          onToggle={onToggle}
          isDarkMode={isDarkMode}
        />
      ))}
    </div>
  );
});

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ files, isDarkMode, projectType, onFilesChange, onDeploy, currentProjectSlug }) => {
  const isWebsite = !projectType || projectType === ProjectType.WEBSITE;
  const [device, setDevice] = useState<DeviceView>(
    projectType === ProjectType.MOBILE_APP ? DeviceView.MOBILE : DeviceView.DESKTOP
  );

  useEffect(() => {
    setDevice(projectType === ProjectType.MOBILE_APP ? DeviceView.MOBILE : DeviceView.DESKTOP);
  }, [projectType]);
  const [previewDarkMode, setPreviewDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.PREVIEW);
  const [activeFile, setActiveFile] = useState<string>(isWebsite ? 'index.html' : (files['README.md'] ? 'README.md' : Object.keys(files)[0]));
  const [currentPreviewPath, setCurrentPreviewPath] = useState<string>('index.html');
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [visualEditMode, setVisualEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState<SelectedElement | null>(null);
  const [editText, setEditText] = useState('');
  const [editClass, setEditClass] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Rebuild file tree when files change
  useEffect(() => {
    setFileTree(buildFileTree(Object.keys(files)));
    if (!files[activeFile]) {
      setActiveFile(
        isWebsite
          ? (files['index.html'] ? 'index.html' : Object.keys(files)[0])
          : (files['README.md'] ? 'README.md' : Object.keys(files)[0])
      );
    }
    if (!files[currentPreviewPath]) {
      setCurrentPreviewPath('index.html');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  // Handle Folder Toggling
  const toggleFolder = (path: string) => {
    const updateTree = (nodes: TreeNode[]): TreeNode[] => {
      return nodes.map(node => {
        if (node.path === path) {
          return { ...node, isOpen: !node.isOpen };
        }
        if (node.children) {
          return { ...node, children: updateTree(node.children) };
        }
        return node;
      });
    };
    setFileTree(prev => updateTree(prev));
  };

  // Visual edit mode — activate/deactivate inspector in iframe
  useEffect(() => {
    if (!iframeRef.current?.contentWindow) return;
    iframeRef.current.contentWindow.postMessage({ type: 'INSPECTOR_TOGGLE', active: visualEditMode }, '*');
    if (!visualEditMode) setSelectedElement(null);
  }, [visualEditMode]);

  const handleApplyPreview = useCallback(() => {
    if (!iframeRef.current?.contentWindow || !selectedElement) return;
    iframeRef.current.contentWindow.postMessage({
      type: 'APPLY_PREVIEW',
      textContent: selectedElement.textContent !== '' ? editText : undefined,
      className: editClass,
    }, '*');
  }, [selectedElement, editText, editClass]);

  const handleSaveToCode = useCallback(() => {
    if (!selectedElement || !onFilesChange) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = selectedElement.outerHTML;
    const el = wrapper.firstElementChild;
    if (!el) return;
    if (selectedElement.textContent !== '' && el.childNodes.length === 1 && el.childNodes[0].nodeType === Node.TEXT_NODE) {
      el.textContent = editText;
    }
    el.className = editClass;
    const newOuterHTML = el.outerHTML;
    const targetFilename = currentPreviewPath && files[currentPreviewPath]
      ? currentPreviewPath
      : (Object.keys(files).find(k => k.endsWith('.html')) ?? 'index.html');
    const fileEntry = files[targetFilename];
    if (!fileEntry) return;
    const updatedContent = fileEntry.content.replace(selectedElement.outerHTML, newOuterHTML);
    if (updatedContent === fileEntry.content) return;
    onFilesChange({ ...files, [targetFilename]: { ...fileEntry, content: updatedContent } });
    setSelectedElement(prev => prev ? { ...prev, outerHTML: newOuterHTML, className: editClass, textContent: editText } : null);
  }, [selectedElement, editText, editClass, files, currentPreviewPath, onFilesChange]);

  // Navigation Event Listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'ELEMENT_SELECTED') {
        const el = event.data as SelectedElement;
        setSelectedElement(el);
        setEditText(el.textContent);
        setEditClass(el.className);
        return;
      }
      if (event.data && event.data.type === 'NAVIGATE') {
        const targetPath = event.data.path;
        // Clean the path
        let normalizedPath = targetPath.replace(/^(\.\/|\/)/, '') || 'index.html';
        
        // Handle trailing slash
        if (normalizedPath.endsWith('/')) {
          normalizedPath += 'index.html';
        }

        // Try to find the file
        // 1. Exact match
        // 2. Add .html extension if missing
        let resolvedPath = normalizedPath;
        if (!files[resolvedPath] && !resolvedPath.includes('.')) {
          if (files[resolvedPath + '.html']) {
            resolvedPath += '.html';
          }
        }

        if (files[resolvedPath]) {
          setCurrentPreviewPath(resolvedPath);
          setActiveFile(resolvedPath); 
        } else {
           console.warn(`Internal Navigation: ${resolvedPath} not found in project files.`);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [files]);


  // Bundle files for preview
  useEffect(() => {
    const fileToShow = files[currentPreviewPath];

    if (viewMode === ViewMode.PREVIEW && iframeRef.current && fileToShow) {
      let html = fileToShow.content;
      
      // Inject CSS
      const cssFiles = Object.keys(files).filter(f => f.endsWith('.css'));
      cssFiles.forEach(cssFile => {
        const regex = new RegExp(`<link[^>]*href=["']\\.?\/?${escapeRegExp(cssFile)}["'][^>]*>`, 'gi');
        html = html.replace(regex, `<style>\n/* ${cssFile} */\n${files[cssFile].content}\n</style>`);
      });

      // Inject JS
      const jsFiles = Object.keys(files).filter(f => f.endsWith('.js') || f.endsWith('.jsx'));
      jsFiles.forEach(jsFile => {
        const regex = new RegExp(`<script([^>]*)src=["']\\.?\/?${escapeRegExp(jsFile)}["']([^>]*)>[\s\S]*?<\/script>`, 'gi');
        html = html.replace(regex, (match, attrs1, attrs2) => {
          return `<script${attrs1}${attrs2}>\n// ${jsFile}\n${files[jsFile].content}\n</script>`;
        });
      });

      // Inject Dark Mode
      if (previewDarkMode) {
        html = html.replace('</head>', `
          <style>
            html { filter: invert(1) hue-rotate(180deg); background-color: white; }
            img, video, iframe, picture { filter: invert(1) hue-rotate(180deg); }
          </style>
          </head>
        `);
      } else {
         html = html.replace('</head>', `<style>body { background-color: white; }</style></head>`);
      }

      // Interceptor script
      const injectedScripts = `
        <script>
          window.onerror = function(message, source, lineno, colno, error) {
            const errorContainer = document.createElement('div');
            errorContainer.style.position = 'fixed';
            errorContainer.style.bottom = '10px';
            errorContainer.style.left = '10px';
            errorContainer.style.right = '10px';
            errorContainer.style.backgroundColor = '#fee2e2';
            errorContainer.style.color = '#991b1b';
            errorContainer.style.padding = '12px';
            errorContainer.style.borderRadius = '8px';
            errorContainer.style.border = '1px solid #f87171';
            errorContainer.style.fontFamily = 'monospace';
            errorContainer.style.fontSize = '12px';
            errorContainer.style.zIndex = '9999';
            errorContainer.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
            errorContainer.innerHTML = '<strong>Runtime Error:</strong> ' + message;
            document.body.appendChild(errorContainer);
            return false;
          };

          document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            if (link) {
              const href = link.getAttribute('href');
              // Only intercept internal links (no http, no //, no tel:, no mailto:, no anchor-only)
              if (href && !href.match(/^(https?:|\\/\\/|tel:|mailto:|#)/)) {
                e.preventDefault();
                window.parent.postMessage({ type: 'NAVIGATE', path: href }, '*');
              }
            }
          });
        </script>
      `;
      html = html.replace('<head>', '<head>' + injectedScripts);
      // Inject inspector script (inactive by default, activated via postMessage)
      if (html.includes('</body>')) {
        html = html.replace('</body>', `<script>${INSPECTOR_SCRIPT}<\/script></body>`);
      } else {
        html += `<script>${INSPECTOR_SCRIPT}<\/script>`;
      }
      iframeRef.current.srcdoc = html;
    }
  }, [files, viewMode, previewDarkMode, refreshKey, currentPreviewPath]);

  // Fix: Explicitly cast Object.entries(files) to avoid type error where 'file' is inferred as unknown
  const handleDownload = async () => {
    const zip = new JSZip();
    (Object.entries(files) as [string, FileContent][]).forEach(([name, file]) => {
      zip.file(name, file.content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'project.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getContainerWidth = () => {
    switch (device) {
      case DeviceView.MOBILE: return 'max-w-[375px]';
      case DeviceView.TABLET: return 'max-w-[768px]';
      default: return 'max-w-full';
    }
  };

  if (isWebsite && !files['index.html']) {
    return (
      <div className={`h-full flex items-center justify-center flex-col gap-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <AlertTriangle className="w-12 h-12 text-yellow-500" />
        <p>No index.html found.</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full border-l transition-colors duration-300 ${isDarkMode ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-gray-200'}`}>
      <div className={`flex items-center justify-between px-4 py-3 border-b shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-gray-100'}`}>
        <div className={`flex p-1 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100/80'}`}>
          <button
            onClick={() => setViewMode(ViewMode.PREVIEW)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${
              viewMode === ViewMode.PREVIEW
                ? isDarkMode ? 'bg-[#3a3a3a] text-white shadow-sm font-medium' : 'bg-white text-gray-900 shadow-sm font-medium'
                : isDarkMode ? 'text-gray-500 hover:text-gray-300 opacity-60 hover:opacity-100' : 'text-gray-400 hover:text-gray-700 opacity-60 hover:opacity-100'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button
            onClick={() => setViewMode(ViewMode.CODE)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs transition-all ${
              viewMode === ViewMode.CODE
                ? isDarkMode ? 'bg-[#3a3a3a] text-white shadow-sm font-medium' : 'bg-white text-gray-900 shadow-sm font-medium'
                : isDarkMode ? 'text-gray-500 hover:text-gray-300 opacity-60 hover:opacity-100' : 'text-gray-400 hover:text-gray-700 opacity-60 hover:opacity-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Code
          </button>
        </div>

        {viewMode === ViewMode.PREVIEW && isWebsite && (
          <button
            onClick={() => setVisualEditMode(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              visualEditMode
                ? 'bg-blue-600 text-white'
                : isDarkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
            title="Visual Edit Mode"
          >
            <MousePointer2 className="w-3.5 h-3.5" />
            Visual
          </button>
        )}

        <div className="flex items-center gap-1">
          <div className={`w-px h-5 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />

          {viewMode === ViewMode.PREVIEW && isWebsite && (
            <button
              onClick={() => setRefreshKey(prev => prev + 1)}
              className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-400' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
              title="Refresh Preview"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}

          {isWebsite && (
            <button
              onClick={() => setPreviewDarkMode(prev => !prev)}
              className={`p-2 rounded-lg transition-all ${previewDarkMode ? 'bg-blue-600 text-yellow-300' : isDarkMode ? 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-400' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
              title={previewDarkMode ? "Preview: Light Mode" : "Preview: Dark Mode"}
            >
              {previewDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleDownload}
            className={`p-2 rounded-lg transition-all ${isDarkMode ? 'text-gray-400 hover:bg-blue-500/10 hover:text-blue-400' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
            title="Download Project (ZIP)"
          >
            <Download className="w-4 h-4" />
          </button>

          {isWebsite && onDeploy && (
            <button
              onClick={onDeploy}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                currentProjectSlug
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              title={currentProjectSlug ? 'Update deployed site' : 'Deploy site'}
            >
              <Rocket className="w-3.5 h-3.5" />
              {currentProjectSlug ? 'Update' : 'Deploy'}
            </button>
          )}

          {viewMode === ViewMode.PREVIEW && isWebsite && (
            <>
              <div className={`w-px h-5 mx-2 ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
              <div className={`flex items-center gap-0.5 rounded-lg p-1 ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
                <button
                  onClick={() => setDevice(DeviceView.DESKTOP)}
                  className={`p-1.5 rounded-md transition-all ${device === DeviceView.DESKTOP ? isDarkMode ? 'bg-[#3a3a3a] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                  title="Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDevice(DeviceView.TABLET)}
                  className={`p-1.5 rounded-md transition-all ${device === DeviceView.TABLET ? isDarkMode ? 'bg-[#3a3a3a] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                  title="Tablet"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDevice(DeviceView.MOBILE)}
                  className={`p-1.5 rounded-md transition-all ${device === DeviceView.MOBILE ? isDarkMode ? 'bg-[#3a3a3a] text-white shadow-sm' : 'bg-white text-gray-900 shadow-sm' : 'text-gray-400 hover:text-gray-200'}`}
                  title="Mobile"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className={`flex-1 relative overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
        {viewMode === ViewMode.PREVIEW && isWebsite && (
          <div className="absolute inset-0 flex flex-col items-center overflow-auto custom-scrollbar p-6">
            <div className={`transition-all duration-300 ease-in-out w-full h-full flex flex-col ${getContainerWidth()}`}>
              {device === DeviceView.DESKTOP && (
                <div className={`flex items-center shrink-0 px-3 h-9 rounded-t-lg border border-b-0 ${isDarkMode ? 'bg-[#2a2a2a] border-[#3a3a3a]' : 'bg-gray-100 border-gray-200'}`}>
                  {/* Traffic lights */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  {/* Fake URL pill */}
                  <div className="flex-1 flex justify-center">
                    <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded-md text-xs select-none ${isDarkMode ? 'bg-[#1e1e1e] text-gray-500' : 'bg-white text-gray-400 border border-gray-200'}`}>
                      <Globe className="w-3 h-3" />
                      <span>preview</span>
                    </div>
                  </div>
                  {/* Balance spacer */}
                  <div className="w-[54px]" />
                </div>
              )}
              <iframe
                key={refreshKey}
                ref={iframeRef}
                title="Website Preview"
                className={`w-full flex-1 bg-white ${
                  device !== DeviceView.DESKTOP
                    ? 'rounded-[2rem] border-[12px] border-gray-900 shadow-2xl'
                    : `border ${isDarkMode ? 'border-[#3a3a3a]' : 'border-gray-200'} rounded-b-lg shadow-sm`
                }`}
                sandbox="allow-scripts allow-modals allow-same-origin"
              />
            </div>
          </div>
        )}

        {/* Mobile App Preview (React Native via Expo Snack) */}
        {viewMode === ViewMode.PREVIEW && !isWebsite && (
          <div className={`absolute inset-0 overflow-auto flex items-center justify-center ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-gray-50'}`}>
            <MobilePreview files={files} isDarkMode={isDarkMode} />
          </div>
        )}

        {/* Visual Edit Panel */}
        {viewMode === ViewMode.PREVIEW && isWebsite && visualEditMode && selectedElement && (
          <div className={`absolute bottom-4 right-4 z-50 w-72 rounded-xl border shadow-2xl ${isDarkMode ? 'bg-gray-900 border-white/10 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`}>
            <div className={`flex items-center justify-between px-3.5 py-2.5 border-b ${isDarkMode ? 'border-white/[0.08]' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${isDarkMode ? 'bg-white/[0.08] text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                  {'<'}{selectedElement.tagName}{'>'}
                </span>
                {selectedElement.id && (
                  <span className="text-xs text-gray-500">#{selectedElement.id}</span>
                )}
              </div>
              <button onClick={() => setSelectedElement(null)} className={`p-0.5 rounded transition-colors ${isDarkMode ? 'hover:bg-white/8 text-gray-500' : 'hover:bg-gray-100 text-gray-400'}`}>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="px-3.5 py-3 flex flex-col gap-3">
              {selectedElement.textContent !== '' && (
                <div>
                  <label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Text content</label>
                  <textarea
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    rows={2}
                    className={`w-full text-sm rounded-lg px-3 py-2 resize-none focus:outline-none border ${isDarkMode ? 'bg-white/[0.06] border-white/[0.08] text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                  />
                </div>
              )}
              <div>
                <label className={`text-xs mb-1 block ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Classes</label>
                <textarea
                  value={editClass}
                  onChange={e => setEditClass(e.target.value)}
                  rows={2}
                  className={`w-full text-sm font-mono rounded-lg px-3 py-2 resize-none focus:outline-none border ${isDarkMode ? 'bg-white/[0.06] border-white/[0.08] text-gray-200' : 'bg-gray-50 border-gray-200 text-gray-800'}`}
                />
              </div>
              <div className="flex gap-2 pt-0.5">
                <button
                  onClick={handleApplyPreview}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isDarkMode ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                >
                  Apply preview
                </button>
                <button
                  onClick={handleSaveToCode}
                  className="flex-1 py-1.5 rounded-lg text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Save to code
                </button>
              </div>
            </div>
          </div>
        )}


        {viewMode === ViewMode.CODE && (
          <div className="absolute inset-0 flex">
            <div className={`w-48 md:w-56 border-r flex flex-col shrink-0 overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-[#1e1e1e] border-[#333]' : 'bg-white border-gray-200'}`}>
              <div className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b shrink-0 ${isDarkMode ? 'text-gray-400 border-[#333]' : 'text-gray-500 border-gray-50'}`}>
                <Box className="w-3.5 h-3.5" />
                Explorer
              </div>
              <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
                {fileTree.map(node => (
                  <FileTreeItem 
                    key={node.path} 
                    node={node} 
                    level={0} 
                    activeFile={activeFile}
                    onSelect={setActiveFile}
                    onToggle={toggleFolder}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 relative flex flex-col h-full overflow-hidden">
               <div className={`h-9 border-b flex items-center px-4 gap-2 text-sm transition-colors duration-300 ${isDarkMode ? 'bg-[#1e1e1e] border-[#333] text-gray-400' : 'bg-white border-gray-100 text-gray-500'}`}>
                  {getFileIcon(activeFile)}
                  <span>{activeFile}</span>
               </div>
               <div className="flex-1 relative">
                  <Suspense fallback={
                    <div className={`w-full h-full flex items-center justify-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Loading editor...
                    </div>
                  }>
                    <Editor
                      height="100%"
                      language={files[activeFile]?.language || 'plaintext'}
                      value={files[activeFile]?.content || ''}
                      theme={isDarkMode ? "vs-dark" : "light"}
                      options={MONACO_OPTIONS}
                    />
                  </Suspense>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};