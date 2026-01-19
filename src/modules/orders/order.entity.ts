import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    VOID = 'void',
    CANCELLED = 'cancelled',
}

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    orderNumber: string;

    @Column('decimal', { precision: 10, scale: 2 })
    subtotal: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    tax: number;

    @Column('decimal', { precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
