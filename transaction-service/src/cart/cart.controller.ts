import { Controller, Get, Post, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

@ApiTags('Cart Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve the contents of the shopping cart' })
  getCart(@Request() req: any) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a product to the shopping cart' })
  addToCart(@Request() req: any, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, dto);
  }

  @Post(':product_id/update')
  @ApiOperation({ summary: 'Update the quantity of a product in the cart' })
  updateCartItem(
    @Request() req: any,
    @Param('product_id', ParseIntPipe) productId: number,
    @Body() dto: UpdateCartDto,
  ) {
    return this.cartService.updateCartItem(req.user.id, productId, dto);
  }

  @Post(':product_id/delete')
  @ApiOperation({ summary: 'Remove a specific product from the cart' })
  deleteCartItem(@Request() req: any, @Param('product_id', ParseIntPipe) productId: number) {
    return this.cartService.deleteCartItem(req.user.id, productId);
  }

  @Post('clear')
  @ApiOperation({ summary: 'Clear all items from the shopping cart' })
  clearCart(@Request() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}