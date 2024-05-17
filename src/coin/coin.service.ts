import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coins } from './coin.entity';
import { Repository } from 'typeorm';
import { Users } from 'src/user/user.entity';
import { CoinStat } from './coin_stat.entity';

@Injectable()
export class CoinService {
    constructor(
        @InjectRepository(Coins)
        private coinRepository: Repository<Coins>,

        @InjectRepository(CoinStat)
        private coinStatRepository: Repository<CoinStat>,

        @InjectRepository(Users)
        private userRepository: Repository<Users>
    ) {}

    async findAll(): Promise<Coins[]> {
        return await this.coinRepository.find();
    }

    async findOne(id: number): Promise<Coins> {
        return await this.coinRepository.findOne({
            where: {
                id: id
            }
        });
    }

    async create(
        creator_id: number,
        name: string,
        ticker: string,
        description: string
    ): Promise<void> {        
        const coin = this.coinRepository.create({
            creator: await this.userRepository.findOne({
                where: {
                    id: creator_id
                }
            }),
            name,
            ticker,
            description
        })
        await this.coinRepository.save(coin);

        const coinstat = this.coinStatRepository.create({
            coin: await this.coinRepository.findOne({
                where: {
                    id: coin.id
                }
            })
        })
        await this.coinStatRepository.save(coinstat)
    }
}
