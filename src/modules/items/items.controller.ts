import { Controller, Get, Post, Body, UseGuards, Param, Patch, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('items')
@UseGuards(AuthGuard('jwt'))
export class ItemsController {
    constructor(private readonly itemsService: ItemsService) { }

    @Get()
    async findAll() {
        return this.itemsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.itemsService.findOne(id);
    }

    @Patch('bulk-update')
    async bulkUpdate(@Body() body: any[]) {
        return this.itemsService.bulkUpdate(body);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.itemsService.updateItem(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.itemsService.removeItem(id);
    }

    @Post()
    async create(@Body() body: any) {
        return this.itemsService.createItem(body);
    }
}
