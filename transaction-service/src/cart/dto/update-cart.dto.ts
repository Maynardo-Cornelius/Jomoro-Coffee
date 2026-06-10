import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty({ example: 3, description: 'New quantity for the product in cart' })
  @IsInt()
  @Min(1)
  quantity!: number;
}