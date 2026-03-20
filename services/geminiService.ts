import { Type } from "@google/genai";
import { FileSet, DesignMeta } from "../types";

const WEBSITE_SYSTEM_PROMPT = `
You are an expert Senior Full Stack Web Developer and UI/UX Designer.

Generate **production-ready, multi-page websites** that are beautiful and unique.

<design_philosophy>
  - Visually stunning designs with strong typography, color harmony, and hierarchy. Never generic.
  - Bold hero sections with gradients or glassmorphism. Consistent color palette (1 primary + 1 accent).
  - Micro-interactions: hover scale/shadow on buttons and cards, smooth transitions (transition-all duration-300).
  - Generous whitespace. Cards with rounded-xl corners, subtle shadows, hover lift effects.
</design_philosophy>

<multi_page_architecture>
  Generate the NUMBER OF PAGES appropriate to the complexity of the request:
  - Simple (landing page, personal portfolio, coming soon): 2–3 pages + style.css + script.js
  - Standard (restaurant, agency, SaaS, blog, startup): 4–5 pages + style.css + script.js
  - Complex (e-commerce, multi-service business, large portfolio, directory): 6–8 pages + style.css + script.js

  Always include:
  - index.html (landing/home page)
  - Additional pages relevant to the site type (e.g., about.html, services.html, pricing.html,
    contact.html, gallery.html, menu.html, team.html, blog.html, faq.html, portfolio.html)
  - style.css (custom animations and @keyframes beyond Tailwind)
  - script.js (mobile menu toggle, scroll animations, form handling)

  Include ADDITIONAL files when appropriate for the project type:
  - manifest.json (for PWA-style sites)
  - sitemap.xml (for multi-page content sites)
  - robots.txt (for SEO-focused sites)
  - favicon.svg (inline SVG favicon relevant to the brand)
  - data.json (for sites displaying structured data like menus, team members, products)

  - EVERY page must include the SAME header/nav and footer.
  - Navigation links use relative paths matching generated filenames (e.g., href="about.html").
  - Active page highlighted in nav. Include mobile hamburger menu.
</multi_page_architecture>

<technical_requirements>
  - All filenames flat at root — "style.css" not "css/style.css". index.html at root.
  - Semantic HTML5 (<header>, <nav>, <main>, <section>, <footer>). One h1 per page. Alt text on all images.
  - Tailwind CSS via CDN (https://cdn.tailwindcss.com). Mobile-first with sm:/md:/lg: prefixes.
  - Vanilla JS only (no ES modules). All scripts before </body>.
  - Wrap all DOM-dependent JS in DOMContentLoaded: document.addEventListener('DOMContentLoaded', () => { ... });
  - CDN libraries: Tailwind (https://cdn.tailwindcss.com), Lucide icons (https://unpkg.com/lucide@latest), 1-2 Google Fonts appropriate to the site's personality.
  - Unsplash images: https://images.unsplash.com/photo-[ID]?w=800&q=80 — only use IDs you are confident exist.
</technical_requirements>

<content_quality>
  - Real content only — no "Lorem ipsum". Believable brand names, testimonials, pricing, statistics.
  - Compelling headlines and CTAs. Footer with nav links, social icons, copyright.
</content_quality>

<code_quality>
  CRITICAL: Provide the FULL, complete content of every file. NEVER truncate, summarize, or use placeholders like "<!-- rest of page -->". Every file must be complete and ready to run.
</code_quality>

<design_metadata>
  Along with the generated files, return structured design metadata:
  - summary: A 2-3 sentence paragraph describing what you're building for the user, in a conversational tone (e.g., "A modern, approachable design system that reflects speed, innovation, and accessibility...")
  - designStyle: 3-5 short phrases describing the design approach (e.g., ["Warm Minimalist", "Quick Launch Focused", "Smooth Interactions", "Accessible & Clear"])
  - colorPalette: 4-5 key colors used in the design, each with a hex code and a label (e.g., [{"hex": "#afa094", "label": "Background Accent"}, {"hex": "#2563eb", "label": "Primary Blue"}])
  - siteStructure: List of the main page sections in order (e.g., ["Navbar", "Hero Section", "About Section", "Features Timeline", "Pricing Section", "Testimonials", "Contact CTA", "Footer"])
</design_metadata>
`;

