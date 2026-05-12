// Insights Screen Interactions

// Tab switching
const insightTabs = document.querySelectorAll('.insight-tab');
const tabContents = document.querySelectorAll('.tab-content');

insightTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // Update active tab
        insightTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Update active content
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === targetTab) {
                content.classList.add('active');
            }
        });

        console.log(`Switched to ${targetTab} tab`);
    });
});

// Animate category bars on load
window.addEventListener('load', () => {
    const categoryBars = document.querySelectorAll('.category-bar-fill');
    categoryBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        setTimeout(() => {
            bar.style.width = width;
        }, 300);
    });
});

// KPI card interactions
const kpiCards = document.querySelectorAll('.kpi-card');
kpiCards.forEach(card => {
    card.addEventListener('click', () => {
        const label = card.querySelector('.kpi-label').textContent;
        const value = card.querySelector('.kpi-value').textContent;
        alert(`${label}\n\n${value}\n\nView detailed breakdown and historical trends.`);
    });
});

// Legend item interactions
const legendItems = document.querySelectorAll('.legend-item');
legendItems.forEach(item => {
    item.addEventListener('click', () => {
        const categoryName = item.querySelector('.legend-name').textContent;
        const percent = item.querySelector('.legend-percent').textContent;
        alert(`${categoryName}\n\n${percent} of total spending\n\nView transactions in this category.`);
    });
});

// Forecast event interactions
const forecastEvents = document.querySelectorAll('.forecast-event');
forecastEvents.forEach(event => {
    event.addEventListener('click', () => {
        const name = event.querySelector('.event-name').textContent;
        const date = event.querySelector('.event-date').textContent;
        const amount = event.querySelector('.event-amount').textContent;
        alert(`${name}\n\n${date}\n${amount}\n\nEdit or view details.`);
    });
});

console.log('Insights screen loaded');
