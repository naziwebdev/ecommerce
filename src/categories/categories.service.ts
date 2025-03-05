import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      const category =
        await this.categoriesRepository.create(createCategoryDto);

      return await this.categoriesRepository.save(category);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create category/title must be unique',
      );
    }
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number) {
    const category = await this.categoriesRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException('not found category');
    }

    category.title = updateCategoryDto.title;

    return await this.categoriesRepository.save(category);
  }

  async findAll(limit: number = 2, page: number = 1) {
    const categories = await this.categoriesRepository.find({
      take: limit,
      skip: (page - 1) * limit,
    });

    return categories;
  }
}
