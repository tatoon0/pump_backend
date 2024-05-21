import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { Users } from './user.entity';
import { UserCoin } from 'src/user_coin/user_coin.entity';
import { Coins } from 'src/coin/coin.entity';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) {}

    //모든 유저 정보 (name, wallet_address, created_at)
    @Get()
    findAll(): Promise<Users[]> {
        return this.userService.findAll();
    }

    //특정 유저 정보 (name, wallet_address, created_at)
    @Get('/:id')
    findOne(@Param('id')id: number): Promise<Users> {
        return this.userService.findOne(id);
    }


    @Get('/:id/held')
    getHeldCoin(@Param('id')id: number): Promise<UserCoin[]> {
        return this.userService.getHeldCoin(id)
    }

    //발행한 코인 (name, ticker, description, created_at)
    @Get('/:id/create')
    getCreateCoin(@Param('id')id: number): Promise<Coins[]> {
        return this.userService.getCreateCoin(id)
    }

    //유저 등록
    @Post()
    create(
        @Body('name')name: string,
        @Body('wallet_address')wallet_address: string
    ) {
        return this.userService.create(name, wallet_address);
    }
}
