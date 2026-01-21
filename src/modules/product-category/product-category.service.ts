import { Injectable, BadRequestException } from '@nestjs/common';
import { BaseTenantService } from '../../common/base-tenant.service';
import { Category } from './category.entity';
import { ProductGroup } from '../product-group/product-group.entity';

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

        // Extract productGroup ID if provided as an object..
        const data: any = { ...categoryData };
        // Extract productGroup ID if provided as an object or string
        if (data.productGroup) {
            if (typeof data.productGroup === 'object') {
                data.productGroupId = data.productGroup.id;
            } else if (typeof data.productGroup === 'string') {
                data.productGroupId = data.productGroup;
            }
            delete data.productGroup;
        }

        if (data.productGroupId) {
            const group = await manager.findOne(ProductGroup, { where: { id: data.productGroupId } });
            if (!group) {
                throw new BadRequestException(`Product Group with ID ${data.productGroupId} does not exist.`);
            }
        }
        const item = manager.create(Category, data);
        try {
            return await manager.save(Category, item);
        } catch (error) {
            console.error('Error saving category:', error);
            throw new BadRequestException(`Failed to save category. Error: ${error.message}. Data: ${JSON.stringify(data)}`);
        }
    }

    async updateCategory(id: string, itemData: Partial<Category>) {
        const manager = await this.getEntityManager();

        // Extract category ID if provided as an object
        const data: any = { ...itemData };
        // Extract productGroup ID if provided as an object or string
        if (data.productGroup) {
            if (typeof data.productGroup === 'object') {
                data.productGroupId = data.productGroup.id;
            } else if (typeof data.productGroup === 'string') {
                data.productGroupId = data.productGroup;
            }
            delete data.productGroup;
        }

        if (data.productGroupId) {
            const group = await manager.findOne(ProductGroup, { where: { id: data.productGroupId } });
            if (!group) {
                throw new BadRequestException(`Product Group with ID ${data.productGroupId} does not exist.`);
            }
        }

        await manager.update(Category, id, data);
        return this.findOne(id);
    }

    async removeCategory(id: string) {
        const manager = await this.getEntityManager();
        return manager.delete(Category, id);
    }
}
