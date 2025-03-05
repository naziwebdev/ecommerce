import {
  Controller,
  Post,
  UseGuards,
  Body,
  Res,
  HttpStatus,
  Get,
  Query,
  Param,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { Response } from 'express';
import { UpdateProductDto } from './dtos/update-product.dto';

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

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async update(
    @Body() body: UpdateProductDto,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const updatedProduct = await this.productsService.update(
      body,
      parseInt(id),
    );

    return res.status(HttpStatus.OK).json({
      data: updatedProduct,
      statusCode: HttpStatus.OK,
      message: 'product updated successfully',
    });
  }

  @Get('/:href')
  async findByHref(@Param('href') href: string, @Res() res: Response) {
    const product = await this.productsService.findByHref(href);

    return res.status(HttpStatus.OK).json({
      data: product,
      statusCode: HttpStatus.OK,
      message: 'product get successfully',
    });
  }
}
