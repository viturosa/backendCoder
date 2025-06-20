const fs = require('fs').promises;
const path = require('path');

class ProductManager {
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

  async addProduct(product) {
    const products = await this._load();

    const id = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = { id, status: true, ...product };

    if (products.some(p => p.code === newProduct.code)) {
      throw new Error("Código duplicado.");
    }

    products.push(newProduct);
    await this._save(products);
    return newProduct;
  }

  async getProducts() {
    return await this._load();
  }

  async getProductById(id) {
    const products = await this._load();
    return products.find(p => p.id == id);
  }

  async updateProduct(id, data) {
    const products = await this._load();
    const index = products.findIndex(p => p.id == id);
    if (index === -1) return null;

    delete data.id;
    products[index] = { ...products[index], ...data };
    await this._save(products);
    return products[index];
  }

  async deleteProduct(id) {
    let products = await this._load();
    const lengthBefore = products.length;
    products = products.filter(p => p.id != id);
    if (products.length === lengthBefore) return false;

    await this._save(products);
    return true;
  }
}

module.exports = ProductManager;