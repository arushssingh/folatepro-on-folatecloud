import { FileSet } from '../types';

/** Strips import/export declarations so the code can run as a plain script in the same scope */
function processCode(code: string): string {
  return code
    // Remove all import statements (single-line and multi-line)
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?\s*$/gm, '')
    // Remove bare side-effect imports: import 'foo';
    .replace(/^import\s+['"][^'"]+['"];?\s*$/gm, '')
    // Remove "export default" → keep the declaration
    .replace(/^export\s+default\s+/gm, '')
    // Remove "export const/function/class/type/interface/enum" → keep the declaration
    .replace(/^export\s+(const|function|class|type|interface|enum)\s+/gm, '$1 ');
}

export function buildPreviewHtml(files: FileSet): string {
  const entries = Object.entries(files);

  // Sort: App.tsx last (entry point, must come after all helper/screen files)
  const sorted = [
    ...entries.filter(([name]) => name !== 'App.tsx'),
    ...entries.filter(([name]) => name === 'App.tsx'),
  ].filter(([name]) => /\.[tj]sx?$/.test(name));

  // Fallback: if no App.tsx in files, just take first available
  if (sorted.length === 0) {
    const fallback = Object.values(files)[0]?.content ?? '';
    sorted.push(['App.tsx', { content: fallback, language: 'typescript' }]);
  }

  const combinedCode = sorted
    .map(([, file]) => processCode(file.content))
    .join('\n\n');

  // Escape </script> to prevent the text/plain block from closing early
  const escaped = combinedCode.replace(/<\/script>/gi, '<\\/script>');

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    html,body{height:100%;background:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;-webkit-font-smoothing:antialiased;}
    #root{height:100%;display:flex;flex-direction:column;}
    ::-webkit-scrollbar{width:0;height:0;}
    input,textarea{font-family:inherit;}
    img{display:block;}
  </style>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js" crossorigin></script>
</head>
<body>
<div id="root"></div>
<script>
// ── React globals ──────────────────────────────────────────────────
window.React = React;
window.ReactDOM = ReactDOM;

// Expose React named exports as globals so import-stripped code can use them directly
const { useState, useEffect, useCallback, useRef, useMemo, useContext,
        createContext, useReducer, useLayoutEffect, useId, useTransition,
        Fragment, Children, cloneElement, isValidElement, createRef } = React;
const forwardRef = React.forwardRef;
const memo = React.memo;

// ── Style helpers ──────────────────────────────────────────────────
function flatStyle(s) {
  if (!s) return {};
  if (Array.isArray(s)) return Object.assign({}, ...s.map(flatStyle));
  return s;
}
function mergeStyle(base, extra) {
  return Object.assign({}, flatStyle(base), flatStyle(extra));
}

// ── React Native component mocks ───────────────────────────────────
const View = React.forwardRef(function View({ style, children, onLayout, pointerEvents, ...p }, ref) {
  return React.createElement('div', {
    ref,
    style: mergeStyle({ display: 'flex', flexDirection: 'column', position: 'relative' }, style),
    ...p
  }, children);
});

const Text = function Text({ style, children, numberOfLines, onPress, selectable, ...p }) {
  const s = mergeStyle({ fontFamily: 'inherit', fontSize: 14, color: '#000' }, style);
  if (numberOfLines) {
    s.overflow = 'hidden';
    s.display = '-webkit-box';
    s.WebkitLineClamp = numberOfLines;
    s.WebkitBoxOrient = 'vertical';
  }
  return React.createElement('span', { style: s, onClick: onPress, ...p }, children);
};

const TouchableOpacity = function TouchableOpacity({ style, onPress, children, activeOpacity = 0.7, disabled, ...p }) {
  const [pressed, setPressed] = React.useState(false);
  return React.createElement('div', {
    onClick: disabled ? undefined : onPress,
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false),
    onMouseLeave: () => setPressed(false),
    style: mergeStyle({
      cursor: disabled ? 'default' : 'pointer',
      userSelect: 'none',
      display: 'flex',
      flexDirection: 'column',
      opacity: pressed ? activeOpacity : 1,
      transition: 'opacity 0.1s',
    }, style),
    ...p
  }, children);
};

