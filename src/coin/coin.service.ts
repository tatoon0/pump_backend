import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coins } from './coin.entity';
import { OrderedBulkOperation, Repository } from 'typeorm';
import { Users } from 'src/user/user.entity';
import { CoinStat } from './coin_stat.entity';
import { UserCoin } from 'src/user_coin/user_coin.entity';

@Injectable()
export class CoinService {
    constructor(
        @InjectRepository(Coins)
        private coinRepository: Repository<Coins>,

        @InjectRepository(CoinStat)
        private coinStatRepository: Repository<CoinStat>,

        @InjectRepository(Users)
        private userRepository: Repository<Users>,

        @InjectRepository(UserCoin)
        private usercoinRepository: Repository<UserCoin>
    ) {}

    async findAll(sortBy: string, orderDirection: string): Promise<Coins[]> {
        let order = {};
        if (!orderDirection) {
            orderDirection = 'desc'
        }
        switch (sortBy) {
            case 'created':
                order = { 'coin.created_at': orderDirection };
                break;
            case 'trade':
                order = { 'coinstat.last_trade_date': orderDirection };
                break;
            case 'funded':
                order = { 'coinstat.total_funded': orderDirection };
                break;
            default:
                order = { 'coinstat.last_trade_date': orderDirection };
                break;
        }
    
        return await this.coinRepository.createQueryBuilder('coin')
            .leftJoinAndSelect('coin.coinStat', 'coinstat')
            .orderBy(order)
            .getMany();
    }

    async findOne(id: number): Promise<Coins> {
        return await this.coinRepository.findOne({
            where: {
                id: id
            }
        });
    }
    
    async getHolder(id: number): Promise<UserCoin[]> {
        return await this.usercoinRepository.createQueryBuilder('usercoin')
        .leftJoinAndSelect('usercoin.user', 'user')
        .leftJoinAndSelect('usercoin.coin', 'coin')
        .where('usercoin.coin.id = :id', { id })
        .orderBy('usercoin.amount', 'DESC')
        .getMany();
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

        coin.coinStat = coinstat
        await this.coinRepository.save(coin);

    }
}
