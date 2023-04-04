import { Router } from "express";
import ProductManager from "../productManager.js";



const ProductRouter = Router();
const productManager = new ProductManager;


ProductRouter.get("/", async (req, res) => {
    const { limit } = req.query;

    const products = await productManager.getProducts(parseInt(limit))
    return res
        .status(200)
        .json(products)

});

ProductRouter.get("/:pid", async (req, res) => {
    const productId = req.params.pid;

    const product = await productManager.getProductById(parseInt(productId));

    if (product instanceof Error) {
        return res
            .status(400)
            .send({ status: "error", message: `${product.message}`})   
    } else {
        return res
            .status(200)
            .json(product)
    };

});

ProductRouter.post("/", async (req, res) => {
    const newProduct = req.body
    
    const addProduct = await productManager.addProduct(newProduct);

    if (addProduct instanceof Error) {
        return res
            .status(400)
            .send({ status: "error", message: `${addProduct.message}`})   
    } else {
        return res
            .status(200)
            .send({ status: "success", message: "Producto agregado"})   
    };

});

ProductRouter.put("/:pid", async (req, res) => {
    const updates = req.body;
    const productId = req.params.pid;

    const updateProduct = await productManager.updateProduct(parseInt(productId), updates);

    if (updateProduct instanceof Error) {
        return res
            .status(400)
            .send({ status: "error", message: `${updateProduct.message}`})   
    } else {
        return res
            .status(200)
            .send({ status: "success", message: "Producto actualizado"})   
    };

});

ProductRouter.delete("/:pid", async (req, res) => {
    const productId = req.params.pid;

    const deleteProduct = await productManager.deleteProduct(productId);

    if (deleteProduct instanceof Error) {
        return res
            .status(400)
            .send({ status: "error", message: `${deleteProduct.message}`})   
    } else {
        return res
            .status(200)
            .send({ status: "success", message: "Producto eliminado"})   
    };

});

export default ProductRouter

