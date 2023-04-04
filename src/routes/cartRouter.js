import { Router } from "express";
import CartManager from "../cartManager.js";

const CartRouter = Router();
const cartManager = new CartManager;

CartRouter.post("/", async (req, res) => {
    const addCart = await cartManager.addCart();
    
    return res
        .status(200)
        .send({ status: "success", message: `Se creo un nuevo carrito`})

})

CartRouter.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    const productsCart = await cartManager.getProductsCartById(parseInt(cartId));

    if (productsCart instanceof Error) {
        return res
            .status(400)
            .send({ status: "error", message: `${productsCart.message}`})   
    } else {
        return res
            .status(200)
            .json(productsCart)
    };

})

CartRouter.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const addToCart = await cartManager.addProductToCart(parseInt(cartId), parseInt(productId));

    if (addToCart instanceof Error) {
        return res
            .status(400)
            .send({ status: "error", message: `${addToCart.message}`})   
    } else {
        return res
            .status(200)
            .send({ status: "success", message: "Producto agregado al carrito"})
    };

})

CartRouter.delete("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const deleteProductInCart = await cartManager.deleteProductInCart(parseInt(cartId), parseInt(productId));

    if (deleteProductInCart instanceof Error) {
        return res
            .status(400)
            .send({ status: "error", message: `${deleteProductInCart.message}`})   
    } else {
        return res
            .status(200)
            .send({ status: "success", message: "Producto eliminado"})   
    };

});

export default CartRouter;