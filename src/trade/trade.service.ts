import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { DataSource, Repository } from 'typeorm';
import { Coins } from '../coin/coin.entity';
import { Users } from '../user/user.entity';
import { CoinStat } from '../coin/coin_stat.entity';
import { UserCoin } from '../user_coin/user_coin.entity';

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

        private dataSoource: DataSource
    ) {}

    async tradeCoin(
        coin_id: number,
        user_id: number,
        type: string,
        amount: number,
        price: number
    ): Promise<void> {
        // trade type check
        if (type !== 'buy' && type !== 'sell') {
            throw new BadRequestException('Invalid trade type')
        }
    
        const queryRunner = this.dataSoource.createQueryRunner()
        await queryRunner.connect()

        await queryRunner.startTransaction()

        try{
            // find user
            const user = await queryRunner.manager.findOne(Users, {
                where: {
                    id: user_id
                }
            });
            if (!user) {
                throw new NotFoundException(`User with ID ${user_id} not found`);
            }
    
            // find coin
            const coin = await queryRunner.manager.findOne(Coins, {
                where: {
                    id: coin_id
                },
                relations: ['creator']
            })
            if (!coin) {
                throw new NotFoundException(`Coin with ID ${coin_id} not found`);
            }
    
            // find usercoin
            let usercoin = await queryRunner.manager.findOne(UserCoin, {
                where: {
                    user: { id: user_id },
                    coin: { id: coin_id }
                }
            });
    
            if (!usercoin) {
                usercoin = queryRunner.manager.create(UserCoin, {
                    user,
                    coin
                });
                await queryRunner.manager.save(usercoin);
            }
            
            // find coinstat
            const coinstat = await queryRunner.manager.findOne(CoinStat, {
                where: {
                    coin: { id: coin_id }
                }
            });
            if (!coinstat) {
                throw new NotFoundException(`CoinStat for coin with ID ${coin_id} not found`);
            }
    
            // trade validation
            if (type === 'buy' && amount > coinstat.stockNumber) {
                throw new BadRequestException('Purchase amount exceeds available stock')
            }
            else if (type === 'sell') {
                if (amount > usercoin.amountNumber){
                    throw new BadRequestException('Sell amount exceeds your available coins')
                }
                else if (coin.funding_complete === true) {
                    throw new BadRequestException('The funding for this coin has been completed')
                }
            }
            
            // last trade date update
            coinstat.last_trade_date = new Date();
            
            // trade
            if (type === 'buy') {
                usercoin.amountNumber += amount;
                coinstat.stockNumber -= amount;
                coinstat.total_fundedNumber += price;
            } else if (type === 'sell') {
                usercoin.amountNumber -= amount;
                coinstat.stockNumber += amount;
                coinstat.total_fundedNumber -= price;
            }
    
            // funding complete check
            if (coinstat.stockNumber < 0.0000000001) {
                coin.funding_complete = true;
                const creator = await coin.creator;
                creator.is_artist = true;
                await queryRunner.manager.save(creator);
            }
    
            const trade = this.tradeRepository.create({
                coin,
                user,
                type,
                amount,
                price
            });
    
            await queryRunner.manager.save(coin);
            await queryRunner.manager.save(usercoin);
            await queryRunner.manager.save(coinstat);
            await queryRunner.manager.save(trade);
            
            await queryRunner.commitTransaction()
        } catch(error) {
            await queryRunner.rollbackTransaction()
            throw error;
        } finally {
            await queryRunner.release()
        }
    }
}
