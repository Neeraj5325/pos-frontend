import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { TenantsService } from './tenants/tenants.service';
import { UsersService } from './users/users.service';
import { UserRole } from './users/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
    constructor(
        private readonly tenantsService: TenantsService,
        private readonly usersService: UsersService,
    ) { }

    async onApplicationBootstrap() {
        const tenants = await this.tenantsService.findAll();
        if (tenants.length === 0) {
            console.log('Seeding default tenant and user...');
            const tenant = await this.tenantsService.create('Default Cafe', 'default-cafe');

            await this.usersService.create({
                name: 'Admin User',
                email: 'admin@cafe.com',
                password: 'password123',
                role: UserRole.OWNER,
                tenantId: tenant.id,
            });
            console.log('Seeding completed. Email: admin@cafe.com, Password: password123');
        }
    }
}
