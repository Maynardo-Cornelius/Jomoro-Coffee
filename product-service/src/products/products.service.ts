import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  //PUBLIC

  async findAll() {
    return this.prisma.products.findMany();
  }

  async findOne(id: number) {
    const product = await this.prisma.products.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  //ADMIN
  async create(data: CreateProductDto) {
    await this.prisma.products.create({ data });
    return { message: 'Product successfully created' };
  }

  async update(id: number, data: CreateProductDto) {
    await this.findOne(id);
    await this.prisma.products.update({ where: { id }, data });
    return { message: 'Product successfully updated' }; 
  }

  async reduceStock(id: number, quantity: number) {
    const product = await this.findOne(id);
    
    if (quantity > product.stock) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    await this.prisma.products.update({
      where: { id },
      data: { stock: product.stock - quantity },
    });

    return { message: 'Product stock successfully reduced' };
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.products.delete({ where: { id } });
    return { message: 'Product successfully deleted' };
  }
}