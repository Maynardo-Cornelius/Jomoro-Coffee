import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ example: 1, description: 'ID of the product' })
  @IsInt()
  @Min(1)
  product_id!: number;

  @ApiProperty({ example: 2, description: 'Quantity to add to cart' })
  @IsInt()
  @Min(1)
  quantity!: number;
}