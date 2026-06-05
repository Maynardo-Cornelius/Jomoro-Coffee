import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { JwtStrategy } from '../auth/jwt.strategy';

@Module({
  controllers: [CartController],
  providers: [CartService, JwtStrategy],
})
export class CartModule {}