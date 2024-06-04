import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CoinService } from './coin.service';
import { Coins } from './coin.entity';
import { UserCoin } from '../user_coin/user_coin.entity';
import { Trade } from '../trade/trade.entity';

@Controller('coin')
export class CoinController {
    constructor(private coinService: CoinService) {}

    //모든 코인 정보
    //sort: created - 생성일자, funded - 시가총액, trade (디폴트) - 거래일
    //direction: asc - 오름차순, desc - 내림차순
    @Get()
    findAll(
        @Query('sort') sortBy: string,
        @Query('direction') direction: string
    ): Promise<Coins[]> {
        return this.coinService.findAll(sortBy, direction);
    }

    //특정 코인 정보
    @Get('/:id')
    findOne(@Param('id')id: number): Promise<Coins> {
        return this.coinService.findOne(id);
    }

    //홀더 정보
    @Get('/:id/holder')
    getHolder(@Param('id')id: number): Promise<UserCoin[]> {
        return this.coinService.getHolder(id);
    }

    //거래 정보
    @Get('/:id/trade')
    getTradeHistory(@Param('id') coinId: number): Promise<Trade[]> {
        return this.coinService.getTradeHistory(coinId);
    }

    //코인 정보 등록
    @Post()
    create(
        @Body('creator_id')creator_id: number,
        @Body('name')name: string,
        @Body('ticker')ticker: string,
        @Body('description')description: string,
        @Body('img_url')img_url: string
    ): Promise<number> {
        return this.coinService.create(creator_id, name, ticker, description, img_url);
    }
}