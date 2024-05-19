import express, { Application } from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Signale } from 'signale';
import { OrderController } from '../../application/controllers/orderController';
import { OrderProductController } from '../../application/controllers/order-productController';
import { OrderRepository } from '../../domain/repositories/orderRepository';
import { OrderProductRepository } from '../../domain/repositories/order-productRepository';

dotenv.config();

const app: Application = express();
const signale = new Signale();
const PORT = process.env.PORT || 3001;
const ORDERS = process.env.SERVICE_NAME || 'orders';

app.use(express.json());
app.use(morgan('dev'));

const orderRepository = new OrderRepository();
const orderProductRepository = new OrderProductRepository();

const orderController = new OrderController(orderRepository, orderProductRepository);
const orderProductController = new OrderProductController(orderProductRepository, orderRepository);

app.get('/orders', orderController.listOrders);
app.post('/orders/create', orderController.createOrder);
app.delete('/orders/:id', orderController.deleteOrder);
app.put('/orders/update-tracking/:id', orderController.updateTracking);

app.post('/orders-products/create', orderProductController.createOrderProduct);
app.put('/orders-products/update/:id', orderProductController.updateOrderProduct);

app.use('/', async (req, res) => {
    const orders = await orderRepository.findAll();
    res.status(200).json({
        message: 'Welcome to orders service',
        orders: orders
    });
});

app.listen(PORT, () => {
    signale.success(`Servicio de ${ORDERS} corriendo en http://localhost:${PORT}`);
});

