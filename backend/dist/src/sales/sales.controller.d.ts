import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/sale.dto';
export declare class SalesController {
    private salesService;
    constructor(salesService: SalesService);
    create(req: any, dto: CreateSaleDto): Promise<{
        saleItems: ({
            product: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                sku: string;
                price: number;
                stock_quantity: number;
            };
        } & {
            id: number;
            price: number;
            productId: number;
            quantity: number;
            saleId: number;
        })[];
    } & {
        createdAt: Date;
        id: number;
        total: number;
        userId: number;
    }>;
    findAll(): Promise<({
        user: {
            email: string;
            name: string | null;
            id: number;
        };
        saleItems: ({
            product: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                sku: string;
                price: number;
                stock_quantity: number;
            };
        } & {
            id: number;
            price: number;
            productId: number;
            quantity: number;
            saleId: number;
        })[];
    } & {
        createdAt: Date;
        id: number;
        total: number;
        userId: number;
    })[]>;
    findOne(id: number): Promise<{
        user: {
            email: string;
            name: string | null;
            id: number;
        };
        saleItems: ({
            product: {
                name: string;
                createdAt: Date;
                updatedAt: Date;
                id: number;
                sku: string;
                price: number;
                stock_quantity: number;
            };
        } & {
            id: number;
            price: number;
            productId: number;
            quantity: number;
            saleId: number;
        })[];
    } & {
        createdAt: Date;
        id: number;
        total: number;
        userId: number;
    }>;
}
