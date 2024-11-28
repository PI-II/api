import { v4 as uuidv4 } from "uuid";
import { db } from "../../db.js";

function getMonday() {
  let mondayWeek = new Date(Date.now());
  let monday = mondayWeek.getDay() || 7;
  if (monday !== 1) {
    mondayWeek.setHours(-24* (monday - 1));
  }
  let year = mondayWeek.getFullYear();
  let month = String(mondayWeek.getMonth() + 1).padStart(2, '0');
  let dayW = String(mondayWeek.getDate()).padStart(2,'0');
  var formattedMonday = `${year}-${month}-${dayW} 00:00:00`;

  return formattedMonday;
}
function getSunday() {
  let sundayWeek = new Date(Date.now());
  let sunday = sundayWeek.getDay();
  if (sunday != 0) {
    sundayWeek.setHours(-24 * (sunday - 7));
  }
  let year = sundayWeek.getFullYear();
  let month = String(sundayWeek.getMonth() + 1).padStart(2, '0');
  let dayW = String(sundayWeek.getDate()).padStart(2,'0');
  var formattedSunday = `${year}-${month}-${dayW} 23:59:59`;
  return formattedSunday;
}

export default async function (fastify) {
  /*fastify.post("/users/sessions", (req, reply) => {
        fastify.mysql.query(
            `SELECT usuarios.cpf, usuarios.nome, usuarios.email, usuarios.tipo, sessoes.inicio, sessoes.fim FROM ${db.database}.usuarios INNER JOIN ${db.database}.sessoes ON sessoes.usuario = usuarios.cpf WHERE usuarios.nome = ?`, [req.body.nome],
            function onResult(err, result) {
                reply.send(err || result)
            }
        )
    })*/

  fastify.post("/session", (req, reply) => {
    fastify.mysql.query(
      `INSERT INTO ${db.database}.sessoes (inicio, usuario) VALUES (?, ?)`,
      [req.body.inicio, req.body.usuario],
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  fastify.patch("/finish", (req, reply) => {
    fastify.mysql.query(
      `UPDATE ${db.database}.sessoes SET fim = ? WHERE id = ?`,
      [req.body.fim, req.body.id],
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  fastify.get("/sessions", (_, reply) => {
    fastify.mysql.query(
      `SELECT *, timestampdiff(HOUR,inicio,fim) as tempo FROM ${db.database}.sessoes`,
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  fastify.post("/user/sessions", (req, reply) => {
    fastify.mysql.query(
      `SELECT id, inicio, fim, TIMESTAMPDIFF(HOUR,inicio,fim) as total FROM ${db.database}.sessoes WHERE usuario = ? AND inicio BETWEEN ? AND ? GROUP BY id`,
      [req.body.usuario, req.body.inicio, req.body.fim],
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  fastify.get("/week", (req, reply) => {
    fastify.mysql.query(
      `SELECT *, timestampdiff(HOUR,inicio,fim) as tempo FROM ${db.database}.sessoes 
      WHERE inicio BETWEEN ? AND ?`,
      [getMonday(),getSunday()],
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  })

  fastify.get("/weekSessions", (_, reply) => {
    fastify.mysql.query(
      `SELECT usuario, SUM(timestampdiff(HOUR,inicio,fim)) as total FROM ${db.database}.sessoes 
      WHERE inicio BETWEEN ? AND ? GROUP BY usuario`,
      [getMonday(), getSunday()],
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  })

}
