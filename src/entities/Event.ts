import { Entity, Column, OneToMany } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Match } from "./Match";

@Entity("event")
export class Event extends BaseClass {
  @Column()
  sport: string;

  @OneToMany(() => Match, (match) => match.event)
  matches: Match[];
}
