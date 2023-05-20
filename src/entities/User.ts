import { Column, Entity, OneToMany, Unique } from "typeorm";

import { BaseClass } from "./BaseClass";
import { Transaction } from "./Transaction";
import { PlacedBet } from "./PlacedBet";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

enum UserState {
  ACTIVE = "active",
  BLOCKED = "blocked",
}

@Entity("user")
export class User extends BaseClass {
  @Column({
    type: "enum",
    enum: UserRole,
  })
  role: string;

  @Column({
    type: "enum",
    enum: UserState,
    default: "active",
  })
  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column()
  @Unique(["email"])
  email: string;

  @Column({ select: false })
  password: string;

  @Column()
  username: string;

  @Column()
  address: string;

  @Column()
  gender: string;

  @Column({
    type: "date",
  })
  birth_date: string;

  @Column()
  country_id: number;

  @Column()
  city: string;

  @Column()
  category: string;

  @Column()
  document_id: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => PlacedBet, (placed_bet) => placed_bet.user, {
    cascade: true,
  })
  placed_bets: PlacedBet[];
}
