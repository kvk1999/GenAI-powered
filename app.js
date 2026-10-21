/**
 * @file app.js
 * PlanCraft AI — Modular, High-Efficiency & Accessible Event Engine
 * @version 2.0.0
 */

'use strict';

/**
 * Escapes unsafe characters to neutralize XSS injection.
 * @param {string} str 
 * @returns {string} Sanitized string
 */
function escapeHTML(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[m]);
}

/**
 * Debounce utility to prevent unthrottled DOM re-renders.
 * @param {Function} fn 
 * @param {number} delay 
 * @returns {Function}
 */
function debounce(fn, delay = 250) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Preset Library
const eventPresets = {
    wedding: {
        title: "Maya & Alex's Bohemian Wedding",
        type: "wedding",
        vibe: "Bohemian Chic",
        guestCount: 150,
        budget: 25000,
        budgetItems: [
            { category: "Venue & Rentals", estimated: 8500, actual: 8200, status: "Booked" },
            { category: "Catering & Bar", estimated: 7500, actual: 7800, status: "Booked" },
            { category: "Photography & Video", estimated: 3200, actual: 3000, status: "Booked" },
            { category: "Florals & Decor", estimated: 2500, actual: 2200, status: "In Progress" },
            { category: "DJ & Live Sound", estimated: 1800, actual: 1600, status: "Booked" },
            { category: "Attire & Rings", estimated: 1500, actual: 1450, status: "Paid" }
        ],
        milestones: [
            { time: "6 Months Out", task: "Reserve ceremony and reception venue", done: true },
            { time: "4 Months Out", task: "Book caterer and schedule menu tasting", done: true },
            { time: "2 Months Out", task: "Send invitations & track RSVPs with dietary notes", done: false },
            { time: "2 Weeks Out", task: "Finalize seating chart and headcount with caterer", done: false },
            { time: "1 Day Prior", task: "Rehearsal dinner & hand off vendor coordinator contacts", done: false }
        ],
        schedule: [
            { time: "10:00 AM", event: "Bridal Party Hair & Makeup Prep", person: "Lead Stylist" },
            { time: "02:30 PM", event: "First Look & Couple Portraits", person: "Photographer" },
            { time: "04:30 PM", event: "Guest Arrival & Welcome Mocktail Spritz", person: "Host Team" },
            { time: "05:00 PM", event: "Ceremony Begins & Vows Exchange", person: "Officiant" },
            { time: "06:30 PM", event: "Banquet Dinner & Toast Speeches", person: "Catering Lead" },
            { time: "08:30 PM", event: "First Dance & Party Celebration", person: "DJ" }
        ],
        vendors: [
            { role: "Venue", name: "Sunstone Villa Gardens", fee: 8200, status: "Booked", contact: "events@sunstone.com" },
            { role: "Catering", name: "Artisan Feast Co.", fee: 7800, status: "Booked", contact: "555-019-2831" },
            { role: "Photography", name: "Lumière Photo Studios", fee: 3000, status: "Booked", contact: "photo@lumiere.com" },
            { role: "Florist", name: "Wild Bloom Florals", fee: 2200, status: "Contacted", contact: "orders@wildbloom.com" }
        ]
    },
    birthday: {
        title: "Liam's Retro 80s Synthwave 30th Birthday",
        type: "birthday",
        vibe: "Neon Synthwave",
        guestCount: 60,
        budget: 4500,
        budgetItems: [
            { category: "Venue Loft Rental", estimated: 1200, actual: 1200, status: "Booked" },
            { category: "Taco Truck & Craft Beer", estimated: 1500, actual: 1450, status: "Booked" },
            { category: "Arcade Games & Neon Decor", estimated: 800, actual: 850, status: "Booked" },
            { category: "DJ / Sound Setup", estimated: 600, actual: 550, status: "Booked" },
            { category: "Custom 80s Retro Cake", estimated: 400, actual: 380, status: "Paid" }
        ],
        milestones: [
            { time: "4 Weeks Out", task: "Book private rooftop or warehouse loft space", done: true },
            { time: "3 Weeks Out", task: "Send digital invites with dress code (Neon 80s)", done: true },
            { time: "1 Week Out", task: "Order custom retro cake & neon glow accessories", done: false },
            { time: "Event Day", task: "Setup arcade rentals & soundcheck", done: false }
        ],
        schedule: [
            { time: "06:00 PM", event: "Load-in & Neon Lighting Installation", person: "Planner" },
            { time: "07:30 PM", event: "Doors Open & Welcome Signature Cocktails", person: "Bartender" },
            { time: "08:45 PM", event: "Retro Trivia & Costume Contest", person: "Host" },
            { time: "09:30 PM", event: "Birthday Toast & Cake Cutting", person: "Liam's Friends" },
            { time: "10:00 PM", event: "Synthwave Dance Party", person: "DJ" }
        ],
        vendors: [
            { role: "Venue", name: "The Neon Loft Space", fee: 1200, status: "Booked", contact: "loft@venues.com" },
            { role: "Food Truck", name: "Baja Fire Tacos", fee: 1450, status: "Booked", contact: "555-332-9912" },
            { role: "Bakery", name: "Pixel Sweets Bakery", fee: 380, status: "Paid", contact: "cake@pixelsweets.com" }
        ]
    },
    community: {
        title: "Oakridge Harvest Charity Gala & Block Fair",
        type: "community",
        vibe: "Rustic Community Harvest",
        guestCount: 400,
        budget: 15000,
        budgetItems: [
            { category: "City Permit & Park Rental", estimated: 2000, actual: 2000, status: "Paid" },
            { category: "Stage, Sound & Tents", estimated: 4500, actual: 4300, status: "Booked" },
            { category: "Local Food Stalls", estimated: 3000, actual: 2800, status: "Booked" },
            { category: "Kids Activities & Games", estimated: 2500, actual: 2600, status: "Booked" },
            { category: "Safety & Volunteer First Aid", estimated: 1500, actual: 1500, status: "Booked" }
        ],
        milestones: [
            { time: "3 Months Out", task: "Submit city special event permit & safety plan", done: true },
            { time: "2 Months Out", task: "Recruit 20 volunteer coordinators & food vendors", done: true },
            { time: "1 Month Out", task: "Launch neighborhood flyers & online ticket registration", done: true },
            { time: "1 Week Out", task: "Confirm tent delivery & stage electrical hookups", done: false }
        ],
        schedule: [
            { time: "07:00 AM", event: "Vendor & Food Truck Staging in Park Lot", person: "Marshal Team" },
            { time: "10:00 AM", event: "Opening Ceremony & Council Welcome Speech", person: "Mayor / Council" },
            { time: "11:30 AM", event: "Live Local Bands & Craft Fair Open", person: "Stage Lead" },
            { time: "02:00 PM", event: "Pie Baking Contest & Silent Auction", person: "Volunteer Crew" },
            { time: "05:00 PM", event: "Closing Remarks & Volunteer Appreciation", person: "Event Chair" }
        ],
        vendors: [
            { role: "Staging/AV", name: "Metro Audio-Visual Rentals", fee: 4300, status: "Booked", contact: "sound@metroav.com" },
            { role: "City Permits", name: "Dept of Parks & Rec", fee: 2000, status: "Paid", contact: "permits@city.gov" },
            { role: "Security", name: "Guardian Patrol Services", fee: 1500, status: "Booked", contact: "555-888-0019" }
        ]
    }
};

