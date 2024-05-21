import { Coins } from "src/coin/coin.entity";
import { Users } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Trade {
    @PrimaryGeneratedColumn()
    trade_id: number;

    @ManyToOne(() => Coins, {lazy: true})
    @JoinColumn({name: 'coin_id'})
    coin: Coins;

    @ManyToOne(() => Users, {lazy: true})
    @JoinColumn({name: 'user_id'})
    user: Users;

    @Column()
    type: string;

    @Column('decimal', { precision: 20, scale: 10 })
    amount: number;

    @Column('decimal', { precision: 20, scale: 10 })
    price: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP '})
    trade_date: Date;
}