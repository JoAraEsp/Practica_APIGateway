import express, { Application } from "express";
import morgan from "morgan";
import dotenv from 'dotenv';
import { Signale } from "signale";
import { ProductController } from "../../application/controllers/productController";
import { ProductRepository } from "../../domain/repositories/productRepository";

dotenv.config();

const app: Application = express();
const signale = new Signale();
const PORT = process.env.PORT || 3002;
const INVENTORY = process.env.SERVICE_NAME || 'inventory';

app.use(express.json());
app.use(morgan('dev'));

const productRepository = new ProductRepository();

const productController = new ProductController(productRepository);

app.get('/products', productController.listProducts);
app.post('/products/create', productController.createProduct);
app.delete('/products/delete/:id', productController.deleteProduct);

app.use('/', async (req, res) => {
    const products = await productRepository.findAll();
    res.status(200).json({
        message: "Welcome to inventory service",
        products: products
    });
});

app.listen(PORT, () => {
    signale.success(`Servicio de ${INVENTORY} corriendo en http://localhost:${PORT}`);
});
