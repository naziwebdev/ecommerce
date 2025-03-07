import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dtos/create-address.dto';
import { User } from 'src/users/entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async create(createAddressDto: CreateAddressDto, user: User) {
    const address = await this.addressesRepository.create({
      ...createAddressDto,
      user: user,
    });

    const savedAddress = await this.addressesRepository.save(address);

    savedAddress.user = plainToInstance(User, savedAddress.user);

    return savedAddress;
  }

  async findUserAddresses(user: User) {
    const addresses = await this.addressesRepository.find({
      relations: ['user'],
      where: { user: { id: user.id } },
    });

    const transformedAddresses = addresses.map((address) => ({
      ...address,
      user: plainToInstance(User, address.user),
    }));

    return transformedAddresses;
  }
}
