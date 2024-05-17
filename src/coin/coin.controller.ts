import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CoinService } from './coin.service';
import { Coins } from './coin.entity';

@Controller('coin')
export class CoinController {
    constructor(private userService: CoinService) {}

    //모든 코인 정보 (name, ticker, description, created_at)
    @Get()
    findAll(): Promise<Coins[]> {
        return this.userService.findAll();
    }

    //특정 코인 정보 (name, ticker, description, created_at)
    @Get('/:id')
    findOne(@Param('id')id: number): Promise<Coins> {
        return this.userService.findOne(id);
    }

    //코인 정보 등록
    @Post()
    create(
        @Body('creator_id')creator_id: number,
        @Body('name')name: string,
        @Body('ticker')ticker: string,
        @Body('description')description: string,
    ) {
        return this.userService.create(creator_id, name, ticker, description);
    }
}
