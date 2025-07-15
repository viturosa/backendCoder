import express from 'express';
import handlebars from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const users = {}

const productsFile = path.join(__dirname, 'data', 'products.json');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    res.render('home', { products });
});


app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts');
});


io.on('connection', (socket) => {
    console.log('Usuário conectado:', socket.id);
    socket.on('setNome', (nome) => {
        users[socket.id] = nome;
        socket.emit('mensagem', { tipo: 'sistema', texto: `Bem-vindo ${nome}!` });
        socket.broadcast.emit('mensagem', { tipo: 'sistema', texto: `${nome} entrou no chat!` });
    
    socket.broadcast.emit('mensagem', { tipo: 'sistema', texto: `Usuário ${socket.id} conectado`})
    })
   
    socket.on('mensagem', (msg) => {
        io.emit('mensagem',{tipo: 'usuario', texto: msg, remetente});
    });

    socket.on('disconnect', () => {
        const nome = users[socket.id] || 'Usuário Desconhecido';
        delete users[socket.id];
        io.emit('mensagem', { tipo: 'sistema', texto: ` ${nome} desconectado` });
    })

    const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    socket.emit('update-products', products);

 
    socket.on('new-product', (product) => {
        const current = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
        current.push(product);
        fs.writeFileSync(productsFile, JSON.stringify(current, null, 2));
        io.emit('update-products', current);
    });

  
    socket.on('delete-product', (id) => {
        let current = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
        current = current.filter(p => p.id !== id);
        fs.writeFileSync(productsFile, JSON.stringify(current, null, 2));
        io.emit('update-products', current);
    });

    socket.on('disconnect', () => {
        console.log('Usuário desconectado:', socket.id);
    });
});


server.listen(8080, () => {
    console.log('Servidor Express e Socket rodando na porta 8080');
});