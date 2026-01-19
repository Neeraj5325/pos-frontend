import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async create(@Body() body: any) {
        return this.ordersService.create(body);
    }

    @Get()
    async findAll() {
        return this.ordersService.findAll();
    }
}
