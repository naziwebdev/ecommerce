import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cartItem.entity';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dtos/create-cartItem.dto';
import { User } from 'src/users/entities/user.entity';
import { ProductsService } from 'src/products/products.service';

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

    const cart = await this.cartsRepository.findOne({
      relations: ['user'],
      where: { user },
    });
    const priceAtAddingTime = product.price;

    if (!cart) {
      const newCart = await this.cartsRepository.create({ user });
      await this.cartsRepository.save(newCart);
      const newCartItem = await this.cartItemsRepository.create({
        quantity: createCartItemDto.quantity,
        product,
        priceAtAddingTime,
        cart: newCart,
      });
      const savedCartItem = await this.cartItemsRepository.save(newCartItem);
      return savedCartItem;
    }

    const existingItem = await this.cartItemsRepository.findOne({
      relations: ['product'],
      where: { product },
    });

    let savedCartItem = null;

    if (existingItem) {
      existingItem.quantity =
        createCartItemDto.quantity + existingItem.quantity;
      existingItem.priceAtAddingTime =
        existingItem.priceAtAddingTime * existingItem.quantity;
      await this.cartItemsRepository.save(existingItem);
    } else {
      const newCartItem = await this.cartItemsRepository.create({
        quantity: createCartItemDto.quantity,
        product,
        priceAtAddingTime,
        cart,
      });

      savedCartItem = await this.cartItemsRepository.save(newCartItem);
    }

    return existingItem || savedCartItem;
  }
}
