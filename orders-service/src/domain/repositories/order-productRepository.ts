import { OrderProduct } from "../models/order-product";
import pool from "../../infrastructure/database/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class OrderProductRepository {
    async findAll(): Promise<OrderProduct[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM order_products');
        return rows as OrderProduct[];
    }

    async create(orderProduct: OrderProduct): Promise<void> {
        const { id, orderId, productId, quantity, price } = orderProduct;
        await pool.query<ResultSetHeader>('INSERT INTO order_products (id, order_id, product_id, quantity, price) VALUES (?, ?, ?, ?, ?)', [id, orderId, productId, quantity, price]);
    }

    async update(id: string, orderProduct: Partial<OrderProduct>): Promise<void> {
        const { quantity, price } = orderProduct;
        await pool.query<ResultSetHeader>('UPDATE order_products SET quantity = ?, price = ? WHERE id = ?', [quantity, price, id]);
    }

    async findByOrderId(orderId: string): Promise<any[]> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM order_products WHERE order_id = ?', [orderId]);
        return rows;
    }
}

