
import users from './routes/users/users.js'
import Fastify from 'fastify';



const fastify = Fastify({
    logger: true,
})

fastify.register(import('@fastify/mysql'), {
    connectionString: 'mysql://root@localhost/mysql'
  })
  fastify.register(users, {
    prefix: "/users"
  });

fastify.get("/user/:name", (req, reply) => {
    fastify.mysql.query(
        'SELECT * FROM api_testing.usuarios WHERE nome=?', [req.params.name],
        function onResult (err, result) {
          reply.send(err || result)
        }
      )
    })

fastify.post("/new_session", (req, reply) => {
    fastify.mysql.query(
        'INSERT INTO api_testing.sessoes (inicio, fim, id_usuario) VALUES (?, ?, ?)', [req.body.inicio, req.body.fim, req.body.id_usuario],
        function onResult(err, result) {
            reply.send(err || result)
        }
    )
  }) 

fastify.get("/user/:id/sessions", (req, reply) => {
    fastify.mysql.query(
        'SELECT * FROM api_testing.sessoes WHERE id_usuario=?', [req.params.id], 
        function onResult(err, result) {
            reply.send(err || result)
        }
    )
 })

fastify.get("/sessions", (_, reply) => {
    fastify.mysql.query(
        'SELECT * FROM api_testing.sessoes',
        function onResult(err, result) {
            reply.send(err || result)
        }
    )
  })

    fastify.listen({ port: 3000 }, err => {
        if (err) throw err
        console.log(`server listening on ${fastify.server.address().port}`)
        
      })