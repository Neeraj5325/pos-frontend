import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, EntityManager } from 'typeorm';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class TenancyService {
    constructor(
        @Inject(REQUEST) private readonly request: Request,
        private readonly dataSource: DataSource,
    ) { }

    async getTenantEntityManager(): Promise<EntityManager> {
        const tenantId = this.request.headers['x-tenant-id'] as string;

        if (!tenantId) {
            return this.dataSource.manager;
        }

        // Identify the schema name based on tenantId (slug)
        // In a real app, you'd look this up in the public.tenants table
        // For now, let's assume schemaName = tenantId
        const schemaName = tenantId;

        // Create a new manager that runs within the schema context
        // This is a bit tricky in TypeORM without opening a new connection.
        // One way is to use a query runner and set search path.

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.query(`SET search_path TO "${schemaName}", public`);

        return queryRunner.manager;
    }
}
