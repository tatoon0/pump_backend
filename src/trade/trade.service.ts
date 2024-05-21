import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { Repository } from 'typeorm';
import { Coins } from 'src/coin/coin.entity';
import { Users } from 'src/user/user.entity';
import { CoinStat } from 'src/coin/coin_stat.entity';
import { UserCoin } from 'src/user_coin/user_coin.entity';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

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
        const found = await this.usercoinRepository.findOne({
            where: {
                user: {id: user_id},
                coin: {id: coin_id}
            }
        });

        let usercoin: UserCoin

        if (!found) {
            usercoin = this.usercoinRepository.create({
                user: await this.userRepository.findOne({
                    where: {
                        id: user_id
                    }
                }),
                coin: await this.coinRepository.findOne({
                    where: {
                        id: coin_id
                    }
                })
            })
            await this.usercoinRepository.save(usercoin);
        } else {
            usercoin = found;
        }

        const coinstat = await this.coinstatRepository.findOne({
            where: {
              coin: { id: coin_id }
            }
        });

        coinstat.last_trade_date = new Date();

        //console.log('Before update:', usercoin.amount, coinstat.stock, coinstat.total_funded);
        if (type === 'buy') {
          usercoin.amount += amount;
          coinstat.stock -= amount;
          coinstat.total_funded += price;
          //console.log('After buy:', usercoin.amount, coinstat.stock, coinstat.total_funded);
        } else if (type === 'sell') {
          usercoin.amount -= amount;
          coinstat.stock += amount;
          coinstat.total_funded -= price;
          //console.log('After sell:', usercoin.amount, coinstat.stock, coinstat.total_funded);
        }
        
        const trade = this.tradeRepository.create({
            coin: await this.coinRepository.findOne({
                where: {
                    id: coin_id
                }
            }),
            user: await this.userRepository.findOne({
                where: {
                    id: user_id
                }
            }),
            type,
            amount,
            price
        })

        await this.usercoinRepository.save(usercoin)
        await this.coinstatRepository.save(coinstat)
        await this.tradeRepository.save(trade)
    }
}
