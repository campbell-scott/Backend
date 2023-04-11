import express from 'express';
import { engine } from 'express-handlebars'
import { resolve } from 'path'
import { Server } from 'socket.io'

import CartRouter from "./routes/cartRouter.js"
import ProductRouter from "./routes/productRouter.js"
import ProductManager from './productManager.js';


const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/products', ProductRouter)
app.use('/api/carts', CartRouter)

const port = 8081
const viewsPath = resolve('src/views');
const productManager = new ProductManager;

app.engine('handlebars', engine({
    layoutsDir: `${viewsPath}/layouts`,
    defaultLayout: `${viewsPath}/layouts/main.handlebars`,
}));
app.set('view engine', 'handlebars');
app.set('views', viewsPath);

//ruta lista de productos
app.get('/', async(req, res) => {
const products = await productManager.getProducts();
res.render('home', { products: products });
});

const httpServer = app.listen(port, () => {
    console.log(`Conectado al server en el puerto: ${port}`);
});

const io = new Server(httpServer);

app.get('/realtimeproducts', async(req, res) => {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
    
    io.on('connection', (socket) => {
      console.log('User connected');
      
      socket.emit('productList', products);
      
      socket.on('addProduct', async() => {
        const newProducts = await productManager.getProducts();
        io.emit('productList', newProducts);
      });
      
      // Escucha el evento 'deleteProduct' y emite la nueva lista de productos a todos los clientes conectados
      socket.on('deleteProduct', async() => {
        const newProducts = await productManager.getProducts();
        io.emit('productList', newProducts);
      });
      
      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  });


/*app.listen( 8081, () => { 
    console.log('Servidor escuchando en el puerto 8081');
});*/
