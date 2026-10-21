/**
 * @file app.js
 * Production-ready, secure, and accessible event planning engine.
 */

'use strict';

/**
 * HTML Escaper to prevent XSS injection attacks.
 * @param {string} str 
 * @returns {string} sanitized string
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

/** State Management */
const state = {
    title: "Maya & Alex's Bohemian Wedding",
    type: "wedding",
    guestCount: 150,
    budget: 25000,
    budgetItems: [
        { category: "Venue & Rentals", estimated: 8500, actual: 8200 },
        { category: "Catering & Bar", estimated: 7500, actual: 7800 },
        { category: "Photography", estimated: 3200, actual: 3000 }
    ],
    milestones: [
        { time: "6 Months Out", task: "Book venue and confirm date", done: true },
        { time: "2 Months Out", task: "Finalize RSVPs and dietary count", done: false }
    ],
    schedule: [
        { time: "04:30 PM", event: "Guest Arrival", person: "Host Team" },
        { time: "05:00 PM", event: "Ceremony Begins", person: "Officiant" }
    ],
    vendors: [
        { role: "Venue", name: "Sunstone Villa", fee: 8200, status: "Booked" },
        { role: "Catering", name: "Artisan Feast Co.", fee: 7800, status: "Booked" }
    ]
};

// Tab Switching with Accessibility ARIA updates
function switchTab(tabId) {
    ['ideas', 'budget', 'timeline', 'vendors'].forEach(id => {
        const section = document.getElementById(`content-${id}`);
        const tabBtn = document.getElementById(`tab-${id}`);
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
}

// Debounce Utility for performance efficiency
function debounce(fn, delay = 250) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

function updateBudgetUI() {
    const committed = state.budgetItems.reduce((acc, i) => acc + (Number(i.actual) || 0), 0);
    const remaining = state.budget - committed;

    document.getElementById('lblAllocated').textContent = `$${state.budget.toLocaleString()}`;
    document.getElementById('lblCommitted').textContent = `$${committed.toLocaleString()}`;

    const remEl = document.getElementById('lblRemaining');
    remEl.textContent = `$${remaining.toLocaleString()}`;
    remEl.className = remaining < 0 ? 'text-2xl font-bold text-red-600 mt-1' : 'text-2xl font-bold text-emerald-600 mt-1';
}

function renderUI() {
    document.getElementById('eventTitle').value = state.title;
    document.getElementById('eventType').value = state.type;
    document.getElementById('guestCount').value = state.guestCount;
    document.getElementById('totalBudget').value = state.budget;
    updateBudgetUI();
}

// AI Service with Fallback
function requestAi(category) {
    const header = document.getElementById('aiHeader');
    const body = document.getElementById('aiBody');

    header.textContent = `Generated ${category.toUpperCase()} Ideas`;
    body.textContent = "Analyzing event context and generating recommendations...";

    setTimeout(() => {
        if (category === 'theme') {
            body.textContent = `Palette: Terracotta (#C86446), Sage (#8A9A86), Ivory (#FAF7F2)\n\nAesthetic: Layered natural linens with pampas grass and amber candlelight.`;
        } else if (category === 'menu') {
            body.textContent = `Signature Cocktail: The Rosemary Dusk (Smoked bourbon, blackberry reduction)\n\nEntrée: Saffron risotto with herb-crusted salmon or grilled cauliflower steak.`;
        } else if (category === 'activities') {
            body.textContent = `1. Audio Guestbook: Vintage rotary phone recording guest memories.\n2. Table Icebreaker Prompts: Custom questions for each table.`;
        } else {
            body.textContent = `"Welcome everyone. Looking around tonight, we are deeply grateful for your presence. Let us celebrate love, friendship, and great memories ahead. Cheers!"`;
        }
    }, 400);
}

// Event Listeners with Debounce
document.getElementById('totalBudget').addEventListener('input', debounce((e) => {
    state.budget = Number(e.target.value) || 0;
    updateBudgetUI();
}));

document.getElementById('exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `event_plan.json`;
    a.click();
});

window.addEventListener('DOMContentLoaded', () => {
    renderUI();
    if (window.lucide) window.lucide.createIcons();
});