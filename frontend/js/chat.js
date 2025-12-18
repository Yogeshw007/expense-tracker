// Chat functionality
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    chatInput.focus();
    loadQuickExamples();
});

// Load categories and create quick examples
async function loadQuickExamples() {
    try {
        const response = await fetch(API.categories.getAll());
        const categories = await response.json();

        const exampleButtonsContainer = document.querySelector('.example-buttons');
        exampleButtonsContainer.innerHTML = '';

        // Add "Spent" examples for each category
        categories.forEach(category => {
            const spentBtn = document.createElement('button');
            spentBtn.className = 'example-btn';
            spentBtn.onclick = () => fillExample(`spent ${category.name} 100`);
            spentBtn.innerHTML = `
                <i class="fas fa-shopping-cart"></i> spent ${category.name} 100
            `;
            exampleButtonsContainer.appendChild(spentBtn);
        });

        // Add "New Category" button at the end
        const newCategoryBtn = document.createElement('button');
        newCategoryBtn.className = 'example-btn';
        newCategoryBtn.onclick = () => fillExample('new category Travel 5000');
        newCategoryBtn.innerHTML = `
            <i class="fas fa-plus"></i> new category Travel 5000
        `;
        exampleButtonsContainer.appendChild(newCategoryBtn);

    } catch (error) {
        console.error('Error loading categories:', error);
        // Fallback to default examples
        const exampleButtonsContainer = document.querySelector('.example-buttons');
        exampleButtonsContainer.innerHTML = `
            <button class="example-btn" onclick="fillExample('spent Food 100')">
                <i class="fas fa-shopping-cart"></i> spent Food 100
            </button>
            <button class="example-btn" onclick="fillExample('new category Travel 5000')">
                <i class="fas fa-plus"></i> new category Travel 5000
            </button>
        `;
    }
}

// Send message on button click
sendButton.addEventListener('click', sendMessage);

// Send message on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

async function sendMessage() {
    const message = chatInput.value.trim();

    if (!message) {
        return;
    }

    // Add user message to chat
    addMessage(message, 'user');

    // Clear input
    chatInput.value = '';

    // Show typing indicator
    showTypingIndicator();

    try {
        // Try to parse and enhance the message locally first
        const enhancedMessage = enhanceMessage(message);

        // Send to backend
        const response = await fetch(`${API_BASE_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: enhancedMessage })
        });

        const data = await response.json();

        // Remove typing indicator
        removeTypingIndicator();

        // Add bot response with enhanced formatting
        addMessage(data.message, 'bot', data.type);

        // If successful, offer related actions
        if (data.type === 'success') {
            setTimeout(() => {
                addQuickActions(data);
            }, 500);
        }

    } catch (error) {
        removeTypingIndicator();
        addMessage('❌ Sorry, something went wrong. Please try again or check your internet connection.', 'bot', 'error');
        console.error('Error:', error);
    }
}

// Enhance message with smart parsing
function enhanceMessage(message) {
    const lower = message.toLowerCase();

    // Smart patterns for common phrases
    const patterns = [
        { regex: /(?:bought|paid|spent)\s+(.+?)\s+(?:for|of)\s+(\d+)/i, format: 'spent $2 on $1' },
        { regex: /(?:bought|paid|spent)\s+(\d+)\s+(?:on|for)\s+(.+)/i, format: 'spent $1 on $2' },
        { regex: /^(\w+)\s+(\d+)$/i, format: 'spent $2 on $1' }, // Quick format: "food 500"
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern.regex);
        if (match) {
            let enhanced = pattern.format;
            for (let i = 1; i < match.length; i++) {
                enhanced = enhanced.replace(`$${i}`, match[i]);
            }
            console.log(`Enhanced: "${message}" → "${enhanced}"`);
            return enhanced;
        }
    }

    return message;
}

// Add quick action buttons after successful operations
function addQuickActions(data) {
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'chat-message bot-message';
    actionsDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p><strong>What's next?</strong></p>
            <div class="quick-actions">
                <button class="action-btn" onclick="fillExample('spent Food 100')">
                    <i class="fas fa-plus"></i> Add Another Expense
                </button>
                <button class="action-btn" onclick="window.location.href='expenses.html'">
                    <i class="fas fa-list"></i> View All Expenses
                </button>
                <button class="action-btn" onclick="window.location.href='index.html'">
                    <i class="fas fa-chart-line"></i> Dashboard
                </button>
            </div>
        </div>
    `;
    chatMessages.appendChild(actionsDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addMessage(text, sender, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    if (sender === 'bot') {
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content ${type}">
                ${formatMessage(text)}
            </div>
        `;
    } else {
        messageDiv.innerHTML = `
            <div class="message-content">
                ${formatMessage(text)}
            </div>
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
        `;
    }
    
    chatMessages.appendChild(messageDiv);
    
    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(text) {
    // Convert newlines to <br>
    text = text.replace(/\n/g, '<br>');
    
    // Convert bullet points
    text = text.replace(/•/g, '<span style="color: #3B82F6;">•</span>');
    
    // Make text in single quotes bold
    text = text.replace(/'([^']+)'/g, '<strong>$1</strong>');
    
    return text;
}

function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot-message typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function fillExample(text) {
    chatInput.value = text;
    chatInput.focus();
}

