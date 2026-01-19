import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto: any) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(@Request() req) {
        // Filter by current tenant
        const tenantId = req.user.tenantId;
        return this.usersService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: any) {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id);
    }
}
