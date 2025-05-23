import { Module , forwardRef} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]),forwardRef(() => CategoriesModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[TypeOrmModule,ProductsService]
})
export class ProductsModule {}
