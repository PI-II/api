
import fastifyPlugin from 'fastify-plugin'
import fastifyMysql from '@fastify/mysql'
import {db} from './db.js'

async function dbConnector (fastify, options) {
  fastify.register(fastifyMysql, {
    connectionString: `mysql://${db.user}:${db.password}@${db.host}`, //i'll try .env when i get home.
  })
}

export default fastifyPlugin(dbConnector)

