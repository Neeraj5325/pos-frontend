import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Category } from '../product-category/category.entity';

@Entity('product_groups')
export class ProductGroup {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true, nullable: true })
    code: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => Category, (category) => category.productGroup)
    categories: Category[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
