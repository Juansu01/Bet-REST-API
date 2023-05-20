import { ManyToOne, Column, Entity, JoinColumn } from "typeorm";

import { User } from "./User";
import { BaseClass } from "./BaseClass";

export enum TransactionCategory {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
  BET = "bet",
  WINNING = "winning",
}

@Entity("transaction")
export class Transaction extends BaseClass {
  @Column({
    type: "enum",
    enum: TransactionCategory,
  })
  category: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  amount: number;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({
    name: "user_id",
  })
  user: User;

  @Column()
  user_id: number;
}