// Cached DOM element dictionary for maximum query efficiency
const DOM = {};

// Active state
let state = JSON.parse(localStorage.getItem('plancraft_state') || 'null') || eventPresets.wedding;

function saveState() {
    try {
        localStorage.setItem('plancraft_state', JSON.stringify(state));
    } catch (err) {
        console.error("Storage error:", err);
    }
}

// Tab Switching
function switchTab(tabId) {
    ['ideas', 'budget', 'timeline', 'vendors'].forEach(id => {
        const section = document.getElementById(`content-${id}`);
        const tabBtn = document.getElementById(`tab-${id}`);
        if (!section || !tabBtn) return;
        if (id === tabId) {
            section.classList.remove('hidden');
            tabBtn.classList.add('text-fuchsia-600', 'border-b-2', 'border-fuchsia-600');
            tabBtn.setAttribute('aria-selected', 'true');
        } else {
            section.classList.add('hidden');
            tabBtn.classList.remove('text-fuchsia-600', 'border-b-2', 'border-fuchsia-600');
            tabBtn.setAttribute('aria-selected', 'false');
        }
    });
    if (window.lucide) window.lucide.createIcons();
}

// Budget Module
function renderBudget() {
    const committed = state.budgetItems.reduce((acc, i) => acc + (Number(i.actual) || 0), 0);
    const remaining = state.budget - committed;

    if (DOM.lblAllocated) DOM.lblAllocated.textContent = `$${state.budget.toLocaleString()}`;
    if (DOM.lblCommitted) DOM.lblCommitted.textContent = `$${committed.toLocaleString()}`;
    if (DOM.lblRemaining) {
        DOM.lblRemaining.textContent = `$${remaining.toLocaleString()}`;
        DOM.lblRemaining.className = remaining < 0 ? 'text-2xl font-bold text-red-600 mt-1' : 'text-2xl font-bold text-emerald-600 mt-1';
    }

    if (!DOM.budgetTableContainer) return;

    let html = `
    <div class="flex items-center justify-between mb-3">
      <div>
        <h3 class="text-sm font-bold text-slate-800">Budget Breakdown by Category</h3>
        <span class="text-[11px] text-slate-500">${committed > state.budget ? '⚠️ Warning: Over target budget' : '✓ Spending within allocated limit'}</span>
      </div>
      <button onclick="addBudgetItem()" class="px-3 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-xs font-semibold focus:ring-2 focus:ring-fuchsia-500">
        + Add Expense
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
          <tr>
            <th class="py-2.5 px-3">Category</th>
            <th class="py-2.5 px-3">Estimated ($)</th>
            <th class="py-2.5 px-3">Actual ($)</th>
            <th class="py-2.5 px-3">Status</th>
            <th class="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
  `;

    state.budgetItems.forEach((item, index) => {
        html += `
      <tr class="hover:bg-slate-50">
        <td class="py-2.5 px-3 font-semibold text-slate-800">${escapeHTML(item.category)}</td>
        <td class="py-2.5 px-3 text-slate-600">$${Number(item.estimated).toLocaleString()}</td>
        <td class="py-2.5 px-3 font-bold text-slate-900">$${Number(item.actual).toLocaleString()}</td>
        <td class="py-2.5 px-3">
          <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${item.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
            ${escapeHTML(item.status)}
          </span>
        </td>
        <td class="py-2.5 px-3 text-right">
          <button onclick="deleteBudgetItem(${index})" class="text-slate-400 hover:text-red-500 font-semibold" aria-label="Delete ${escapeHTML(item.category)}">
            Delete
          </button>
        </td>
      </tr>
    `;
    });

    html += `</tbody></table></div>`;
    DOM.budgetTableContainer.innerHTML = html;
}

