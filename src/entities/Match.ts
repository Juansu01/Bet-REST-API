import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Event } from "./Event";

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
}
