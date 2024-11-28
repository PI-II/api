import { v4 as uuidv4 } from "uuid";
import { db } from "../../db.js";

function getMonday() {
  let mondayWeek = new Date(Date.now());
  let monday = mondayWeek.getDay() || 7;

  if (monday !== 1) {
    mondayWeek.setHours(-24 * (monday - 1));
  }

  let year = mondayWeek.getFullYear();
  let month = String(mondayWeek.getMonth() + 1).padStart(2, "0");
  let dayW = String(mondayWeek.getDate()).padStart(2, "0");
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
  let month = String(sundayWeek.getMonth() + 1).padStart(2, "0");
  let dayW = String(sundayWeek.getDate()).padStart(2, "0");
  var formattedSunday = `${year}-${month}-${dayW} 23:59:59`;
  return formattedSunday;
}

export default async function (fastify) {
  fastify.post("/session", (req, reply) => {
    reply.sql`INSERT INTO sessoes (inicio, usuario) 
              VALUES (${req.body.inicio}, ${req.body.usuario})`;
  });

  fastify.patch("/finish", async (req, reply) => {
    reply.sql`UPDATE ${db.database}.sessoes SET fim = ? WHERE id = ?`;
  });

  fastify.get("/sessions", (_, reply) => {
    reply.sql`SELECT *, timestampdiff(HOUR,inicio,fim) as tempo 
              FROM sessoes`;
  });

  fastify.post("/user/sessions", (req, reply) => {
    reply.sql`SELECT id, inicio, fim, TIMESTAMPDIFF(HOUR,inicio,fim) as total 
              FROM sessoes WHERE usuario = ${req.body.usuario}
              AND inicio BETWEEN ${req.body.inicio} AND ${req.body.fim} 
              GROUP BY id`;
  });

  fastify.get("/week", (req, reply) => {
    reply.sql`SELECT *, timestampdiff(HOUR,inicio,fim) as tempo 
              FROM sessoes 
              WHERE inicio BETWEEN ${getMonday()} AND ${getSunday()}`;
  });

  fastify.get("/weekSessions", (_, reply) => {
    reply.sql`SELECT usuario, SUM(timestampdiff(HOUR,inicio,fim)) as total 
              FROM sessoes 
              WHERE inicio BETWEEN ${getMonday()} AND ${getSunday()}
              GROUP BY usuario`;
  });
}
