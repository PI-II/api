import { v4 as uuidv4 } from 'uuid'

export default async function (fastify) {

    fastify.get("/sessions", (_, reply) => {
        fastify.mysql.query(
            'SELECT * FROM p2.sessoes',
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })
    fastify.post("/sessions", (req, reply) => {
        fastify.mysql.query(
            'INSERT INTO p2.sessoes (id, inicio, fim, usuario, usuario_presente) VALUES (?, ?, ?, ?, ?)', [uuidv4(), req.body.inicio, req.body.fim, req.body.usuario, req.body.usuario_presente],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })
}