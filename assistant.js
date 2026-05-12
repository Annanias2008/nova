// AI Budget Assistant Interactions

let currentMode = 'helpful';
let isRecording = false;
let conversationHistory = [];
let useOpenAI = false;

// Mode responses for different personalities
const modeResponses = {
    helpful: {
        greeting: "I'm here to help! 😊",
        responses: [
            "Great question! Based on your current spending, you have $87 left in your Dining budget for this week. You're doing well! 🎉",
            "Looking at your expenses, here are your top 3 categories: Housing ($980), Food ($402), and Transportation ($225). Want me to break down any of these?",
            "Your Emergency Fund goal is 67% complete! At your current rate of $250/month, you'll reach $10,000 by August 2026. Keep it up! 💪"
        ]
    },
    professional: {
        greeting: "How may I assist you today?",
        responses: [
            "Based on your current budget allocation, you have $87 remaining in the Dining category for this week. This represents 21.75% of your weekly dining budget.",
            "Your top expenditure categories are: Housing at $980 (40%), Food & Dining at $402 (16.4%), and Transportation at $225 (9.2%). Would you like a detailed analysis?",
            "Your Emergency Fund is currently at 67% completion ($6,700/$10,000). Projected completion date: August 2026, assuming consistent monthly contributions of $250."
        ]
    },
    sassy: {
        greeting: "Sup! Ready to talk money? 😎",
        responses: [
            "You've got $87 left for dining this week. That's like... 19 coffees or 3 fancy dinners. Choose wisely! ☕💸",
            "Okay so you spent $980 on housing (duh, rent), $402 on food (someone likes to eat out 👀), and $225 on gas. Want the tea on where you're wasting money?",
            "Your savings game is at 67%! Not bad, not bad. Keep grinding and you'll hit that $10k by August. Unless you blow it on more takeout... 🙃"
        ]
    },
    motivational: {
        greeting: "LET'S CRUSH THESE FINANCIAL GOALS! 🔥",
        responses: [
            "You've got $87 left for dining this week and you're CRUSHING IT! 🎯 Stay focused and finish strong! You're a budgeting CHAMPION! 💪",
            "WOW! Look at you managing $980 in housing, $402 in food, and $225 in transport like a BOSS! 🚀 You're doing AMAZING! Keep that energy!",
            "67% to your Emergency Fund goal?! THAT'S INCREDIBLE! 🎉 You're on FIRE! August 2026 is YOUR month! Keep pushing, you absolute LEGEND! 🏆"
        ]
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateModeIcon();
    initializeSettings();
    checkAPIStatus();
});

// Suggested Prompts
const promptChips = document.querySelectorAll('.prompt-chip');
promptChips.forEach(chip => {
    chip.addEventListener('click', () => {
        const prompt = chip.dataset.prompt;
        sendMessage(prompt);

        // Hide suggested prompts after first use
        const suggestedPrompts = document.getElementById('suggestedPrompts');
        if (suggestedPrompts) {
            suggestedPrompts.style.display = 'none';
        }
    });
});

// Chat Input
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && chatInput.value.trim()) {
        sendMessage(chatInput.value.trim());
    }
});

sendBtn.addEventListener('click', () => {
    if (chatInput.value.trim()) {
        sendMessage(chatInput.value.trim());
    }
});

// Voice Input
const voiceBtn = document.getElementById('voiceBtn');
voiceBtn.addEventListener('click', () => {
    isRecording = !isRecording;
    voiceBtn.classList.toggle('recording', isRecording);

    if (isRecording) {
        voiceBtn.querySelector('.voice-icon').textContent = '⏹️';
        // Simulate voice recording
        setTimeout(() => {
            isRecording = false;
            voiceBtn.classList.remove('recording');
            voiceBtn.querySelector('.voice-icon').textContent = '🎤';

            // Simulate voice-to-text
            const voicePrompt = "How much can I spend on dining this week?";
            chatInput.value = voicePrompt;
            sendMessage(voicePrompt);
        }, 2000);
    } else {
        voiceBtn.querySelector('.voice-icon').textContent = '🎤';
    }
});

