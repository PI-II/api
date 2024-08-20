export default async function (fastify) {

    fastify.get("/", (_, reply) => {
        fastify.mysql.query(
            'SELECT * FROM api_testing.usuarios',
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })

    fastify.post("/", (req, reply) => {
        fastify.mysql.query(
            'INSERT INTO api_testing.usuarios (nome, cpf, data_nascimento) VALUES (?, ?, ?)', [req.body.nome, req.body.cpf, req.body.data_nascimento],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
      })

    fastify.get("/hi", (req, reply) => {
        reply.send("💀")
    })
}