
import fastifyPlugin from 'fastify-plugin'
import fastifyMysql from '@fastify/mysql'
import {db} from './db.js'

async function dbConnector (fastify, options) {
  fastify.register(fastifyMysql, {
    connectionString: `mysql://${db.user}:${db.password}@${db.host}`, //tried, it's in another branch! :3
  })
}

export default fastifyPlugin(dbConnector)

