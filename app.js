/**
 * @file app.js
 * PlanCraft AI — Complete, Accessible, and Fully Rendered Event Engine
 */

'use strict';

// --- Safe HTML Sanitizer (Prevents XSS) ---
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

// --- Event Presets ---
const eventData = {
    wedding: {
        title: "Maya & Alex's Bohemian Wedding",
        type: "wedding",
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

// Current active state (auto-restored from LocalStorage if available)
let state = JSON.parse(localStorage.getItem('plancraft_state') || 'null') || eventData.wedding;

function saveState() {
    localStorage.setItem('plancraft_state', JSON.stringify(state));
}

// --- Tab Switching ---
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

// --- Render 1: Budget Stats and Table ---
function renderBudget() {
    const committed = state.budgetItems.reduce((acc, i) => acc + (Number(i.actual) || 0), 0);
    const remaining = state.budget - committed;

    const elAllocated = document.getElementById('lblAllocated');
    const elCommitted = document.getElementById('lblCommitted');
    const elRemaining = document.getElementById('lblRemaining');

    if (elAllocated) elAllocated.textContent = `$${state.budget.toLocaleString()}`;
    if (elCommitted) elCommitted.textContent = `$${committed.toLocaleString()}`;
    if (elRemaining) {
        elRemaining.textContent = `$${remaining.toLocaleString()}`;
        elRemaining.className = remaining < 0 ? 'text-2xl font-bold text-red-600 mt-1' : 'text-2xl font-bold text-emerald-600 mt-1';
    }

    const container = document.getElementById('budgetTableContainer');
    if (!container) return;

    let html = `
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-sm font-bold text-slate-800">Budget Breakdown by Category</h3>
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
    container.innerHTML = html;
}

function addBudgetItem() {
    const category = prompt("Enter expense category name (e.g., Lighting, Invitations, Favors):");
    if (!category) return;
    const estimated = Number(prompt("Estimated Cost ($):") || "0");
    const actual = Number(prompt("Actual Cost ($):") || "0");
    state.budgetItems.push({ category, estimated, actual, status: "Planned" });
    renderBudget();
    saveState();
}

function deleteBudgetItem(idx) {
    state.budgetItems.splice(idx, 1);
    renderBudget();
    saveState();
}

// --- Render 2: Timelines & Milestones ---
function renderTimeline() {
    // Milestones
    const milestoneContainer = document.getElementById('milestoneItems');
    if (milestoneContainer) {
        let html = `
      <div class="flex justify-end mb-2">
        <button onclick="addMilestone()" class="text-xs font-semibold text-fuchsia-600 hover:underline">+ Add Milestone</button>
      </div>
    `;
        state.milestones.forEach((m, idx) => {
            html += `
        <div class="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100">
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
        milestoneContainer.innerHTML = html;
    }

    // Schedule
    const scheduleContainer = document.getElementById('scheduleItems');
    if (scheduleContainer) {
        let html = `
      <div class="flex justify-end mb-2">
        <button onclick="addSchedule()" class="text-xs font-semibold text-fuchsia-600 hover:underline">+ Add Time Slot</button>
      </div>
    `;
        state.schedule.forEach((s, idx) => {
            html += `
        <div class="flex items-start justify-between p-2 rounded-lg hover:bg-slate-50">
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
        scheduleContainer.innerHTML = html;
    }
}

function toggleMilestone(idx) {
    state.milestones[idx].done = !state.milestones[idx].done;
    renderTimeline();
    saveState();
}

function addMilestone() {
    const task = prompt("Enter milestone task (e.g., Confirm floral delivery):");
    if (!task) return;
    const time = prompt("Target timeframe (e.g., 2 Weeks Out):") || "Upcoming";
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
    const time = prompt("Enter time (e.g., 03:00 PM):");
    if (!time) return;
    const event = prompt("Enter event name (e.g., Cake Cutting):");
    const person = prompt("Lead person responsible:") || "Host";
    state.schedule.push({ time, event, person });
    renderTimeline();
    saveState();
}

function deleteSchedule(idx) {
    state.schedule.splice(idx, 1);
    renderTimeline();
    saveState();
}

// --- Render 3: Vendor Checklist ---
function renderVendors() {
    const container = document.getElementById('vendorList');
    if (!container) return;

    let html = `
    <div class="flex items-center justify-between mb-3">
      <span class="text-xs text-slate-500">Track contracts, quotations, and booking status:</span>
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
    container.innerHTML = html;
}

function cycleVendorStatus(idx) {
    const stages = ['Shortlisted', 'Contacted', 'Booked', 'Paid'];
    const cur = stages.indexOf(state.vendors[idx].status);
    state.vendors[idx].status = stages[(cur + 1) % stages.length];
    renderVendors();
    saveState();
}

function addVendor() {
    const role = prompt("Service role (e.g., DJ, Florals, Catering):");
    if (!role) return;
    const name = prompt("Business name:");
    const fee = Number(prompt("Fee quote ($):") || "0");
    const contact = prompt("Phone or email contact:") || "";
    state.vendors.push({ role, name, fee, status: "Shortlisted", contact });
    renderVendors();
    saveState();
}

function deleteVendor(idx) {
    state.vendors.splice(idx, 1);
    renderVendors();
    saveState();
}

// --- GenAI Creative Hub ---
function requestAi(category) {
    const header = document.getElementById('aiHeader');
    const body = document.getElementById('aiBody');
    if (!header || !body) return;

    header.textContent = `Generated ${category.toUpperCase()} Ideas`;
    body.textContent = "Analyzing event context and generating recommendations...";

    setTimeout(() => {
        if (category === 'theme') {
            body.textContent = `🎨 Color Palette:
- Terracotta Rust (#C86446)
- Sage Eucalyptus (#8A9A86)
- Champagne Gold (#D7C49E)
- Crisp Ivory (#FAF7F2)

✨ Decor Vision:
Layer natural raw linen runners with dried pampas grass and soft garden roses. Use ribbed amber votives and 2200K warm festoon bulbs for an intimate evening glow.`;
        } else if (category === 'menu') {
            body.textContent = `🍸 Signature Cocktails:
1. "The Rosemary Dusk": Smoked bourbon, blackberry reduction, charred rosemary.
2. "Elderflower Spritz" (Mocktail): Sparkling botanical tonic, blood orange slice, mint.

🍽️ Dinner Progression:
- Appetizer: Wild mushroom & caramelized onion tartlet with goat cheese crumble.
- Main: Herb-crusted salmon with saffron risotto OR Charred cauliflower steak with chimichurri.
- Dessert: Mini olive-oil lemon cake with lavender glaze.`;
        } else if (category === 'activities') {
            body.textContent = `🎲 Guest Engagement Concepts:
1. Audio Guestbook: A vintage rotary telephone where guests record voicemail wishes.
2. Table Icebreaker Cards: Custom prompts like "Share your most hilarious story with the hosts".
3. Polaroid Memory Board: Instant photo station with metallic gel pens.`;
        } else {
            body.textContent = `🎙️ Personalized Toast Draft:

"Good evening everyone. Looking out across this room tonight, surrounded by the people who have shaped our lives, words hardly do justice to how grateful we feel. 

Every single person here holds a chapter in our journey. Whether you traveled across oceans or just down the street, thank you for your warmth and energy. 

Tonight is about celebrating connection, sharing good food, and making memories that will outlast the evening. Let us raise our glasses—cheers!"`;
        }
    }, 400);
}

// --- Event Listeners & Master Render ---
function renderAll() {
    document.getElementById('eventTitle').value = state.title;
    document.getElementById('eventType').value = state.type;
    document.getElementById('guestCount').value = state.guestCount;
    document.getElementById('totalBudget').value = state.budget;

    renderBudget();
    renderTimeline();
    renderVendors();
    if (window.lucide) window.lucide.createIcons();
}

// Switch Event Preset
document.getElementById('eventType')?.addEventListener('change', (e) => {
    const chosenType = e.target.value;
    if (eventData[chosenType]) {
        state = JSON.parse(JSON.stringify(eventData[chosenType]));
        saveState();
        renderAll();
    }
});

// Update budget directly
document.getElementById('totalBudget')?.addEventListener('input', (e) => {
    state.budget = Number(e.target.value) || 0;
    renderBudget();
    saveState();
});

// Update guest count directly
document.getElementById('guestCount')?.addEventListener('input', (e) => {
    state.guestCount = Number(e.target.value) || 0;
    saveState();
});

// Update title directly
document.getElementById('eventTitle')?.addEventListener('input', (e) => {
    state.title = e.target.value;
    saveState();
});

// Export JSON
document.getElementById('exportBtn')?.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_plan.json`;
    a.click();
});

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', () => {
    renderAll();
});