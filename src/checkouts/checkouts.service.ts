import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
type AxiosInstance = ReturnType<typeof axios.create>;
import { Checkout } from './entities/checkout.entity';
import { CheckoutItem } from './entities/checkoutItem.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CheckoutsService {
  private zarinpal: AxiosInstance;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Checkout)
    private checkoutsRepository: Repository<Checkout>,
    @InjectRepository(CheckoutItem)
    private checkoutItemsRepository: Repository<CheckoutItem>,
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {
    const baseURL = this.configService.get<string>('ZARINPAL_BASE_URL');
    this.zarinpal = axios.create({ baseURL });
  }

  async createPayment(amountInRial: number, description: string) {
    try {
      const response: any = await this.zarinpal.post('/request.json', {
        merchant_id: this.configService.get<string>('ZARINPAL_MERCHANT_ID'),
        callback_url: this.configService.get<string>('ZARINPAL_CALLBACK_URL'),
        amount: amountInRial,
        description,
      });

      const data = response.data.data;

      return {
        authority: data.authority,
        paymentUrl: `${this.configService.get<string>('ZARINPAN_START_PAY')}${data.authority}`,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to create payment: ${error.message}`,
      );
    }
  }
}
