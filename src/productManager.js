import fs from "fs/promises";

class ProductManager {
    #products = [];
    
    constructor() {
        this.#products = [];
        this.lastId = 0;
        this.path = `./src/db/product.json`
    }

    async getProducts(limit) {
        try{
            const productsList = await fs.readFile(this.path, "utf-8");

            if (!limit) {
                return JSON.parse(productsList);
            }
            
            const products = JSON.parse(productsList)
            
            return products.slice( 0, limit )
        } catch {
            await fs.writeFile(this.path, "[]");

            return 'No se encontro el archivo, se creo uno nuevo';
        }
    }

    async addProduct(newProduct) {
        try {
            const productsList = await fs.readFile(this.path, "utf-8");
            
            const products = JSON.parse(productsList);
            
            const productExists = products.some((product) => product.code === newProduct.code);
            
            if (productExists) {
                throw new Error("El codigo del producto ya existe");
            }
            
            if (newProduct.id) {
                throw new Error("No es necesario el id, se genera automaticamente")
            }
            
            if (products.length > 0) {
                const lastProduct = products[products.length - 1];
                this.lastId = lastProduct.id;
            }
            
            products.push({ id: ++this.lastId, ...newProduct });
            this.#products.push({ id: ++this.lastId, ...newProduct });

            await fs.writeFile(this.path, JSON.stringify(products));

            return "Producto agregado"
        } catch (e) {
            throw new Error(e);
        }
    }

    async getProductById(id) {
        try {
            const productsList = await fs.readFile(this.path, "utf-8");
            
            const products = JSON.parse(productsList);
            
            const product = products.find((product) => product.id === id);

            if (!product) {
                throw new Error(`No se encontró el producto con id: ${id}`);
            }

            return product
        } catch (e) {
            throw new Error(e);
        }
    }

    async updateProduct(id, updates) {
        try {
            if (updates.id) {
                throw new Error("No es necesario el id, se genera automaticamente")
            }

            const productsList = await fs.readFile(this.path, "utf-8");
            
            const products = JSON.parse(productsList);

            const productCode = products.some((product) => product.code === updates.code);

            if (productCode) {
                throw new Error("El codigo del producto ya existe");
            }
            
            const productExists = products.findIndex((product) => product.id === id);
            
            if (!productExists) {
                throw new Error(`No se encontro ningun producto con el id: ${id}` );
            }

            Object.assign( products[productExists], updates);

            await fs.writeFile(this.path, JSON.stringify(products));

            return "Producto actualizado"
        } catch (e) {
            throw new Error(e);
        }
    }

    async deleteProduct(id) {
        try {
            const productsList = await fs.readFile(this.path, "utf-8");
            
            const products = JSON.parse(productsList);

            const productIndex = products.findIndex((product) => product.id === id);
            
            if (productIndex === -1) {
                throw new Error(`No se encontro ningun producto con el id: ${id}` );
            }

            products.splice(productIndex, 1);

            await fs.writeFile(this.path, JSON.stringify(products));

            return "Producto eliminado"
        } catch (e) {
            throw new Error(e);
        }
    }
}

export default ProductManager