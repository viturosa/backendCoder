const socket = io();

socket.on('mensagem', (msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    document.getElementById('messages').appendChild(li);
});

function sendMessage() {
    const input = document.getElementById('msgInput');
    if (input.value.trim()) {
        socket.emit('mensagem', input.value);
        input.value = '';
    
    }
}

document.getElementById('msgInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
