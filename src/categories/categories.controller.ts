import {
  Controller,
  Res,
  Body,
  HttpStatus,
  Param,
  UseGuards,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Response } from 'express';
import { CreateCategoryDto } from './dtos/create-category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() body: CreateCategoryDto, @Res() res: Response) {
    const newCategory = await this.categoriesService.create(body);

    return res.status(HttpStatus.CREATED).json({
      data: newCategory,
      statusCode: HttpStatus.CREATED,
      message: 'category created successfully',
    });
  }
}
