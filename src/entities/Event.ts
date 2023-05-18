import { Entity, Column, OneToMany } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Bet } from "./Bet";

@Entity("event")
export class Event extends BaseClass {
  @Column()
  sport: string;

  @Column()
  match: number;

  @OneToMany(() => Bet, (bet) => bet.event)
  bets: Bet[];
}
