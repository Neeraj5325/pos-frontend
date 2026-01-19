import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('taxes')
export class Tax {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    type: string;

    @Column()
    taxType: string;

    @Column('decimal', { precision: 5, scale: 2 })
    rate: number;

    @Column({ default: 'Active' })
    status: string;

    @Column({ type: 'date', nullable: true })
    wef: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
