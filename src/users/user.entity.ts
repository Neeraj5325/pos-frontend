import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Tenant } from '../tenants/tenant.entity';
import { UserPermission } from './user-permission.entity';

export enum UserRole {
    CASHIER = 'cashier',
    SUPERVISOR = 'supervisor',
    MANAGER = 'manager',
    OWNER = 'owner',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.CASHIER })
    role: UserRole;

    @ManyToOne(() => Tenant)
    tenant: Tenant;

    @Column()
    tenantId: string;

    @Column({ nullable: true })
    mobileNo: string;

    @Column({ default: 'Active' })
    status: string;

    @Column({ type: 'date', nullable: true })
    wef: Date;

    @OneToMany(() => UserPermission, permission => permission.user, { cascade: true })
    permissions: UserPermission[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
