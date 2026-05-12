// Add Transaction Modal Functionality

// Set today's date as default
const transactionDate = document.getElementById('transactionDate');
if (transactionDate) {
    const today = new Date().toISOString().split('T')[0];
    transactionDate.value = today;
}

// Modal controls
const addTransactionModal = document.getElementById('addTransactionModal');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        addTransactionModal.style.display = 'none';
    });
}

if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
        addTransactionModal.style.display = 'none';
    });
}

// Close modal when clicking outside
if (addTransactionModal) {
    addTransactionModal.addEventListener('click', (e) => {
        if (e.target === addTransactionModal) {
            addTransactionModal.style.display = 'none';
        }
    });
}

// Transaction type tabs
const typeTabs = document.querySelectorAll('.type-tab');
let selectedType = 'expense';

typeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        typeTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        selectedType = tab.dataset.type;
    });
});

// Category selection
const categoryOptions = document.querySelectorAll('.category-option');
let selectedCategory = '';

categoryOptions.forEach(option => {
    option.addEventListener('click', () => {
        categoryOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        selectedCategory = option.dataset.category;
    });
});

// Form submission
const transactionForm = document.getElementById('transactionForm');
if (transactionForm) {
    transactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const amount = document.getElementById('transactionAmount').value;
        const description = document.getElementById('transactionDescription').value;
        const date = document.getElementById('transactionDate').value;

        if (!selectedCategory) {
            alert('Please select a category');
            return;
        }

        // Create transaction object
        const transaction = {
            type: selectedType,
            amount: parseFloat(amount),
            description: description,
            category: selectedCategory,
            date: date
        };

        // Show success message
        alert(`Transaction Added!\n\nType: ${selectedType}\nAmount: $${amount}\nDescription: ${description}\nCategory: ${selectedCategory}\nDate: ${date}\n\nThis would be saved to your account in production.`);

        // Reset form
        transactionForm.reset();
        categoryOptions.forEach(opt => opt.classList.remove('selected'));
        selectedCategory = '';
        transactionDate.value = new Date().toISOString().split('T')[0];

        // Close modal
        addTransactionModal.style.display = 'none';

        // In production, this would:
        // 1. Send to backend API
        // 2. Update local state
        // 3. Refresh transaction list
        // 4. Update budget calculations
    });
}

console.log('Add transaction functionality loaded');
