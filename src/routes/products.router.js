import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/product.controller.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);

export default router;
