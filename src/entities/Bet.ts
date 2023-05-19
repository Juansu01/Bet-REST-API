import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { BaseClass } from "./BaseClass";
import { Option } from "./Option";
import { Event } from "./Event";
import { Match } from "./Match";

export enum BetStatus {
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

  @Column()
  match_id: number;

  @ManyToOne(() => Match, (match) => match.bets, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "match_id",
  })
  match: Match;

  @ManyToMany((type) => Option, {
    cascade: true,
  })
  options: Option[];
}
