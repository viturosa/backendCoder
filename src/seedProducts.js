import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/product.model.js'; 
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const products = [
  {
    title: 'Tênis de corrida',
    description: 'Confortável para longas distâncias',
    price: 299.9,
    category: 'Calçados',
    stock: 25,
    status: true
  },
  {
    title: 'Camiseta básica',
    description: 'Camiseta 100% algodão, diversas cores',
    price: 49.9,
    category: 'Roupas',
    stock: 100,
    status: true
  },
  {
    title: 'Relógio esportivo',
    description: 'Resistente à água, com monitor cardíaco',
    price: 499.9,
    category: 'Acessórios',
    stock: 15,
    status: true
  },
  {
    title: 'Mochila de viagem',
    description: 'Espaçosa e resistente, com compartimento para notebook',
    price: 199.9,
    category: 'Bolsas',
    stock: 30,
    status: true
  },
  {
    title: 'Fone de ouvido Bluetooth',
    description: 'Som estéreo, bateria de longa duração',
    price: 149.9,
    category: 'Eletrônicos',
    stock: 50,
    status: true
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado ao MongoDB');

    await Product.deleteMany({});
    console.log('Coleção products limpa');

    await Product.insertMany(products);
    console.log('Produtos inseridos com sucesso');

    await mongoose.disconnect();
    console.log('Desconectado do MongoDB');
  } catch (error) {
    console.error('Erro ao inserir produtos:', error);
  }
}

seed();