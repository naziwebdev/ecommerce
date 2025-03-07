import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { CreateTicketDto } from './dtos/create-ticket.dto';
import { User } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto, user: User) {
    let ticketReplyTo = null;
    if (createTicketDto.replyTo) {
      ticketReplyTo = await this.ticketsRepository.findOne({
        where: { id: createTicketDto.replyTo },
      });

      if (!ticketReplyTo) {
        throw new BadRequestException('you can not reply this ticket');
      }
    }

    const ticket = await this.ticketsRepository.create({
      ...createTicketDto,
      user: user,
      replyTo: ticketReplyTo,
    });

    ticket.user = plainToInstance(User, ticket.user);

    return await this.ticketsRepository.save(ticket);
  }

  async findOne(id: number, user: User) {
    const ticket = await this.ticketsRepository.findOne({
      where: { id },
      relations: ['replies', 'replyTo', 'user'],
    });

    if (ticket.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('forbidden route');
    }

    ticket.user = plainToInstance(User, ticket.user);

    return ticket;
  }

  async findAll(limit: number = 2, page: number = 1) {
    const tickets = await this.ticketsRepository.find({
      where: { replyTo: null },
      relations: ['replyTo', 'user'],
      take: limit,
      skip: (page - 1) * limit,
    });

    const transformedTickets = tickets.map((ticket) => ({
      ...ticket,
      user: plainToInstance(User, ticket.user),
    }));

    return transformedTickets;
  }
}