// Send Message Function
async function sendMessage(text) {
    const messagesContainer = document.getElementById('messagesContainer');

    // Add user message
    const userMessage = createMessageElement(text, 'user');
    messagesContainer.appendChild(userMessage);

    // Add to conversation history
    conversationHistory.push({ role: 'user', content: text });

    // Clear input
    chatInput.value = '';

    // Scroll to bottom
    scrollToBottom();

    // Show loading indicator
    const loadingMessage = createLoadingMessage();
    messagesContainer.appendChild(loadingMessage);
    scrollToBottom();

    try {
        let aiResponse;

        // Use OpenAI if configured, otherwise use fallback
        if (useOpenAI) {
            aiResponse = await getOpenAIResponse(text);
        } else {
            // Simulate delay for fallback responses
            await new Promise(resolve => setTimeout(resolve, 1000));
            aiResponse = getAIResponse(text);
        }

        // Remove loading indicator
        loadingMessage.remove();

        // Add AI response
        conversationHistory.push({ role: 'assistant', content: aiResponse });
        const aiMessage = createMessageElement(aiResponse, 'ai');
        messagesContainer.appendChild(aiMessage);
        scrollToBottom();
    } catch (error) {
        console.error('Error getting AI response:', error);

        // Remove loading indicator
        loadingMessage.remove();

        if (useOpenAI) {
            // Fallback to local demo response when OpenAI fails
            const fallbackResponse = getAIResponse(text);
            conversationHistory.push({ role: 'assistant', content: fallbackResponse });
            const aiMessage = createMessageElement(fallbackResponse, 'ai');
            messagesContainer.appendChild(aiMessage);

            const warningMessage = createMessageElement(
                'OpenAI failed, so I used demo mode for this reply. Please check your API key or settings if you want OpenAI-powered responses.',
                'ai',
                true
            );
            messagesContainer.appendChild(warningMessage);
            scrollToBottom();
            return;
        }

        // Show error message
        const errorMessage = createMessageElement(
            "Sorry, I encountered an error. Please check your API settings or try again later. 😔",
            'ai',
            true
        );
        messagesContainer.appendChild(errorMessage);
        scrollToBottom();
    }
}

