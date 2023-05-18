import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Match } from "./Match";

@Entity("team")
export class Team extends BaseClass {
  @Column()
  name: string;

  @ManyToOne(() => Match, (match) => match.teams, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "match_id" })
  match: Match;
}
