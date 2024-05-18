import { Request, Response } from "express";
import { OrderProductRepository } from "../../domain/repositories/order-productRepository";

export class OrderProductController {
    private orderProductRepository: OrderProductRepository;

    constructor(orderProductRepository: OrderProductRepository) {
        this.orderProductRepository = orderProductRepository;
    }

    createOrderProduct = async (req: Request, res: Response): Promise<void> => {
        const { id, orderId, productId, quantity, price } = req.body;
        if (id && orderId && productId && quantity && price) {
            await this.orderProductRepository.create({ id, orderId, productId, quantity, price });
            res.status(201).json({ message: 'Order product created successfully', orderProduct: { id, orderId, productId, quantity, price } });
        } else {
            res.status(400).json({ message: 'Invalid order product data' });
        }
    };

    updateOrderProduct = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { quantity, price } = req.body;
        if (quantity && price) {
            await this.orderProductRepository.update(id, { quantity, price });
            res.status(200).json({ message: 'Order product updated successfully' });
        } else {
            res.status(400).json({ message: 'Invalid order product data' });
        }
    };
}

