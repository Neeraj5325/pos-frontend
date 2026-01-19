import { Injectable } from '@nestjs/common';
import { BaseTenantService } from '../../common/base-tenant.service';
import { Category } from './category.entity';

@Injectable()
export class ProductCategoryService extends BaseTenantService {
    async findAll() {
        const manager = await this.getEntityManager();
        return manager.find(Category, { relations: ['productGroup'] });
    }

    async findOne(id: string) {
        const manager = await this.getEntityManager();
        return manager.findOne(Category, {
            where: { id },
            relations: ['productGroup']
        });
    }

    async findCategories() {
        const manager = await this.getEntityManager();
        return manager.find(Category, { relations: ['productGroup'] });
    }

    async findOneCategory(id: string) {
        const manager = await this.getEntityManager();
        return manager.findOne(Category, {
            where: { id },
            relations: ['productGroup']
        });
    }

    async createCategory(categoryData: Partial<Category>) {
        const manager = await this.getEntityManager();

        // Extract productGroup ID if provided as an object
        const data: any = { ...categoryData };
        if (data.productGroup && typeof data.productGroup === 'object') {
            data.productGroupId = data.productGroup.id;
            delete data.productGroup;
        }

        const item = manager.create(Category, data);
        return manager.save(Category, item);
    }

    async updateCategory(id: string, itemData: Partial<Category>) {
        const manager = await this.getEntityManager();

        // Extract category ID if provided as an object
        const data: any = { ...itemData };
        if (data.category && typeof data.category === 'object') {
            data.categoryId = data.category.id;
            delete data.category;
        }

        await manager.update(Category, id, data);
        return this.findOne(id);
    }

    async removeCategory(id: string) {
        const manager = await this.getEntityManager();
        return manager.delete(Category, id);
    }
}
