import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async checkout(userId: number) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      include: { cart_items: true },
    });

    if (!cart || cart.cart_items.length === 0) {
      throw new BadRequestException('Keranjang belanja Anda masih kosong!');
    }

    const orderDetails:any[] = [];
    for (const item of cart.cart_items) {
      try {
        const response = await axios.get(`http://localhost:3002/products/${item.product_id}`);
        const product = response.data;

        orderDetails.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price, 
        });
      } catch (error) {
        throw new NotFoundException(`Produk dengan ID ${item.product_id} tidak ditemukan di Product Service`);
      }
    }

    const order = await this.prisma.orders.create({
      data: {
        user_id: userId,
        order_details: {
          create: orderDetails, 
        },
      },
      include: {
        order_details: true,
      },
    });

    await this.prisma.cart_items.deleteMany({
      where: { cart_id: cart.id },
    });

    return {
      message: 'Checkout berhasil diproses',
      order,
    };
  }

  async getOrders(userId: number) {
    return this.prisma.orders.findMany({
      where: { user_id: userId },
      include: { order_details: true },
      orderBy: { created_at: 'desc' },
    });
  }
}