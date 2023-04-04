import fs from "fs/promises";
import ProductManager from './productManager.js';
const productManager = new ProductManager();

class CartManager {
    #carts = [];
    
    constructor() {
        this.#carts = [];
        this.lastId = 0;
        this.path = `./src/db/cart.json`
    }

    async addCart() {
        try{
            const cartist = await fs.readFile(this.path, "utf-8");

            const carts = JSON.parse(cartist)
            
            if (carts.length > 0) {
                const lastCart = carts[carts.length - 1];
                this.lastId = lastCart.id;
            }

            carts.push({ id: ++this.lastId, products: [] });

            await fs.writeFile(this.path, JSON.stringify(carts));

            return "Cart agregado"
            
        } catch {
            const newCart = [{ id: 1, products: [] }]
            
            await fs.writeFile(this.path, JSON.stringify(newCart));

            return 'No se encontro el archivo, se creo uno nuevo';
        }
    }

    async getProductsCartById(id) {
        try {
            const cartsList = await fs.readFile(this.path, "utf-8");
            
            const carts = JSON.parse(cartsList);
            
            const cart = carts.find((cart) => cart.id === id);

            if (!cart) {
                throw new Error(`No se encontró el carrito con id: ${id}`);
            }

            return cart.products
        } catch (e) {
            throw new Error(e);
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            const product = productManager.getProductById(productId)

            if (!product) {
                throw new Error (`No se encontro ningun producto con el id: ${productId}`);
            }

            if (!quantity) {
                quantity = 1
            }

            const cartsList = await fs.readFile(this.path, "utf-8");
            
            const carts = JSON.parse(cartsList);

            const cartIdIndex = carts.findIndex((cart) => cart.id === cartId);

            if (cartIdIndex === -1) {
                throw new Error(`No se encontro ningun carrito con el id: ${cartId}`);
            }
            const productIndex = carts[cartIdIndex].products.findIndex(p => p.product === productId);
            
            if (productIndex !== -1) {
                carts[cartIdIndex].products[productIndex].quantity += quantity;
            } else {
                carts[cartIdIndex].products.push({ product: productId, quantity: quantity})
            }

            await fs.writeFile(this.path, JSON.stringify(carts));
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteProductInCart(cartId, productId) {
        try {
            const cartsList = await fs.readFile(this.path, "utf-8");
            
            const carts = JSON.parse(cartsList);

            const cartIndex = carts.findIndex((cart) => cart.id === cartId);
            
            if (cartIndex === -1) {
                throw new Error(`No se encontro ningun carrito con el id: ${cartId}` );
            }

            const productIndex = carts[cartIndex].products.findIndex((product) => product.product === productId);

            if (productIndex === -1) {
                throw new Error(`No se encontro ningun producto con el id: ${productId} en el carrito con id: ${cartId}` );
            }

            carts[cartIndex].products.splice(productIndex, 1);

            await fs.writeFile(this.path, JSON.stringify(carts));

            return "Producto eliminado"
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default CartManager