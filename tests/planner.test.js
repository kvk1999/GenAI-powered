/**
 * @file planner.test.js
 * Comprehensive automated test suite for PlanCraft AI
 * Run via: node tests/planner.test.js
 */

const assert = require('assert');

// --- PURE CORE LOGIC FUNCTIONS UNDER TEST ---
function calculateBudget(budgetItems, totalBudget) {
    if (!Array.isArray(budgetItems)) return { committed: 0, remaining: totalBudget, percentUsed: 0, isOverBudget: false };
    const committed = budgetItems.reduce((acc, item) => acc + Math.max(0, Number(item.actual) || 0), 0);
    const safeTotal = Math.max(0, Number(totalBudget) || 0);
    const remaining = safeTotal - committed;
    const percentUsed = safeTotal > 0 ? (committed / safeTotal) * 100 : 0;
    return { committed, remaining, percentUsed, isOverBudget: committed > safeTotal };
}

function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[m]);
}

function cycleVendorStatus(currentStatus) {
    const stages = ['Shortlisted', 'Contacted', 'Booked', 'Paid'];
    const curIdx = stages.indexOf(currentStatus);
    if (curIdx === -1) return 'Shortlisted';
    return stages[(curIdx + 1) % stages.length];
}

function toggleMilestone(milestones, index) {
    if (!Array.isArray(milestones) || index < 0 || index >= milestones.length) return milestones;
    const copy = milestones.map(m => ({ ...m }));
    copy[index].done = !copy[index].done;
    return copy;
}

function getMilestoneProgress(milestones) {
    if (!Array.isArray(milestones) || milestones.length === 0) return 0;
    const completed = milestones.filter(m => m.done).length;
    return Math.round((completed / milestones.length) * 100);
}

function buildAiPromptContext(event) {
    const title = event.title || 'Untitled Event';
    const type = event.type || 'general';
    const guests = Math.max(1, Number(event.guestCount) || 1);
    const budget = Math.max(0, Number(event.budget) || 0);
    const vibe = event.vibe || 'Classic';
    return `Event: ${title} (${type}) | Guests: ${guests} | Budget: $${budget} | Vibe: ${vibe}`;
}

// --- TEST RUNNER ---
let passed = 0;
let total = 0;

function test(name, fn) {
    total++;
    try {
        fn();
        console.log(`  ✓ PASS: ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ✗ FAIL: ${name}`);
        console.error(`    ${err.message}`);
    }
}

console.log('\n=============================================');
console.log('  PlanCraft AI — Comprehensive Test Suite');
console.log('=============================================\n');

// 1. Budget Engine Tests
test('Budget: accurately calculates committed expenses, balance, and % used', () => {
    const items = [{ actual: 5000 }, { actual: 3000 }, { actual: 2000 }];
    const res = calculateBudget(items, 20000);
    assert.strictEqual(res.committed, 10000);
    assert.strictEqual(res.remaining, 10000);
    assert.strictEqual(res.percentUsed, 50);
    assert.strictEqual(res.isOverBudget, false);
});

test('Budget: correctly flags over-budget when spending exceeds target', () => {
    const items = [{ actual: 12500 }];
    const res = calculateBudget(items, 10000);
    assert.strictEqual(res.isOverBudget, true);
    assert.strictEqual(res.remaining, -2500);
});

test('Budget: handles zero or empty budget items without crashing', () => {
    const res = calculateBudget([], 5000);
    assert.strictEqual(res.committed, 0);
    assert.strictEqual(res.remaining, 5000);
    assert.strictEqual(res.percentUsed, 0);
});

test('Budget: safely handles invalid or negative line item values', () => {
    const items = [{ actual: -500 }, { actual: 'not-a-number' }, { actual: 1000 }];
    const res = calculateBudget(items, 5000);
    assert.strictEqual(res.committed, 1000);
});

