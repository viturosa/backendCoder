const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(filePath) {
    this.path = path.resolve(filePath);
  }

  async _load() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async _save(data) {
    await fs.writeFile(this.path, JSON.stringify(data, null, 2));
  }

  async createCart() {
    const carts = await this._load();
    const id = carts.length ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id, products: [] };
    carts.push(newCart);
    await this._save(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._load();
    return carts.find(cart => cart.id == id);
  }

  async addProductToCart(cid, pid) {
    const carts = await this._load();
    const cart = carts.find(c => c.id == cid);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product == pid);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await this._save(carts);
    return cart;
  }
}

module.exports = CartManager;