import { Injectable } from '@nestjs/common';
import { BaseTenantService } from '../../common/base-tenant.service';
import { Item } from './item.entity';
import { Category } from '../product-category/category.entity';

@Injectable()
export class ItemsService extends BaseTenantService {
    async findAll() {
        const manager = await this.getEntityManager();
        return manager.find(Item, { relations: ['category'] });
    }

    async findOne(id: string) {
        const manager = await this.getEntityManager();
        return manager.findOne(Item, {
            where: { id },
            relations: ['category']
        });
    }

    async createItem(itemData: Partial<Item>) {
        const manager = await this.getEntityManager();

        // Extract category ID if provided as an object
        const data: any = { ...itemData };
        if (data.category && typeof data.category === 'object') {
            data.categoryId = data.category.id;
            delete data.category;
        }

        const item = manager.create(Item, data);
        return manager.save(Item, item);
    }

    async updateItem(id: string, itemData: Partial<Item>) {
        const manager = await this.getEntityManager();

        // Extract category ID if provided as an object
        const data: any = { ...itemData };
        if (data.category && typeof data.category === 'object') {
            data.categoryId = data.category.id;
            delete data.category;
        }

        await manager.update(Item, id, data);
        return this.findOne(id);
    }

    async bulkUpdate(items: Partial<Item>[]): Promise<Item[]> {
        const manager = await this.getEntityManager();
        const updatedItems = [];

        for (const item of items) {
            if (item.id) {
                // We update only specific fields allowed for bulk update
                // like price, stock, cost, mrp, sellingPrice
                await manager.update(Item, item.id, {
                    price: item.price,
                    stock: item.stock,
                    cost: item.cost,
                    mrp: item.mrp,
                    sellingPrice: item.sellingPrice,
                    discountPercentage: item.discountPercentage,
                    lowStockAlert: item.lowStockAlert
                });
                updatedItems.push(await this.findOne(item.id));
            }
        }
        return updatedItems;
    }

    async removeItem(id: string) {
        const manager = await this.getEntityManager();
        return manager.delete(Item, id);
    }
}
