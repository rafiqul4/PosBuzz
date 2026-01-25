import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    create(dto: CreateProductDto): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        sku: string;
        price: number;
        stock_quantity: number;
    }>;
    findAll(): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        sku: string;
        price: number;
        stock_quantity: number;
    }[]>;
    findOne(id: number): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        sku: string;
        price: number;
        stock_quantity: number;
    }>;
    update(id: number, dto: UpdateProductDto): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        sku: string;
        price: number;
        stock_quantity: number;
    }>;
    remove(id: number): Promise<{
        name: string;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        sku: string;
        price: number;
        stock_quantity: number;
    }>;
}
