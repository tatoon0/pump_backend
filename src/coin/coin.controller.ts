import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CoinService } from './coin.service';
import { Coins } from './coin.entity';

@Controller('coin')
export class CoinController {
    constructor(private coinService: CoinService) {}

    //모든 코인 정보 (name, ticker, description, created_at)
    //sort: created - 생성일자, funded - 시가총액, trade (디폴트) - 거래일
    //direction: asc - 오름차순, desc - 내림차순
    @Get()
    findAll(
        @Query('sort') sortBy: string,
        @Query('direction') direction: string
    ): Promise<Coins[]> {
        return this.coinService.findAll(sortBy, direction);
    }

    //특정 코인 정보 (name, ticker, description, created_at)
    @Get('/:id')
    findOne(@Param('id')id: number): Promise<Coins> {
        return this.coinService.findOne(id);
    }

    //코인 정보 등록
    @Post()
    create(
        @Body('creator_id')creator_id: number,
        @Body('name')name: string,
        @Body('ticker')ticker: string,
        @Body('description')description: string,
    ) {
        return this.coinService.create(creator_id, name, ticker, description);
    }
}
