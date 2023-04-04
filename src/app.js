import express from 'express';

import CartRouter from "./routes/cartRouter.js"
import ProductRouter from "./routes/productRouter.js"

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', ProductRouter)
app.use('/api/carts', CartRouter)

app.listen( 8081, () => { 
    console.log('Servidor escuchando en el puerto 8081');
});
