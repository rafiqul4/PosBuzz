import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSaleDto } from './dto/sale.dto';

@Injectable()
export class SalesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, dto: CreateSaleDto) {
    // Validate all products and check stock
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    // Check stock availability
    for (const item of dto.items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new NotFoundException(`Product with id ${item.productId} not found`);
      }
      if (product.stock_quantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`,
        );
      }
    }

    // Calculate total
    let total = 0;
    const saleItems = dto.items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Create sale with transaction
    return await this.prisma.$transaction(async (tx) => {
      // Create sale
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

      // Deduct stock
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
