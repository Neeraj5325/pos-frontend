import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TaxesService } from './taxes.service';
import { Tax } from './tax.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('taxes')
@UseGuards(AuthGuard('jwt'))
export class TaxesController {
    constructor(private readonly taxesService: TaxesService) { }

    @Post()
    create(@Body() createTaxDto: Partial<Tax>) {
        return this.taxesService.create(createTaxDto);
    }

    @Get()
    findAll() {
        return this.taxesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.taxesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaxDto: Partial<Tax>) {
        return this.taxesService.update(id, updateTaxDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.taxesService.remove(id);
    }
}
