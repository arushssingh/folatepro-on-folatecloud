import { ProjectType } from '../types';
import type { Template } from './templates-types';

export const TEMPLATES: Template[] = [
  {
    id: 'mobile-fitness-tracker',
    name: 'FitTrack',
    description: 'Fitness tracker with workout logs, progress stats, exercise library, and a personal profile screen.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=600&h=400',
    category: 'Health & Fitness',
    projectType: ProjectType.MOBILE_APP,
    files: {
      'index.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>FitTrack</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
    body { background: #f0f4f8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .screen { display: none; }
    .screen.active { display: flex; flex-direction: column; }
    .btn-press:active { transform: scale(0.97); }
    .nav-tab.active-tab svg { color: #6366f1; }
    .nav-tab.active-tab span { color: #6366f1; }
    .progress-ring { transition: stroke-dashoffset 0.6s ease; }
    ::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center bg-gray-200">
<div id="app" class="relative w-full max-w-[390px] mx-auto bg-gray-50 min-h-screen flex flex-col overflow-hidden shadow-2xl">

  <!-- Status Bar -->
  <div class="bg-indigo-600 px-5 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
    <span class="text-white text-xs font-semibold">9:41</span>
    <div class="flex items-center gap-1.5">
      <i data-lucide="signal" class="w-3.5 h-3.5 text-white"></i>
      <i data-lucide="wifi" class="w-3.5 h-3.5 text-white"></i>
      <i data-lucide="battery-full" class="w-4 h-4 text-white"></i>
    </div>
  </div>

  <!-- Screens -->

  <!-- Home Screen -->
  <div id="screen-home" class="screen active flex-1 overflow-y-auto pb-20">
    <div class="bg-indigo-600 px-5 pt-4 pb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <p class="text-indigo-200 text-sm">Good morning,</p>
          <h1 class="text-white text-xl font-bold">Alex Johnson</h1>
        </div>
        <div onclick="showScreen('screen-profile')" class="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 cursor-pointer">
          <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=80&h=80&q=80" class="w-full h-full object-cover" />
        </div>
      </div>
      <div class="bg-white/20 rounded-2xl p-4">
        <p class="text-white/80 text-xs mb-1">Today's Goal</p>
        <div class="flex items-end justify-between">
          <div>
            <span class="text-white text-3xl font-black">6,240</span>
            <span class="text-white/70 text-sm ml-1">/ 10,000 steps</span>
          </div>
          <span class="text-white/80 text-xs">62%</span>
        </div>
        <div class="mt-2 h-2 bg-white/30 rounded-full overflow-hidden">
          <div class="h-full bg-white rounded-full" style="width: 62%"></div>
        </div>
      </div>
    </div>

    <div class="px-5 -mt-4">
      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-3 mb-6">
        <div class="bg-white rounded-2xl p-3 text-center shadow-sm">
          <i data-lucide="flame" class="w-5 h-5 text-orange-500 mx-auto mb-1"></i>
          <p class="text-gray-900 font-bold text-base">420</p>
          <p class="text-gray-400 text-[10px]">Calories</p>
        </div>
        <div class="bg-white rounded-2xl p-3 text-center shadow-sm">
          <i data-lucide="clock" class="w-5 h-5 text-blue-500 mx-auto mb-1"></i>
          <p class="text-gray-900 font-bold text-base">47</p>
          <p class="text-gray-400 text-[10px]">Min Active</p>
        </div>
        <div class="bg-white rounded-2xl p-3 text-center shadow-sm">
          <i data-lucide="heart-pulse" class="w-5 h-5 text-red-500 mx-auto mb-1"></i>
          <p class="text-gray-900 font-bold text-base">72</p>
          <p class="text-gray-400 text-[10px]">Avg BPM</p>
        </div>
      </div>

      <!-- Today's Workout -->
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-gray-900 font-bold text-base">Today's Workout</h2>
        <button onclick="showScreen('screen-workouts')" class="text-indigo-600 text-xs font-semibold">See All</button>
      </div>
      <div onclick="showScreen('screen-workouts')" class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 mb-4 cursor-pointer btn-press shadow-lg shadow-indigo-200">
        <div class="flex items-center justify-between mb-3">
          <div>
            <p class="text-white/80 text-xs">Next Up</p>
            <p class="text-white font-bold text-lg">Upper Body Strength</p>
          </div>
          <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <i data-lucide="dumbbell" class="w-5 h-5 text-white"></i>
          </div>
        </div>
        <div class="flex items-center gap-4 text-white/80 text-xs">
          <span class="flex items-center gap-1"><i data-lucide="clock" class="w-3 h-3"></i> 45 min</span>
          <span class="flex items-center gap-1"><i data-lucide="zap" class="w-3 h-3"></i> 380 cal</span>
          <span class="flex items-center gap-1"><i data-lucide="layers" class="w-3 h-3"></i> 6 exercises</span>
        </div>
      </div>

      <!-- Recent Activity -->
      <h2 class="text-gray-900 font-bold text-base mb-3">Recent Activity</h2>
      <div class="space-y-2">
        ${[
          { name: 'Morning Run', time: '7:30 AM', cal: 310, icon: 'footprints', color: 'bg-green-50', iconColor: 'text-green-600' },
          { name: 'Yoga Flow', time: 'Yesterday', cal: 180, icon: 'wind', color: 'bg-purple-50', iconColor: 'text-purple-600' },
          { name: 'Cycling', time: 'Mon', cal: 420, icon: 'bike', color: 'bg-blue-50', iconColor: 'text-blue-600' },
        ].map(a => `
        <div class="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm">
          <div class="w-9 h-9 ${a.color} rounded-xl flex items-center justify-center flex-shrink-0">
            <i data-lucide="${a.icon}" class="w-4 h-4 ${a.iconColor}"></i>
          </div>
          <div class="flex-1">
            <p class="text-gray-900 text-sm font-semibold">${a.name}</p>
            <p class="text-gray-400 text-xs">${a.time}</p>
          </div>
          <span class="text-orange-500 text-xs font-bold">${a.cal} cal</span>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Workouts Screen -->
  <div id="screen-workouts" class="screen flex-1 overflow-y-auto pb-20">
    <div class="bg-white px-5 pt-4 pb-4 border-b border-gray-100">
      <h1 class="text-gray-900 text-xl font-bold">Workouts</h1>
      <div class="flex gap-2 mt-3">
        <button class="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">All</button>
        <button class="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-1.5 rounded-full">Strength</button>
        <button class="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-1.5 rounded-full">Cardio</button>
        <button class="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-1.5 rounded-full">Yoga</button>
      </div>
    </div>
    <div class="px-5 py-4 space-y-3">
      ${[
        { name: 'Upper Body Strength', duration: '45 min', cal: 380, level: 'Intermediate', img: 'photo-1581009146145-b5ef050c2e1e', color: 'from-indigo-500 to-purple-600' },
        { name: 'HIIT Cardio Blast', duration: '30 min', cal: 520, level: 'Advanced', img: 'photo-1476480862126-209bfaa8edc8', color: 'from-orange-500 to-red-500' },
        { name: 'Morning Yoga Flow', duration: '25 min', cal: 180, level: 'Beginner', img: 'photo-1544367567-0f2fcb009e0b', color: 'from-emerald-500 to-teal-600' },
        { name: 'Core & Abs', duration: '20 min', cal: 200, level: 'Intermediate', img: 'photo-1571019613454-1cb2f99b2d8b', color: 'from-blue-500 to-cyan-600' },
      ].map(w => `
      <div class="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer btn-press">
        <div class="relative h-28 bg-gradient-to-r ${w.color} overflow-hidden">
          <img src="https://images.unsplash.com/${w.img}?auto=format&fit=crop&w=400&h=150&q=80" class="w-full h-full object-cover mix-blend-overlay opacity-50" />
          <div class="absolute inset-0 p-4 flex flex-col justify-end">
            <p class="text-white font-bold text-base">${w.name}</p>
            <div class="flex items-center gap-3 text-white/80 text-xs mt-1">
              <span>${w.duration}</span><span>·</span><span>${w.cal} cal</span>
            </div>
          </div>
          <span class="absolute top-3 right-3 bg-white/20 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">${w.level}</span>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Stats Screen -->
  <div id="screen-stats" class="screen flex-1 overflow-y-auto pb-20">
    <div class="bg-white px-5 pt-4 pb-4 border-b border-gray-100">
      <h1 class="text-gray-900 text-xl font-bold">Progress</h1>
      <div class="flex gap-2 mt-3">
        <button class="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full">Week</button>
        <button class="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-1.5 rounded-full">Month</button>
        <button class="bg-gray-100 text-gray-600 text-xs font-semibold px-4 py-1.5 rounded-full">Year</button>
      </div>
    </div>
    <div class="px-5 py-4 space-y-4">
      <!-- Steps Chart -->
      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <p class="text-gray-900 font-bold text-sm mb-4">Steps This Week</p>
        <div class="flex items-end gap-1.5 h-24">
          ${[7200, 5400, 9800, 6100, 8300, 6240, 0].map((val, i) => {
            const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
            const h = Math.round((val / 10000) * 96);
            const active = i === 5;
            return `<div class="flex-1 flex flex-col items-center gap-1">
              <div class="w-full rounded-t-lg ${active ? 'bg-indigo-600' : 'bg-gray-100'}" style="height:${h}px"></div>
              <span class="text-[9px] ${active ? 'text-indigo-600 font-bold' : 'text-gray-400'}">${days[i]}</span>
            </div>`;
          }).join('')}
        </div>
      </div>
      <!-- Stats grid -->
      <div class="grid grid-cols-2 gap-3">
        ${[
          { label: 'Total Workouts', val: '24', sub: 'this month', icon: 'dumbbell', color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Calories Burned', val: '8,420', sub: 'this month', icon: 'flame', color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Active Minutes', val: '640', sub: 'this month', icon: 'clock', color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Avg Heart Rate', val: '74 bpm', sub: 'resting', icon: 'heart-pulse', color: 'text-red-600', bg: 'bg-red-50' },
        ].map(s => `
        <div class="bg-white rounded-2xl p-4 shadow-sm">
          <div class="w-8 h-8 ${s.bg} rounded-xl flex items-center justify-center mb-2">
            <i data-lucide="${s.icon}" class="w-4 h-4 ${s.color}"></i>
          </div>
          <p class="text-gray-900 font-bold text-lg">${s.val}</p>
          <p class="text-gray-400 text-[10px] mt-0.5">${s.label}</p>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Profile Screen -->
  <div id="screen-profile" class="screen flex-1 overflow-y-auto pb-20">
    <div class="bg-gradient-to-b from-indigo-600 to-indigo-500 px-5 pt-4 pb-12">
      <h1 class="text-white text-xl font-bold mb-4">Profile</h1>
      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-full overflow-hidden border-4 border-white/40">
          <img src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=80&h=80&q=80" class="w-full h-full object-cover" />
        </div>
        <div>
          <p class="text-white font-bold text-lg">Alex Johnson</p>
          <p class="text-white/70 text-sm">alex@example.com</p>
        </div>
      </div>
    </div>
    <div class="px-5 -mt-6 space-y-3">
      <div class="grid grid-cols-3 gap-3">
        ${[{ val: '24', label: 'Workouts' }, { val: '68 kg', label: 'Weight' }, { val: '12.4%', label: 'Body Fat' }].map(s => `
        <div class="bg-white rounded-2xl p-3 text-center shadow-sm">
          <p class="text-gray-900 font-bold text-base">${s.val}</p>
          <p class="text-gray-400 text-[10px]">${s.label}</p>
        </div>`).join('')}
      </div>
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
        ${[
          { icon: 'target', label: 'My Goals' },
          { icon: 'bell', label: 'Notifications' },
          { icon: 'shield', label: 'Privacy' },
          { icon: 'settings', label: 'Settings' },
        ].map(item => `
        <div class="flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 last:border-0 cursor-pointer btn-press">
          <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center">
            <i data-lucide="${item.icon}" class="w-4 h-4 text-gray-600"></i>
          </div>
          <span class="text-gray-800 text-sm font-medium flex-1">${item.label}</span>
          <i data-lucide="chevron-right" class="w-4 h-4 text-gray-300"></i>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Bottom Nav -->
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-100 px-2 pb-5 pt-2 flex justify-around z-50">
    <button onclick="showScreen('screen-home')" id="nav-home" class="nav-tab active-tab flex flex-col items-center gap-0.5 px-3 py-1 btn-press">
      <i data-lucide="home" class="w-5 h-5 text-gray-400"></i>
      <span class="text-[10px] text-gray-400 font-medium">Home</span>
    </button>
    <button onclick="showScreen('screen-workouts')" id="nav-workouts" class="nav-tab flex flex-col items-center gap-0.5 px-3 py-1 btn-press">
      <i data-lucide="dumbbell" class="w-5 h-5 text-gray-400"></i>
      <span class="text-[10px] text-gray-400 font-medium">Workouts</span>
    </button>
    <button onclick="showScreen('screen-stats')" id="nav-stats" class="nav-tab flex flex-col items-center gap-0.5 px-3 py-1 btn-press">
      <i data-lucide="bar-chart-2" class="w-5 h-5 text-gray-400"></i>
      <span class="text-[10px] text-gray-400 font-medium">Stats</span>
    </button>
    <button onclick="showScreen('screen-profile')" id="nav-profile" class="nav-tab flex flex-col items-center gap-0.5 px-3 py-1 btn-press">
      <i data-lucide="user" class="w-5 h-5 text-gray-400"></i>
      <span class="text-[10px] text-gray-400 font-medium">Profile</span>
    </button>
  </div>

</div>
<script>
  const screenNavMap = {
    'screen-home': 'nav-home',
    'screen-workouts': 'nav-workouts',
    'screen-stats': 'nav-stats',
    'screen-profile': 'nav-profile',
  };
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active-tab'));
    const navId = screenNavMap[id];
    if (navId) document.getElementById(navId)?.classList.add('active-tab');
    lucide.createIcons();
  }
  lucide.createIcons();
</script>
</body>
</html>`
      }
    }
  },
  {
    id: 'mobile-food-delivery',
    name: 'QuickBite',
    description: 'Food delivery app with restaurant listings, menu browsing, cart management, and order tracking.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600&h=400',
    category: 'Food & Delivery',
    projectType: ProjectType.MOBILE_APP,
    files: {
      'index.html': {
        language: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
  <title>QuickBite</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
    body { background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .screen { display: none; }
    .screen.active { display: flex; flex-direction: column; }
    .btn-press:active { transform: scale(0.97); }
    .nav-tab.active-tab svg { color: #ef4444; }
    .nav-tab.active-tab span { color: #ef4444; }
    ::-webkit-scrollbar { display: none; }
  </style>
</head>
<body class="min-h-screen flex items-center justify-center bg-gray-300">
<div id="app" class="relative w-full max-w-[390px] mx-auto bg-gray-50 min-h-screen flex flex-col overflow-hidden shadow-2xl">

  <!-- Status Bar -->
  <div id="statusBar" class="bg-white px-5 pt-3 pb-2 flex items-center justify-between flex-shrink-0">
    <span class="text-gray-900 text-xs font-semibold">9:41</span>
    <div class="flex items-center gap-1.5">
      <i data-lucide="signal" class="w-3.5 h-3.5 text-gray-700"></i>
      <i data-lucide="wifi" class="w-3.5 h-3.5 text-gray-700"></i>
      <i data-lucide="battery-full" class="w-4 h-4 text-gray-700"></i>
    </div>
  </div>

  <!-- Home Screen -->
  <div id="screen-home" class="screen active flex-1 overflow-y-auto pb-20">
    <div class="bg-white px-5 pb-4">
      <div class="flex items-center justify-between mb-1">
        <div>
          <p class="text-gray-500 text-xs">Deliver to</p>
          <button class="flex items-center gap-1 text-gray-900 font-bold text-sm">
            123 Main Street <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-red-500"></i>
          </button>
        </div>
        <div class="relative">
          <button onclick="showScreen('screen-cart')" class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center btn-press">
            <i data-lucide="shopping-bag" class="w-5 h-5 text-gray-700"></i>
          </button>
          <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">3</span>
        </div>
      </div>
      <div class="mt-3 flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
        <i data-lucide="search" class="w-4 h-4 text-gray-400 flex-shrink-0"></i>
        <span class="text-gray-400 text-sm">Search restaurants, cuisine...</span>
      </div>
    </div>

    <div class="px-5 py-3">
      <!-- Categories -->
      <div class="flex gap-3 overflow-x-auto pb-1 mb-5">
        ${[
          { icon: '🍕', label: 'Pizza' },
          { icon: '🍔', label: 'Burgers' },
          { icon: '🍣', label: 'Sushi' },
          { icon: '🌮', label: 'Mexican' },
          { icon: '🍜', label: 'Noodles' },
          { icon: '🥗', label: 'Salads' },
        ].map((c, i) => `
        <button class="flex flex-col items-center gap-1.5 flex-shrink-0 btn-press ${i === 0 ? 'opacity-100' : 'opacity-70'}">
          <div class="w-14 h-14 ${i === 0 ? 'bg-red-50 border-2 border-red-400' : 'bg-white border border-gray-200'} rounded-2xl flex items-center justify-center text-2xl shadow-sm">
            ${c.icon}
          </div>
          <span class="text-[11px] ${i === 0 ? 'text-red-500 font-bold' : 'text-gray-500'}">${c.label}</span>
        </button>`).join('')}
      </div>

      <!-- Featured -->
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-gray-900 font-bold text-base">Featured</h2>
        <button class="text-red-500 text-xs font-semibold">See All</button>
      </div>
      <div class="flex gap-3 overflow-x-auto pb-1 mb-5">
        ${[
          { name: "Luigi's Pizza", tag: '25-35 min', offer: '20% OFF', img: 'photo-1565299624946-b28f40a0ae38', rating: 4.8 },
          { name: 'Sakura Sushi', tag: '30-40 min', offer: 'Free delivery', img: 'photo-1514190051997-0f6f39ca5cde', rating: 4.9 },
        ].map(r => `
        <div onclick="showScreen('screen-menu')" class="flex-shrink-0 w-52 bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer btn-press">
          <div class="relative h-32">
            <img src="https://images.unsplash.com/${r.img}?auto=format&fit=crop&w=220&h=130&q=80" class="w-full h-full object-cover" />
            <span class="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">${r.offer}</span>
          </div>
          <div class="p-3">
            <p class="text-gray-900 font-bold text-sm">${r.name}</p>
            <div class="flex items-center justify-between mt-1">
              <span class="text-gray-400 text-xs">${r.tag}</span>
              <span class="flex items-center gap-0.5 text-xs font-semibold text-amber-500">⭐ ${r.rating}</span>
            </div>
          </div>
        </div>`).join('')}
      </div>

      <!-- Nearby Restaurants -->
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-gray-900 font-bold text-base">Nearby</h2>
        <button class="text-red-500 text-xs font-semibold">Map View</button>
      </div>
      <div class="space-y-3">
        ${[
          { name: "Burger Palace", cuisine: 'American • Burgers', time: '20-30 min', img: 'photo-1568901346375-23c9450c58cd', rating: 4.6, fee: '$1.99' },
          { name: 'Green Bowl', cuisine: 'Healthy • Salads', time: '15-25 min', img: 'photo-1512621776951-a57141f2eefd', rating: 4.7, fee: 'Free' },
          { name: 'Taco Fiesta', cuisine: 'Mexican • Wraps', time: '25-35 min', img: 'photo-1565299585323-38d6b0865b47', rating: 4.5, fee: '$0.99' },
        ].map(r => `
        <div onclick="showScreen('screen-menu')" class="bg-white rounded-2xl flex gap-3 p-3 shadow-sm cursor-pointer btn-press">
          <img src="https://images.unsplash.com/${r.img}?auto=format&fit=crop&w=80&h=80&q=80" class="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <p class="text-gray-900 font-bold text-sm">${r.name}</p>
              <span class="flex items-center gap-0.5 text-xs font-semibold text-amber-500 flex-shrink-0 ml-1">⭐ ${r.rating}</span>
            </div>
            <p class="text-gray-400 text-xs mt-0.5">${r.cuisine}</p>
            <div class="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
              <span class="flex items-center gap-0.5"><i data-lucide="clock" class="w-3 h-3"></i> ${r.time}</span>
              <span>·</span>
              <span class="${r.fee === 'Free' ? 'text-green-600 font-semibold' : ''}">${r.fee} delivery</span>
            </div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>

  <!-- Menu Screen -->
  <div id="screen-menu" class="screen flex-1 overflow-y-auto pb-20">
    <div class="relative h-44 flex-shrink-0">
      <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&h=180&q=80" class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <button onclick="showScreen('screen-home')" class="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow btn-press">
        <i data-lucide="chevron-left" class="w-4 h-4 text-gray-700"></i>
      </button>
      <div class="absolute bottom-3 left-4">
        <p class="text-white font-black text-xl">Luigi's Pizza</p>
        <div class="flex items-center gap-2 text-white/80 text-xs">
          <span>⭐ 4.8</span><span>·</span><span>25-35 min</span><span>·</span><span>$1.99 delivery</span>
        </div>
      </div>
    </div>

    <div class="bg-white px-4 py-3 border-b border-gray-100">
      <div class="flex gap-2 overflow-x-auto">
        ${['Popular', 'Pizzas', 'Sides', 'Drinks', 'Desserts'].map((c, i) => `
        <button class="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full ${i === 0 ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'}">${c}</button>`).join('')}
      </div>
    </div>

    <div class="px-4 py-3 space-y-3">
      ${[
        { name: 'Margherita Classic', desc: 'San Marzano tomatoes, fresh mozzarella, basil', price: '$14.99', img: 'photo-1574071318508-1cdbab80d002', tag: '⭐ Popular' },
        { name: 'Pepperoni Supreme', desc: 'Double pepperoni, mozzarella, oregano', price: '$16.99', img: 'photo-1534308983496-4fabb1a015ee', tag: '' },
        { name: 'BBQ Chicken Pizza', desc: 'Grilled chicken, BBQ sauce, red onions, cilantro', price: '$17.99', img: 'photo-1565299624946-b28f40a0ae38', tag: '🔥 Hot' },
      ].map(item => `
      <div class="bg-white rounded-2xl p-3 shadow-sm flex gap-3">
        <img src="https://images.unsplash.com/${item.img}?auto=format&fit=crop&w=80&h=80&q=80" class="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
        <div class="flex-1">
          <div class="flex items-start justify-between gap-2">
            <div>
              ${item.tag ? `<span class="text-[10px] font-bold text-red-500">${item.tag}</span>` : ''}
              <p class="text-gray-900 font-bold text-sm">${item.name}</p>
              <p class="text-gray-400 text-[11px] mt-0.5 line-clamp-2">${item.desc}</p>
            </div>
          </div>
          <div class="flex items-center justify-between mt-2">
            <span class="text-gray-900 font-bold text-sm">${item.price}</span>
            <button onclick="showScreen('screen-cart')" class="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center btn-press">
              <i data-lucide="plus" class="w-3.5 h-3.5 text-white"></i>
            </button>
          </div>
        </div>
      </div>`).join('')}
    </div>
  </div>

  <!-- Cart Screen -->
  <div id="screen-cart" class="screen flex-1 overflow-y-auto pb-20">
    <div class="bg-white px-5 pt-4 pb-4 border-b border-gray-100">
      <div class="flex items-center gap-3">
        <button onclick="showScreen('screen-home')" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center btn-press">
          <i data-lucide="chevron-left" class="w-4 h-4 text-gray-700"></i>
        </button>
        <h1 class="text-gray-900 text-xl font-bold">Your Cart</h1>
      </div>
      <p class="text-gray-400 text-xs mt-1 ml-11">Luigi's Pizza</p>
    </div>
    <div class="px-5 py-4 space-y-3">
      ${[
        { name: 'Margherita Classic', size: 'Large', price: 14.99 },
        { name: 'Pepperoni Supreme', size: 'Medium', price: 16.99 },
        { name: 'Garlic Bread', size: 'x1', price: 4.99 },
      ].map(item => `
      <div class="bg-white rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
        <div class="flex items-center gap-2">
          <button class="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center btn-press">
            <i data-lucide="minus" class="w-3.5 h-3.5 text-gray-600"></i>
          </button>
          <span class="text-gray-900 font-bold text-sm w-4 text-center">1</span>
          <button class="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center btn-press">
            <i data-lucide="plus" class="w-3.5 h-3.5 text-white"></i>
          </button>
        </div>
        <div class="flex-1">
          <p class="text-gray-900 font-semibold text-sm">${item.name}</p>
          <p class="text-gray-400 text-xs">${item.size}</p>
        </div>
        <span class="text-gray-900 font-bold text-sm">$${item.price.toFixed(2)}</span>
      </div>`).join('')}

      <div class="bg-white rounded-2xl p-4 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <i data-lucide="tag" class="w-4 h-4 text-gray-400"></i>
          <span class="text-gray-500 text-sm">Apply coupon code</span>
        </div>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between text-gray-500"><span>Subtotal</span><span>$36.97</span></div>
          <div class="flex justify-between text-gray-500"><span>Delivery fee</span><span>$1.99</span></div>
          <div class="flex justify-between text-gray-500"><span>Service fee</span><span>$1.00</span></div>
          <div class="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
            <span>Total</span><span>$39.96</span>
          </div>
        </div>
      </div>
    </div>
    <div class="px-5 pb-6">
      <button onclick="showScreen('screen-tracking')" class="w-full bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-200 btn-press text-sm">
        Place Order · $39.96
      </button>
    </div>
  </div>

  <!-- Tracking Screen -->
  <div id="screen-tracking" class="screen flex-1 overflow-y-auto pb-20">
    <div class="bg-white px-5 pt-4 pb-4 border-b border-gray-100">
      <h1 class="text-gray-900 text-xl font-bold">Order Tracking</h1>
      <p class="text-gray-400 text-xs mt-0.5">Order #QB-28491</p>
    </div>
    <div class="px-5 py-4">
      <div class="bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl p-5 mb-5 text-center">
        <p class="text-white/80 text-sm mb-1">Estimated Arrival</p>
        <p class="text-white font-black text-4xl">23 min</p>
        <p class="text-white/70 text-xs mt-1">Your order is on the way!</p>
      </div>
      <!-- Steps -->
      <div class="bg-white rounded-2xl p-4 shadow-sm space-y-4">
        ${[
          { label: 'Order Confirmed', sub: '9:41 AM', done: true },
          { label: 'Being Prepared', sub: '9:45 AM · Estimated', done: true },
          { label: 'Out for Delivery', sub: 'Now · In progress', done: true, active: true },
          { label: 'Delivered', sub: '~10:04 AM · Estimated', done: false },
        ].map((step, i, arr) => `
        <div class="flex gap-3 items-start">
          <div class="flex flex-col items-center">
            <div class="w-7 h-7 rounded-full flex items-center justify-center ${step.done ? 'bg-red-500' : 'bg-gray-200'} flex-shrink-0">
              <i data-lucide="${step.done ? 'check' : 'circle'}" class="w-3.5 h-3.5 ${step.done ? 'text-white' : 'text-gray-400'}"></i>
            </div>
            ${i < arr.length - 1 ? `<div class="w-0.5 h-6 ${step.done ? 'bg-red-300' : 'bg-gray-200'} mt-1"></div>` : ''}
          </div>
          <div class="flex-1 pt-0.5">
            <p class="text-sm ${step.done ? 'text-gray-900 font-semibold' : 'text-gray-400'}">${step.label}</p>
            <p class="text-xs text-gray-400 mt-0.5">${step.sub}</p>
          </div>
        </div>`).join('')}
      </div>

      <div class="bg-white rounded-2xl p-4 shadow-sm mt-3 flex items-center gap-3">
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=50&h=50&q=80" class="w-12 h-12 rounded-full object-cover" />
        <div class="flex-1">
          <p class="text-gray-900 font-bold text-sm">Marco Delivery</p>
          <div class="flex items-center gap-1 text-xs text-amber-500">⭐ 4.9 · 238 deliveries</div>
        </div>
        <button class="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center btn-press">
          <i data-lucide="phone" class="w-4 h-4 text-red-500"></i>
        </button>
        <button class="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center btn-press">
          <i data-lucide="message-circle" class="w-4 h-4 text-red-500"></i>
        </button>
      </div>
    </div>
  </div>

  <!-- Bottom Nav -->
  <div class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] bg-white border-t border-gray-100 px-2 pb-5 pt-2 flex justify-around z-50">
    <button onclick="showScreen('screen-home')" id="nav-home" class="nav-tab active-tab flex flex-col items-center gap-0.5 px-3 py-1 btn-press">
      <i data-lucide="home" class="w-5 h-5 text-gray-400"></i>
      <span class="text-[10px] text-gray-400 font-medium">Home</span>
    </button>
    <button onclick="showScreen('screen-menu')" id="nav-search" class="nav-tab flex flex-col items-center gap-0.5 px-3 py-1 btn-press">
      <i data-lucide="search" class="w-5 h-5 text-gray-400"></i>
      <span class="text-[10px] text-gray-400 font-medium">Explore</span>
    </button>
    <button onclick="showScreen('screen-cart')" id="nav-cart" class="nav-tab relative flex flex-col items-center gap-0.5 px-3 py-1 btn-press">
      <i data-lucide="shopping-bag" class="w-5 h-5 text-gray-400"></i>
      <span class="absolute top-0.5 right-1 w-4 h-4 bg-red-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full">3</span>
      <span class="text-[10px] text-gray-400 font-medium">Cart</span>
    </button>
    <button onclick="showScreen('screen-tracking')" id="nav-orders" class="nav-tab flex flex-col items-center gap-0.5 px-3 py-1 btn-press">
      <i data-lucide="package" class="w-5 h-5 text-gray-400"></i>
      <span class="text-[10px] text-gray-400 font-medium">Orders</span>
    </button>
  </div>

</div>
<script>
  const screenNavMap = {
    'screen-home': 'nav-home',
    'screen-menu': 'nav-search',
    'screen-cart': 'nav-cart',
    'screen-tracking': 'nav-orders',
  };
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active');
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active-tab'));
    const navId = screenNavMap[id];
    if (navId) document.getElementById(navId)?.classList.add('active-tab');
    lucide.createIcons();
  }
  lucide.createIcons();
</script>
</body>
</html>`
      }
    }
  },
];
