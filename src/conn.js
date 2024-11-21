import fastifyPlugin from "fastify-plugin";
import fastifyMysql from "@fastify/mysql";
import "dotenv/config";

const db = {
  user: process.env["DB_USER"] || "root",
  password: process.env["DB_PASS"] || "none",
  host: process.env["DB_HOST"] || "localhost",
};
async function dbConnector(fastify) {
  fastify.register(fastifyMysql, {
    connectionString: `mysql://${db.user}:${db.password}@${db.host}`,
  });
}

export default fastifyPlugin(dbConnector);
