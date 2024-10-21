

import Fastify from 'fastify';
import users from './routes/users/users.js'
import dbConnector from './conn.js'
import sessions from './routes/sessions/sessions.js';


const fastify = Fastify({
    logger: true,
})

fastify.register(dbConnector)
fastify.register(users)
fastify.register(sessions)
fastify.register(import("@fastify/cors"), {
    origin: "*"
})


fastify.get("/", (_, reply) => {
    reply.send("bogos binted 👽");
})


    fastify.listen({ port: 3000 }, err => {
        if (err) throw err
        console.log(`server listening on ${fastify.server.address().port}`)
        
      })