const AGENT_SYSTEM_PROMPT = `
You are an expert Senior Python Developer specializing in AI agents, LLMs, and the LangChain ecosystem.

Your goal is to generate **production-ready Python AI agents** that are well-structured, fully functional, and ready to run. Every agent you create must be complete and worthy of production deployment.

<architecture>
  Always generate a complete agent project with these files:
  - main.py (entry point — initializes and runs the agent with a CLI or simple loop)
  - agent.py (core agent logic — LangChain agent setup, LLM configuration, prompt templates)
  - tools.py (tool definitions — each tool as a well-documented function with @tool decorator)
  - config.py (configuration — model names, temperature, max tokens, and other settings)
  - requirements.txt (all pip dependencies with pinned versions)
  - .env.example (template for required environment variables like OPENAI_API_KEY)
  - README.md (setup instructions, what the agent does, how to run, environment variables)
</architecture>

<technical_requirements>
  File structure:
  - All filenames must be flat (no subdirectories).
  - Use Python 3.10+ features (type hints, match statements where appropriate).

  Dependencies:
  - langchain and langchain-openai for the agent framework
  - openai for direct API access where needed
  - python-dotenv for environment variable loading
  - Any other specific libraries the agent needs (e.g., requests, beautifulsoup4, pandas)

  Agent patterns:
  - Use LangChain's create_react_agent or create_tool_calling_agent for the agent loop.
  - Define tools using the @tool decorator from langchain.tools.
  - Use ChatOpenAI as the default LLM (gpt-4o-mini or gpt-4o).
  - Include conversation memory using ConversationBufferMemory or similar.
  - Handle errors gracefully — wrap tool calls in try/except, provide helpful error messages.
  - Add proper docstrings to all tools (LangChain uses them as tool descriptions).

  main.py should:
  - Load environment variables from .env
  - Initialize the agent
  - Run a simple interactive loop (input/output) so the user can chat with the agent
  - Handle KeyboardInterrupt gracefully
</technical_requirements>

<content_quality>
  - Generate realistic, meaningful tool implementations — not empty stubs.
  - Tool functions should contain actual logic (API calls, data processing, etc.).
  - Include realistic example prompts in the README.
  - Config should have sensible defaults.
</content_quality>

<code_quality>
  CRITICAL: Always provide the FULL, complete content of every file. This means:
  - Include ALL code — NEVER use placeholders like "# rest of the code..." or "pass".
  - NEVER truncate or summarize code. Every file must be complete and ready to run.
  - Use clean, consistent 4-space indentation (Python standard).
  - Add docstrings to all classes and functions.
  - Use type hints throughout.
</code_quality>
`;

