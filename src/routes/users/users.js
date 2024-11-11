import { v4 as uuidv4 } from 'uuid'
import {db} from '../../db.js'

export default async function (fastify) {
    

    fastify.get("/users", (_, reply) => {
        fastify.mysql.query(
            `SELECT * FROM ${db.database}.usuarios`,
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })

    fastify.post("/users", (req, reply) => {
        fastify.mysql.query(
            `INSERT INTO ${db.database}.usuarios (cpf, nome, email, tipo, senha) VALUES (?, ?, ?, ?, ?)`, [req.body.cpf, req.body.nome, req.body.email, req.body.tipo, req.body.senha],
            function onResult(err, result) {
                
                reply.send(err || result)
            }
        )
    })

    fastify.post("/user", (req, reply) => {
        fastify.mysql.query(
            `SELECT * FROM ${db.database}.usuarios WHERE nome = ?`, [req.params.nome],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })

    
    fastify.post("/login", (req, reply) => {
        fastify.mysql.query(
            `SELECT tipo FROM ${db.database}.usuarios WHERE email = ? AND senha = ?`, [req.body.email, req.body.senha],
            function onResult(err, result) {
                if (result.length === 0) {
                    reply.code(401).send("Usuário ou senha inválidos")
                } else {
                    
                reply.code(200).send(err || result)
                }
            }
        )
    })

    
    fastify.post("/check", (req, reply) => {
        fastify.mysql.query(
            `SELECT * FROM ${db.database}.usuarios WHERE cpf = ?`, [req.body.cpf],
            function onResult(err, result) {
                if (result.length != 0) {
                    reply.code(401).send("CPF já cadastrado")
                } else {
                    reply.code(200).send("CPF disponível.")
                }
            }
        )
    })



}