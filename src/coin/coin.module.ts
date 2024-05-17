import { Module } from '@nestjs/common';
import { CoinController } from './coin.controller';
import { CoinService } from './coin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coins } from './coin.entity';
import { Users } from 'src/user/user.entity';
import { CoinStat } from './coin_stat.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Coins, CoinStat, Users])
  ],
  controllers: [CoinController],
  providers: [CoinService]
})
export class CoinModule {}
