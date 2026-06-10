import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
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
      throw new NotFoundException('Product not found in Product Service');
    }

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    let cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });

    if (!cart) {
      cart = await this.prisma.carts.create({ data: { user_id: userId } });
    }

    const existingItem = await this.prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: dto.product_id },
    });

    if (existingItem) {
      throw new BadRequestException('Product already exists in the cart');
    }

    await this.prisma.cart_items.create({
      data: {
        cart_id: cart.id,
        product_id: dto.product_id,
        quantity: dto.quantity,
      },
    });

    return { message: 'Product successfully added to the cart' };
  }

  async updateCartItem(userId: number, productId: number, dto: UpdateCartDto) {
    let product;

    try {
      const response = await axios.get(`http://localhost:3002/products/${productId}`);
      product = response.data;
    } catch (error) {
      throw new NotFoundException('Product not found in Product Service');
    }

    if (dto.quantity > product.stock) {
      throw new BadRequestException('Quantity exceeds available stock');
    }

    const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existingItem = await this.prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!existingItem) {
      throw new NotFoundException('Product not found in the cart');
    }

    await this.prisma.cart_items.update({
      where: { id: existingItem.id },
      data: { quantity: dto.quantity },
    });

    return { message: 'Product quantity successfully updated' };
  }

  async deleteCartItem(userId: number, productId: number) {
    const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const existingItem = await this.prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id: productId },
    });

    if (!existingItem) {
      throw new NotFoundException('Product not found in the cart');
    }

    await this.prisma.cart_items.delete({
      where: { id: existingItem.id },
    });

    return { message: 'Product successfully removed from the cart' };
  }

  async clearCart(userId: number) {
    const cart = await this.prisma.carts.findFirst({ where: { user_id: userId } });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.prisma.cart_items.deleteMany({
      where: { cart_id: cart.id },
    });

    return { message: 'Cart successfully cleared' };
  }
}