import { Controller, Get, Post, UseGuards, Request, Param, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Orders Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Process checkout and clear the shopping cart' })
  checkout(@Request() req: any) {
    const token = req.headers.authorization;
    return this.ordersService.checkout(req.user.id, token);
  }

  @Get()
  @ApiOperation({ summary: 'View entire order history' })
  getOrders(@Request() req: any) {
    return this.ordersService.getOrders(req.user.id);
  }

  @Post(':id')
  @ApiOperation({ summary: 'View details of a specific order' })
  getOrderDetails(@Request() req: any, @Param('id', ParseIntPipe) orderId: number) {
    return this.ordersService.getOrderDetails(req.user.id, orderId);
  }
}