import mongoose from 'mongoose';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import Product from './models/product.model.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;


const server = http.createServer(app);
const io = new Server(server);

const users = {};

io.on('connection', async (socket) => {
  console.log(`🔌 Usuário conectado: ${socket.id}`);

  
  socket.on('setNome', (nome) => {
    users[socket.id] = nome;
    socket.emit('mensagem', { tipo: 'sistema', texto: `Bem-vindo, ${nome}!` });
    socket.broadcast.emit('mensagem', { tipo: 'sistema', texto: `${nome} entrou no chat.` });
  });

  
  socket.on('mensagem', (msg) => {
    const remetente = users[socket.id] || 'Anônimo';
    io.emit('mensagem', { tipo: 'usuario', texto: msg, remetente });
  });

  const produtos = await Product.find().lean();
  socket.emit('update-products', produtos);

  socket.on('new-product', async (produto) => {
    const novo = new Product(produto);
    await novo.save();
    const atualizados = await Product.find().lean();
    io.emit('update-products', atualizados);
  });

  socket.on('delete-product', async (id) => {
    await Product.findByIdAndDelete(id);
    const atualizados = await Product.find().lean();
    io.emit('update-products', atualizados);
  });

  socket.on('disconnect', () => {
    const nome = users[socket.id] || 'Usuário';
    delete users[socket.id];
    io.emit('mensagem', { tipo: 'sistema', texto: `${nome} saiu do chat.` });
    console.log(`Desconectado: ${socket.id}`);
  });
});


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Conectado ao MongoDB');
  server.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}).catch(err => console.error('Erro ao conectar ao MongoDB:', err));