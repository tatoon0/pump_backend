import { Module } from '@nestjs/common';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coins } from './coin.entity';
import { Users } from '../user/user.entity';
import { CoinStat } from './coin_stat.entity';
import { UserCoin } from '../user_coin/user_coin.entity';
import { Trade } from '../trade/trade.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Coins, CoinStat, Users, UserCoin, Trade])
  ],
  controllers: [CoinController],
  providers: [CoinService]
})
export class CoinModule {}
