import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Article } from 'src/schemas/article.schema';
import { CreateArticleDto } from '../dto/create-article.dto';
import { Model, isValidObjectId } from 'mongoose';
import { UpdateArticleDto } from '../dto/update-article.dto';
import { CategoryService } from './category.service';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name)
    private readonly articleModel: Model<Article>,
    private readonly categoryServie: CategoryService,
  ) {}

  async create(createArticleDto: CreateArticleDto, userId): Promise<Article> {
    createArticleDto.author = userId;
    const createArticle = new this.articleModel(createArticleDto);
    if (createArticleDto.categories) {
      await this.categoryServie.updateMany(
        {
          _id: { $in: createArticleDto.categories },
        },
        {
          $push: { articles: createArticle._id },
        },
      );
    }
    return createArticle.save();
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
  ): Promise<Article> {
    return await this.articleModel
      .findByIdAndUpdate(id, updateArticleDto)
      .exec();
  }

  async delete(id: string) {
    await this.articleModel.findByIdAndDelete(id).exec();
    return 'delete successful!';
  }

  async findOne(id: string): Promise<Article> {
    return await this.articleModel
      .findById(id)
      .populate({ path: 'author', select: 'email name' })
      .populate({ path: 'categories', select: 'title' })
      .exec();
  }

  async findAll({
    page,
    limit,
    start,
  }: {
    page: number;
    limit: number;
    start: string;
  }): Promise<{ count_page: string; articles: Article[] }> {
    const count = await this.articleModel.countDocuments({});
    const count_page = (count / limit).toFixed();
    const articles = await this.articleModel
      .find(
        {
          _id: {
            $gte: isValidObjectId(start) ? start : '000000000000000000000000',
          },
        },
        null,
        {
          sort: {
            _id: 1,
          },
          skip: (page - 1) * limit,
          limit: limit,
        },
      )
      .populate({ path: 'author', select: 'email name' })
      .populate({ path: 'categories', select: 'title' })
      .exec();

    return { count_page, articles };
  }

  async getByCategories(category_ids: string[]) {
    return await this.articleModel
      .find({
        categories: {
          $all: category_ids,
        },
      })
      .populate({ path: 'author', select: 'email name' })
      .populate({ path: 'categories', select: 'title' })
      .exec();
  }
}
