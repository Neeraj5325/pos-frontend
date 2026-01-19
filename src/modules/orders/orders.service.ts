import { Injectable } from '@nestjs/common';
import { BaseTenantService } from '../../common/base-tenant.service';
import { Order, OrderStatus } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Item } from '../items/item.entity';

@Injectable()
export class OrdersService extends BaseTenantService {
    async create(orderData: any) {
        const manager = await this.getEntityManager();

        return await manager.transaction(async (transactionalManager) => {
            const order = transactionalManager.create(Order, {
                orderNumber: `ORD-${Date.now()}`,
                status: OrderStatus.PENDING,
                subtotal: orderData.subtotal,
                discount: orderData.discount || 0,
                tax: orderData.tax || 0,
                total: orderData.total,
            });

            const savedOrder = await transactionalManager.save(Order, order);

            for (const itemData of orderData.items) {
                const item = await transactionalManager.findOne(Item, { where: { id: itemData.id } });
                if (item) {
                    const orderItem = transactionalManager.create(OrderItem, {
                        order: savedOrder,
                        item: item,
                        quantity: itemData.quantity,
                        unitPrice: item.price,
                        totalPrice: item.price * itemData.quantity,
                    });
                    await transactionalManager.save(OrderItem, orderItem);

                    // Deduct stock
                    item.stock -= itemData.quantity;
                    await transactionalManager.save(Item, item);
                }
            }

            return savedOrder;
        });
    }

    async findAll() {
        const manager = await this.getEntityManager();
        return manager.find(Order, { relations: ['items', 'items.item'] });
    }
}
