import { Entity, Column } from "typeorm";

import { BaseClass } from "./BaseClass";

@Entity("placedbet")
export class PlacedBet extends BaseClass {
  @Column()
  user_id: number;

  @Column()
  bet_id: number;

  @Column()
  bet_option: string;

  @Column()
  amount: number;
}
