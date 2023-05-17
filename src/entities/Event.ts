import { BaseClass } from "./BaseClass";

import { Entity, Column } from "typeorm";
@Entity("event")
export class Event extends BaseClass {
  @Column()
  sport: string;

  @Column()
  match: number;
}
