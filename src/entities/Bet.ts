import { Column, Entity, ManyToMany } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Option } from "./Option";

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

  @ManyToMany((type) => Option, {
    cascade: true,
  })
  options: Option[];
}
