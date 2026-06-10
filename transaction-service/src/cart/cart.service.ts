import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import axios from 'axios';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: number) {
    let cart = await this.prisma.carts.findFirst({
      where: { user_id: userId },
      include: { cart_items: true },
    });

    if (!cart) {
      cart = await this.prisma.carts.create({
        data: { user_id: userId },
        include: { cart_items: true },
      });
    }

    const itemsWithDetails = await Promise.all(
      cart.cart_items.map(async (item) => {
        try {
          const { data } = await axios.get(`http://localhost:3002/products/${item.product_id}`);
          return {
            id: item.id,
            product_id: item.product_id,
            name: data.name,
            price: data.price,
            quantity: item.quantity,
          };
        } catch (error) {
          return {
            id: item.id,
            product_id: item.product_id,
            name: 'Unknown',
            price: 0,
            quantity: item.quantity,
          };
        }
      }),
    );

    return {
      cart_id: cart.id,
      user_id: cart.user_id,
      items: itemsWithDetails,
    };
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    let product;

    try {
      const response = await axios.get(`http://localhost:3002/products/${dto.product_id}`);
      product = response.data;
    } catch (error) {
      throw new NotFoundException('Produk tidak ditemukan di Product Service');
    }

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Kuantitas melebihi stok yang tersedia');
    }

    let cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });

    if (!cart) {
      cart = await this.prisma.carts.create({ data: { user_id: userId } });
    }

    const existingItem = await this.prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: dto.product_id },
    });

    if (existingItem) {
      throw new BadRequestException('Produk sudah ada di dalam keranjang');
    }

    await this.prisma.cart_items.create({
      data: {
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
      },
    });

    return { message: 'Produk berhasil ditambahkan ke keranjang' };
  }
}