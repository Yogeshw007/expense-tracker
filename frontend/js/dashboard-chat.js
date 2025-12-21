// Dashboard Chat Modal functionality
const chatModal = document.getElementById('chatModal');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatBotButton = document.getElementById('chatBotButton');

// Open chat modal
function openChatModal() {
    chatModal.style.display = 'block';
    chatModal.classList.add('show');
    chatInput.focus();
    loadQuickExamples();

    // Hide chat button when modal is open
    if (chatBotButton) {
        chatBotButton.style.display = 'none';
    }

    // Hide notification badge
    const badge = document.getElementById('chatNotificationBadge');
    if (badge) {
        badge.style.display = 'none';
    }

    // Add welcome message if chat is empty (only bot's initial message)
    if (chatMessages.children.length === 1) {
        setTimeout(() => {
            addMessage("👋 Hello! I'm ready to help you track your expenses. Try saying something like 'spent 500 on food' or 'create category Travel 5000'", 'bot', 'info');
        }, 300);
    }
}

// Show notification badge on page load
document.addEventListener('DOMContentLoaded', () => {
    const badge = document.getElementById('chatNotificationBadge');
    if (badge) {
        // Show badge after 3 seconds to attract attention
        setTimeout(() => {
            badge.style.display = 'flex';
        }, 3000);
    }
});

// Close chat modal
function closeChatModal() {
    chatModal.style.display = 'none';
    chatModal.classList.remove('show');

    // Show chat button when modal is closed
    if (chatBotButton) {
        chatBotButton.style.display = 'flex';
    }
}

// Close modal when clicking outside (but not on the modal content)
window.onclick = function(event) {
    if (event.target === chatModal) {
        closeChatModal();
    }
}

// Load categories and create quick examples
async function loadQuickExamples() {
    try {
        const response = await fetch(API.categories.getAll());
        const categories = await response.json();

        const exampleButtonsContainer = document.getElementById('exampleButtons');
        exampleButtonsContainer.innerHTML = '';

        // Add "Spent" examples for each category (limit to 4)
        categories.slice(0, 4).forEach(category => {
            const spentBtn = document.createElement('button');
            spentBtn.className = 'example-btn';
            spentBtn.onclick = () => fillExample(`spent ${category.name} 100`);
            spentBtn.innerHTML = `
                <i class="fas fa-shopping-cart"></i> spent ${category.name} 100
            `;
            exampleButtonsContainer.appendChild(spentBtn);
        });

        // Add "New Category" button
        const newCategoryBtn = document.createElement('button');
        newCategoryBtn.className = 'example-btn';
        newCategoryBtn.onclick = () => fillExample('new category Travel 5000');
        newCategoryBtn.innerHTML = `
            <i class="fas fa-plus"></i> new category Travel 5000
        `;
        exampleButtonsContainer.appendChild(newCategoryBtn);

    } catch (error) {
        console.error('Error loading categories:', error);
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
        // Enhance the message
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

        // Add bot response
        addMessage(data.message, 'bot', data.type);

        // If successful, reload dashboard data
        if (data.type === 'success') {
            setTimeout(() => {
                loadDashboard(); // Reload dashboard data
                addQuickActions();
            }, 500);
        }

    } catch (error) {
        removeTypingIndicator();
        addMessage('❌ Sorry, something went wrong. Please try again.', 'bot', 'error');
        console.error('Error:', error);
    }
}

// Enhance message with smart parsing
function enhanceMessage(message) {
    const patterns = [
        { regex: /(?:bought|paid|spent)\s+(.+?)\s+(?:for|of)\s+(\d+)/i, format: 'spent $2 on $1' },
        { regex: /(?:bought|paid|spent)\s+(\d+)\s+(?:on|for)\s+(.+)/i, format: 'spent $1 on $2' },
        { regex: /^(\w+)\s+(\d+)$/i, format: 'spent $2 on $1' },
    ];

    for (const pattern of patterns) {
        const match = message.match(pattern.regex);
        if (match) {
            let enhanced = pattern.format;
            for (let i = 1; i < match.length; i++) {
                enhanced = enhanced.replace(`$${i}`, match[i]);
            }
            return enhanced;
        }
    }

    return message;
}

// Add quick action buttons after successful operations
function addQuickActions() {
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
                    <i class="fas fa-plus"></i> Add Another
                </button>
                <button class="action-btn" onclick="closeChatModal()">
                    <i class="fas fa-check"></i> Done
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
    messageDiv.style.opacity = '0';
    messageDiv.style.transform = 'translateY(10px)';

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

    // Animate message in
    setTimeout(() => {
        messageDiv.style.transition = 'all 0.3s ease';
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateY(0)';
    }, 10);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessage(text) {
    text = text.replace(/\n/g, '<br>');
    text = text.replace(/•/g, '<span style="color: #3B82F6;">•</span>');
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

