import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCoin } from 'src/user_coin/user_coin.entity';
import { Coins } from 'src/coin/coin.entity';

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
        return await this.userRepository.find()
    }

    async findOne(id: number): Promise<Users> {
        return await this.userRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async create(name: string, wallet_address: string): Promise<void> {
        const user = this.userRepository.create({
            name,
            wallet_address,
        })
        await this.userRepository.save(user);
    }

    async getHeldCoin(id: number): Promise<UserCoin[]> {
        const founds = await this.usercoinRepository.find({
            where: {
                user: {
                    id: id
                }
            }
        })
        for (const found of founds) {
            await found.coin;
        }
        return founds
    }

    async getCreateCoin(id: number): Promise<Coins[]> {
        return await this.coinRepository.find({
            where: {
                creator: {
                    id: id
                }
            }
        })
    }
}
