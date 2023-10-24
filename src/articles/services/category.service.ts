import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createCategory = new this.categoryModel(createCategoryDto);
    return createCategory.save();
  }

  async getAll() {
    return this.categoryModel.find().exec();
  }

  async getArticles(category_id: string) {
    return this.categoryModel.find({
      categories: {
        $elemMatch: { $eq: category_id },
      },
    });
  }

  async updateMany(filter: {}, update: {}, option?: any | null) {
    return this.categoryModel.updateMany(filter, update, option);
  }
}
