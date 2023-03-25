const fs = require("fs").promises;

class ProductManager {
    #products = [];
    lastId = 0;
    path = ``
    
    constructor() {
        this.#products = [];
        this.lastId = 0;
        this.path = `./product.json`
    }

    async getProducts() {
        try{
            const productsList = await fs.readFile(this.path, "utf-8");
    
            return JSON.parse(productsList);
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
            
            if (!productIndex) {
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

const productManager = new ProductManager();

// Obtener todos los productos
const main = async () => {
    console.log(await productManager.getProducts())
}

//main()

// Agregar nuevos productos
const newProduct1 = {
    title: "producto1",
    description: "Muy buen producto",
    price: 250,
    thumbnail: "Sin imagen",
    code: "1111",
    stock: 25,
};

const newProduct2 = {
    title: "producto2",
    description: "Exelente producto",
    price: 450,
    thumbnail: "Sin imagen",
    code: "2222",
    stock: 15,
};

const generate = async () => {
    console.log(await productManager.addProduct(newProduct1))
    console.log(await productManager.addProduct(newProduct2))
}

//generate()

// Buscar un producto por su id
const find = async () => {
    console.log(await productManager.getProductById(1))
}

//find()


// Actualizar un producto
const actualizoProducto = {
    title: "productor",
    stock: 43,
}

const update = async () => {
    console.log(await productManager.updateProduct(2,actualizoProducto))
}

//update()

// Eliminar un producto
const erase = async () => {
    console.log(await productManager.deleteProduct(2))
}

//erase()
