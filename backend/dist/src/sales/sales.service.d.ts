import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/sale.dto';
export declare class SalesService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: number, dto: CreateSaleDto): Promise<{
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
    findAll(userId?: number): Promise<({
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
