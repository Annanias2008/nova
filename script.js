// Nova Budgeting - Interactive Scripts

// Update time in status bar
function updateTime() {
    const timeElements = document.querySelectorAll('.time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    timeElements.forEach(el => el.textContent = `${hours}:${minutes}`);
}

updateTime();
setInterval(updateTime, 60000);

// Animate progress rings on load
window.addEventListener('load', () => {
    const progressRings = document.querySelectorAll('.progress-ring-fill, .ring-fill');
    progressRings.forEach(ring => {
        const offset = ring.style.strokeDashoffset;
        ring.style.strokeDashoffset = ring.getAttribute('stroke-dasharray') || '251.2';
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 100);
    });

    // Animate pocket bar
    const pocketBar = document.querySelector('.pocket-bar-fill');
    if (pocketBar) {
        const width = pocketBar.style.width;
        pocketBar.style.width = '0%';
        setTimeout(() => {
            pocketBar.style.width = width;
        }, 200);
    }
});

// FAB button interaction
const fab = document.querySelector('.fab');
if (fab) {
    fab.addEventListener('click', () => {
        alert('Quick Add: Choose transaction type\n\n• Expense\n• Income\n• Transfer');
    });
}

// AI Action button
const aiActionBtn = document.querySelector('.ai-action-btn');
if (aiActionBtn) {
    aiActionBtn.addEventListener('click', () => {
        alert('AI Suggestion Applied!\n\nMoved $50 from Food budget to Savings goal.');
    });
}

// Optimize budgets button
const optimizeBtn = document.querySelector('.optimize-btn');
if (optimizeBtn) {
    optimizeBtn.addEventListener('click', () => {
        alert('AI Budget Optimization\n\nBased on your spending patterns:\n\n• Reduce Entertainment by $20\n• Increase Food by $30\n• Add $50 to Emergency Fund\n\nApply these changes?');
    });
}

// Toggle buttons
const toggleBtns = document.querySelectorAll('.toggle-btn');
toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        toggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Transaction item interactions
const transactionItems = document.querySelectorAll('.transaction-item');
transactionItems.forEach(item => {
    item.addEventListener('click', () => {
        const merchantName = item.querySelector('.merchant-name').textContent;
        alert(`Transaction Details\n\n${merchantName}\n\nTap to edit category, split, or add notes.`);
    });
});

// Budget card interactions
const budgetCards = document.querySelectorAll('.budget-card');
budgetCards.forEach(card => {
    card.addEventListener('click', () => {
        const categoryName = card.querySelector('.category-name').textContent;
        alert(`${categoryName} Details\n\nView all transactions, adjust budget, or see spending trends.`);
    });
});

// Add category button
const addCategoryBtn = document.querySelector('.add-category-btn');
if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
        alert('Add New Category\n\nChoose from:\n\n• Shopping\n• Healthcare\n• Education\n• Travel\n• Custom Category');
    });
}

// Smooth scroll for horizontal sections
const horizontalScrolls = document.querySelectorAll('.horizontal-scroll');
horizontalScrolls.forEach(scroll => {
    scroll.style.scrollBehavior = 'smooth';
});

// Pull to refresh simulation
let startY = 0;
let isPulling = false;

document.addEventListener('touchstart', (e) => {
    if (window.scrollY === 0) {
        startY = e.touches[0].pageY;
        isPulling = true;
    }
});

document.addEventListener('touchmove', (e) => {
    if (isPulling && window.scrollY === 0) {
        const currentY = e.touches[0].pageY;
        const pullDistance = currentY - startY;
        
        if (pullDistance > 80) {
            const refreshIndicator = document.querySelector('.refresh-indicator');
            if (refreshIndicator && !refreshIndicator.classList.contains('rotating')) {
                refreshIndicator.classList.add('rotating');
                setTimeout(() => {
                    refreshIndicator.classList.remove('rotating');
                }, 2000);
            }
        }
    }
});

document.addEventListener('touchend', () => {
    isPulling = false;
});

// Haptic feedback simulation (visual feedback)
function addHapticFeedback(element) {
    element.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 100);
    });
}

// Add haptic to all interactive elements
document.querySelectorAll('button, .nav-item, .transaction-item, .budget-card').forEach(addHapticFeedback);

console.log('Nova Budgeting loaded successfully!');
