import { Column, Entity } from "typeorm";

import { BaseClass } from "./BaseClass";

@Entity("option")
export class Option extends BaseClass {
  @Column()
  number: number;

  @Column()
  name: string;

  @Column()
  odd: number;

  @Column()
  did_win: Boolean;
}
