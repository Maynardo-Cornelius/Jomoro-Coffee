import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AdminProductsController } from './admin-products.controller';
import { JwtStrategy } from '../auth/jwt.strategy'; // 1. Import file strategi JWT Anda

@Module({
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService, JwtStrategy],
})
export class ProductsModule {}