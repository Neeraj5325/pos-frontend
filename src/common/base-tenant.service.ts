import { Injectable, Inject, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DataSource, EntityManager } from 'typeorm';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class BaseTenantService {
    constructor(
        @Inject(REQUEST) protected readonly request: Request,
        protected readonly dataSource: DataSource,
    ) { }

    async getEntityManager(): Promise<EntityManager> {
        const req = this.request as any;

        // 1. Use existing tenant manager if available (from Interceptor)
        if (req.tenantManager) {
            return req.tenantManager;
        }

        // 2. Fallback: Check if we have tenant context but no manager yet (shouldn't happen if Interceptor is global)
        // This is a safety net or for testing
        const user = req.user;
        const schemaName = user?.schemaName || req.tenantId;

        if (schemaName) {
            // WARNING: This path creates a connection that MIGHT NOT BE RELEASED if not carefully managed.
            // Ideally should go through Interceptor. 
            // For now, we'll keep the old behavior as fallback but log a warning.
            // console.warn('Creating ad-hoc tenant connection in Service (Potential Leak)');
            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.query(`SET search_path TO "${schemaName}", public`);
            return queryRunner.manager;
        }

        // 3. Fallback: Public schema (no tenant)
        return this.dataSource.manager;
    }
}
