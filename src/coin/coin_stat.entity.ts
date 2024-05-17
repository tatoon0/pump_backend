import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Coins } from './coin.entity';

@Entity()
export class CoinStat {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Coins, {lazy: true})
  @JoinColumn({name: 'coin_id'})
  coin: Coins

  @Column('decimal', { precision: 20, scale: 10, default: 10000})
  stock: number;

  @Column('decimal', { precision: 20, scale: 10, default: 0 })
  total_funded: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_trade_date: Date;
}