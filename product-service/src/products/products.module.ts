import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AdminProductsController } from './admin-products.controller';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [ProductsController, AdminProductsController],
  providers: [ProductsService, JwtStrategy],
})
export class ProductsModule {}