const TouchableHighlight = TouchableOpacity;
const Pressable = TouchableOpacity;

const ScrollView = function ScrollView({ style, contentContainerStyle, children, horizontal, showsVerticalScrollIndicator, showsHorizontalScrollIndicator, keyboardShouldPersistTaps, ...p }) {
  return React.createElement('div', {
    style: mergeStyle({
      overflow: 'auto',
      display: 'flex',
      flexDirection: horizontal ? 'row' : 'column',
      WebkitOverflowScrolling: 'touch',
    }, style),
    ...p
  },
    React.createElement('div', {
      style: mergeStyle({
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        flexShrink: 0,
      }, contentContainerStyle)
    }, children)
  );
};

const FlatList = function FlatList({ data, renderItem, keyExtractor, style, contentContainerStyle, horizontal, ListHeaderComponent, ListFooterComponent, ListEmptyComponent, ItemSeparatorComponent, numColumns, ...p }) {
  const items = (data || []).map((item, index) => {
    const rendered = renderItem({ item, index });
    const key = keyExtractor ? keyExtractor(item, index) : String(index);
    return React.createElement(React.Fragment, { key }, rendered,
      ItemSeparatorComponent && index < data.length - 1 ? React.createElement(ItemSeparatorComponent) : null
    );
  });
  const isEmpty = !data || data.length === 0;
  return React.createElement(ScrollView, { style, contentContainerStyle, horizontal, ...p },
    ListHeaderComponent ? (typeof ListHeaderComponent === 'function' ? React.createElement(ListHeaderComponent) : ListHeaderComponent) : null,
    isEmpty && ListEmptyComponent ? (typeof ListEmptyComponent === 'function' ? React.createElement(ListEmptyComponent) : ListEmptyComponent) : items,
    ListFooterComponent ? (typeof ListFooterComponent === 'function' ? React.createElement(ListFooterComponent) : ListFooterComponent) : null,
  );
};

const SectionList = function SectionList({ sections, renderItem, renderSectionHeader, keyExtractor, style, contentContainerStyle, ...p }) {
  const children = (sections || []).flatMap((section, si) => {
    const header = renderSectionHeader ? renderSectionHeader({ section }) : null;
    const items = (section.data || []).map((item, ii) => {
      const key = keyExtractor ? keyExtractor(item, ii) : String(si) + '-' + String(ii);
      return React.createElement(React.Fragment, { key }, renderItem({ item, section, index: ii }));
    });
    return header ? [header, ...items] : items;
  });
  return React.createElement(ScrollView, { style, contentContainerStyle, ...p }, ...children);
};

const SafeAreaView = function SafeAreaView({ style, children, ...p }) {
  return React.createElement('div', {
    style: mergeStyle({ display: 'flex', flexDirection: 'column', flex: 1 }, style),
    ...p
  }, children);
};

const TextInput = function TextInput({ style, onChangeText, onChange, value, defaultValue, placeholder, placeholderTextColor, multiline, numberOfLines, secureTextEntry, keyboardType, returnKeyType, onSubmitEditing, editable, ...p }) {
  const tag = multiline ? 'textarea' : 'input';
  return React.createElement(tag, {
    value,
    defaultValue,
    placeholder,
    disabled: editable === false,
    type: secureTextEntry ? 'password' : keyboardType === 'email-address' ? 'email' : keyboardType === 'numeric' ? 'number' : 'text',
    onChange: e => { onChange?.(e); onChangeText?.(e.target.value); },
    onKeyDown: e => e.key === 'Enter' && !multiline && onSubmitEditing?.(),
    rows: multiline ? (numberOfLines || 3) : undefined,
    style: mergeStyle({
      fontFamily: 'inherit',
      fontSize: 14,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      resize: 'none',
      color: '#000',
    }, style),
    ...p
  });
};

