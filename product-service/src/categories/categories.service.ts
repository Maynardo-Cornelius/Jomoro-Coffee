import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.categories.findMany();
  }

  async findProductsByCategory(categoryId: number) {
    const category = await this.prisma.categories.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Kategori dengan ID ${categoryId} tidak ditemukan`);
    }

    return this.prisma.products.findMany({
      where: { category_id: categoryId },
    });
  }
}