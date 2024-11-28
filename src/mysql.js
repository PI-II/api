import mysql from "mysql2/promise";
import { DB_CONFIG } from "./env";

export const pool = mysql.createPool(DB_CONFIG);

export default async function sql(queryParts, ...values) {
  if (values.length <= 0) {
    const [res] = await pool.execute(queryParts[0]);
    return res;
  }

  const query = queryParts.join("?");

  const [res] = await pool.execute(query, values);
  return res;
}
