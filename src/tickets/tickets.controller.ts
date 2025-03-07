import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpStatus,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';
import { RoleGuard } from 'src/guards/role.guard';
import { pairwise } from 'rxjs';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(
    @GetUser() user: User,
    @Body() body: CreateTicketDto,
    @Res() res: Response,
  ) {
    const ticket = await this.ticketsService.create(body, user);

    return res.status(HttpStatus.CREATED).json({
      data: ticket,
      statusCode: HttpStatus.CREATED,
      message: 'ticket created successfully',
    });
  }

  @Get('/')
  @UseGuards(JwtAuthGuard, RoleGuard)
  async findAll(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Res() res: Response,
  ) {
    const tickets = await this.ticketsService.findAll(
      parseInt(limit),
      parseInt(page),
    );

    return res.status(HttpStatus.OK).json({
      data: tickets,
      statusCode: HttpStatus.OK,
      message: 'ticket get successfully',
    });
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async findOne(
    @GetUser() user: User,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const ticket = await this.ticketsService.findOne(parseInt(id), user);

    return res.status(HttpStatus.OK).json({
      data: ticket,
      statusCode: HttpStatus.OK,
      message: 'ticket get successfully',
    });
  }
}
