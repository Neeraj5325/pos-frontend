import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';
import { Item } from '../items/item.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('int')
    quantity: number;

    @Column('decimal', { precision: 10, scale: 2 })
    unitPrice: number;

    @Column('decimal', { precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => Order, (order) => order.items)
    order: Order;

    @ManyToOne(() => Item)
    item: Item;
}
