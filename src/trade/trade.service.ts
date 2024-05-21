import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { Repository } from 'typeorm';
import { Coins } from 'src/coin/coin.entity';
import { Users } from 'src/user/user.entity';
import { CoinStat } from 'src/coin/coin_stat.entity';
import { UserCoin } from 'src/user_coin/user_coin.entity';

@Injectable()
export class TradeService {
    constructor(
        @InjectRepository(Trade)
        private tradeRepository: Repository<Trade>,

        @InjectRepository(Coins)
        private coinRepository: Repository<Coins>,

        @InjectRepository(Users)
        private userRepository: Repository<Users>,

        @InjectRepository(CoinStat)
        private coinstatRepository: Repository<CoinStat>,

        @InjectRepository(UserCoin)
        private usercoinRepository: Repository<UserCoin>,
    ) {}

    async tradeCoin(
        coin_id: number,
        user_id: number,
        type: string,
        amount: number,
        price: number
    ): Promise<void> {
        if (type !== ('buy' || 'sell')) {
            throw new BadRequestException('Invalid trade type')
        }

        const user = await this.userRepository.findOne({
            where: {
                id: user_id
            }
        });
        if (!user) {
            throw new NotFoundException(`User with ID ${user_id} not found`);
        }

        const coin = await this.coinRepository.findOne({
            where: {
                id: coin_id
            }
        });
        if (!coin) {
            throw new NotFoundException(`Coin with ID ${coin_id} not found`);
        }

        let usercoin = await this.usercoinRepository.findOne({
            where: {
                user: { id: user_id },
                coin: { id: coin_id }
            }
        });

        if (!usercoin) {
            usercoin = this.usercoinRepository.create({
                user,
                coin
            });
            await this.usercoinRepository.save(usercoin);
        }

        const coinstat = await this.coinstatRepository.findOne({
            where: {
                coin: { id: coin_id }
            }
        });
        if (!coinstat) {
            throw new NotFoundException(`CoinStat for coin with ID ${coin_id} not found`);
        }

        coinstat.last_trade_date = new Date();

        if (type === 'buy') {
            usercoin.amount += amount;
            coinstat.stock -= amount;
            coinstat.total_funded += price;
        } else if (type === 'sell') {
            usercoin.amount -= amount;
            coinstat.stock += amount;
            coinstat.total_funded -= price;
        }

        const trade = this.tradeRepository.create({
            coin,
            user,
            type,
            amount,
            price
        });

        await this.usercoinRepository.save(usercoin);
        await this.coinstatRepository.save(coinstat);
        await this.tradeRepository.save(trade);
    }
}
