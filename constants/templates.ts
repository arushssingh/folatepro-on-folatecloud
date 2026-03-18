
import { FileSet, ProjectType } from "../types";

export interface Template {
  id: string;
  name: string;
  description: string;
  image: string;
  category: string;
  projectType: ProjectType;
  files: FileSet;
}

const COMMON_META = `
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@300;400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@300;400;500;700&family=Inter:wght@300;400;600;800&display=swap" rel="stylesheet">
`;

export const TEMPLATES: Template[] = [
  {
    id: 'saas-modern',
    name: 'Nexus SaaS',
    description: 'Complete software platform with dashboard previews, tiered pricing, and a customer support hub.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600&h=400',
    category: 'Technology',
    projectType: ProjectType.WEBSITE,
    files: {
      'index.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NexusSaaS | Scale Faster</title>
    ${COMMON_META}
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .gradient-text { background: linear-gradient(to right, #2563eb, #7c3aed); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900 overflow-x-hidden">
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-2">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <i data-lucide="zap" class="text-white w-6 h-6"></i>
                </div>
                <span class="font-extrabold text-2xl tracking-tight">Nexus</span>
            </a>
            <div class="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
                <a href="index.html" class="text-blue-600">Home</a>
                <a href="about.html" class="hover:text-blue-600 transition-colors">About</a>
                <a href="features.html" class="hover:text-blue-600 transition-colors">Features</a>
                <a href="pricing.html" class="hover:text-blue-600 transition-colors">Pricing</a>
            </div>
            <div class="flex items-center gap-4">
                <a href="pricing.html" class="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 hover:shadow-lg transition-all">Start Trial</a>
            </div>
        </div>
    </nav>
    <main class="pt-32">
        <section class="max-w-7xl mx-auto px-6 text-center py-20">
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-xs font-bold mb-8">
                <span class="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                NEW: Nexus AI Agents are here
            </div>
            <h1 class="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8">Ship faster with <br/><span class="gradient-text">Nexus AI.</span></h1>
            <p class="text-xl text-slate-500 max-w-2xl mx-auto mb-12">The ultimate workspace for engineering teams. Manage, build, and scale in one place.</p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="pricing.html" class="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl text-center">Get Started</a>
                <a href="features.html" class="w-full sm:w-auto bg-white border border-slate-200 text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all text-center flex items-center justify-center gap-2">
                    <i data-lucide="play-circle" class="w-5 h-5"></i> View Demo
                </a>
            </div>
        </section>
        <section class="bg-white py-20 border-y border-slate-100">
            <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/Google-Logo.svg" class="h-8 mx-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" class="h-8 mx-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" class="h-8 mx-auto" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" class="h-8 mx-auto" />
            </div>
        </section>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      },
      'features.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NexusSaaS | Features</title>
    ${COMMON_META}
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-900">
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-2">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <i data-lucide="zap" class="text-white w-6 h-6"></i>
                </div>
                <span class="font-extrabold text-2xl tracking-tight">Nexus</span>
            </a>
            <div class="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
                <a href="index.html" class="hover:text-blue-600">Home</a>
                <a href="about.html" class="hover:text-blue-600 transition-colors">About</a>
                <a href="features.html" class="text-blue-600">Features</a>
                <a href="pricing.html" class="hover:text-blue-600 transition-colors">Pricing</a>
            </div>
        </div>
    </nav>
    <main class="pt-40 max-w-7xl mx-auto px-6">
        <h2 class="text-5xl font-black mb-16">Built for speed.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div class="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6"><i data-lucide="code"></i></div>
                <h3 class="text-xl font-bold mb-4">API First</h3>
                <p class="text-slate-500">Integrate with your favorite tools seamlessly using our robust API.</p>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div class="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6"><i data-lucide="shield"></i></div>
                <h3 class="text-xl font-bold mb-4">Enterprise Security</h3>
                <p class="text-slate-500">SOC2 compliant and encrypted data handling at every step.</p>
            </div>
            <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6"><i data-lucide="activity"></i></div>
                <h3 class="text-xl font-bold mb-4">Real-time Analytics</h3>
                <p class="text-slate-500">Monitor performance and logs in real-time with zero latency.</p>
            </div>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      },
      'pricing.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>NexusSaaS | Pricing</title>
    ${COMMON_META}
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
</head>
<body class="bg-slate-50 text-slate-900">
    <nav class="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-2">
                <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <i data-lucide="zap" class="text-white w-6 h-6"></i>
                </div>
                <span class="font-extrabold text-2xl tracking-tight">Nexus</span>
            </a>
            <div class="hidden md:flex items-center gap-10 text-sm font-semibold text-slate-600">
                <a href="index.html" class="hover:text-blue-600 transition-colors">Home</a>
                <a href="about.html" class="hover:text-blue-600 transition-colors">About</a>
                <a href="features.html" class="hover:text-blue-600 transition-colors">Features</a>
                <a href="pricing.html" class="text-blue-600">Pricing</a>
            </div>
        </div>
    </nav>
    <main class="pt-40 max-w-7xl mx-auto px-6 text-center">
        <h2 class="text-5xl font-black mb-16">Simple pricing. No hidden fees.</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-white p-10 rounded-3xl border border-slate-200">
                <h3 class="text-xl font-bold mb-4">Starter</h3>
                <div class="text-4xl font-black mb-6">$0</div>
                <ul class="text-slate-500 space-y-4 text-sm mb-10 text-left">
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-green-500 w-4 h-4"></i> 1 Project</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-green-500 w-4 h-4"></i> Community Support</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-green-500 w-4 h-4"></i> 5GB Storage</li>
                </ul>
                <button class="w-full py-4 rounded-xl font-bold bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all">Get Started</button>
            </div>
            <div class="bg-white p-10 rounded-3xl border-2 border-blue-600 relative shadow-2xl shadow-blue-500/10">
                <span class="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">Popular</span>
                <h3 class="text-xl font-bold mb-4">Pro</h3>
                <div class="text-4xl font-black mb-6">$29<span class="text-sm font-medium text-slate-400">/mo</span></div>
                <ul class="text-slate-500 space-y-4 text-sm mb-10 text-left">
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-blue-500 w-4 h-4"></i> Unlimited Projects</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-blue-500 w-4 h-4"></i> Priority Support</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-blue-500 w-4 h-4"></i> 100GB Storage</li>
                </ul>
                <button class="w-full py-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all">Get Pro</button>
            </div>
            <div class="bg-white p-10 rounded-3xl border border-slate-200">
                <h3 class="text-xl font-bold mb-4">Enterprise</h3>
                <div class="text-4xl font-black mb-6">Custom</div>
                <ul class="text-slate-500 space-y-4 text-sm mb-10 text-left">
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-slate-400 w-4 h-4"></i> SAML SSO</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-slate-400 w-4 h-4"></i> Custom SLA</li>
                    <li class="flex items-center gap-2"><i data-lucide="check" class="text-slate-400 w-4 h-4"></i> Audit Logs</li>
                </ul>
                <button class="w-full py-4 rounded-xl font-bold bg-slate-900 text-white hover:bg-slate-800 transition-all">Contact Sales</button>
            </div>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      }
    }
  },
  {
    id: 'aether-portfolio',
    name: 'Aether Creative',
    description: 'A bold, dark-themed portfolio for creators featuring a masonry work gallery and interactive contact form.',
    image: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600&h=400',
    category: 'Portfolio',
    projectType: ProjectType.WEBSITE,
    files: {
      'index.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Aether | Creative Director</title>
    ${COMMON_META}
    <style>body { font-family: 'Space Grotesk', sans-serif; }</style>
</head>
<body class="bg-[#050505] text-white">
    <nav class="p-8 flex justify-between items-center fixed w-full top-0 z-50 bg-[#050505]/50 backdrop-blur-xl">
        <a href="index.html" class="text-2xl font-bold tracking-tighter">AE.</a>
        <div class="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="index.html" class="text-white">Home</a>
            <a href="work.html" class="text-zinc-500 hover:text-white transition-colors">Work</a>
            <a href="contact.html" class="text-zinc-500 hover:text-white transition-colors">Contact</a>
        </div>
    </nav>
    <main class="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <h1 class="text-8xl md:text-[12rem] font-bold leading-none tracking-tighter mb-8 uppercase">CREATIVE<br/><span class="text-zinc-600 italic">VISION.</span></h1>
        <p class="text-xl text-zinc-400 max-w-xl mb-12">Crafting digital experiences that linger in the mind. Specialized in high-end design & art direction.</p>
        <div class="flex gap-4">
            <a href="work.html" class="bg-white text-black px-12 py-5 rounded-full font-bold hover:scale-105 transition-all">Selected Works</a>
            <a href="contact.html" class="border border-zinc-800 px-12 py-5 rounded-full font-bold hover:bg-zinc-900 transition-all">Let's talk</a>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      },
      'work.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Aether | Selected Work</title>
    ${COMMON_META}
    <style>body { font-family: 'Space Grotesk', sans-serif; }</style>
</head>
<body class="bg-[#050505] text-white">
    <nav class="p-8 flex justify-between items-center fixed w-full top-0 z-50 bg-[#050505]/50 backdrop-blur-xl">
        <a href="index.html" class="text-2xl font-bold tracking-tighter">AE.</a>
        <div class="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="index.html" class="text-zinc-500 hover:text-white">Home</a>
            <a href="work.html" class="text-white">Work</a>
            <a href="contact.html" class="text-zinc-500 hover:text-white transition-colors">Contact</a>
        </div>
    </nav>
    <main class="pt-40 px-8 pb-20">
        <h2 class="text-6xl font-bold mb-20 tracking-tighter uppercase">Selected Projects.</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="group cursor-pointer">
                <div class="aspect-[16/10] bg-zinc-900 overflow-hidden mb-6">
                    <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800" class="w-full h-full object-cover group-hover:scale-110 grayscale transition-all duration-700"/>
                </div>
                <h3 class="text-2xl font-bold">Lumina App</h3>
                <p class="text-zinc-500 font-medium">UX Design / Development</p>
            </div>
            <div class="group cursor-pointer">
                <div class="aspect-[16/10] bg-zinc-900 overflow-hidden mb-6">
                    <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800" class="w-full h-full object-cover group-hover:scale-110 grayscale transition-all duration-700"/>
                </div>
                <h3 class="text-2xl font-bold">Vanguard Identity</h3>
                <p class="text-zinc-500 font-medium">Branding / Strategy</p>
            </div>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      },
      'contact.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Aether | Contact</title>
    ${COMMON_META}
    <style>body { font-family: 'Space Grotesk', sans-serif; }</style>
</head>
<body class="bg-[#050505] text-white">
    <nav class="p-8 flex justify-between items-center fixed w-full top-0 z-50 bg-[#050505]/50 backdrop-blur-xl">
        <a href="index.html" class="text-2xl font-bold tracking-tighter">AE.</a>
        <div class="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="index.html" class="text-zinc-500 hover:text-white">Home</a>
            <a href="work.html" class="text-zinc-500 hover:text-white">Work</a>
            <a href="contact.html" class="text-white">Contact</a>
        </div>
    </nav>
    <main class="min-h-screen flex flex-col items-center justify-center px-8">
        <h2 class="text-7xl font-bold mb-12 tracking-tighter uppercase">Start a project.</h2>
        <form class="w-full max-w-2xl space-y-6">
            <input type="text" placeholder="Name" class="w-full bg-zinc-900 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-white transition-all outline-none"/>
            <input type="email" placeholder="Email" class="w-full bg-zinc-900 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-white transition-all outline-none"/>
            <textarea placeholder="Tell me about your vision..." rows="5" class="w-full bg-zinc-900 border-none px-6 py-4 rounded-xl focus:ring-2 focus:ring-white transition-all outline-none resize-none"></textarea>
            <button class="w-full bg-white text-black py-5 rounded-full font-bold hover:bg-zinc-200 transition-colors uppercase tracking-widest text-sm">Send Inquiry</button>
        </form>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      }
    }
  },
  {
    id: 'lumiere-restaurant',
    name: 'Lumiere Dining',
    description: 'An elegant restaurant website with a curated menu, reservation system, and storytelling page.',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600&h=400',
    category: 'Restaurant',
    projectType: ProjectType.WEBSITE,
    files: {
      'index.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lumiere | Fine Dining</title>
    ${COMMON_META}
    <style>body { font-family: 'Playfair Display', serif; } .sans { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#fdfcf9] text-[#1c1c1c]">
    <nav class="p-10 flex justify-between items-center fixed w-full top-0 z-50 bg-white/50 backdrop-blur-md border-b border-[#1c1c1c]/5">
        <a href="index.html" class="text-3xl font-bold tracking-tighter italic">Lumiere</a>
        <div class="flex gap-12 sans text-[10px] font-black uppercase tracking-[0.3em]">
            <a href="index.html" class="border-b-2 border-black">Home</a>
            <a href="menu.html" class="opacity-40 hover:opacity-100 transition-opacity">Menu</a>
            <a href="reservation.html" class="opacity-40 hover:opacity-100 transition-opacity">Reserve</a>
        </div>
    </nav>
    <header class="h-screen flex items-center justify-center p-10 text-center">
        <div class="max-w-4xl">
            <span class="sans text-xs font-black uppercase tracking-[0.4em] mb-6 block opacity-40">EST. 1924</span>
            <h1 class="text-8xl md:text-[10rem] font-bold leading-[0.85] mb-12 tracking-tighter italic">The Art of Dining.</h1>
            <p class="sans text-lg max-w-xl mx-auto leading-relaxed opacity-60 mb-12">Experience a fusion of heritage and innovation in the heart of the city.</p>
            <a href="reservation.html" class="sans bg-black text-white px-16 py-5 uppercase text-[10px] font-black tracking-[0.3em] hover:bg-zinc-800 transition-colors">Book a Table</a>
        </div>
    </header>
    <script>lucide.createIcons();</script>
</body>
</html>`
      },
      'menu.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lumiere | Menu</title>
    ${COMMON_META}
    <style>body { font-family: 'Playfair Display', serif; } .sans { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#fdfcf9] text-[#1c1c1c]">
    <nav class="p-10 flex justify-between items-center fixed w-full top-0 z-50 bg-white/50 backdrop-blur-md border-b border-[#1c1c1c]/5">
        <a href="index.html" class="text-3xl font-bold tracking-tighter italic">Lumiere</a>
        <div class="flex gap-12 sans text-[10px] font-black uppercase tracking-[0.3em]">
            <a href="index.html" class="opacity-40 hover:opacity-100">Home</a>
            <a href="menu.html" class="border-b-2 border-black">Menu</a>
            <a href="reservation.html" class="opacity-40 hover:opacity-100 transition-opacity">Reserve</a>
        </div>
    </nav>
    <main class="pt-40 p-10 max-w-4xl mx-auto pb-20">
        <h2 class="text-7xl italic font-bold mb-20 text-center">The Menu</h2>
        <div class="space-y-16">
            <div>
                <h3 class="sans text-xs font-black uppercase tracking-[0.4em] mb-8 opacity-40 border-b pb-4">Starters</h3>
                <div class="space-y-8">
                    <div class="flex justify-between items-baseline border-b border-dotted border-black/10 pb-4">
                        <div>
                            <h4 class="text-2xl font-bold italic">Truffle Velouté</h4>
                            <p class="sans text-xs opacity-40">Seasonal mushrooms, herb oil, gold leaf</p>
                        </div>
                        <span class="sans font-bold">$24</span>
                    </div>
                </div>
            </div>
            <div>
                <h3 class="sans text-xs font-black uppercase tracking-[0.4em] mb-8 opacity-40 border-b pb-4">Mains</h3>
                <div class="space-y-8">
                    <div class="flex justify-between items-baseline border-b border-dotted border-black/10 pb-4">
                        <div>
                            <h4 class="text-2xl font-bold italic">Glazed Sea Bass</h4>
                            <p class="sans text-xs opacity-40">Miso reduction, baby bok choy, ginger</p>
                        </div>
                        <span class="sans font-bold">$48</span>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      },
      'reservation.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lumiere | Reservation</title>
    ${COMMON_META}
    <style>body { font-family: 'Playfair Display', serif; } .sans { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-[#fdfcf9] text-[#1c1c1c]">
    <nav class="p-10 flex justify-between items-center fixed w-full top-0 z-50 bg-white/50 backdrop-blur-md border-b border-[#1c1c1c]/5">
        <a href="index.html" class="text-3xl font-bold tracking-tighter italic">Lumiere</a>
        <div class="flex gap-12 sans text-[10px] font-black uppercase tracking-[0.3em]">
            <a href="index.html" class="opacity-40 hover:opacity-100">Home</a>
            <a href="menu.html" class="opacity-40 hover:opacity-100">Menu</a>
            <a href="reservation.html" class="border-b-2 border-black">Reserve</a>
        </div>
    </nav>
    <main class="min-h-screen flex flex-col items-center justify-center p-10">
        <h2 class="text-7xl italic font-bold mb-12 tracking-tighter">Your Table Awaits.</h2>
        <form class="w-full max-w-lg space-y-6">
            <div class="grid grid-cols-2 gap-4">
                <input type="date" class="sans w-full border border-black/10 bg-transparent px-6 py-4 outline-none focus:border-black transition-colors"/>
                <input type="time" class="sans w-full border border-black/10 bg-transparent px-6 py-4 outline-none focus:border-black transition-colors"/>
            </div>
            <select class="sans w-full border border-black/10 bg-transparent px-6 py-4 outline-none focus:border-black transition-colors">
                <option>2 People</option>
                <option>4 People</option>
                <option>6+ People</option>
            </select>
            <button class="sans w-full bg-black text-white py-5 uppercase text-[10px] font-black tracking-[0.3em] hover:bg-zinc-800 transition-colors">Confirm Reservation</button>
        </form>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      }
    }
  },
  {
    id: 'vitality-app',
    name: 'Vitality Wellness',
    description: 'A vibrant wellness platform with feature lists, activity tracking previews, and subscription plans.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600&h=400',
    category: 'Health',
    projectType: ProjectType.WEBSITE,
    files: {
      'index.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vitality | Future of Wellness</title>
    ${COMMON_META}
    <style>body { font-family: 'Outfit', sans-serif; }</style>
</head>
<body class="bg-white text-zinc-900 selection:bg-emerald-100">
    <nav class="p-6 flex justify-between items-center fixed w-full top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-50">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm"><i data-lucide="leaf"></i></div>
            <span class="text-xl font-black italic tracking-tighter uppercase">Vitality</span>
        </div>
        <div class="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest">
            <a href="index.html" class="text-emerald-600">Overview</a>
            <a href="features.html" class="hover:text-emerald-600 transition-colors">Science</a>
            <a href="pricing.html" class="hover:text-emerald-600 transition-colors">Plans</a>
        </div>
        <a href="pricing.html" class="bg-emerald-500 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all">Join Vitality</a>
    </nav>
    <header class="pt-48 px-6 pb-20 text-center">
        <h1 class="text-7xl md:text-9xl font-black leading-[0.9] tracking-tighter mb-10 uppercase">UPGRADE YOUR<br/><span class="text-emerald-500 italic">BIOLOGY.</span></h1>
        <p class="text-xl text-zinc-500 max-w-2xl mx-auto mb-12 font-medium">The personalized health ecosystem that uses data to optimize your energy, sleep, and longevity.</p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button class="bg-zinc-900 text-white px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all">Get the App</button>
            <button class="bg-emerald-50 text-emerald-600 border border-emerald-100 px-12 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-emerald-100 transition-all">Explore Science</button>
        </div>
    </header>
    <script>lucide.createIcons();</script>
</body>
</html>`
      },
      'features.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vitality | Features</title>
    ${COMMON_META}
    <style>body { font-family: 'Outfit', sans-serif; }</style>
</head>
<body class="bg-white text-zinc-900">
    <nav class="p-6 flex justify-between items-center fixed w-full top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-emerald-50">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white"><i data-lucide="leaf"></i></div>
            <span class="text-xl font-black italic tracking-tighter uppercase">Vitality</span>
        </div>
        <div class="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest">
            <a href="index.html" class="hover:text-emerald-600">Overview</a>
            <a href="features.html" class="text-emerald-600">Science</a>
            <a href="pricing.html" class="hover:text-emerald-600 transition-colors">Plans</a>
        </div>
    </nav>
    <main class="pt-48 px-6 max-w-7xl mx-auto pb-20">
        <h2 class="text-6xl font-black tracking-tighter mb-16 uppercase">Intelligence in every beat.</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <div>
                <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800" class="rounded-[40px] shadow-2xl"/>
            </div>
            <div class="space-y-12">
                <div class="flex gap-6">
                    <div class="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0 shadow-sm"><i data-lucide="brain"></i></div>
                    <div>
                        <h3 class="text-2xl font-black mb-2 uppercase tracking-tight">Cognitive Load</h3>
                        <p class="text-zinc-500 leading-relaxed font-medium">Analyze how your daily choices affect your mental focus and fatigue.</p>
                    </div>
                </div>
                <div class="flex gap-6">
                    <div class="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 shadow-sm"><i data-lucide="moon"></i></div>
                    <div>
                        <h3 class="text-2xl font-black mb-2 uppercase tracking-tight">Deep Recovery</h3>
                        <p class="text-zinc-500 leading-relaxed font-medium">Advanced sleep phase monitoring for optimal physical repair.</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      },
      'pricing.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Vitality | Plans</title>
    ${COMMON_META}
    <style>body { font-family: 'Outfit', sans-serif; }</style>
</head>
<body class="bg-zinc-950 text-white">
    <nav class="p-6 flex justify-between items-center fixed w-full top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
        <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-sm"><i data-lucide="leaf"></i></div>
            <span class="text-xl font-black italic tracking-tighter uppercase">Vitality</span>
        </div>
        <div class="hidden md:flex gap-10 text-xs font-black uppercase tracking-widest">
            <a href="index.html" class="hover:text-emerald-600">Overview</a>
            <a href="features.html" class="hover:text-emerald-600">Science</a>
            <a href="pricing.html" class="text-emerald-600">Plans</a>
        </div>
    </nav>
    <main class="pt-48 px-6 max-w-7xl mx-auto pb-20">
        <h2 class="text-6xl font-black tracking-tighter mb-16 text-center uppercase">Choose your path.</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div class="bg-zinc-900 p-10 rounded-[40px] border border-white/5">
                <h3 class="text-2xl font-black mb-2 uppercase tracking-tight">Monthly</h3>
                <div class="text-5xl font-black mb-8">$19<span class="text-lg font-medium opacity-40">/mo</span></div>
                <ul class="space-y-4 text-zinc-400 mb-10 font-bold text-sm">
                    <li class="flex gap-3"><i data-lucide="check" class="text-emerald-500 w-4 h-4"></i> Full Bio-Tracking</li>
                    <li class="flex gap-3"><i data-lucide="check" class="text-emerald-500 w-4 h-4"></i> Daily Health Score</li>
                </ul>
                <button class="w-full bg-white text-black py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-zinc-200 transition-all">Subscribe Now</button>
            </div>
            <div class="bg-emerald-500 p-10 rounded-[40px] text-white shadow-2xl shadow-emerald-500/20">
                <h3 class="text-2xl font-black mb-2 uppercase tracking-tight">Annual</h3>
                <div class="text-5xl font-black mb-8">$149<span class="text-lg font-medium opacity-60">/yr</span></div>
                <ul class="space-y-4 text-emerald-100 mb-10 font-bold text-sm">
                    <li class="flex gap-3"><i data-lucide="check" class="text-white w-4 h-4"></i> All Monthly Features</li>
                    <li class="flex gap-3"><i data-lucide="check" class="text-white w-4 h-4"></i> 1:1 Coaching Call</li>
                </ul>
                <button class="w-full bg-zinc-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all">Best Value</button>
            </div>
        </div>
    </main>
    <script>lucide.createIcons();</script>
</body>
</html>`
      }
    }
  },
];
