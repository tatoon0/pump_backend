import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { Coins } from '../coin/coin.entity';
import { Users } from '../user/user.entity';
import { CoinStat } from '../coin/coin_stat.entity';
import { UserCoin } from '../user_coin/user_coin.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Trade, Coins, Users, CoinStat, UserCoin, Trade])
  ],
  controllers: [TradeController],
  providers: [TradeService]
})
export class TradeModule {}
