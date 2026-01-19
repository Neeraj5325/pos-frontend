import { Injectable } from '@nestjs/common';
import { BaseTenantService } from '../../common/base-tenant.service';
import { ProductGroup } from './product-group.entity';

@Injectable()
export class ProductGroupsService extends BaseTenantService {
    async findAll() {
        const manager = await this.getEntityManager();
        return manager.find(ProductGroup);
    }

    async findOne(id: string) {
        const manager = await this.getEntityManager();
        return manager.findOne(ProductGroup, { where: { id } });
    }

    async create(data: Partial<ProductGroup>) {
        const manager = await this.getEntityManager();
        const group = manager.create(ProductGroup, data);
        return manager.save(ProductGroup, group);
    }

    async update(id: string, data: Partial<ProductGroup>) {
        const manager = await this.getEntityManager();
        await manager.update(ProductGroup, id, data);
        return this.findOne(id);
    }

    async remove(id: string) {
        const manager = await this.getEntityManager();
        return manager.delete(ProductGroup, id);
    }
}
