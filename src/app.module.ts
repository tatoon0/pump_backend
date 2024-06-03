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

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'mysql',
//       host: 'hackathemy.me',
//       port: 3306,
//       username: 'adfpump',
//       password: 'Adfadf!1',
//       database: 'adfpump',
//       synchronize: true,
//       entities: [Users, Coins, CoinStat, UserCoin, Trade],
//     }),
//     UserModule,
//     CoinModule,
//     TradeModule,
//   ],
// })

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'pokm1569*',
      database: 'pump_db',
      synchronize: true,
      entities: [Users, Coins, CoinStat, UserCoin, Trade],
    }),
    UserModule,
    CoinModule,
    TradeModule,
  ],
})
export class AppModule {}
