import { Injectable, NotFoundException } from '@nestjs/common';
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

    return cart;
  }

  async addToCart(userId: number, dto: AddToCartDto) {
    try {
      await axios.get(`http://localhost:3002/products/${dto.product_id}`);
    } catch (error) {
      throw new NotFoundException('Produk tidak ditemukan di Product Service');
    }

    let cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });
    if (!cart) {
      cart = await this.prisma.carts.create({ data: { user_id: userId } });
    }

    const existingItem = await this.prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: dto.product_id },
    });

    if (existingItem) {
      await this.prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + dto.quantity },
      });
    } else {
      await this.prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id: dto.product_id,
          quantity: dto.quantity,
        },
      });
    }

    return { message: 'Produk berhasil ditambahkan ke keranjang' };
  }
}