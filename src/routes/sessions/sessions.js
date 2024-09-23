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
    // const date1 = new Date('September 21, 2024 16:30:00');
    // // Sun Dec 17 1995 03:24:00 GMT...
    
    // const date2 = new Date('2024-09-21T15:00:00');
    // // Sun Dec 17 1995 03:24:00 GMT...
    
    // const time = date1 - date2; //30 minutos
    // var minute = time / (1000 * 60);
    // var hour = time / (1000 * 60 * 60);
    // console.log("Início do treino: " + date1.toISOString());
    // console.log("Término do treino: " + date2.toISOString());
    // console.log("Duração do treino: " + minute.toString() + " minutos");
    
    // console.log("Duração do treino: " + hour.toString() + " horas");
    

}