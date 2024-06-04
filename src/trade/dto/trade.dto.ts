import { Type } from "class-transformer";
import { IsNumber, IsString } from "class-validator";

export class TradeDto{
    @IsNumber()
    @Type(() => Number)
    coin_id: number;

    @IsNumber()
    @Type(() => Number)
    user_id: number;

    @IsString()
    type: string;

    @IsNumber()
    @Type(() => Number)
    amount: number;

    @IsNumber()
    @Type(() => Number)
    price: number;
}