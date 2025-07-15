const express = require('express');
const handlebars = require('express-handlebars');
const _dirname = require('./utils');
const viewsRouter = require('./routes/views.router');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const io = new Server(server);

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', _dirname + '/views');

app.use(express.static(_dirname + '/public'));

app.use('/views', viewsRouter);

io.on('connection', (socket) => {
    console.log('Usuário conectado');

    socket.on('authenticate', (user) => {
        console.log(`Usuário autenticado: ${user}`);
        socket.broadcast.emit('userConnected', user);
    });
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
    socket.on('disconnect', () => {
        console.log('Usuário desconectado');
    });
  });

  const PORT = 8080;
  server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });