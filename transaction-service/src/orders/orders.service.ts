import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrders(userId: number) {
    return this.prisma.orders.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getOrderDetails(userId: number, orderId: number) {
    const order = await this.prisma.orders.findFirst({
      where: { id: orderId, user_id: userId },
      include: { order_details: true },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    const detailsWithProductName = await Promise.all(
      order.order_details.map(async (detail) => {
        try {
          const { data } = await axios.get(`http://localhost:3002/products/${detail.product_id}`);
          return {
            product_id: detail.product_id,
            name: data.name,
            quantity: detail.quantity,
            price: detail.price,
          };
        } catch (error) {
          return {
            product_id: detail.product_id,
            name: 'Produk Tidak Diketahui',
            quantity: detail.quantity,
            price: detail.price,
          };
        }
      })
    );

    return detailsWithProductName;
  }

  async checkout(userId: number, token: string) {
    const cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      include: { cart_items: true },
    });

    if (!cart || cart.cart_items.length === 0) {
      throw new BadRequestException('Keranjang belanja Anda masih kosong!');
    }

    const orderDetails: any[] = [];

    for (const item of cart.cart_items) {
      try {
        const response = await axios.get(`http://localhost:3002/products/${item.product_id}`);
        const product = response.data;

        orderDetails.push({
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price, 
        });

        await axios.post(
          `http://localhost:3002/admin/products/${item.product_id}/reduce`,
          { quantity: item.quantity },
          { headers: { Authorization: token } }
        );

      } catch (error) {
        throw new InternalServerErrorException(
          `Gagal memproses produk ID ${item.product_id}. Pastikan produk tersedia dan stok mencukupi.`
        );
      }
    }

    const order = await this.prisma.orders.create({
      data: {
        user_id: userId,
        order_details: {
          create: orderDetails, 
        },
      },
    });

    await this.prisma.cart_items.deleteMany({
      where: { cart_id: cart.id },
    });

    return { message: 'Checkout berhasil diproses' };
  }
}