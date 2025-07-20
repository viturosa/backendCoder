import { Router } from 'express';
import {
  getCart,
  deleteProductFromCart,
  updateAllCartProducts,
  updateProductQuantity,
  deleteAllProductsFromCart
} from '../controllers/cart.controller.js';

const router = Router();

router.get('/:cid', getCart);
router.delete('/:cid/products/:pid', deleteProductFromCart);
router.put('/:cid', updateAllCartProducts);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', deleteAllProductsFromCart);

export default router;
