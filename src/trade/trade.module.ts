import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trade } from './trade.entity';
import { Coins } from 'src/coin/coin.entity';
import { Users } from 'src/user/user.entity';
import { CoinStat } from 'src/coin/coin_stat.entity';
import { UserCoin } from 'src/user_coin/user_coin.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Trade, Coins, Users, CoinStat, UserCoin])
  ],
  controllers: [TradeController],
  providers: [TradeService]
})
export class TradeModule {}
