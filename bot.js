const chatInput = document.getElementById('chat-input');
const chatSend = document.getElementById('chat-send');
const chatMessages = document.getElementById('chat-messages');
const botTrigger = document.getElementById('bot-trigger');
const chatWindow = document.getElementById('chat-window');
const closeChat = document.getElementById('close-chat');

let chatState = 'greeting';
let userName = '';

const responses = {
    "name": "My name is Mashilo Makgotho.",
    "do": "I am a software developer.",
    "background": "I hold a Diploma in Software Development and have experience in IT support.",
    "languages": "I know C#, Java, Python, JavaScript, and more.",
    "skills": "I have skills in programming, problem-solving, system design, and various frameworks.",
    "study": "I studied on platforms like FreeCodeCamp, Oracle, and Cisco.",
    "goal": "I am committed to becoming a skilled full-stack developer.",
    "experience": "I have experience in IT support, which has enhanced my technical troubleshooting abilities and attention to detail.",
    "thank": "You're welcome! Is there anything else you'd like to know?",
    "thanks": "You're welcome! Is there anything else you'd like to know?",
    "email": "For professional inquiries, you can connect with me on LinkedIn.",
    "phone": "For contact information, please check the social links or LinkedIn.",
    "contact": "You can find me on LinkedIn, GitHub, Instagram, and Facebook.",
    "contacts": "You can find me on LinkedIn, GitHub, Instagram, and Facebook.",
    "bye": "Goodbye! Have a great day!",
    "goodbye": "Goodbye! Have a great day!",
    "default": "I'm sorry, I don't have an answer for that. Feel free to ask about my background, skills, or experience!"
};

function getResponse(question) {
    const lowerQuestion = question.toLowerCase();
    for (const key in responses) {
        if (lowerQuestion.includes(key)) {
            return responses[key];
        }
    }
    return responses["default"];
}

function addMessage(text, className) {
    const message = document.createElement('div');
    message.className = 'message ' + className;
    message.textContent = text;
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

botTrigger.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    setTimeout(() => chatWindow.classList.add('show'), 10); // Small delay to trigger transition
    if (chatMessages.children.length === 0) {
        addMessage('Bot: Hello! I\'m Mashilo\'s AI assistant. What\'s your name?', 'bot');
    }
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('show');
    setTimeout(() => chatWindow.style.display = 'none', 500); // Wait for transition
});

chatSend.addEventListener('click', () => {
    const question = chatInput.value.trim();
    if (question) {
        addMessage('You: ' + question, 'user');

        let response = '';
        if (chatState === 'greeting') {
            userName = question;
            chatState = 'qa';
            response = `Nice to meet you ${userName}! What would you like to know about Mashilo?`;
        } else if (chatState === 'qa') {
            response = getResponse(question);
        }

        addMessage('Bot: ' + response, 'bot');
        chatInput.value = '';
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        chatSend.click();
    }
});