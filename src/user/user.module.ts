import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './user.entity';
import { UserCoin } from 'src/user_coin/user_coin.entity';
import { Coins } from 'src/coin/coin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, UserCoin, Coins])
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
