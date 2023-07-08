import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from "typeorm";

import { BaseClass } from "./BaseClass";
import { Option } from "./Option";
import { Match } from "./Match";

export enum BetStatus {
  ACTIVE = "active",
  CANCELLED = "cancelled",
  SETTLED = "settled",
}

@Entity("bet")
export class Bet extends BaseClass {
  @Column({
    nullable: true,
  })
  result: string;

  @Column({
    type: "enum",
    enum: BetStatus,
    default: "active",
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
    onDelete: "CASCADE",
  })
  @JoinTable({
    name: "bets_options",
    joinColumn: {
      name: "bet",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "option",
      referencedColumnName: "id",
    },
  })
  options: Option[];
}
