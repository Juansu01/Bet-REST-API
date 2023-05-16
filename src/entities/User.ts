import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "enum",
    enum: UserRole,
  })
  role: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

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
}
