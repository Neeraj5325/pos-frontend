import { Controller, Post, Body, Get, Patch, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { Tenant } from './tenant.entity';

@Controller('tenants')
export class TenantsController {
    constructor(private readonly tenantsService: TenantsService) { }

    @Post('register')
    async register(@Body() body: { name: string; slug: string }) {
        return this.tenantsService.create(body.name, body.slug);
    }

    @Get()
    async findAll() {
        return this.tenantsService.findAll();
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() data: Partial<Tenant>) {
        return this.tenantsService.update(id, data);
    }
}
