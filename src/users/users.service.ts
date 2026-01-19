import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const user = this.userRepository.create({
            ...userData,
            password: hashedPassword,
        });
        return this.userRepository.save(user);
    }

    async findByEmail(email: string) {
        return this.userRepository
            .createQueryBuilder('user')
            .addSelect('user.password')
            .leftJoinAndSelect('user.tenant', 'tenant')
            .where('user.email = :email', { email })
            .getOne();
    }

    async findAll(tenantId?: string) {
        const where = tenantId ? { tenantId } : {};
        return this.userRepository.find({
            where,
            relations: ['permissions'],
            order: { createdAt: 'DESC' }
        });
    }

    async findById(id: string) {
        return this.userRepository.findOne({
            where: { id },
            relations: ['tenant', 'permissions']
        });
    }

    async update(id: string, updateData: any) {
        const { permissions, ...userData } = updateData;

        // If password is being updated, hash it
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 10);
        }

        // First update user basics
        await this.userRepository.update(id, userData);

        // If permissions are provided, update them
        // For simplicity, we can load the user, clear permissions, and re-add them
        // But since we have cascade: true, saving the user with permissions might work better
        // However, updating nested relations via save() on partial update is tricky.

        if (permissions) {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ['permissions']
            });

            if (user) {
                // Update basic fields on the object
                Object.assign(user, userData);
                // Assign new permissions (TypeORM cascade should handle this if configured right, 
                // but usually requires replacing the array)
                user.permissions = permissions;
                return this.userRepository.save(user);
            }
        }

        return this.findById(id);
    }

    async remove(id: string) {
        return this.userRepository.delete(id);
    }
}
