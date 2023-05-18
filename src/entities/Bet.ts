import { Column, Entity, ManyToOne } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Event } from "./Event";

enum BetStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  SETTLED = "settled",
}

@Entity("bet")
export class Bet extends BaseClass {
  @Column()
  result: string;

  @Column({
    type: "enum",
    enum: BetStatus,
  })
  status: string;

  @ManyToOne(() => Event, (event) => event.bets)
  event: Event;
}
