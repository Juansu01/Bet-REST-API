import { Column, Entity, JoinTable, ManyToMany } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Bet } from "./Bet";

@Entity("option")
export class Option extends BaseClass {
  @Column()
  number: number;

  @Column()
  name: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  odd: number;

  @Column({
    nullable: true,
  })
  did_win: Boolean;

  @ManyToMany((type) => Bet, {
    cascade: true,
  })
  @JoinTable({
    name: "bets_options",
    joinColumn: {
      name: "option",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "bet",
      referencedColumnName: "id",
    },
  })
  bets: Bet[];
}
