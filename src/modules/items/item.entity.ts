import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../product-category/category.entity';

@Entity('items')
export class Item {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    brand: string;

    @Column({ nullable: true })
    barcode: string;

    @Column({ nullable: true })
    unit: string;

    @Column({ nullable: true })
    gst: string;

    @Column({ nullable: true })
    hsnCode: string;

    @Column({ default: 0 })
    stock: number;

    @Column({ default: 0 })
    openingStock: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    cost: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    mrp: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    discountPercentage: number;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    sellingPrice: number;

    @Column({ default: true })
    trackQty: boolean;

    @Column({ default: 5 })
    lowStockAlert: number;

    @Column({ default: 'Active' })
    status: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    categoryId: string;

    @ManyToOne(() => Category, (category) => category.items)
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
