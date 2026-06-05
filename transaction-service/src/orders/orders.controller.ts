import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Orders Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Melakukan checkout dan mengosongkan keranjang' })
  checkout(@Request() req: any) {
    return this.ordersService.checkout(req.user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Melihat seluruh riwayat pesanan' })
  getOrders(@Request() req: any) {
    return this.ordersService.getOrders(req.user.id);
  }
}