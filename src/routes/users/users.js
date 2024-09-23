import { v4 as uuidv4 } from 'uuid'

export default async function (fastify) {

    fastify.get("/users", (_, reply) => {
        fastify.mysql.query(
            'SELECT * FROM p2.usuarios',
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })

    fastify.post("/users", (req, reply) => {
        fastify.mysql.query(
            'INSERT INTO p2.usuarios (id_usuario, cpf, nome, email, senha) VALUES (?, ?, ?, ?, ?)', [uuidv4(), req.body.cpf, req.body.nome, req.body.email, req.body.senha],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })

    fastify.get("/users/:nome", (req, reply) => {
        fastify.mysql.query(
            "SELECT * FROM p2.usuarios WHERE nome = ?", [req.params.nome],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })

    fastify.get("/login/:email/:senha", (req, reply) => {
        fastify.mysql.query(
            "SELECT * FROM p2.usuarios WHERE email = ? AND senha = ?", [req.params.email, req.params.senha],
            function onResult(err, result) {
                if (result.length == 0) {
                    result = "Usuário não encontrado"
                }
                reply.send(err || result)

            }
        )
    })
    fastify.get("/userSessions", (_, reply) => {
        fastify.mysql.query(
            'SELECT U.cpf, U.nome, U.email, U.tipo, S.inicio, S.fim, S.usuario_presente FROM usuarios U INNER JOIN sessoes S ON U.cpf = S.usuario'),
            function onResult(err, result) {
                reply.send(err || result)
            }
    })



}