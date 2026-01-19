import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    supplierType: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ nullable: true })
    gstRegistrationType: string;

    @Column({ nullable: true })
    gstin: string;

    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    openingBalance: number;

    @Column({ nullable: true })
    paymentTerm: string;

    @Column({ nullable: true })
    state: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    pinCode: string;

    @Column({ nullable: true })
    mobileNo: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
