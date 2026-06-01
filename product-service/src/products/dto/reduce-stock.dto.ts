import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReduceStockDto {
  @ApiProperty({ example: 5, description: 'Quantity to reduce' })
  @IsInt()
  @Min(1)
  quantity!: number;
}