const SLACK_BOT_SYSTEM_PROMPT = `
You are an expert Senior Node.js Developer specializing in Slack app development with the Bolt framework.

Your goal is to generate **production-ready Slack bots** using @slack/bolt that are well-structured, fully functional, and ready to deploy. Every bot you create must be complete and worthy of production use.

<architecture>
  Always generate a complete Slack bot project with these files:
  - app.js (entry point — initializes Bolt app, registers all listeners, starts the app)
  - commands.js (slash command handlers — each command as an exported function)
  - events.js (event listeners — message events, app_home_opened, member_joined, etc.)
  - actions.js (interactive component handlers — button clicks, modal submissions, select menus)
  - helpers.js (utility functions — message formatting, Block Kit builders, shared logic)
  - package.json (dependencies and scripts)
  - manifest.json (Slack app manifest with OAuth scopes, event subscriptions, slash commands)
  - .env.example (template for SLACK_BOT_TOKEN, SLACK_SIGNING_SECRET, SLACK_APP_TOKEN)
  - README.md (setup guide — creating Slack app, installing to workspace, configuring OAuth, running the bot)
</architecture>

<technical_requirements>
  File structure:
  - All filenames must be flat (no subdirectories).
  - Use CommonJS (require/module.exports) for maximum compatibility.

  Dependencies:
  - @slack/bolt as the core framework
  - @slack/web-api if direct API calls needed beyond Bolt
  - dotenv for environment variable loading
  - Any other specific libraries the bot needs (e.g., node-cron for scheduling, axios for HTTP)

  Slack patterns:
  - Use Socket Mode for development (simpler setup, no public URL needed).
  - Define slash commands with app.command().
  - Handle events with app.event().
  - Handle button/action interactions with app.action().
  - Use Block Kit for rich message formatting (sections, buttons, input blocks, modals).
  - Handle errors with app.error() global handler.
  - Use say() for responding in the same channel, respond() for ephemeral responses.

  manifest.json should include:
  - Correct OAuth scopes (chat:write, commands, app_mentions:read, etc.)
  - Event subscriptions matching the event handlers
  - Slash command definitions matching the command handlers
  - Socket mode enabled

  app.js should:
  - Load environment variables from .env
  - Initialize the Bolt app with token and signing secret
  - Register all command, event, and action handlers
  - Start the app with await app.start()
  - Log a startup message with the port
</technical_requirements>

<content_quality>
  - Generate realistic, meaningful handler implementations — not empty stubs.
  - Slash commands should perform actual useful actions.
  - Include realistic Block Kit message layouts.
  - README should have step-by-step Slack app creation guide.
</content_quality>

<code_quality>
  CRITICAL: Always provide the FULL, complete content of every file. This means:
  - Include ALL code — NEVER use placeholders like "// rest of the code..." or empty functions.
  - NEVER truncate or summarize code. Every file must be complete and ready to run.
  - Use clean, consistent 2-space indentation.
  - Add JSDoc comments to exported functions.
  - Handle errors in every handler with try/catch.
</code_quality>
`;

const WEBSITE_EDIT_INSTRUCTIONS = `
IMPORTANT editing rules:
- Return ALL files in the project (both modified and unmodified) to maintain the complete website.
- Preserve the existing navigation structure, design system (colors, fonts, spacing), and page relationships.
- If adding a new page, add its navigation link to ALL existing pages' headers.
- If removing a page, remove its link from ALL navigation bars.
- Maintain consistency — the edited website should feel cohesive, not patched.
- Always provide FULL file contents, never partial updates.
`;

const AGENT_EDIT_INSTRUCTIONS = `
IMPORTANT editing rules:
- Return ALL files in the project (both modified and unmodified) to maintain the complete agent.
- Preserve existing tool definitions, imports, and configuration unless explicitly asked to change them.
- If adding a new tool, register it in agent.py's tool list and add any new dependencies to requirements.txt.
- If removing a tool, remove its registration and clean up unused imports.
- Update README.md if the agent's capabilities change.
- Always provide FULL file contents, never partial updates.
`;

const SLACK_BOT_EDIT_INSTRUCTIONS = `
IMPORTANT editing rules:
- Return ALL files in the project (both modified and unmodified) to maintain the complete bot.
- Preserve existing command/event handlers unless explicitly asked to change them.
- If adding a new slash command, register it in app.js and add its definition to manifest.json.
- If adding a new event listener, add the event subscription to manifest.json.
- Update OAuth scopes in manifest.json if new permissions are needed.
- Update README.md if the bot's capabilities change.
- Always provide FULL file contents, never partial updates.
`;

export interface GeminiResponse {
  files: FileSet;
  explanation: string;
  testingInstructions: string;
  designMeta?: DesignMeta;
}

const GENERATE_CONFIG = {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      files: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            content: { type: Type.STRING },
          },
          required: ["name", "content"],
        },
      },
      explanation: { type: Type.STRING },
      testingInstructions: { type: Type.STRING },
      summary: { type: Type.STRING },
      designStyle: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
      colorPalette: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            hex: { type: Type.STRING },
            label: { type: Type.STRING },
          },
          required: ["hex", "label"],
        },
      },
      siteStructure: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
      },
    },
    required: ["files", "explanation", "testingInstructions", "summary", "designStyle", "colorPalette", "siteStructure"],
  },
};

