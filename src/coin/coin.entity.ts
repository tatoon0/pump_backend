import { Users } from "src/user/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { CoinStat } from "./coin_stat.entity";

@Entity()
export class Coins {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Users, {lazy: true})
    @JoinColumn({name: 'creator_id'})
    creator: Users;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 10 })
    ticker: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @OneToOne(() => CoinStat, { lazy: true })
    @JoinColumn({name: 'coinstat_id'})
    coinStat: CoinStat;
}