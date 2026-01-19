import { Injectable } from '@nestjs/common';
import { BaseTenantService } from '../../common/base-tenant.service';
import { Supplier } from './supplier.entity';

@Injectable()
export class SuppliersService extends BaseTenantService {
    async create(createSupplierDto: Partial<Supplier>): Promise<Supplier> {
        const manager = await this.getEntityManager();
        const supplier = manager.create(Supplier, createSupplierDto);
        return manager.save(Supplier, supplier);
    }

    async findAll(): Promise<Supplier[]> {
        const manager = await this.getEntityManager();
        return manager.find(Supplier, {
            order: { createdAt: 'DESC' }
        });
    }

    async findOne(id: string): Promise<Supplier> {
        const manager = await this.getEntityManager();
        return manager.findOne(Supplier, { where: { id } });
    }

    async update(id: string, updateSupplierDto: Partial<Supplier>): Promise<Supplier> {
        const manager = await this.getEntityManager();
        await manager.update(Supplier, id, updateSupplierDto);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const manager = await this.getEntityManager();
        await manager.delete(Supplier, id);
    }
}
