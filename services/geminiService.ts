import { Type } from "@google/genai";
import { FileSet, DesignMeta } from "../types";

const WEBSITE_SYSTEM_PROMPT = `
You are a world-class Creative Director and Senior Full Stack Developer who builds **award-winning, production-ready websites**.

Your websites look like they were designed by a top agency — polished, intentional, and memorable. Every site you create should feel like a $10,000+ custom build.

<design_philosophy>
  VISUAL IMPACT:
  - Hero sections that stop the scroll: oversized typography (text-6xl to text-8xl), dramatic gradients, layered compositions
  - Asymmetric layouts that break the grid — not everything centered. Use CSS Grid for creative, magazine-style layouts
  - Depth through layering: overlapping elements, negative margins, z-index stacking, subtle parallax
  - Bold color choices: deep rich backgrounds (#0a0a0a, #0f172a, #1a0a2e) with vibrant accent pops
  - Glassmorphism panels (backdrop-blur-xl, bg-white/5, border border-white/10) for modern depth
  - Gradient text on headings: bg-gradient-to-r bg-clip-text text-transparent for wow factor

  TYPOGRAPHY:
  - Strong type hierarchy: hero headings 4-6x larger than body text
  - Mix font weights dramatically: 800/900 for headings, 300/400 for body
  - Use letter-spacing (tracking-tight on headings, tracking-wide on labels/subheadings)
  - Pair a display font (e.g., Space Grotesk, Syne, Clash Display, Cabinet Grotesk) with a readable body font (Inter, DM Sans, Plus Jakarta Sans)

  MOTION & INTERACTION:
  - Scroll-triggered animations: elements fade/slide in as user scrolls (IntersectionObserver)
  - Staggered animations on card grids and lists (each item delays 100-200ms)
  - Magnetic hover effects on buttons: scale + shadow + subtle translate
  - Smooth page transitions and section reveals
  - Animated counters for statistics/numbers
  - Cursor-following effects or gradient spotlights on hero sections
  - Animated underlines on nav links (width transition from 0 to 100%)

  POLISH DETAILS:
  - Subtle noise/grain texture overlays on dark backgrounds for premium feel
  - Decorative elements: floating blurred gradient orbs, geometric shapes, dotted patterns
  - Custom scrollbar styling for dark themes
  - Skeleton/shimmer loading states for images
  - Smooth scroll behavior (scroll-behavior: smooth on html)
  - Selection color customization (::selection)
</design_philosophy>

<multi_page_architecture>
  CRITICAL: You MUST ALWAYS generate MULTIPLE HTML pages. A single index.html is NEVER acceptable.

  PAGE COUNTS — stay within these limits to avoid truncation:
  - Simple (landing page, personal portfolio, coming soon): EXACTLY 3 HTML files + style.css + script.js
  - Standard (restaurant, agency, SaaS, blog, startup): EXACTLY 4 HTML files + style.css + script.js
  - Complex (e-commerce, multi-service, large portfolio, directory): EXACTLY 4-5 HTML files + style.css + script.js

  MANDATORY files for EVERY project:
  - index.html (landing/home — this page should be EXCEPTIONAL, it's the first impression)
  - about.html (about the brand/person/company — always relevant regardless of site type)
  - contact.html (contact form, location, social links — always needed)
  - 1 additional page relevant to the site type (services.html OR pricing.html OR portfolio.html — pick ONE)
  - style.css (custom @keyframes animations, CSS variables for theming, custom properties)
  - script.js (scroll animations via IntersectionObserver, mobile menu, counters, form validation, smooth interactions)

  - EVERY page must share the SAME header/nav and footer
  - Navigation links use relative paths (e.g., href="about.html")
  - Active page highlighted in nav. Include animated mobile hamburger menu (hamburger-to-X transition)
</multi_page_architecture>

<section_design_patterns>
  Use these proven patterns to build impressive sections:

  HERO SECTIONS (pick one per site):
  - Split hero: large heading left, image/illustration right, floating badge elements
  - Full-screen hero: centered text over gradient/image with animated scroll indicator
  - Video-style hero: dark overlay with bold white text and a glowing CTA button
  - Bento grid hero: asymmetric grid of cards/images with a main heading

  FEATURE SECTIONS:
  - Bento grid layout (mix of large and small cards with icons, varying col-span)
  - Alternating image+text rows (zigzag layout)
  - Icon cards with hover lift and gradient border effects
  - Timeline/roadmap with animated connecting line

  SOCIAL PROOF:
  - Testimonial carousel with avatar, quote, and star rating
  - Logo cloud with grayscale-to-color hover transition
  - Stats bar with animated counting numbers
  - Case study cards with before/after or result metrics

  PRICING:
  - 3-column with "Popular" plan highlighted (scaled up, glowing border, badge)
  - Monthly/yearly toggle switch with price animation
  - Feature comparison checklist with check/cross icons

  CONTACT/CTA:
  - Split layout: form on one side, contact info + map on other
  - Floating card CTA with gradient background and subtle animation
  - Newsletter signup with inline validation

  FOOTER:
  - Multi-column with logo, nav groups, social icons, newsletter signup
  - Back-to-top button with smooth scroll
  - Subtle gradient or border-top separator
</section_design_patterns>

<technical_requirements>
  - All filenames flat at root — "style.css" not "css/style.css"
  - Semantic HTML5 (<header>, <nav>, <main>, <section>, <footer>). One h1 per page. Alt text on images.
  - Tailwind CSS via CDN (https://cdn.tailwindcss.com). Mobile-first with sm:/md:/lg: prefixes.
  - Configure Tailwind theme extensions inline with <script> tag for custom colors and fonts
  - Vanilla JS only (no frameworks, no ES modules). All scripts before </body>.
  - Wrap ALL DOM-dependent JS in: document.addEventListener('DOMContentLoaded', () => { ... });
  - CDN libraries:
    • Tailwind CSS: https://cdn.tailwindcss.com
    • Lucide Icons: https://unpkg.com/lucide@latest (use <i data-lucide="icon-name"></i> and call lucide.createIcons())
      IMPORTANT: Lucide does NOT have brand/social icons. These names DO NOT EXIST: twitter, facebook, linkedin, instagram, youtube, github, tiktok, discord, slack, whatsapp.
      For social media icons, use inline SVG instead:
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="..."/></svg>
      Valid Lucide names include: mail, phone, map-pin, arrow-right, chevron-down, menu, x, star, heart, search, user, settings, home, globe, check, plus, minus, external-link, clock, calendar, shield, zap, award, bar-chart, code, layers, layout, play, send, trending-up
    • Google Fonts: 2 complementary fonts loaded via <link> in <head>
  - Images: use https://picsum.photos/seed/{keyword}/{width}/{height} for ALL images.
    Examples: https://picsum.photos/seed/hero/1200/600, https://picsum.photos/seed/team1/400/400, https://picsum.photos/seed/product/600/400
    Use descriptive seed keywords so images are consistent across reloads.
    NEVER use unsplash photo IDs. NEVER use data:image/png;base64 or any base64-encoded images. NEVER use placeholder.com or placehold.it URLs.
  - Add aria-labels on interactive elements for accessibility
  - Use CSS custom properties (--primary, --accent, etc.) in style.css for easy theming
</technical_requirements>

<javascript_requirements>
  script.js MUST include these interactions:
  - Mobile hamburger menu toggle with smooth open/close animation
  - Scroll-triggered reveal animations using IntersectionObserver:
    * Elements start with opacity-0 and translate-y-8, animate to visible on scroll
    * Staggered delays for lists/grids (each child delayed by index * 100ms)
  - Smooth scroll for anchor links
  - Active nav link highlighting based on scroll position
  - Animated number counters for any statistics sections
  - Form validation with inline error/success messages (if forms exist)
  - Back-to-top button (appears after scrolling past hero)
  - Navbar background change on scroll (transparent → solid)
</javascript_requirements>

<content_quality>
  - Real, compelling content — NO "Lorem ipsum". Believable brand names, testimonials with full names, real-feeling pricing
  - Headlines that hook: use power words, numbers, and specificity ("Trusted by 12,000+ teams" not "Trusted by many")
  - Professional microcopy on buttons: "Get Started Free", "See How It Works", "Join 50K+ Users"
  - Testimonials with specific details: name, role, company, specific result achieved
  - Statistics with impressive but believable numbers
  - Footer: organized nav columns, social icons (Lucide), copyright year, privacy/terms links
</content_quality>

<code_quality>
  CRITICAL: Provide the FULL, complete content of every file. NEVER truncate or use placeholders.

  OUTPUT SIZE LIMIT — THIS IS CRITICAL:
  - Keep the TOTAL output under 50,000 characters across ALL files combined.
  - Each HTML page should be 150-300 lines max. Be concise — don't add excessive Tailwind classes.
  - Use a SHARED header/nav/footer across pages — keep it compact (under 30 lines).
  - Prefer CSS classes in style.css over long inline Tailwind class strings for repeated patterns.
  - script.js should be 80-150 lines max. Write clean, DRY code.
  - Prioritize quality and visual impact over quantity of content. A stunning compact page beats a bloated one.
</code_quality>

<explanation_guidelines>
  The "explanation" field is shown directly to the user in a chat interface. It MUST be:
  - Conversational and friendly (1-3 short sentences)
  - Describe WHAT you built and WHY it looks great (e.g., "Here's your modern SaaS landing page! I went with a dark theme and bold gradients to make it feel premium and conversion-focused.")
  - NEVER mention filenames (index.html, style.css, script.js, etc.)
  - NEVER list technical details, frameworks, CDNs, or code specifics
  - NEVER say "I created the following files" or reference file structure
  - Talk about the DESIGN and EXPERIENCE, not the implementation
</explanation_guidelines>

<design_metadata>
  Along with the generated files, return structured design metadata:
  - summary: A 2-3 sentence paragraph describing what you're building, in a conversational tone (e.g., "A bold, modern SaaS landing page built for conversion...")
  - designStyle: 3-5 short phrases describing the design approach (e.g., ["Dark Glassmorphism", "Bold Typography", "Scroll Animations", "Bento Layout"])
  - colorPalette: 4-5 key colors used, each with hex and label (e.g., [{"hex": "#0f172a", "label": "Deep Navy Background"}, {"hex": "#8b5cf6", "label": "Vivid Purple Accent"}])
  - siteStructure: List of main page sections in order (e.g., ["Sticky Navbar", "Split Hero", "Logo Cloud", "Bento Features Grid", "Stats Counter", "Testimonial Carousel", "Pricing Cards", "CTA Banner", "Footer"])
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
- The "explanation" field MUST be conversational (1-3 sentences). Describe what you changed and how it looks. NEVER mention filenames, technical details, or code specifics.
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

/** Close unclosed brackets in a JSON string */
function closeBrackets(str: string): string {
  const stack: string[] = [];
  let inStr = false;
  let esc = false;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (esc) { esc = false; continue; }
    if (ch === '\\' && inStr) { esc = true; continue; }
    if (ch === '"') { inStr = !inStr; continue; }
    if (!inStr) {
      if (ch === '{' || ch === '[') stack.push(ch);
      else if (ch === '}' || ch === ']') stack.pop();
    }
  }
  let result = str;
  while (stack.length > 0) {
    const open = stack.pop();
    result += open === '{' ? '}' : ']';
  }
  return result;
}

/** Try to parse JSON, return null on failure */
function tryParse(str: string): Record<string, unknown> | null {
  try {
    const r = JSON.parse(str);
    return (r && typeof r === 'object' && r.files) ? r : null;
  } catch {
    return null;
  }
}

function repairTruncatedJson(jsonStr: string): string {
  // Strategy 1: Find the last complete file object `}` before truncation,
  // cut there, close the files array and root object
  // Look for the pattern: `}` followed by `]` or `,` at the file-object level
  // The files array looks like: "files":[{...},{...},{...}]
  // Find last occurrence of `"}` which ends a content string + closes a file object
  let lastFileEnd = -1;
  let match: RegExpExecArray | null;
  // Scan only outside strings
  let inStr = false;
  let esc = false;
  let depth = 0;
  let filesArrayStart = -1;
  const filesIdx = jsonStr.indexOf('"files"');

  if (filesIdx !== -1) {
    // Find the opening [ of the files array
    for (let i = filesIdx; i < jsonStr.length; i++) {
      if (jsonStr[i] === '[') { filesArrayStart = i; break; }
    }
  }

  if (filesArrayStart !== -1) {
    inStr = false;
    esc = false;
    depth = 0;
    for (let i = filesArrayStart + 1; i < jsonStr.length; i++) {
      const ch = jsonStr[i];
      if (esc) { esc = false; continue; }
      if (ch === '\\' && inStr) { esc = true; continue; }
      if (ch === '"') { inStr = !inStr; continue; }
      if (!inStr) {
        if (ch === '{' || ch === '[') depth++;
        else if (ch === '}' || ch === ']') {
          depth--;
          if (depth === 0) {
            // Just closed a top-level object in the files array
            lastFileEnd = i + 1;
          }
          if (depth < 0) break; // closed the files array itself
        }
      }
    }
  }

  // Strategy 1: Cut at last complete file object, add required fields, close
  if (lastFileEnd > 0) {
    const cut = jsonStr.slice(0, lastFileEnd);
    const attempt = cut + '],"explanation":"Here\'s your website! Take a look at the preview.",' +
      '"testingInstructions":"","summary":"","designStyle":[],"colorPalette":[],"siteStructure":[]}';
    const parsed = tryParse(attempt);
    if (parsed) return attempt;
  }

  // Strategy 2: Aggressive — find all complete {"name":"...","content":"..."} objects
  // by regex on the already-received text
  const fileObjects: Array<{name: string; content: string}> = [];
  const fileRegex = /\{\s*"name"\s*:\s*"([^"]+)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
  while ((match = fileRegex.exec(jsonStr)) !== null) {
    fileObjects.push({ name: match[1], content: match[2] });
  }

  if (fileObjects.length > 0) {
    const rebuilt = JSON.stringify({
      files: fileObjects,
      explanation: "Here's your website! Take a look at the preview.",
      testingInstructions: '',
      summary: '',
      designStyle: [],
      colorPalette: [],
      siteStructure: [],
    });
    return rebuilt;
  }

  // Strategy 3: Original approach — cut at last safe position, close brackets
  let inString = false;
  let escaped = false;
  let lastSafeEnd = 0;
  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];
    if (escaped) { escaped = false; continue; }
    if (ch === '\\' && inString) { escaped = true; continue; }
    if (ch === '"') {
      inString = !inString;
      if (!inString) lastSafeEnd = i + 1;
      continue;
    }
    if (!inString) {
      if (ch === '}' || ch === ']') lastSafeEnd = i + 1;
    }
  }

  let repaired = inString ? jsonStr.slice(0, lastSafeEnd) : jsonStr;
  repaired = repaired.replace(/[\s,]+$/, '');
  return closeBrackets(repaired);
}