const Image = function Image({ source, style, resizeMode = 'cover', ...p }) {
  const src = typeof source === 'string' ? source : source?.uri ?? source?.default;
  return React.createElement('img', {
    src,
    style: mergeStyle({ objectFit: resizeMode === 'contain' ? 'contain' : resizeMode === 'stretch' ? 'fill' : 'cover' }, style),
    alt: '',
    ...p
  });
};

const ActivityIndicator = function ActivityIndicator({ color = '#007AFF', size = 'small' }) {
  const sz = size === 'large' ? 36 : 20;
  return React.createElement('div', {
    style: { width: sz, height: sz, borderRadius: '50%', border: \`3px solid \${color}33\`, borderTopColor: color, animation: 'rnSpin 0.8s linear infinite' }
  });
};

const Modal = function Modal({ visible, children, transparent, animationType, onRequestClose, ...p }) {
  if (!visible) return null;
  return React.createElement('div', {
    style: { position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: transparent ? 'transparent' : '#fff' },
    ...p
  }, children);
};

const Switch = function Switch({ value, onValueChange, trackColor, thumbColor }) {
  return React.createElement('input', { type: 'checkbox', checked: !!value, onChange: e => onValueChange?.(e.target.checked), style: { cursor: 'pointer' } });
};

const RefreshControl = function RefreshControl() { return null; };
const KeyboardAvoidingView = View;
const StatusBar = function() { return null; };
const Platform = { OS: 'ios', select: obj => obj.ios ?? obj.default ?? obj.android };
const Dimensions = { get: dim => ({ width: 390, height: 844, scale: 1, fontScale: 1 }) };
const StyleSheet = { create: s => s, flatten: flatStyle, hairlineWidth: 1 };
const Animated = {
  View, Text, ScrollView, Image,
  Value: class { constructor(v) { this._v = v; } setValue(v) { this._v = v; } interpolate() { return this._v; } addListener() {} removeAllListeners() {} },
  timing: () => ({ start: cb => cb?.() }),
  spring: () => ({ start: cb => cb?.() }),
  parallel: (a) => ({ start: cb => { a.forEach(x => x.start()); cb?.(); } }),
  sequence: (a) => ({ start: cb => { a.forEach(x => x.start()); cb?.(); } }),
  loop: () => ({ start: cb => cb?.(), stop: () => {} }),
};
const LayoutAnimation = { configureNext: () => {}, Presets: {} };
const Keyboard = { dismiss: () => {}, addListener: () => ({ remove: () => {} }) };
const Alert = { alert: (t, m) => window.alert(m ? t + '\\n' + m : t) };
const Linking = { openURL: url => window.open(url, '_blank') };
const Haptics = { impactAsync: () => {}, selectionAsync: () => {} };
const AsyncStorage = { getItem: () => Promise.resolve(null), setItem: () => Promise.resolve(), removeItem: () => Promise.resolve() };
const useWindowDimensions = () => ({ width: 390, height: 844 });

// Spinner keyframe
const _spinStyle = document.createElement('style');
_spinStyle.textContent = '@keyframes rnSpin { to { transform: rotate(360deg); } }';
document.head.appendChild(_spinStyle);
</script>

<script id="_src" type="text/plain">${escaped}</script>
<script>
(function() {
  var src = document.getElementById('_src').textContent;
  try {
    var out = Babel.transform(src, {
      presets: [
        ['react', {}],
        ['typescript', { allExtensions: true, isTSX: true }]
      ],
      filename: 'App.tsx'
    }).code;
    var s = document.createElement('script');
    s.textContent = out + '\\n// Mount\\nvar _rootEl = document.getElementById("root");\\nvar _root = ReactDOM.createRoot(_rootEl);\\n_root.render(React.createElement(App));';
    document.body.appendChild(s);
  } catch(e) {
    document.getElementById('root').innerHTML =
      '<div style="color:#e53e3e;padding:20px;font-family:monospace;white-space:pre-wrap;font-size:12px">' +
      '<b>Compile error:</b>\\n' + e.message.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</div>';
  }
})();
</script>
</body>
</html>`;
}
