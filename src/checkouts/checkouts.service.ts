import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
type AxiosInstance = ReturnType<typeof axios.create>;
import { Checkout } from './entities/checkout.entity';
import { CheckoutItem } from './entities/checkoutItem.entity';
import { Order } from 'src/orders/entities/order.entity';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/users/entities/user.entity';
import { AddressesService } from 'src/addresses/addresses.service';
import { Cart } from 'src/carts/entities/cart.entity';
import { OrdersService } from 'src/orders/orders.service';
import { CartItem } from 'src/carts/entities/cartItem.entity';

@Injectable()
export class CheckoutsService {
  private zarinpal: AxiosInstance;
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Checkout)
    private checkoutsRepository: Repository<Checkout>,
    @InjectRepository(CheckoutItem)
    private checkoutItemsRepository: Repository<CheckoutItem>,
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    private readonly addressesService: AddressesService,
    private readonly ordersService: OrdersService,
  ) {
    const baseURL = this.configService.get<string>('ZARINPAN_BASE_URL_API');
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

  async verifyPayment(amountInRial: number, authority: string) {
    try {
      const response: any = await this.zarinpal.post('/verify.json', {
        merchant_id: this.configService.get<string>('ZARINPAL_MERCHANT_ID'),
        amount: amountInRial,
        authority,
      });

      const data = response.data.data;

      return data;
    } catch (error) {
      throw new BadRequestException(
        `Failed to verify payment: ${error.message}`,
      );
    }
  }

  async createCheckout(user: User, addressId: number) {
  
    const address = await this.addressesService.findOne(addressId);
    if (!address) {
      throw new NotFoundException('not found address');
    }

    const cart = await this.cartsRepository.findOne({
      relations: ['user'],
      where: { user: { id: user.id } },
    });

    if (!cart) {
      throw new NotFoundException('not found cart');
    }

    const cartItems = await this.cartItemsRepository.find({
      relations: ['product', 'cart'],
      where: { cart: { id: cart.id } },
    });

    if (cartItems.length === 0) {
      throw new NotFoundException('cart is empty');
    }

    const checkoutItems = [];

    for (const item of cartItems) {
      checkoutItems.push({
        quantity: item.quantity,
        priceAtPurchaseTime: item.priceAtAddingTime,
        product: item.product.id,
      });
    }

    const totalPrice = checkoutItems.reduce((total, item) => {
      return total + item.priceAtPurchaseTime * item.quantity;
    }, 0);

    const peyment = await this.createPayment(totalPrice, 'peyment');

    const newCheckOut = await this.checkoutsRepository.create({
      totalPrice,
      address,
      user,
      authourity: peyment.authority,
    });

    await this.checkoutsRepository.save(newCheckOut);

    for (const item of checkoutItems) {
      item.checkout = newCheckOut.id;

      const newCheckOutItem = await this.checkoutItemsRepository.create({
        ...item,
      });

      await this.checkoutItemsRepository.save(newCheckOutItem);
    }

    return peyment.paymentUrl;
  }
}
