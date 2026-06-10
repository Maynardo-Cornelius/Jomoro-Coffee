import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  @ApiResponse({ status: 200, description: 'Returns a list of available menu categories.' }) 
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':categoryId/products')
  @ApiOperation({ summary: 'Filter products by category' })
  @ApiParam({ name: 'categoryId', type: 'number', description: 'ID of the category' })
  @ApiResponse({ status: 200, description: 'Returns a list of products that belong to the specific Category ID.' })
  findProductsByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.categoriesService.findProductsByCategory(categoryId);
  }
}