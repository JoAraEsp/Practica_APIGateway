import { Product } from "../models/product";
import pool from "../../infrastructure/database/database";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class ProductRepository {
    async findAll(): Promise<Product[]> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products');
        return rows as Product[];
    }

    async create(product: Product): Promise<void> {
        const { id, nombre, precio, stock } = product;
        await pool.query<ResultSetHeader>('INSERT INTO products (id, nombre, precio, stock) VALUES (?, ?, ?, ?)', [id, nombre, precio, stock]);
    }

    async delete(id: string): Promise<Product | null> {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM products WHERE id = ?', [id]);
        const product = rows[0] as Product | undefined;
        if (product) {
            await pool.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
            return product;
        }
        return null;
    }
}
