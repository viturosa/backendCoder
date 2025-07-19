const express = require('express');
const ProductManager = require('../managers/ProductManager');

const router = express.Router();
const pm = new ProductManager('./data/products.json');

router.get('/', async (req, res) => {
  const products = await pm.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await pm.getProductById(req.params.pid);
  product ? res.json(product) : res.status(404).json({ error: 'Produto não encontrado' });
});

router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    const newProduct = await pm.addProduct({ title, description, code, price, status, stock, category, thumbnails });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put('/:pid', async (req, res) => {
  const updated = await pm.updateProduct(req.params.pid, req.body);
  updated ? res.json(updated) : res.status(404).json({ error: 'Produto não encontrado' });
});

router.delete('/:pid', async (req, res) => {
  const success = await pm.deleteProduct(req.params.pid);
  success ? res.json({ message: 'Produto deletado' }) : res.status(404).json({ error: 'Produto não encontrado' });
});

module.exports = router;