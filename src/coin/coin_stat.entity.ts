import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { Coins } from './coin.entity';

@Entity()
export class CoinStat {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Coins, {lazy: true})
  @JoinColumn({name: 'coin_id'})
  coin: Coins

  @Column('decimal', { precision: 20, scale: 10, default: 10000 })
  stock: string;

  @Column('decimal', { precision: 20, scale: 10, default: 0 })
  total_funded: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  last_trade_date: Date;

  get stockNumber(): number {
    return parseFloat(this.stock);
  }

  set stockNumber(value: number) {
    this.stock = value.toString();
  }

  get total_fundedNumber(): number {
    return parseFloat(this.total_funded);
  }

  set total_fundedNumber(value: number) {
    this.total_funded = value.toString();
  }
}