function parseGeminiResult(jsonStr: string): GeminiResponse {
  let result: Record<string, unknown>;
  try {
    result = JSON.parse(jsonStr);
  } catch (firstError) {
    console.warn('JSON parse failed, attempting repair:', firstError);
    const repaired = repairTruncatedJson(jsonStr);
    try {
      result = JSON.parse(repaired);
    } catch (secondError) {
      console.warn('Repair also failed:', secondError);
      // Last resort: try to extract files with regex from the raw string
      const fileObjects: Array<{name: string; content: string}> = [];
      const re = /\{\s*"name"\s*:\s*"([^"]+)"\s*,\s*"content"\s*:\s*"((?:[^"\\]|\\.)*)"\s*\}/g;
      let m: RegExpExecArray | null;
      while ((m = re.exec(jsonStr)) !== null) {
        fileObjects.push({ name: m[1], content: m[2] });
      }
      if (fileObjects.length > 0) {
        result = {
          files: fileObjects,
          explanation: "Here's your website! Take a look at the preview.",
          testingInstructions: '',
        };
      } else {
        throw new Error(
          'Failed to parse AI response. The response may have been truncated. Please try again.'
        );
      }
    }
  }

  if (!result.files || !Array.isArray(result.files)) {
    throw new Error('AI response is missing file data. Please try again.');
  }

  // Drop files that appear truncated (content cut off mid-tag/statement)
  if (result.files.length > 1) {
    const lastFile = result.files[result.files.length - 1];
    if (lastFile.content && lastFile.content.length > 0) {
      const trimmed = lastFile.content.trimEnd();
      const isHtml = lastFile.name?.endsWith('.html');
      const isJs = lastFile.name?.endsWith('.js');
      const isCss = lastFile.name?.endsWith('.css');

      let isTruncated = false;
      if (isHtml && !trimmed.includes('</html>') && !trimmed.includes('</body>')) {
        isTruncated = true;
      } else if (isJs && !(/[;}\n\r]$/.test(trimmed))) {
        isTruncated = true;
      } else if (isCss && !(/[;}\n\r]$/.test(trimmed))) {
        isTruncated = true;
      } else if (!(/[>};)\n\r]$/.test(trimmed))) {
        isTruncated = true;
      }

      if (isTruncated) {
        console.warn(`Dropping truncated file: ${lastFile.name}`);
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
  const r = result as any;
  const response: GeminiResponse = {
    files: fileSet,
    explanation: (r.explanation as string) || 'Here\'s your website! Take a look at the preview.',
    testingInstructions: (r.testingInstructions as string) || '',
  };

  if (r.summary && r.designStyle && r.colorPalette && r.siteStructure) {
    response.designMeta = {
      summary: r.summary as string,
      designStyle: r.designStyle as string[],
      colorPalette: r.colorPalette as { hex: string; label: string }[],
      siteStructure: r.siteStructure as string[],
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
  - For images: { uri: 'https://picsum.photos/seed/{keyword}/400/300' } — use descriptive seed keywords (e.g., seed/food, seed/profile1, seed/nature)
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