// 2. Vendor Lifecycle Tests
test('Vendor: advances status through standard pipeline stages', () => {
    assert.strictEqual(cycleVendorStatus('Shortlisted'), 'Contacted');
    assert.strictEqual(cycleVendorStatus('Contacted'), 'Booked');
    assert.strictEqual(cycleVendorStatus('Booked'), 'Paid');
});

test('Vendor: loops circularly back from Paid to Shortlisted', () => {
    assert.strictEqual(cycleVendorStatus('Paid'), 'Shortlisted');
});

test('Vendor: recovers gracefully from invalid initial status', () => {
    assert.strictEqual(cycleVendorStatus('UnknownStatus'), 'Shortlisted');
});

// 3. Milestone & Timeline Tests
test('Timeline: toggles milestone completion flag', () => {
    const list = [{ task: 'Book Venue', done: false }];
    const updated = toggleMilestone(list, 0);
    assert.strictEqual(updated[0].done, true);
    assert.strictEqual(list[0].done, false, 'Should be immutable');
});

test('Timeline: calculates milestone completion percentage accurately', () => {
    const list = [
        { task: 'T1', done: true },
        { task: 'T2', done: true },
        { task: 'T3', done: false },
        { task: 'T4', done: false }
    ];
    assert.strictEqual(getMilestoneProgress(list), 50);
});

test('Timeline: returns 0% for empty milestone list', () => {
    assert.strictEqual(getMilestoneProgress([]), 0);
    assert.strictEqual(getMilestoneProgress(null), 0);
});

// 4. Security & Sanitization Tests
test('Security: neutralizes script injection tags', () => {
    const payload = '<script>alert("xss")</script>';
    assert.strictEqual(sanitizeInput(payload), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
});

test('Security: neutralizes attribute injection with double quotes and ampersands', () => {
    const payload = '"><img src=x onerror=alert(1)>&';
    assert.strictEqual(sanitizeInput(payload), '&quot;&gt;&lt;img src=x onerror=alert(1)&gt;&amp;');
});

test('Security: handles undefined, null, and non-string inputs safely', () => {
    assert.strictEqual(sanitizeInput(undefined), '');
    assert.strictEqual(sanitizeInput(null), '');
    assert.strictEqual(sanitizeInput(42), '');
});

// 5. GenAI Prompt Builder Tests
test('GenAI Context: formats contextual prompt parameters accurately', () => {
    const ctx = buildAiPromptContext({
        title: 'Gala 2026',
        type: 'community',
        guestCount: 300,
        budget: 15000,
        vibe: 'Rustic Elegance'
    });
    assert.strictEqual(ctx, 'Event: Gala 2026 (community) | Guests: 300 | Budget: $15000 | Vibe: Rustic Elegance');
});

test('GenAI Context: supplies robust fallbacks for missing parameters', () => {
    const ctx = buildAiPromptContext({});
    assert.strictEqual(ctx, 'Event: Untitled Event (general) | Guests: 1 | Budget: $0 | Vibe: Classic');
});

// 6. JSON Export Integrity Tests
test('Data Integrity: state object serializes to valid parsable JSON', () => {
    const mockState = {
        title: 'Test',
        budget: 1000,
        budgetItems: [{ category: 'Food', actual: 500 }]
    };
    const jsonStr = JSON.stringify(mockState);
    const parsed = JSON.parse(jsonStr);
    assert.strictEqual(parsed.title, 'Test');
    assert.strictEqual(parsed.budgetItems.length, 1);
});

test('Data Integrity: parses valid export and preserves numerical accuracy', () => {
    const raw = '{"budget": 25000.50, "guestCount": 150}';
    const parsed = JSON.parse(raw);
    assert.strictEqual(parsed.budget, 25000.5);
    assert.strictEqual(parsed.guestCount, 150);
});

console.log('\n---------------------------------------------');
console.log(`  All Test Cases Completed: ${passed}/${total} Passed.`);
console.log('=============================================\n');

if (passed !== total) process.exit(1);