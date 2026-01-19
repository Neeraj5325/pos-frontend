import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('user_permissions')
export class UserPermission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    module: string; // e.g., 'Masters', 'Invoice', 'Reports'

    @Column({ default: false })
    canCreate: boolean;

    @Column({ default: false })
    canEdit: boolean;

    @Column({ default: false })
    canDelete: boolean;

    @Column({ default: false })
    canView: boolean;

    @Column({ default: false })
    canPrint: boolean;

    @ManyToOne(() => User, user => user.permissions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;
}