function addBudgetItem() {
    const category = prompt("Category name (e.g. Venue, Decor, Music, Transportation):");
    if (!category) return;
    const estimated = Math.max(0, Number(prompt("Estimated budget ($):") || "0"));
    const actual = Math.max(0, Number(prompt("Actual cost ($):") || "0"));
    state.budgetItems.push({ category, estimated, actual, status: "Planned" });
    renderBudget();
    saveState();
}

function deleteBudgetItem(idx) {
    state.budgetItems.splice(idx, 1);
    renderBudget();
    saveState();
}

// Timeline Module
function renderTimeline() {
    if (DOM.milestoneItems) {
        const completed = state.milestones.filter(m => m.done).length;
        const pct = state.milestones.length ? Math.round((completed / state.milestones.length) * 100) : 0;

        let html = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-slate-600">Completion: ${pct}% (${completed}/${state.milestones.length})</span>
        <button onclick="addMilestone()" class="text-xs font-semibold text-fuchsia-600 hover:underline">+ Add Milestone</button>
      </div>
      <div class="w-full bg-slate-100 rounded-full h-1.5 mb-3">
        <div class="bg-fuchsia-600 h-1.5 rounded-full" style="width: ${pct}%"></div>
      </div>
    `;

        state.milestones.forEach((m, idx) => {
            html += `
        <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 mb-2">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" ${m.done ? 'checked' : ''} onchange="toggleMilestone(${idx})" class="w-4 h-4 rounded text-fuchsia-600 focus:ring-fuchsia-500" />
            <div>
              <span class="text-xs font-semibold text-slate-800 ${m.done ? 'line-through text-slate-400' : ''}">${escapeHTML(m.task)}</span>
              <p class="text-[10px] font-bold text-fuchsia-600">${escapeHTML(m.time)}</p>
            </div>
          </label>
          <button onclick="deleteMilestone(${idx})" class="text-slate-400 hover:text-red-500 text-xs font-bold" aria-label="Delete milestone">&times;</button>
        </div>
      `;
        });
        DOM.milestoneItems.innerHTML = html;
    }

    if (DOM.scheduleItems) {
        let html = `
      <div class="flex justify-end mb-2">
        <button onclick="addSchedule()" class="text-xs font-semibold text-fuchsia-600 hover:underline">+ Add Time Slot</button>
      </div>
    `;
        state.schedule.forEach((s, idx) => {
            html += `
        <div class="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50 mb-1">
          <div>
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-fuchsia-700">${escapeHTML(s.time)}</span>
              <span class="text-xs font-medium text-slate-800">${escapeHTML(s.event)}</span>
            </div>
            <span class="text-[10px] text-slate-400">Lead: ${escapeHTML(s.person)}</span>
          </div>
          <button onclick="deleteSchedule(${idx})" class="text-slate-400 hover:text-red-500 text-xs font-bold" aria-label="Delete schedule slot">&times;</button>
        </div>
      `;
        });
        DOM.scheduleItems.innerHTML = html;
    }
}

function toggleMilestone(idx) {
    state.milestones[idx].done = !state.milestones[idx].done;
    renderTimeline();
    saveState();
}

function addMilestone() {
    const task = prompt("Milestone task description:");
    if (!task) return;
    const time = prompt("Target timeframe (e.g. 1 Month Out):") || "Upcoming";
    state.milestones.push({ time, task, done: false });
    renderTimeline();
    saveState();
}

function deleteMilestone(idx) {
    state.milestones.splice(idx, 1);
    renderTimeline();
    saveState();
}

function addSchedule() {
    const time = prompt("Time slot (e.g. 05:30 PM):");
    if (!time) return;
    const event = prompt("Run of show event name:");
    const person = prompt("Person / Vendor responsible:") || "Host";
    state.schedule.push({ time, event, person });
    renderTimeline();
    saveState();
}

function deleteSchedule(idx) {
    state.schedule.splice(idx, 1);
    renderTimeline();
    saveState();
}

// Vendor Module
function renderVendors() {
    if (!DOM.vendorList) return;

    let html = `
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-slate-500">Pipeline progression: Shortlisted ➔ Contacted ➔ Booked ➔ Paid</span>
      <button onclick="addVendor()" class="px-3 py-1 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-xs font-semibold focus:ring-2 focus:ring-fuchsia-500">
        + Add Vendor
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead class="bg-slate-50 text-slate-500 border-b border-slate-200">
          <tr>
            <th class="py-2.5 px-3">Service Role</th>
            <th class="py-2.5 px-3">Vendor / Business</th>
            <th class="py-2.5 px-3">Fee ($)</th>
            <th class="py-2.5 px-3">Status</th>
            <th class="py-2.5 px-3">Contact</th>
            <th class="py-2.5 px-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
  `;

    state.vendors.forEach((v, idx) => {
        html += `
      <tr class="hover:bg-slate-50">
        <td class="py-2.5 px-3 font-semibold text-slate-800">${escapeHTML(v.role)}</td>
        <td class="py-2.5 px-3 text-slate-700 font-medium">${escapeHTML(v.name)}</td>
        <td class="py-2.5 px-3 font-bold text-slate-900">$${Number(v.fee).toLocaleString()}</td>
        <td class="py-2.5 px-3">
          <button onclick="cycleVendorStatus(${idx})" class="px-2 py-0.5 rounded-full text-[10px] font-semibold ${v.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'} hover:opacity-80" title="Click to cycle status">
            ${escapeHTML(v.status)} ⟳
          </button>
        </td>
        <td class="py-2.5 px-3 text-slate-500">${escapeHTML(v.contact || 'N/A')}</td>
        <td class="py-2.5 px-3 text-right">
          <button onclick="deleteVendor(${idx})" class="text-slate-400 hover:text-red-500 font-semibold" aria-label="Delete vendor">
            Delete
          </button>
        </td>
      </tr>
    `;
    });

    html += `</tbody></table></div>`;
    DOM.vendorList.innerHTML = html;
}

function cycleVendorStatus(idx) {
    const stages = ['Shortlisted', 'Contacted', 'Booked', 'Paid'];
    const cur = stages.indexOf(state.vendors[idx].status);
    state.vendors[idx].status = stages[(cur + 1) % stages.length];
    renderVendors();
    saveState();
}

function addVendor() {
    const role = prompt("Service role (e.g. Photography, Catering, Florals):");
    if (!role) return;
    const name = prompt("Business name:");
    const fee = Math.max(0, Number(prompt("Quoted fee ($):") || "0"));
    const contact = prompt("Contact email or phone:") || "";
    state.vendors.push({ role, name, fee, status: "Shortlisted", contact });
    renderVendors();
    saveState();
}

function deleteVendor(idx) {
    state.vendors.splice(idx, 1);
    renderVendors();
    saveState();
}

// GenAI Ideas Module (Personalized by Event Context)
function requestAi(category) {
    const header = document.getElementById('aiHeader');
    const body = document.getElementById('aiBody');
    if (!header || !body) return;

    const title = state.title || 'Event';
    const type = state.type || 'Celebration';
    const guests = state.guestCount || 100;
    const budget = state.budget || 10000;

    header.textContent = `Personalized GenAI ${category.toUpperCase()} Ideas`;
    body.textContent = `Analyzing parameters for ${title} (${guests} guests, $${budget.toLocaleString()} budget)...`;

    setTimeout(() => {
        if (category === 'theme') {
            body.textContent = `🎨 Tailored Aesthetic for ${title}:
• Color Palette:
  - Primary: Warm Ochre (#C86446)
  - Secondary: Eucalyptus Green (#8A9A86)
  - Accent: Champagne Shimmer (#D7C49E)
  - Base: Natural Linen (#FAF7F2)

✨ Decor Vision:
Designed for ${guests} guests within a $${budget.toLocaleString()} budget. Layer natural fiber table runners with clustered dried florals, brass accents, and low 2200K amber festoon lighting to create an intimate atmosphere.`;
        } else if (category === 'menu') {
            body.textContent = `🍽️ Custom Catering & Beverage Concept for ${guests} Attendees:
🍸 Signature Cocktails:
1. "The Harvest Dusk" (Bourbon, smoked blackberry reduction, charred rosemary)
2. "Botanical Meadow Tonic" (Elderflower spritz, blood orange wheel, fresh mint)

🍴 Multi-Course Progression:
- Hors d'oeuvres: Wild forest mushroom tartlet with herb chevre.
- Main Entrée: Pan-seared wild salmon over saffron risotto OR Fire-roasted spiced cauliflower steak.
- Dessert: Olive-oil lemon cake with lavender honey glaze.`;
        } else if (category === 'activities') {
            body.textContent = `🎲 Interactive Guest Experiences for ${guests} Guests:
1. "The Audio Telephone Guestbook": Vintage rotary telephone where attendees pick up the receiver to record unfiltered, voicemail-style memories and heartfelt wishes.
2. "Custom Table Icebreaker Prompt Cards": Tailored conversation starters reflecting the hosts' journey.
3. "Polaroid Keepsake Wall": Guests snap instant photos, sign them with metallic pens, and pin them onto a custom board.`;
        } else {
            body.textContent = `✍️ Tailored Welcome Address & Toast Outline:

"Good evening everyone. Looking out across this room tonight, surrounded by all ${guests} of you who have shaped our lives, words hardly do justice to how grateful we feel. 

Every single person here holds a meaningful chapter in this journey. Tonight is about celebrating connection, sharing exceptional food, and creating memories that will outlast the evening. Let's raise our glasses—cheers!"`;
        }
    }, 350);
}

// Master Render & Event Bindings
function cacheDomElements() {
    DOM.lblAllocated = document.getElementById('lblAllocated');
    DOM.lblCommitted = document.getElementById('lblCommitted');
    DOM.lblRemaining = document.getElementById('lblRemaining');
    DOM.budgetTableContainer = document.getElementById('budgetTableContainer');
    DOM.milestoneItems = document.getElementById('milestoneItems');
    DOM.scheduleItems = document.getElementById('scheduleItems');
    DOM.vendorList = document.getElementById('vendorList');
    DOM.eventTitle = document.getElementById('eventTitle');
    DOM.eventType = document.getElementById('eventType');
    DOM.guestCount = document.getElementById('guestCount');
    DOM.totalBudget = document.getElementById('totalBudget');
    DOM.exportBtn = document.getElementById('exportBtn');
}

function renderAll() {
    if (DOM.eventTitle) DOM.eventTitle.value = state.title;
    if (DOM.eventType) DOM.eventType.value = state.type;
    if (DOM.guestCount) DOM.guestCount.value = state.guestCount;
    if (DOM.totalBudget) DOM.totalBudget.value = state.budget;

    renderBudget();
    renderTimeline();
    renderVendors();
    if (window.lucide) window.lucide.createIcons();
}

function bindEvents() {
    DOM.eventType?.addEventListener('change', (e) => {
        const chosen = e.target.value;
        if (eventPresets[chosen]) {
            state = JSON.parse(JSON.stringify(eventPresets[chosen]));
            saveState();
            renderAll();
        }
    });

    // Debounced input listeners to prevent unneeded re-renders
    DOM.totalBudget?.addEventListener('input', debounce((e) => {
        state.budget = Math.max(0, Number(e.target.value) || 0);
        renderBudget();
        saveState();
    }, 200));

    DOM.guestCount?.addEventListener('input', debounce((e) => {
        state.guestCount = Math.max(1, Number(e.target.value) || 1);
        saveState();
    }, 200));

    DOM.eventTitle?.addEventListener('input', debounce((e) => {
        state.title = e.target.value.trim();
        saveState();
    }, 200));

    DOM.exportBtn?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(state.title || 'event').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_plan.json`;
        a.click();
    });
}

window.addEventListener('DOMContentLoaded', () => {
    cacheDomElements();
    bindEvents();
    renderAll();
});