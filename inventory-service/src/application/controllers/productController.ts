import { Request, Response } from "express";
import { ProductRepository } from "../../domain/repositories/productRepository";

export class ProductController {
    private productRepository: ProductRepository;

    constructor(productRepository: ProductRepository) {
        this.productRepository = productRepository;
    }

    listProducts = async (req: Request, res: Response): Promise<void> => {
        const products = await this.productRepository.findAll();
        res.status(200).json(products);
    };

    createProduct = async (req: Request, res: Response): Promise<void> => {
        const { id, nombre, precio, stock } = req.body;
        if (id && nombre && precio && stock) {
            await this.productRepository.create({ id, nombre, precio, stock });
            res.status(201).json({ message: 'Product created successfully', product: { id, nombre, precio, stock } });
        } else {
            res.status(400).json({ message: 'Invalid product data' });
        }
    };

    deleteProduct = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const deletedProduct = await this.productRepository.delete(id);
        if (deletedProduct) {
            res.status(200).json({ message: 'Product deleted successfully', product: deletedProduct });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    };

    getProductById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const product = await this.productRepository.findById(id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    };    

    updateStock = async (req: Request, res: Response): Promise<void> => {
        const { products } = req.body;
        try {
            for (const product of products) {
                await this.productRepository.decreaseStock(product.id, product.quantity);
            }
            res.status(200).json({ message: 'Stock updated successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error updating stock', error });
        }
    };

    
}
