import fastifyPlugin from "fastify-plugin";
import fastifyMysql from "@fastify/mysql";

import { DB_CONFIG } from "./env";

async function dbConnector(fastify, options) {
  fastify.register(fastifyMysql, {
    connectionString: `mysql://${DB_CONFIG.user}:${DB_CONFIG.password}@${DB_CONFIG.password.host}`,
  });
}

export default fastifyPlugin(dbConnector);
