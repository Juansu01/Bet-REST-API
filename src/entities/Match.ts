import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Event } from "./Event";
import { Team } from "./Team";

@Entity("match")
export class Match extends BaseClass {
  @Column()
  date: Date;

  @Column()
  winner: string;

  @ManyToOne(() => Event, (event) => event.matches, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "event_id",
  })
  event: Event;

  @OneToMany(() => Team, (team) => team.match)
  teams: Team[];
}
