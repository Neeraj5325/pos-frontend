import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenant.entity';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { SchemaSyncService } from './schema-sync.service';

@Module({
    imports: [TypeOrmModule.forFeature([Tenant])],
    providers: [TenantsService, SchemaSyncService],
    controllers: [TenantsController],
    exports: [TenantsService, SchemaSyncService],
})
export class TenantsModule { }
