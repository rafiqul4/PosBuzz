import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/create-sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(createSaleDto: CreateSaleDto, userId: number) {
    // Aggregate quantities by productId to handle duplicates
    const productQuantities = new Map<number, number>();
    for (const item of createSaleDto.items) {
      const currentQty = productQuantities.get(item.productId) || 0;
      productQuantities.set(item.productId, currentQty + item.quantity);
    }

    const productIds = Array.from(productQuantities.keys());

    // Create sale and update stock in a transaction
    return this.prisma.$transaction(async (tx) => {
      // Fetch and lock products for update within transaction
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        throw new NotFoundException('One or more products not found');
      }

      // Check stock availability with aggregated quantities
      for (const [productId, totalQuantity] of productQuantities) {
        const product = products.find((p) => p.id === productId);
        if (!product) {
          throw new NotFoundException(`Product with ID ${productId} not found`);
        }
        if (product.stock_quantity < totalQuantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Available: ${product.stock_quantity}, Requested: ${totalQuantity}`,
          );
        }
      }

      // Calculate total
      let total = 0;
      for (const item of createSaleDto.items) {
        const product = products.find((p) => p.id === item.productId);
        total += product.price * item.quantity;
      }

      // Create sale
      const sale = await tx.sale.create({
        data: {
          userId,
          total,
          saleItems: {
            create: createSaleDto.items.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              return {
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
              };
            }),
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

      // Update stock quantities with aggregated amounts
      for (const [productId, totalQuantity] of productQuantities) {
        await tx.product.update({
          where: { id: productId },
          data: {
            stock_quantity: {
              decrement: totalQuantity,
            },
          },
        });
      }

      return sale;
    });
  }

  async findAll(userId?: number) {
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

  async findOne(id: number) {
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
      throw new NotFoundException('Sale not found');
    }

    return sale;
  }
}
