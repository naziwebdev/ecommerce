import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dtos/create-cartItem.dto';
import { User } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private cartItemsRepository: Repository<CartItem>,
    private readonly productsService: ProductsService,
  ) {}

  async add(createCartItemDto: CreateCartItemDto, user: User) {
    const product = await this.productsService.findById(
      createCartItemDto.product_id,
    );

    let cart = await this.cartsRepository.findOne({
      where: { user: { id: user.id } },
      relations: ['user'],
    });

    if (!cart) {
      cart = this.cartsRepository.create({ user });
      await this.cartsRepository.save(cart);
    }

    const existingItem = await this.cartItemsRepository.findOne({
      where: {
        product: { id: product.id },
        cart: { id: cart.id },
      },
      relations: ['product', 'cart', 'cart.user'],
    });

    if (existingItem) {
      existingItem.quantity += createCartItemDto.quantity;
      existingItem.priceAtAddingTime = product.price;
      await this.cartItemsRepository.save(existingItem);
      const response = plainToInstance(CartItem, existingItem);
      response.cart.user = plainToInstance(User, cart.user);
      return response;
    }

    const newCartItem = this.cartItemsRepository.create({
      quantity: createCartItemDto.quantity,
      product,
      priceAtAddingTime: product.price,
      cart,
    });

    const savedCartItem = await this.cartItemsRepository.save(newCartItem);
    return plainToInstance(CartItem, savedCartItem);
  }

  async getUserCart(user: User) {
    const userId = user.id;
    const userCartItems = await this.cartItemsRepository
      .createQueryBuilder('cartItem')
      .innerJoinAndSelect('cartItem.cart', 'cart')
      .innerJoinAndSelect('cart.user', 'user')
      .innerJoinAndSelect('cartItem.product', 'product')
      .where('user.id = :userId', { userId })
      .getMany();

    const transformedCartItems = userCartItems.map((cartItem) => {
      const transformedCartItem = plainToInstance(CartItem, cartItem);
      transformedCartItem.cart.user = plainToInstance(User, cartItem.cart.user);
      return transformedCartItem;
    });

    return transformedCartItems;
  }

  async remove(id: number, user: User) {
    const cart = await this.cartsRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (!cart) {
      throw new NotFoundException('not found user cart');
    }

    const cartItem = await this.cartItemsRepository.findOne({
      where: { id },
      relations:['product']
    });

    if (!cartItem) {
      throw new NotFoundException('not found this item in cart');
    }

    if (cartItem && cartItem.quantity > 1) {
      cartItem.quantity = cartItem.quantity - 1;
      cartItem.priceAtAddingTime = cartItem.priceAtAddingTime - cartItem.product.price
      await this.cartItemsRepository.save(cartItem);
    } else if (cartItem.quantity === 1) {
      await this.cartItemsRepository.remove(cartItem);
    }

    return true;
  }
}
