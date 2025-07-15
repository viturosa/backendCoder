const socket = io();

const mensagensList = document.getElementById('messages');
const inputMensagens = document.getElementById('msgInput');

const nomeUsuario = prompt('Digite seu nome:');
socket.emit('setNome', nomeUsuario);

socket.on('mensagem', (msg) => {
    const li = document.createElement('li');
    if(msg.tipo === 'sistema') {
        li.style.color = 'red';
    } else {
        li.style.color = 'gray';
    }
    li.textContent = msg.tipo === 'sistema' ? `[SISTEMA]: ${msg.texto}` : ` [${msg.remetente}]: ${msg.texto}`; 
    mensagensList.appendChild(li);
    li.textContent = msg;
    document.getElementById('messages').appendChild(li);
    mensagensList.scrollTop = mensagensList.scrollHeight;
});

function sendMessage() {
    const input = inputMensagem;
    if (input.value.trim()) {
        socket.emit('mensagem', input.value);
        input.value = '';
    
    }
}

inputMensagens.getElementById('msgInput').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
