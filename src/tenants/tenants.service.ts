import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tenant } from './tenant.entity';
import { SchemaSyncService } from './schema-sync.service';

@Injectable()
export class TenantsService {
    constructor(
        @InjectRepository(Tenant)
        private tenantRepository: Repository<Tenant>,
        private dataSource: DataSource,
        private schemaSyncService: SchemaSyncService,
    ) { }

    async create(name: string, slug: string) {
        const existingTenant = await this.tenantRepository.findOne({ where: { slug } });
        if (existingTenant) {
            throw new BadRequestException('Tenant with this slug already exists');
        }

        const schemaName = `tenant_${slug.replace(/-/g, '_')}`;

        const tenant = this.tenantRepository.create({
            name,
            slug,
            schemaName,
        });

        await this.tenantRepository.save(tenant);

        // Create Schema
        await this.dataSource.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
        await this.dataSource.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Initialize tables in the new schema
        const sql = this.schemaSyncService.getSchemaInitSql(schemaName);
        await this.dataSource.query(sql);

        return tenant;
    }

    async findAll() {
        return this.tenantRepository.find();
    }

    async update(id: string, data: Partial<Tenant>) {
        await this.tenantRepository.update(id, data);
        return this.tenantRepository.findOne({ where: { id } });
    }
}
