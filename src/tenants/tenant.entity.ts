import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'tenants', schema: 'public' })
export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ unique: true })
    slug: string;

    @Column({ unique: true })
    schemaName: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    pinCode: string;

    @Column({ nullable: true })
    mobile: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    gstRegistrationType: string;

    @Column({ nullable: true })
    gstin: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
