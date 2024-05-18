import { Order } from "../models/order";
import pool from "../../infrastructure/database/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class OrderRepository {
    async findAll(): Promise<Order[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders');
        return rows as Order[];
    }

    async create(order: Order): Promise<void> {
        const { id, total, fecha, estatus } = order;
        await pool.query<ResultSetHeader>('INSERT INTO orders (id, total, fecha, estatus) VALUES (?, ?, ?, ?)', [id, total, fecha, estatus]);
    }

    async delete(id: string): Promise<Order | null> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM orders WHERE id = ?', [id]);
        const order = rows[0] as Order | undefined;
        if (order) {
            await pool.query<ResultSetHeader>('DELETE FROM orders WHERE id = ?', [id]);
            return order;
        }
        return null;
    }

    async updateTracking(id: string, estatus: string): Promise<void> {
        await pool.query('UPDATE orders SET estatus = ? WHERE id = ?', [estatus, id]);
    }

    async findById(id: string): Promise<Order | null> {
        const [rows]: [any[], any] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
        return rows.length > 0 ? rows[0] as Order : null;
    }
}

