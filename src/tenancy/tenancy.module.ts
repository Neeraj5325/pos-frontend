import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { TenancyService } from './tenancy.service';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Tenant])],
    providers: [TenancyService],
    exports: [TenancyService, TypeOrmModule],
})
export class TenancyModule { }
