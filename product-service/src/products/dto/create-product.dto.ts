import { IsString, IsInt, Min, Max, MinLength, IsOptional, Validate } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MinWordsConstraint } from './min-words.validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Kopi Susu Gula Aren', description: 'Product name must contain at least 3 words' })
  @IsString()
  @Validate(MinWordsConstraint)
  name!: string;

  @ApiProperty({ example: 'Kopi dengan perpaduan susu dan gula aren asli yang sangat nikmat.' })
  @IsString()
  @MinLength(20, { message: 'Product description must have at least 20 characters' })
  description!: string;

  @ApiProperty({ example: 25000, description: 'Must be positive integer (at least 1)' })
  @IsInt()
  @Min(1)
  price!: number;

  @ApiProperty({ example: 50, description: 'Product stock must be between 0 and 999' })
  @IsInt()
  @Min(0)
  @Max(999)
  stock!: number;

  @ApiPropertyOptional({ example: 'http://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({ example: 1, description: 'Reference to the category' })
  @IsInt()
  category_id!: number;
}