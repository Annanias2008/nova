// More Screen Interactions

// Goal card interactions
const goalCards = document.querySelectorAll('.goal-card');
goalCards.forEach(card => {
    card.addEventListener('click', (e) => {
        if (!e.target.classList.contains('goal-contribute-btn')) {
            const goalName = card.querySelector('.goal-name').textContent;
            const target = card.querySelector('.goal-target').textContent;
            alert(`${goalName}\n\n${target}\n\nView progress, edit goal, or adjust contributions.`);
        }
    });
});

// Contribute buttons
const contributeBtns = document.querySelectorAll('.goal-contribute-btn');
contributeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const goalName = btn.closest('.goal-card').querySelector('.goal-name').textContent;
        alert(`Contribute to ${goalName}\n\nEnter amount to add:\n\n$_____.___\n\nOne-time or recurring contribution?`);
    });
});

// AI Chat button
const aiChatBtn = document.querySelector('.ai-chat-btn');
if (aiChatBtn) {
    aiChatBtn.addEventListener('click', () => {
        window.location.href = 'assistant.html';
    });
}

// AI Orb FAB
const aiOrbFab = document.querySelector('.ai-orb-fab');
if (aiOrbFab) {
    aiOrbFab.addEventListener('click', () => {
        window.location.href = 'assistant.html';
    });
}

// Settings items
const settingsItems = document.querySelectorAll('.settings-item');
settingsItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const label = item.querySelector('.settings-label').textContent;

        switch (label) {
            case 'Linked Accounts':
                alert('Linked Accounts\n\n🏦 Chase Checking ••1234\n💳 Amex ••5678\n💰 Savings ••9012\n\n+ Link New Account');
                break;
            case 'Notifications':
                alert('Notifications\n\n✅ Bill reminders\n✅ Budget alerts\n✅ Unusual spending\n❌ Weekly summaries\n❌ Goal milestones');
                break;
            case 'Appearance':
                alert('Appearance\n\n🌙 Dark Mode (Current)\n☀️ Light Mode\n🎨 System Default\n\nAccent Color: Teal');
                break;
            case 'Security & Privacy':
                alert('Security & Privacy\n\n🔒 Biometric Lock: ON\n🔐 2FA: Enabled\n👁️ Privacy Mode: OFF\n📊 Data Sharing: Disabled');
                break;
            case 'Export Data':
                alert('Export Data\n\nDownload your financial data:\n\n📄 CSV Format\n📊 PDF Report\n📈 Excel Spreadsheet\n\nTime Range: Last 12 months');
                break;
            case 'Help & Support':
                alert('Help & Support\n\n📚 User Guide\n💬 Live Chat\n📧 Email Support\n🐛 Report a Bug\n⭐ Rate the App');
                break;
            case 'About NovaBudget':
                alert('About Nova Budgeting\n\nVersion 1.0.0\n\n"AI That Budgets for You"\n\n© 2026 NovaBudget\nMade with ❤️ for smarter budgeting\n\n📜 Terms of Service\n🔒 Privacy Policy');
                break;
        }
    });
});

// Animate goal rings on load
window.addEventListener('load', () => {
    const goalRings = document.querySelectorAll('.goal-ring .ring-fill');
    goalRings.forEach(ring => {
        const offset = ring.style.strokeDashoffset;
        ring.style.strokeDashoffset = '251.2';
        setTimeout(() => {
            ring.style.strokeDashoffset = offset;
        }, 300);
    });
});

console.log('More screen loaded');
