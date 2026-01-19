import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductCategoryService } from './product-category.service';

@Controller('items')
@UseGuards(AuthGuard('jwt'))
export class ProductCategoryController {
    constructor(private readonly itemsService: ProductCategoryService) { }
    // --- Category Endpoints ---

    @Get('categories')
    async findCategories() {
        return this.itemsService.findCategories();
    }

    @Get('categories/:id')
    async findOneCategory(@Param('id') id: string) {
        return this.itemsService.findOneCategory(id);
    }

    @Post('categories')
    async createCategory(@Body() body: any) {
        return this.itemsService.createCategory(body);
    }

    @Patch('categories/:id')
    async updateCategory(@Param('id') id: string, @Body() body: any) {
        return this.itemsService.updateCategory(id, body);
    }

    @Delete('categories/:id')
    async removeCategory(@Param('id') id: string) {
        return this.itemsService.removeCategory(id);
    }

    @Post()
    async create(@Body() body: any) {
        return this.itemsService.createCategory(body);
    }
}
