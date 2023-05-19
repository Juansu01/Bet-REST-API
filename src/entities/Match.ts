import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Event } from "./Event";
import { Team } from "./Team";
import { Bet } from "./Bet";

@Entity("match")
export class Match extends BaseClass {
  @Column()
  date: Date;

  @Column({
    nullable: true,
  })
  winner: string;

  @Column({
    default: null,
    nullable: true,
  })
  event_id: number;

  @ManyToOne(() => Event, (event) => event.matches, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "event_id",
  })
  event: Event;

  @OneToMany(() => Bet, (bet) => bet.match)
  bets: Bet[];

  @OneToMany(() => Team, (team) => team.match)
  teams: Team[];
}
