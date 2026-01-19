import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductGroupsService } from './product-groups.service';
import { ProductGroup } from './product-group.entity';

@Controller('product-groups')
export class ProductGroupsController {
    constructor(private readonly productGroupsService: ProductGroupsService) { }

    @Get()
    findAll() {
        return this.productGroupsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productGroupsService.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<ProductGroup>) {
        return this.productGroupsService.create(data);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() data: Partial<ProductGroup>) {
        return this.productGroupsService.update(id, data);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productGroupsService.remove(id);
    }
}
