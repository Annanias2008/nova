// Transactions Screen Interactions

// Filter chips
const chips = document.querySelectorAll('.chip');
chips.forEach(chip => {
    chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');

        const filter = chip.textContent;
        console.log(`Filtering by: ${filter}`);
    });
});

// Search functionality
const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        console.log(`Searching for: ${query}`);
        // In production, this would filter transactions
    });
}

// Transaction row click
const transactionRows = document.querySelectorAll('.transaction-row');
transactionRows.forEach(row => {
    const content = row.querySelector('.transaction-content');

    content.addEventListener('click', () => {
        const merchantName = row.querySelector('.merchant-name').textContent;
        const amount = row.querySelector('.transaction-amount').textContent;

        alert(`Transaction Details\n\n${merchantName}\n${amount}\n\nEdit • Split • Categorize • Delete`);
    });
});

// Swipe gesture simulation
let touchStartX = 0;
let touchEndX = 0;
let currentSwipedRow = null;

transactionRows.forEach(row => {
    row.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    row.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(row);
    });

    // Mouse events for desktop testing
    row.addEventListener('mousedown', (e) => {
        touchStartX = e.screenX;
    });

    row.addEventListener('mouseup', (e) => {
        touchEndX = e.screenX;
        handleSwipe(row);
    });
});

function handleSwipe(row) {
    const swipeDistance = touchStartX - touchEndX;

    // Swipe left to reveal actions
    if (swipeDistance > 50) {
        // Close previously swiped row
        if (currentSwipedRow && currentSwipedRow !== row) {
            currentSwipedRow.classList.remove('swiped');
        }

        row.classList.add('swiped');
        currentSwipedRow = row;
    }

    // Swipe right to close
    if (swipeDistance < -50) {
        row.classList.remove('swiped');
        if (currentSwipedRow === row) {
            currentSwipedRow = null;
        }
    }
}

// Swipe action buttons
document.querySelectorAll('.swipe-action').forEach(action => {
    action.addEventListener('click', (e) => {
        e.stopPropagation();
        const actionType = action.classList[1]; // categorize, split, flag, delete
        const row = action.closest('.transaction-row');
        const merchantName = row.querySelector('.merchant-name').textContent;

        switch (actionType) {
            case 'categorize':
                alert(`Categorize Transaction\n\n${merchantName}\n\nSelect category:\n• Food & Dining\n• Shopping\n• Transportation\n• Entertainment`);
                break;
            case 'split':
                alert(`Split Transaction\n\n${merchantName}\n\nDivide this transaction between multiple categories or people.`);
                break;
            case 'flag':
                alert(`Flag Transaction\n\n${merchantName}\n\nMarked for review.`);
                break;
            case 'delete':
                if (confirm(`Delete this transaction?\n\n${merchantName}`)) {
                    row.style.opacity = '0';
                    setTimeout(() => row.remove(), 300);
                }
                break;
        }

        row.classList.remove('swiped');
        currentSwipedRow = null;
    });
});

// Close swipe actions when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.transaction-row') && currentSwipedRow) {
        currentSwipedRow.classList.remove('swiped');
        currentSwipedRow = null;
    }
});

console.log('Transactions screen loaded');
