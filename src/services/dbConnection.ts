import { DataSource } from "typeorm";

const myDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DATABASE,
  entities: [],
  logging: true,
  synchronize: true,
});

export default myDataSource;
