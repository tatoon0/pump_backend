import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user/user.entity';
import { UserModule } from './user/user.module';
import { CoinModule } from './coin/coin.module';
import { Coins } from './coin/coin.entity';
import { CoinStat } from './coin/coin_stat.entity';
import { UserCoin } from './user_coin/user_coin.entity';
import { TradeModule } from './trade/trade.module';
import { Trade } from './trade/trade.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'username',
      password: 'password',
      database: 'pump-backend',
      synchronize: true,
      entities: [Users, Coins, CoinStat, UserCoin, Trade],
    }),
    UserModule,
    CoinModule,
    TradeModule,
  ],
})
export class AppModule {}
