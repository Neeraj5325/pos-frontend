import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { ProductCategoryService } from './product-category.service';
import { ProductCategoryController } from './product-category.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [ProductCategoryService],
    controllers: [ProductCategoryController],
    exports: [ProductCategoryService],
})
export class ProductCategoryModule { }
