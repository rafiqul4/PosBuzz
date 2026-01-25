"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SalesService = class SalesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        const productIds = dto.items.map((item) => item.productId);
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
        });
        if (products.length !== productIds.length) {
            throw new common_1.NotFoundException('One or more products not found');
        }
        for (const item of dto.items) {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Product with id ${item.productId} not found`);
            }
            if (product.stock_quantity < item.quantity) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
            }
        }
        let total = 0;
        const saleItems = dto.items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) {
                throw new common_1.NotFoundException(`Product with id ${item.productId} not found`);
            }
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            };
        });
        return await this.prisma.$transaction(async (tx) => {
            const sale = await tx.sale.create({
                data: {
                    userId,
                    total,
                    saleItems: {
                        create: saleItems,
                    },
                },
                include: {
                    saleItems: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
            for (const item of dto.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock_quantity: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            return sale;
        });
    }
    async findAll(userId) {
        return this.prisma.sale.findMany({
            where: userId ? { userId } : undefined,
            include: {
                saleItems: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const sale = await this.prisma.sale.findUnique({
            where: { id },
            include: {
                saleItems: {
                    include: {
                        product: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });
        if (!sale) {
            throw new common_1.NotFoundException('Sale not found');
        }
        return sale;
    }
};
exports.SalesService = SalesService;
exports.SalesService = SalesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SalesService);
//# sourceMappingURL=sales.service.js.map