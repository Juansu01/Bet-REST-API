import { Entity, Column, ManyToOne } from "typeorm";

import { BaseClass } from "./BaseClass";
import { User } from "./User";

@Entity("placedbet")
export class PlacedBet extends BaseClass {
  @Column()
  user_id: number;

  @Column()
  bet_id: number;

  @Column()
  bet_option: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;
  @ManyToOne(() => User, (user) => user.placed_bets)
  user: User;
}
