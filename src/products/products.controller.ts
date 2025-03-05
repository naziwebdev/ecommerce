import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  HttpStatus,
  Get,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { Response } from 'express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  async create(@Body() body: CreateProductDto, @Res() res: Response) {
    const product = await this.productsService.create(body);

    return res.status(HttpStatus.CREATED).json({
      data: product,
      statusCode: HttpStatus.CREATED,
      message: 'product created successfully',
    });
  }

  @Get()
  async getAll(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Res() res: Response,
  ) {
    const products = await this.productsService.findAll(
      parseInt(limit),
      parseInt(page),
    );

    return res.status(HttpStatus.OK).json({
      data: products,
      statusCode: HttpStatus.OK,
      message: 'products get successfully',
    });
  }
}
