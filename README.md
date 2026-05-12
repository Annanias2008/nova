# Nova Budgeting - Interactive Prototype

**Tagline:** "AI That Budgets for You – Automated, Adaptive, Effortless"

##  Quick Start

Open any of these HTML files in your browser to view the interactive prototypes:

**Authentication:**
1. **[login.html](login.html)** - Login with Email/Biometric/Social
2. **[register.html](register.html)** - Sign Up with Password Strength

**Main App:**
3. **[index.html](index.html)** - Main Dashboard (Hero screen)
4. **[budgets.html](budgets.html)** - Budget Categories with Progress Rings
5. **[transactions.html](transactions.html)** - Transaction List with Swipe Actions
6. **[insights.html](insights.html)** - Charts, Analytics & Cash Flow
7. **[more.html](more.html)** - Goals, AI Assistant & Settings

## 📱 Features Implemented

### Dashboard (index.html)
-  **Hero Balance Card** with glassmorphism effect
-  **Sparkline graph** showing balance trends
-  **Monthly spending progress ring** (49% filled, emerald green)
-  **"In My Pocket"** disposable income calculator
-  **Upcoming bills** preview card
-  **AI Insight** with actionable suggestions
-  **Recent transactions** list (3 items with categories)
-  **FAB button** for quick add
-  **Bottom navigation** (5 tabs)

### Budgets Screen (budgets.html)
-  **Monthly/Weekly toggle**
-  **Budget summary** (Total budgeted vs Income)
-  **AI Optimize Budgets** button
-  **Housing** - 82% spent (emerald, under budget)
-  **Food & Dining** - 70% spent (emerald, on track)
-  **Transportation** - 90% spent (yellow, warning)
-  **Entertainment** - 110% spent (coral, over budget)
-  **Add Category** button

### Transactions Screen (transactions.html)
-  **Search bar** with live filtering
-  **Filter chips** (All, This Month, Uncategorized, Income, Expenses)
-  **Grouped by date** (Today, Yesterday, etc.)
-  **Transaction cards** with merchant logos, amounts, categories
-  **Swipe actions** (Categorize, Split, Flag, Delete)
-  **Recurring transaction** indicators
-  **Uncategorized** transaction highlights
-  **Income/Expense** color coding

### Insights Screen (insights.html)
-  **4 Tab Navigation** (Overview, Spending, Trends, Cash Flow)
-  **KPI Cards** (Total Spent, Income, Savings Rate, Net Worth)
-  **Donut Chart** with interactive spending breakdown
-  **Category bars** with animated progress
-  **Trend line chart** (6-month spending history)
-  **Cash flow forecast** (30-day projection)
-  **Upcoming events** timeline (income, bills, warnings)
-  **AI forecast insights**

### More Screen (more.html)
-  **Goals & Savings** cards with progress rings
  - Emergency Fund (67% complete)
  - Japan Vacation (34% complete)
  - Credit Card Payoff (55% complete)
-  **AI Assistant** with animated orb
-  **Floating AI orb** FAB button
-  **Settings menu** (Accounts, Notifications, Appearance, Security, Export, Help)
-  **Account management**
-  **Theme selector** (Dark/Light mode)

##  Design System

### Colors
- **Primary Background:** `#0A1D37` (Deep Navy)
- **Accent:** `#0F4C81` (Teal Blue)
- **Positive:** `#10B981` (Emerald Green)
- **Alert:** `#FF6B6B` (Soft Coral)
- **Warning:** `#FBBF24` (Amber)

### Typography
- **Font:** Inter (Google Fonts)
- **Headings:** 28-36pt, Weight 700
- **Body:** 16-18pt, Weight 400
- **Numbers:** 24-48pt, Weight 600-700

### Effects
- **Glassmorphism:** `backdrop-filter: blur(20px)`
- **Card Radius:** 20-24px
- **Shadows:** `0 8px 32px rgba(0,0,0,0.3)`
- **Animations:** 200-500ms smooth transitions

##  Interactive Elements

All buttons and cards are clickable with alert dialogs demonstrating functionality:

- **FAB (+) Button** → Quick add transaction menu
- **AI Insight "Act on This"** → Apply AI suggestion
- **AI Optimize Budgets** → View optimization recommendations
- **Transaction Items** → View/edit transaction details
- **Budget Cards** → Drill down into category details
- **Add Category** → Create new budget category

##  Responsive Design

- **Mobile:** Optimized for iPhone 16 / Pixel 9 (428px)
- **Tablet:** Grid layouts activate at 768px+
- **Desktop:** Multi-column dashboard

##  Animations

- Progress rings animate on page load
- Smooth transitions on all interactions
- Pull-to-refresh indicator (touch devices)
- Haptic-style visual feedback on taps
- Rotating refresh indicator

## 🔧 Technical Stack

- **HTML5** - Semantic structure
- **CSS3** - Glassmorphism, gradients, animations
- **Vanilla JavaScript** - Interactive behaviors
- **Google Fonts** - Inter typeface

##  File Structure

```
NovaBudget/
├── index.html          # Dashboard screen
├── budgets.html        # Budgets screen
├── styles.css          # Global styles & components
├── budgets.css         # Budget-specific styles
├── script.js           # Interactive behaviors
├── novabudget-design-spec.md  # Complete design specification
└── README.md           # This file
```

## 🎬 Next Steps to Complete

Additional screens to implement:
- **transactions.html** - Full transaction list with filters
- **insights.html** - Charts and spending analytics
- **more.html** - Goals, settings, AI chat
- **onboarding.html** - Welcome flow (5-7 screens)

##  Usage Tips

1. **View on mobile device** for best experience (or use browser DevTools mobile emulation)
2. **Click everything** - all interactive elements have demo alerts
3. **Watch animations** - progress rings and bars animate on load
4. **Try pull-to-refresh** on touch devices

##  Premium Features Demonstrated

 **Glassmorphism cards** with blur effects  
 **Gradient backgrounds** and text  
 **Circular progress rings** with smooth animations  
 **Color-coded budgets** (emerald/yellow/coral)  
 **AI-powered insights** with sparkle icons  
 **Modern typography** with Inter font  
 **Micro-interactions** and haptic feedback  
 **Dark mode** optimized (light mode ready)  
 **Accessibility** with semantic HTML  
 **Responsive** mobile-first design  

---

**Built with  for premium fintech experiences**
