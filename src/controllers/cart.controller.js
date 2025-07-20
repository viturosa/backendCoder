import Cart from '../models/cart.model.js';

export const getCart = async (req, res) => {
  const cart = await Cart.findById(req.params.cid).populate('products.product').lean();
  res.render('cart', { cart });
};

export const deleteProductFromCart = async (req, res) => {
  const { cid, pid } = req.params;
  await Cart.findByIdAndUpdate(cid, { $pull: { products: { product: pid } } });
  res.sendStatus(204);
};

export const updateAllCartProducts = async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  await Cart.findByIdAndUpdate(cid, { products });
  res.sendStatus(200);
};

export const updateProductQuantity = async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  await Cart.updateOne(
    { _id: cid, 'products.product': pid },
    { $set: { 'products.$.quantity': quantity } }
  );
  res.sendStatus(200);
};

export const deleteAllProductsFromCart = async (req, res) => {
  await Cart.findByIdAndUpdate(req.params.cid, { products: [] });
  res.sendStatus(204);
};