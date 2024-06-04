import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { TradeService } from './trade.service';
import { Trade } from './trade.entity';
import { TradeDto } from './dto/trade.dto';

@Controller('trade')
export class TradeController {
  constructor(private tradeService: TradeService) {}

  //코인 거래
  @Post()
  @UsePipes(new ValidationPipe({transform: true}))
  tradeCoin(@Body() tradeDto: TradeDto): Promise<void> {
    return this.tradeService.tradeCoin(tradeDto);
  }
}