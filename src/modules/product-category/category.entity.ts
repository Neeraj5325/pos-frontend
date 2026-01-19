import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Item } from '../items/item.entity';
import { ProductGroup } from '../product-group/product-group.entity';

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: 0 })
    displayOrder: number;

    @Column({ nullable: true })
    tax: string;

    @Column({ default: 'Active' })
    status: string;

    @Column({ type: 'date', nullable: true })
    wef: Date;

    @Column({ nullable: true })
    productGroupId: string;

    @ManyToOne(() => ProductGroup, (group) => group.categories)
    @JoinColumn({ name: 'productGroupId' })
    productGroup: ProductGroup;

    @OneToMany(() => Item, (item) => item.category)
    items: Item[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
