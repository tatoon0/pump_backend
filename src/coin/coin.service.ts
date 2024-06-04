import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Coins } from './coin.entity';
import { Repository } from 'typeorm';
import { Users } from '../user/user.entity';
import { CoinStat } from './coin_stat.entity';
import { UserCoin } from '../user_coin/user_coin.entity';
import { Trade } from '../trade/trade.entity';

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
        private usercoinRepository: Repository<UserCoin>,

        @InjectRepository(Trade)
        private tradeRepository: Repository<Trade>
    ) {}

    async findAll(sortBy: string, orderDirection: string = 'desc'): Promise<Coins[]> {
        let order = {};
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
        const coin = await this.coinRepository.findOne({
            where: { id },
            relations: ['coinStat']
        });
        if (!coin) {
            throw new NotFoundException(`Coin with ID ${id} not found`);
        }
        return coin;
    }

    async getHolder(id: number): Promise<UserCoin[]> {
        const holders = await this.usercoinRepository.find({
            where: { coin: { id } },
            order: { amount: 'desc' },
            relations: ['user']
        });
        if (holders.length === 0) {
            throw new NotFoundException(`No holders found for coin with ID ${id}`);
        }
        return holders;
    }

    async create(
        creator_id: number,
        name: string,
        ticker: string,
        description: string,
        img_url: string
    ): Promise<number> {
        const creator = await this.userRepository.findOne({ where: { id: creator_id } });
        if (!creator) {
            throw new NotFoundException(`User with ID ${creator_id} not found`);
        }

        const coin = this.coinRepository.create({
            creator,
            name,
            ticker,
            description,
            img_url
        });
        await this.coinRepository.save(coin);

        const coinstat = this.coinStatRepository.create({ coin });
        await this.coinStatRepository.save(coinstat);

        coin.coinStat = coinstat;
        await this.coinRepository.save(coin);

        return coin.id;
    }

    async getTradeHistory(coinId: number): Promise<Trade[]> {
        const trades = await this.tradeRepository.find({
            where: { coin: { id: coinId } },
            order: { trade_date: 'DESC' },
            relations: ['user']
        });
        if (trades.length === 0) {
            throw new NotFoundException(`No trades found for coin with ID ${coinId}`);
        }
        return trades;
    }
}