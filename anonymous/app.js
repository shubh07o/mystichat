// Connect to the server
const socket = io({
    transports: ['websocket'],
    upgrade: false
});

const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const newChatButton = document.getElementById('newChatButton');
const endChatButton = document.getElementById('endChatButton');
const typingIndicator = document.getElementById('typingIndicator');
const connectionStatus = document.getElementById('connectionStatus');

let typingTimeout;
let isChatActive = false;

// Format timestamp
function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add message to chat
function addMessage(text, isSent = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isSent ? 'sent' : 'received'}`;
    
    const messageText = document.createElement('div');
    messageText.textContent = text;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = formatTimestamp(new Date());
    
    messageDiv.appendChild(messageText);
    messageDiv.appendChild(timestamp);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show connection status
function showStatus(message) {
    connectionStatus.textContent = message;
}

// Handle typing indicator
function handleTyping() {
    typingIndicator.style.display = 'block';
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
        typingIndicator.style.display = 'none';
    }, 1000);
}

// Socket event handlers
socket.on('connect', () => {
    showStatus('Connected to server');
});

socket.on('disconnect', () => {
    showStatus('Disconnected from server');
});

socket.on('connect_error', (error) => {
    showStatus('Connection error. Please refresh the page.');
    console.error('Connection error:', error);
});

socket.on('waitingForPartner', () => {
    showStatus('Waiting for a partner...');
    isChatActive = false;
});

socket.on('chatStarted', () => {
    showStatus('Chat started with a stranger');
    isChatActive = true;
    chatMessages.innerHTML = '';
});

socket.on('chatEnded', () => {
    showStatus('Chat ended');
    isChatActive = false;
    addMessage('Chat ended. Click "New Chat" to start a new conversation.', false);
});

socket.on('partnerDisconnected', () => {
    showStatus('Partner disconnected');
    isChatActive = false;
    addMessage('Your partner has disconnected. Click "New Chat" to start a new conversation.', false);
});

socket.on('message', (data) => {
    addMessage(data.text, false);
});

socket.on('typing', () => {
    handleTyping();
});

// Event listeners
sendButton.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message && isChatActive) {
        socket.emit('message', { text: message });
        addMessage(message, true);
        messageInput.value = '';
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && isChatActive) {
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('message', { text: message });
            addMessage(message, true);
            messageInput.value = '';
        }
    }
});

messageInput.addEventListener('input', () => {
    if (isChatActive) {
        socket.emit('typing');
    }
});

newChatButton.addEventListener('click', () => {
    socket.emit('joinQueue');
    showStatus('Looking for a partner...');
});

endChatButton.addEventListener('click', () => {
    if (isChatActive) {
        socket.emit('endChat');
    }
});

// Initialize
showStatus('Click "New Chat" to start a conversation'); 
