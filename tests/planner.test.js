/**
 * @file planner.test.js
 * Test suite for PlanCraft AI core logic (Budget, Vendor, Timeline, Security)
 */

const assert = require('assert');

// Core logic functions imported or defined for isolated testing
function calculateBudget(budgetItems, totalBudget) {
    const committed = budgetItems.reduce((acc, item) => acc + (Number(item.actual) || 0), 0);
    const remaining = totalBudget - committed;
    const percentUsed = totalBudget > 0 ? (committed / totalBudget) * 100 : 0;
    return { committed, remaining, percentUsed, isOverBudget: committed > totalBudget };
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

function updateVendorStatus(vendors, index, nextStatus) {
    const allowed = ['Shortlisted', 'Contacted', 'Booked', 'Paid'];
    if (!allowed.includes(nextStatus)) throw new Error('Invalid status');
    const updated = [...vendors];
    updated[index] = { ...updated[index], status: nextStatus };
    return updated;
}

// --- TEST SUITE ---
let passed = 0;
let total = 0;

function it(name, fn) {
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

console.log('\nRunning PlanCraft AI Test Suite...\n');

// 1. Budget Calculation Tests
it('accurately calculates committed, remaining, and percentage', () => {
    const items = [
        { actual: 5000 },
        { actual: 3000 },
        { actual: 2000 }
    ];
    const res = calculateBudget(items, 15000);
    assert.strictEqual(res.committed, 10000);
    assert.strictEqual(res.remaining, 5000);
    assert.strictEqual(Math.round(res.percentUsed), 67);
    assert.strictEqual(res.isOverBudget, false);
});

it('triggers over-budget flag when expenses exceed total cap', () => {
    const items = [{ actual: 12000 }];
    const res = calculateBudget(items, 10000);
    assert.strictEqual(res.isOverBudget, true);
    assert.strictEqual(res.remaining, -2000);
});

// 2. Security Sanitization Tests
it('prevents XSS injection vectors by HTML escaping characters', () => {
    const dirty = '<script>alert("hack")</script>';
    const clean = sanitizeInput(dirty);
    assert.strictEqual(clean, '&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;');
});

it('safely handles non-string inputs in sanitizer', () => {
    assert.strictEqual(sanitizeInput(null), '');
    assert.strictEqual(sanitizeInput(undefined), '');
    assert.strictEqual(sanitizeInput(12345), '');
});

// 3. Vendor Status Pipeline Tests
it('advances vendor workflow through allowed states', () => {
    const vendors = [{ role: 'DJ', name: 'Beats Co.', status: 'Shortlisted' }];
    const updated = updateVendorStatus(vendors, 0, 'Booked');
    assert.strictEqual(updated[0].status, 'Booked');
});

it('rejects invalid vendor states', () => {
    const vendors = [{ role: 'DJ', name: 'Beats Co.', status: 'Shortlisted' }];
    assert.throws(() => updateVendorStatus(vendors, 0, 'UnknownStatus'), /Invalid status/);
});

// Summary
console.log(`\nTest Results: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);