// Create Message Element
function createMessageElement(text, sender, isError = false) {
    const messageGroup = document.createElement('div');
    messageGroup.className = `message-group ${sender === 'user' ? 'user-message' : 'ai-message'}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = `<div class="avatar-orb">${sender === 'ai' ? '✨' : '👤'}</div>`;

    const content = document.createElement('div');
    content.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble glass-card';

    // Format text with line breaks
    const formattedText = text.replace(/\n/g, '<br>');
    bubble.innerHTML = `<p class="message-text">${formattedText}</p>`;

    // Add error styling if needed
    if (isError) {
        bubble.classList.add('error-message');
    }

    // Add action buttons for AI responses (occasionally)
    if (sender === 'ai' && !isError && Math.random() > 0.7) {
        const actions = document.createElement('div');
        actions.className = 'message-actions';
        actions.innerHTML = `
            <button class="message-action-btn" onclick="window.location.href='budgets.html'">View Budget</button>
            <button class="message-action-btn" onclick="window.location.href='insights.html'">See Details</button>
        `;
        bubble.appendChild(actions);
    }

    const time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = 'Just now';

    content.appendChild(bubble);
    content.appendChild(time);

    messageGroup.appendChild(avatar);
    messageGroup.appendChild(content);

    return messageGroup;
}

// Create Loading Message
function createLoadingMessage() {
    const messageGroup = document.createElement('div');
    messageGroup.className = 'message-group ai-message';
    messageGroup.id = 'loadingMessage';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = '<div class="avatar-orb">✨</div>';

    const content = document.createElement('div');
    content.className = 'message-content';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble glass-card loading';
    bubble.innerHTML = `
        <div class="loading-dots">
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
            <div class="loading-dot"></div>
        </div>
    `;

    content.appendChild(bubble);
    messageGroup.appendChild(avatar);
    messageGroup.appendChild(content);

    return messageGroup;
}

// Get OpenAI Response
async function getOpenAIResponse(userMessage) {
    const systemPrompt = OpenAIConfig.systemPrompts[currentMode];

    const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'system', content: `Budget Context: ${OpenAIConfig.budgetContext}` },
        ...conversationHistory.slice(-10) // Keep last 10 messages for context
    ];

    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: OpenAIConfig.model,
            messages: messages,
            temperature: OpenAIConfig.temperature,
            max_tokens: OpenAIConfig.maxTokens
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Get AI Response based on mode and context
function getAIResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    // Analyze question and provide contextual response
    if (msg.includes('dining') || msg.includes('restaurant') || msg.includes('eat out')) {
        return getResponseByMode({
            helpful: "Great question! 😊 You have $87 left in your Dining budget for this week. That's about 21% of your weekly budget. You're doing well staying on track!",
            professional: "Based on your current budget allocation, you have $87 remaining in the Dining category for this week, representing 21.75% of your allocated dining budget.",
            sassy: "You've got $87 left for dining this week. That's like... 19 coffees or 3 fancy dinners. Choose wisely! ☕💸",
            motivational: "You've got $87 left for dining this week and you're CRUSHING IT! 🎯 Stay focused and finish strong! You're a budgeting CHAMPION! 💪"
        });
    }

    if (msg.includes('biggest') || msg.includes('top') || msg.includes('most expensive')) {
        return getResponseByMode({
            helpful: "Looking at your expenses, here are your top 3 categories: Housing ($980), Food & Dining ($402), and Transportation ($225). Housing is your largest expense at 40% of your budget. Want me to break down any of these? 📊",
            professional: "Your top expenditure categories are: Housing at $980 (40%), Food & Dining at $402 (16.4%), and Transportation at $225 (9.2%). Would you like a detailed analysis?",
            sassy: "Okay so you spent $980 on housing (duh, rent), $402 on food (someone likes to eat out 👀), and $225 on gas. Want the tea on where you're wasting money?",
            motivational: "WOW! Look at you managing $980 in housing, $402 in food, and $225 in transport like a BOSS! 🚀 You're doing AMAZING! Keep that energy!"
        });
    }

    if (msg.includes('goal') || msg.includes('saving') || msg.includes('emergency fund')) {
        return getResponseByMode({
            helpful: "Your Emergency Fund goal is 67% complete! 🎉 You've saved $6,700 out of $10,000. At your current rate of $250/month, you'll reach your goal by August 2026. Keep it up! 💪",
            professional: "Your Emergency Fund is currently at 67% completion ($6,700/$10,000). Projected completion date: August 2026, assuming consistent monthly contributions of $250.",
            sassy: "Your savings game is at 67%! Not bad, not bad. Keep grinding and you'll hit that $10k by August. Unless you blow it on more takeout... 🙃",
            motivational: "67% to your Emergency Fund goal?! THAT'S INCREDIBLE! 🎉 You're on FIRE! August 2026 is YOUR month! Keep pushing, you absolute LEGEND! 🏆"
        });
    }

    if (msg.includes('optimize') || msg.includes('improve') || msg.includes('better')) {
        return getResponseByMode({
            helpful: "I've analyzed your spending patterns! 💡 Here are my suggestions:\n\n1. You're $10 over budget in Entertainment - consider reducing streaming subscriptions\n2. You're under budget in Food by $87 - great job!\n3. Move that extra $50 to your Emergency Fund to reach your goal faster\n\nWant me to make these changes?",
            professional: "Budget optimization analysis complete. Recommendations: 1) Reduce Entertainment allocation by $10 (currently over budget). 2) Reallocate Food surplus of $87. 3) Increase Emergency Fund contribution by $50 monthly to accelerate goal completion.",
            sassy: "Alright, let's fix this mess 😎\n\n• Cut that Entertainment budget - you're $10 over (Netflix AND Hulu? Really?)\n• You saved $87 on food this month - finally!\n• Throw that extra cash at your savings before you spend it on something dumb\n\nShall I do it?",
            motivational: "LET'S OPTIMIZE THIS BUDGET AND CRUSH YOUR GOALS! 🔥\n\n✓ Entertainment is $10 over - LET'S FIX THAT!\n✓ Food is $87 under - YOU'RE A STAR!\n✓ Let's BOOST that Emergency Fund by $50!\n\nYou're about to level UP! Ready?!"
        });
    }

    if (msg.includes('save') || msg.includes('cut') || msg.includes('reduce')) {
        return getResponseByMode({
            helpful: "Here are some ways to save more money: 💰\n\n• Cancel unused subscriptions (I found 2 you haven't used in 3 months)\n• Pack lunch 2x/week = save ~$80/month\n• Switch to a cheaper phone plan = save $25/month\n\nThat's $105/month in savings!",
            professional: "Savings opportunities identified: 1) Subscription optimization ($30/month). 2) Meal preparation strategy ($80/month). 3) Telecommunications plan adjustment ($25/month). Total potential savings: $135/month.",
            sassy: "Wanna save money? Here's the truth bomb 💣\n\n• You're paying for 2 streaming services you don't watch\n• Stop buying $12 salads when you have food at home\n• Your phone bill is highway robbery - switch carriers\n\nThat's like $135/month you're throwing away. You're welcome.",
            motivational: "TIME TO UNLOCK YOUR SAVINGS POTENTIAL! 💪\n\n🎯 Cut those unused subscriptions - $30 SAVED!\n🎯 Meal prep like a CHAMPION - $80 SAVED!\n🎯 Optimize that phone plan - $25 SAVED!\n\nThat's $135/MONTH back in YOUR pocket! LET'S GO!"
        });
    }

    if (msg.includes('advice') || msg.includes('help') || msg.includes('provide')) {
        return getResponseByMode({
            helpful: "Here are some ways to save more money: 💰\n\n• Cancel unused subscriptions (I found 2 you haven't used in 3 months)\n• Pack lunch 2x/week = save ~$80/month\n• Switch to a cheaper phone plan = save $25/month\n\nThat's $105/month in savings!",
            professional: "Savings opportunities identified: 1) Subscription optimization ($30/month). 2) Meal preparation strategy ($80/month). 3) Telecommunications plan adjustment ($25/month). Total potential savings: $135/month.",
            sassy: "Wanna save money? Here's the truth bomb 💣\n\n• You're paying for 2 streaming services you don't watch\n• Stop buying $12 salads when you have food at home\n• Your phone bill is highway robbery - switch carriers\n\nThat's like $135/month you're throwing away. You're welcome.",
            motivational: "TIME TO UNLOCK YOUR SAVINGS POTENTIAL! 💪\n\n🎯 Cut those unused subscriptions - $30 SAVED!\n🎯 Meal prep like a CHAMPION - $80 SAVED!\n🎯 Optimize that phone plan - $25 SAVED!\n\nThat's $135/MONTH back in YOUR pocket! LET'S GO!"
        });
    }

    if (msg.includes('spend') || msg.includes('analysis') || msg.includes('habit')) {
        return getResponseByMode({
            helpful: "I've analyzed your spending habits over the past 3 months! 📈\n\nPatterns I noticed:\n• You spend 40% more on weekends\n• Coffee shops are your #1 small expense ($120/month)\n• You're great at staying under budget on groceries!\n\nOverall, you're doing well! Just watch those weekend splurges.",
            professional: "Spending pattern analysis (90-day period): Weekend expenditure elevated by 40% compared to weekdays. Recurring small transactions at coffee establishments total $120 monthly. Grocery budget adherence: excellent (consistently 15% under allocation).",
            sassy: "Let me read you for filth 📖\n\n• Weekends? You go WILD - spending 40% more\n• $120/month on coffee? Bestie, buy a Keurig\n• Groceries? Actually good - color me shocked\n\nYou're doing okay but those weekend vibes are expensive 💸",
            motivational: "YOUR SPENDING ANALYSIS IS IN! 📊\n\n💪 CRUSHING groceries - 15% under budget!\n⚠️ Weekends are your kryptonite - 40% more spending\n☕ Coffee addiction detected - $120/month!\n\nYou're AMAZING but let's DOMINATE those weekends too! 🔥"
        });
    }

    // Default responses for general questions
    return getResponseByMode({
        helpful: "I'm here to help! 😊 I can answer questions about your budget, spending, goals, and give you personalized financial advice. Try asking me about specific categories, your savings progress, or how to optimize your budget!",
        professional: "I can provide detailed analysis of your financial data, budget recommendations, spending patterns, and goal projections. Please specify your inquiry for a comprehensive response.",
        sassy: "What do you wanna know? 😎 I can tell you where your money's going, roast your spending habits, or help you actually save some cash. Hit me with a real question!",
        motivational: "I'm PUMPED to help you CRUSH your financial goals! 🔥 Ask me ANYTHING about your budget, spending, or savings and let's make MAGIC happen! You've got this! 💪"
    });
}

function getResponseByMode(responses) {
    return responses[currentMode];
}

// Scroll to bottom
function scrollToBottom() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Quick Actions
const quickActionBtns = document.querySelectorAll('.quick-action-btn');
quickActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.dataset.action;

        switch (action) {
            case 'transactions':
                window.location.href = 'transactions.html';
                break;
            case 'budget':
                window.location.href = 'budgets.html';
                break;
            case 'insights':
                window.location.href = 'insights.html';
                break;
        }
    });
});

// Mode Toggle
const modeToggle = document.getElementById('modeToggle');
const modeModal = document.getElementById('modeModal');
const closeModal = document.getElementById('closeModal');

modeToggle.addEventListener('click', () => {
    modeModal.style.display = 'flex';
});

closeModal.addEventListener('click', () => {
    modeModal.style.display = 'none';
});

modeModal.addEventListener('click', (e) => {
    if (e.target === modeModal) {
        modeModal.style.display = 'none';
    }
});

// Mode Selection
const modeOptions = document.querySelectorAll('.mode-option');
modeOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Update active state
        modeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');

        // Update current mode
        currentMode = option.dataset.mode;
        updateModeIcon();

        // Add confirmation message
        const messagesContainer = document.getElementById('messagesContainer');
        const modeName = option.querySelector('.mode-name').textContent;
        const greeting = modeResponses[currentMode].greeting;

        const modeChangeMessage = createMessageElement(
            `Mode switched to ${modeName}! ${greeting}`,
            'ai'
        );
        messagesContainer.appendChild(modeChangeMessage);
        scrollToBottom();
    });
});

function updateModeIcon() {
    const modeIcon = document.querySelector('.mode-icon');
    const icons = {
        helpful: '😊',
        professional: '💼',
        sassy: '😎',
        motivational: '🔥'
    };
    modeIcon.textContent = icons[currentMode];
}

// Settings Modal
function initializeSettings() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const modelSelect = document.getElementById('modelSelect');

    // Load saved settings
    modelSelect.value = OpenAIConfig.model;

    settingsBtn.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    saveSettings.addEventListener('click', () => {
        const model = modelSelect.value;
        saveModel(model);
        updateAPIStatus(useOpenAI);
        settingsModal.style.display = 'none';

        const messagesContainer = document.getElementById('messagesContainer');
        const confirmMessage = createMessageElement(
            'Model updated successfully! I\'m now using ' + model + '. 🚀',
            'ai'
        );
        messagesContainer.appendChild(confirmMessage);
        scrollToBottom();
    });
}

async function checkAPIStatus() {
    try {
        const response = await fetch('/api/status');
        const status = await response.json();

        if (response.ok && status.configured) {
            useOpenAI = true;
            updateAPIStatus(true);
        } else {
            useOpenAI = false;
            updateAPIStatus(false);
        }
    } catch (error) {
        useOpenAI = false;
        updateAPIStatus(false);
    }
}

function updateAPIStatus(configured) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    const headerStatus = document.querySelector('.header-status');

    if (configured) {
        statusIndicator.classList.add('configured');
        statusText.textContent = 'API Configured ✓';
        if (headerStatus) {
            headerStatus.innerHTML = '<span class="status-dot"></span>Online • OpenAI Powered';
        }
    } else {
        statusIndicator.classList.remove('configured');
        statusText.textContent = 'Not configured';
        if (headerStatus) {
            headerStatus.innerHTML = '<span class="status-dot"></span>Online • Demo Mode';
        }
    }
}

console.log('AI Budget Assistant loaded');
