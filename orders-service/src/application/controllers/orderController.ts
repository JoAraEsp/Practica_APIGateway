import { Request, Response } from "express";
import { OrderRepository } from "../../domain/repositories/orderRepository";
import { OrderProductRepository } from "../../domain/repositories/order-productRepository";
import { Order } from "../../domain/models/order";
import axios from 'axios';

export class OrderController {
    private orderRepository: OrderRepository;
    private orderProductRepository: OrderProductRepository;

    constructor(orderRepository: OrderRepository, orderProductRepository: OrderProductRepository) {
        this.orderRepository = orderRepository;
        this.orderProductRepository = orderProductRepository;
    }

    listOrders = async (req: Request, res: Response): Promise<void> => {
        const orders = await this.orderRepository.findAll();
        res.status(200).json(orders);
    };

    createOrder = async (req: Request, res: Response): Promise<void> => {
        const { id, total, fecha, estatus } = req.body;
        if (id && total && fecha && estatus) {
            const formattedFecha = new Date(fecha);
            const order: Order = { id, total, fecha: formattedFecha, estatus };
            await this.orderRepository.create(order);
            res.status(201).json({ message: 'Order created successfully', order });
        } else {
            res.status(400).json({ message: 'Invalid order data' });
        }
    };

    deleteOrder = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const deletedOrder = await this.orderRepository.delete(id);
        if (deletedOrder) {
            res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    };

    updateTracking = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { estatus } = req.body;
        console.log(`Received request to update tracking for order ID: ${id} with status: ${estatus}`);

        const order = await this.orderRepository.findById(id);

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        await this.orderRepository.updateTracking(id, estatus);

        if (estatus === 'Enviado') {
            console.log('Order status is "Enviado". Updating stock...');
            const orderProducts = await this.orderProductRepository.findByOrderId(id);
            const products = orderProducts.map((op) => ({
                id: op.productId,
                quantity: op.quantity,
            }));
            try {
                await axios.post('http://localhost:3002/products/update-stock', { products });
                console.log('Stock updated successfully');
            } catch (error) {
                let errorMessage = 'Failed to update stock';
                if (axios.isAxiosError(error) && error.response) {
                    errorMessage = error.response.data.message || errorMessage;
                } else if (error instanceof Error) {
                    errorMessage = error.message;
                }
                console.log(errorMessage);
                res.status(500).json({ message: errorMessage });
                return;
            }
        }

        res.status(200).json({ message: "Tracking updated successfully" });
    }
}

