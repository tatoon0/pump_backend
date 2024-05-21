import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TradeService } from './trade.service';
import { Trade } from './trade.entity';

@Controller('trade')
export class TradeController {
    constructor(private tradeService: TradeService) {}

    @Post()
    tradeCoin(
        @Body('coin_id')coin_id: number,
        @Body('user_id')user_id: number,
        @Body('type')type: string,
        @Body('amount')amount: number,
        @Body('price')price: number
    ): Promise<void> {
        return this.tradeService.tradeCoin(
            coin_id,
            user_id,
            type,
            amount,
            price
        )
    }
}