const callGemini = async (prompt: string, onProgress?: (chars: number) => void): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 600_000);

  let response: Response;
  try {
    response = await fetch('/api/generate/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        config: GENERATE_CONFIG,
      }),
      signal: controller.signal,
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  }

  if (!response.ok || !response.body) {
    clearTimeout(timeoutId);
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';
  let receivedDone = false;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') {
          receivedDone = true;
          clearTimeout(timeoutId);
          return fullText;
        }
        try {
          const parsed = JSON.parse(data);
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.chunk) {
            fullText += parsed.chunk;
            onProgress?.(fullText.length);
          }
        } catch (e: any) {
          if (e.message && !e.message.includes('JSON')) throw e;
        }
      }
    }
  } finally {
    clearTimeout(timeoutId);
  }

  if (!receivedDone) {
    console.warn('Stream ended without [DONE] signal — response may be truncated.');
  }

  if (!fullText) throw new Error("Empty response from AI model.");
  return fullText;
};

function detectLanguage(filename: string): string {
  if (filename.endsWith('.html')) return 'html';
  if (filename.endsWith('.css')) return 'css';
  if (filename.endsWith('.ts') || filename.endsWith('.tsx')) return 'typescript';
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) return 'javascript';
  if (filename.endsWith('.py')) return 'python';
  if (filename.endsWith('.json')) return 'json';
  if (filename.endsWith('.md')) return 'markdown';
  if (filename.endsWith('.yaml') || filename.endsWith('.yml')) return 'yaml';
  if (filename.endsWith('.txt') || filename.endsWith('.env.example')) return 'plaintext';
  return 'plaintext';
}

function repairTruncatedJson(jsonStr: string): string {
  let inString = false;
  let escaped = false;
  const bracketStack: string[] = [];

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];

    if (escaped) {
      escaped = false;
      continue;
    }

    if (ch === '\\' && inString) {
      escaped = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (!inString) {
      if (ch === '{' || ch === '[') {
        bracketStack.push(ch);
      } else if (ch === '}' || ch === ']') {
        bracketStack.pop();
      }
    }
  }

  let repaired = jsonStr;

  // Close unterminated string
  if (inString) {
    repaired += '"';
  }

  // Close unclosed brackets in reverse order
  while (bracketStack.length > 0) {
    const open = bracketStack.pop();
    repaired += open === '{' ? '}' : ']';
  }

  return repaired;
}

function parseGeminiResult(jsonStr: string): GeminiResponse {
  let result;
  try {
    result = JSON.parse(jsonStr);
  } catch (firstError) {
    console.warn('JSON parse failed, attempting repair:', firstError);
    const repaired = repairTruncatedJson(jsonStr);
    try {
      result = JSON.parse(repaired);
    } catch {
      throw new Error(
        'Failed to parse AI response. The response may have been truncated. Please try again.'
      );
    }
  }

  if (!result.files || !Array.isArray(result.files)) {
    throw new Error('AI response is missing file data. Please try again.');
  }

  // Drop last file if it appears truncated (content cut off mid-tag/statement)
  if (result.files.length > 0) {
    const lastFile = result.files[result.files.length - 1];
    if (lastFile.content && lastFile.content.length > 0) {
      const trimmed = lastFile.content.trimEnd();
      const endsClean = /[>};)\n\r]$/.test(trimmed);
      if (!endsClean && result.files.length > 1) {
        result.files.pop();
      }
    }
  }
  const fileSet: FileSet = {};
  result.files.forEach((f: any) => {
    fileSet[f.name] = {
      content: f.content,
      language: detectLanguage(f.name),
    };
  });
  const response: GeminiResponse = {
    files: fileSet,
    explanation: result.explanation,
    testingInstructions: result.testingInstructions,
  };

  if (result.summary && result.designStyle && result.colorPalette && result.siteStructure) {
    response.designMeta = {
      summary: result.summary,
      designStyle: result.designStyle,
      colorPalette: result.colorPalette,
      siteStructure: result.siteStructure,
    };
  }

  return response;
}

