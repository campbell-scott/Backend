import express from 'express';
import ProductManager from './productManager.js';

const productManager = new ProductManager();

const app = express();

app.get('/products', async (req, res) => {
    const { limit } = req.query;
    const products = await productManager.getProducts(parseInt(limit));
    res.send(products);
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await productManager.getProductById(parseInt(id))
    if (!product) {
        res.send(product)
    }
    res.send(product)
});

app.listen( 8081, () => { 
    console.log('Servidor escuchando en el puerto 8081');
});
