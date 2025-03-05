import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { href, category_id } = createProductDto;

    const existCategory = await this.categoriesRepository.findOne({
      where: { id: category_id },
    });
    if (!existCategory) {
      throw new NotFoundException('category_id is invalid');
    }

    const existProduct = await this.productsRepository.findOne({
      where: { href },
    });
    if (existProduct) {
      throw new BadRequestException('product exist already for this href');
    }

    const product = await this.productsRepository.create({
      ...createProductDto,
      category: existCategory,
    });

    return await this.productsRepository.save(product);
  }

  async findAll(limit: number = 2, page: number = 1) {
    const products = await this.productsRepository.find({
      relations: ['category'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return products;
  }
}