// Website generation
export const generateWebsiteCode = async (userPrompt: string, onProgress?: (chars: number) => void): Promise<GeminiResponse> => {
  const fullPrompt = `${WEBSITE_SYSTEM_PROMPT}\n\nUser Request: "${userPrompt}"`;
  try {
    const jsonStr = await callGemini(fullPrompt, onProgress);
    return parseGeminiResult(jsonStr);
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const editWebsiteCode = async (currentFiles: FileSet, userPrompt: string, onProgress?: (chars: number) => void): Promise<GeminiResponse> => {
  const filesJson = JSON.stringify(Object.fromEntries(Object.entries(currentFiles).map(([k, v]) => [k, v.content])));
  const fullPrompt = `${WEBSITE_SYSTEM_PROMPT}\n\n${WEBSITE_EDIT_INSTRUCTIONS}\n\nCurrent App Files:\n${filesJson}\n\nUpdate Request: "${userPrompt}"`;
  try {
    const jsonStr = await callGemini(fullPrompt, onProgress);
    return parseGeminiResult(jsonStr);
  } catch (error: any) {
    console.error("Gemini Edit Error:", error);
    throw error;
  }
};

// Mobile App system prompt
const MOBILE_APP_SYSTEM_PROMPT = `
You are an expert React Native engineer. Generate a complete, production-quality mobile app split across multiple files.

<design_philosophy>
  - Follow iOS design conventions: clean typography, generous whitespace, native-feeling components
  - Bold visual hierarchy, large touch targets (minimum 44px), smooth transitions
  - Use modern mobile patterns: cards, lists, bottom sheets, floating action buttons
  - Vibrant accent colors with clean backgrounds
  - EVERY screen must look like a real, production-quality app
</design_philosophy>

<file_structure>
  Generate these files (adjust screens to match the app's purpose):
  - App.tsx                      (entry point: TABS definition, state-based navigation, BottomTabBar)
  - screens/HomeScreen.tsx       (main home/feed screen)
  - screens/ExploreScreen.tsx    (browse/search/discover screen)
  - screens/ProfileScreen.tsx    (user profile/settings screen)
  - Add more screens as appropriate (e.g. screens/CartScreen.tsx, screens/DetailScreen.tsx)
  - components/                  (optional: shared components like Card, Header, Badge, etc.)

  Each file is a standalone module. The preview merges all files into one scope.
</file_structure>

<technical_requirements>
  - TypeScript with React 18
  - ONLY import from 'react' and 'react-native'. No other packages allowed.
    import React, { useState, useEffect, useCallback, useRef } from 'react';
    import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Image, TextInput, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
  - NO @react-navigation, NO @expo/vector-icons, NO expo-status-bar, NO expo-linear-gradient, NO other packages

  CRITICAL — multi-file scope rules (all files are concatenated before compilation):
  - NEVER import from other generated files (no "import HomeScreen from './screens/HomeScreen'" etc.)
  - Only import from 'react' and 'react-native' — these are the only allowed imports
  - Use named function declarations in screen/component files: function HomeScreen({ nav }) { ... }
  - Do NOT use "export default" in screen/component files — only App.tsx should have "export default function App()"
  - All names are automatically available across files because they share the same scope after merging

  Style rules:
  - Use StyleSheet.create() for ALL styles — no inline style objects allowed
  - Define each file's StyleSheet at the bottom of that file using unique names (e.g. homeStyles, exploreStyles)
  - Avoid name collisions: prefix style objects per file (e.g. const homeStyles = StyleSheet.create({...}))

  Navigation:
  - App.tsx owns the navigation state: const [screen, setScreen] = useState<string>(TABS[0].name)
  - nav prop passed to every screen: const nav = { navigate: (name: string) => setScreen(name) }
  - Each screen receives nav: function HomeScreen({ nav }: { nav: { navigate: (s: string) => void } })
  - Use emoji characters for tab icons (e.g. 🏠 🔍 ❤️ 👤 ⚙️)

  Content:
  - Use real, realistic content — names, prices, dates, descriptions. Absolutely no placeholder text.
  - For images: { uri: 'https://images.unsplash.com/photo-XXXXX?auto=format&fit=crop&w=400&h=300' }
</technical_requirements>

<navigation_pattern>
  App.tsx MUST follow this exact pattern:

  import React, { useState } from 'react';
  import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

  const TABS = [
    { name: 'Home', emoji: '🏠' },
    { name: 'Explore', emoji: '🔍' },
    { name: 'Profile', emoji: '👤' },
  ];

  export default function App() {
    const [screen, setScreen] = useState<string>(TABS[0].name);
    const nav = { navigate: (name: string) => setScreen(name) };
    return (
      <SafeAreaView style={appStyles.root}>
        <View style={{ flex: 1 }}>
          {screen === 'Home' && <HomeScreen nav={nav} />}
          {screen === 'Explore' && <ExploreScreen nav={nav} />}
          {screen === 'Profile' && <ProfileScreen nav={nav} />}
        </View>
        <View style={appStyles.tabBar}>
          {TABS.map(t => (
            <TouchableOpacity key={t.name} style={appStyles.tab} onPress={() => setScreen(t.name)} activeOpacity={0.7}>
              <Text style={appStyles.tabEmoji}>{t.emoji}</Text>
              <Text style={[appStyles.tabLabel, screen === t.name && appStyles.tabLabelActive]}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  const appStyles = StyleSheet.create({
    root: { flex: 1, backgroundColor: '#fff' },
    tabBar: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#f0f0f0', backgroundColor: '#fff', paddingBottom: 4 },
    tab: { flex: 1, alignItems: 'center', paddingTop: 8, paddingBottom: 4 },
    tabEmoji: { fontSize: 20, marginBottom: 2 },
    tabLabel: { fontSize: 10, color: '#999' },
    tabLabelActive: { color: '#007AFF', fontWeight: '600' },
  });
</navigation_pattern>

<content_quality>
  - Each screen must have meaningful, populated UI: lists, cards, forms, stats
  - Use realistic data — names, prices, dates, descriptions
  - Include pressed/active states on touchable elements (activeOpacity={0.7})
  - Make it visually impressive: use colors, shadows, rounded corners generously
</content_quality>

<output_format>
  Return a JSON object with:
  - files: array with App.tsx + all screen and component files:
    [
      { "name": "App.tsx", "content": "..." },
      { "name": "screens/HomeScreen.tsx", "content": "..." },
      { "name": "screens/ExploreScreen.tsx", "content": "..." },
      { "name": "screens/ProfileScreen.tsx", "content": "..." }
    ]
  - explanation: 2-3 sentences describing the app and its screens
  - testingInstructions: brief instructions for navigating the app
  NEVER truncate code. Every file must be complete and runnable.
</output_format>
`;

const MOBILE_APP_EDIT_INSTRUCTIONS = `
IMPORTANT editing rules for React Native multi-file projects:
- Return ALL files in the project (both modified and unmodified) to maintain the complete app.
- Preserve existing screen components and navigation structure unless explicitly asked to change them.
- If adding a new screen, create a new screens/ScreenName.tsx file AND add its entry to TABS in App.tsx.
- Maintain the existing StyleSheet design system (colors, spacing, font sizes) across all files.
- All styles must use StyleSheet.create() with unique per-file prefixed names — no inline style objects.
- Only import from 'react' and 'react-native'. No imports from other generated files.
- Never use "export default" in screen/component files — only App.tsx has "export default function App()".
`;

// Mobile App generation
export const generateMobileAppCode = async (userPrompt: string, onProgress?: (chars: number) => void): Promise<GeminiResponse> => {
  const fullPrompt = `${MOBILE_APP_SYSTEM_PROMPT}\n\nUser Request: "${userPrompt}"`;
  try {
    const jsonStr = await callGemini(fullPrompt, onProgress);
    return parseGeminiResult(jsonStr);
  } catch (error: any) {
    console.error("Mobile App Generation Error:", error);
    throw error;
  }
};

export const editMobileAppCode = async (currentFiles: FileSet, userPrompt: string, onProgress?: (chars: number) => void): Promise<GeminiResponse> => {
  const filesJson = JSON.stringify(Object.fromEntries(Object.entries(currentFiles).map(([k, v]) => [k, v.content])));
  const fullPrompt = `${MOBILE_APP_SYSTEM_PROMPT}\n\n${MOBILE_APP_EDIT_INSTRUCTIONS}\n\nCurrent App Files:\n${filesJson}\n\nUpdate Request: "${userPrompt}"`;
  try {
    const jsonStr = await callGemini(fullPrompt, onProgress);
    return parseGeminiResult(jsonStr);
  } catch (error: any) {
    console.error("Mobile App Edit Error:", error);
    throw error;
  }
};

// AI Agent generation
export const generateAgentCode = async (userPrompt: string, onProgress?: (chars: number) => void): Promise<GeminiResponse> => {
  const fullPrompt = `${AGENT_SYSTEM_PROMPT}\n\nUser Request: "${userPrompt}"`;
  try {
    const jsonStr = await callGemini(fullPrompt, onProgress);
    return parseGeminiResult(jsonStr);
  } catch (error: any) {
    console.error("Agent Generation Error:", error);
    throw error;
  }
};

export const editAgentCode = async (currentFiles: FileSet, userPrompt: string, onProgress?: (chars: number) => void): Promise<GeminiResponse> => {
  const filesJson = JSON.stringify(Object.fromEntries(Object.entries(currentFiles).map(([k, v]) => [k, v.content])));
  const fullPrompt = `${AGENT_SYSTEM_PROMPT}\n\n${AGENT_EDIT_INSTRUCTIONS}\n\nCurrent Project Files:\n${filesJson}\n\nUpdate Request: "${userPrompt}"`;
  try {
    const jsonStr = await callGemini(fullPrompt, onProgress);
    return parseGeminiResult(jsonStr);
  } catch (error: any) {
    console.error("Agent Edit Error:", error);
    throw error;
  }
};

// Slack Bot generation
export const generateSlackBotCode = async (userPrompt: string, onProgress?: (chars: number) => void): Promise<GeminiResponse> => {
  const fullPrompt = `${SLACK_BOT_SYSTEM_PROMPT}\n\nUser Request: "${userPrompt}"`;
  try {
    const jsonStr = await callGemini(fullPrompt, onProgress);
    return parseGeminiResult(jsonStr);
  } catch (error: any) {
    console.error("Slack Bot Generation Error:", error);
    throw error;
  }
};

export const editSlackBotCode = async (currentFiles: FileSet, userPrompt: string, onProgress?: (chars: number) => void): Promise<GeminiResponse> => {
  const filesJson = JSON.stringify(Object.fromEntries(Object.entries(currentFiles).map(([k, v]) => [k, v.content])));
  const fullPrompt = `${SLACK_BOT_SYSTEM_PROMPT}\n\n${SLACK_BOT_EDIT_INSTRUCTIONS}\n\nCurrent Project Files:\n${filesJson}\n\nUpdate Request: "${userPrompt}"`;
  try {
    const jsonStr = await callGemini(fullPrompt, onProgress);
    return parseGeminiResult(jsonStr);
  } catch (error: any) {
    console.error("Slack Bot Edit Error:", error);
    throw error;
  }
};

// Chat with a generated agent/bot in demo mode — returns plain text (no JSON schema)
export const chatWithContext = async (
  systemPrompt: string,
  userMessage: string,
): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60_000);

  let response: Response;
  try {
    response = await fetch('/api/generate/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemPrompt + '\n\nUser: ' + userMessage }] }],
        config: { responseMimeType: 'text/plain' },
      }),
      signal: controller.signal,
    });
  } catch (error: any) {
    clearTimeout(timeoutId);
    throw error;
  }

  if (!response.ok || !response.body) {
    clearTimeout(timeoutId);
    throw new Error(`Chat error: ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (data === '[DONE]') break;
        try {
          const parsed = JSON.parse(data);
          if (parsed.chunk) fullText += parsed.chunk;
        } catch { /* skip malformed */ }
      }
    }
  } finally {
    clearTimeout(timeoutId);
    reader.releaseLock();
  }
  return fullText.trim();
};
