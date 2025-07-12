import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();
const __dirname = path.resolve();
const productsFile = path.join(__dirname, 'src', 'data', 'products.json');

router.get('/', (req, res) => {
  const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;