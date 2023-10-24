import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return await this.categoryService.getAll();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Get(':id/posts')
  async getAllPostsOf(@Param('id') category_id: string) {
    return await this.categoryService.getArticles(category_id);
  }
}
