import {
  Body,
  Controller,
  Post,
  UseGuards,
  Res,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Response } from 'express';

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
