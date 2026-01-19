import { Injectable } from '@nestjs/common';
import { BaseTenantService } from '../../common/base-tenant.service';
import { Tax } from './tax.entity';

@Injectable()
export class TaxesService extends BaseTenantService {
    async create(createTaxDto: Partial<Tax>): Promise<Tax> {
        const manager = await this.getEntityManager();
        const tax = manager.create(Tax, createTaxDto);
        return manager.save(Tax, tax);
    }

    async findAll(): Promise<Tax[]> {
        const manager = await this.getEntityManager();
        return manager.find(Tax);
    }

    async findOne(id: string): Promise<Tax> {
        const manager = await this.getEntityManager();
        return manager.findOne(Tax, { where: { id } });
    }

    async update(id: string, updateTaxDto: Partial<Tax>): Promise<Tax> {
        const manager = await this.getEntityManager();
        await manager.update(Tax, id, updateTaxDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const manager = await this.getEntityManager();
        await manager.delete(Tax, id);
    }
}
