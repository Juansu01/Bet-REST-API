import { ManyToOne, Column, Entity } from "typeorm";

import { User } from "./User";
import { BaseClass } from "./BaseClass";

enum TransactionCategory {
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

  @Column({
    type: "numeric",
  })
  amount: number;

  @Column()
  status: string;

  @ManyToOne(() => User, (user) => user.transactions, {
    onDelete: "CASCADE",
  })
  user: User;
}
