import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCoin } from '../user_coin/user_coin.entity';
import { Coins } from '../coin/coin.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,

        @InjectRepository(UserCoin)
        private usercoinRepository: Repository<UserCoin>,

        @InjectRepository(Coins)
        private coinRepository: Repository<Coins>
    ) {}

    async findAll(): Promise<Users[]> {
        return await this.userRepository.find();
    }

    async findOne(id: number): Promise<Users> {
        const user = await this.userRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async create(name: string, wallet_address: string): Promise<void> {
        const user = this.userRepository.create({ name, wallet_address });
        await this.userRepository.save(user);
    }

    async getHeldCoin(id: number): Promise<UserCoin[]> {
        const founds = await this.usercoinRepository.find({
            where: { user: { id } },
            relations: ['coin'],
        });
        if (founds.length === 0) {
            throw new NotFoundException(`No coins found for user with ID ${id}`);
        }
        return founds;
    }

    async getCreateCoin(id: number): Promise<Coins[]> {
        const coins = await this.coinRepository.find({
            where: { creator: { id } },
        });
        if (coins.length === 0) {
            throw new NotFoundException(`No coins created by user with ID ${id}`);
        }
        return coins;
    }
}
