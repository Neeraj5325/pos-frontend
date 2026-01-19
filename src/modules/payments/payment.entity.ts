import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Order } from '../orders/order.entity';

export enum PaymentMethod {
    CASH = 'cash',
    CARD = 'card',
    UPI = 'upi',
    WALLET = 'wallet',
}

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: PaymentMethod })
    method: PaymentMethod;

    @Column({ default: 'completed' })
    status: string;

    @ManyToOne(() => Order)
    order: Order;

    @CreateDateColumn()
    createdAt: Date;
}
