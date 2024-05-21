import { Coins } from "src/coin/coin.entity";
import { Users } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserCoin {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Users, {lazy: true})
  @JoinColumn({name: 'user_id'})
  user: Users;

  @ManyToOne(() => Coins, {lazy: true})
  @JoinColumn({name: 'coin_id'})
  coin: Coins;

  @Column('decimal', { precision: 20, scale: 10 ,default: 0})
  amount: number;
}