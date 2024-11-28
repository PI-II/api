import { v4 as uuidv4 } from "uuid";
import { db } from "../../db.js";
import sql from "../../mysql.js";

export default async function (fastify) {
  fastify.get("/users", (_, reply) => {
    reply.sql`SELECT * FROM usuarios`;
  });

  fastify.post("/users", (req, reply) => {
    const { cpf, nome, email, tipo, senha } = req.body;

    reply.sql`INSERT INTO usuarios (cpf, nome, email, tipo, senha) 
              VALUES (${cpf}, ${nome}, ${email}, ${tipo}, ${senha})`;
  });

  fastify.post("/user", (req, reply) => {
    reply.sql`SELECT * FROM usuarios 
              WHERE nome = ${req.params.nome}`;
  });

  fastify.post("/login", (req, reply) => {
    reply.sql`SELECT tipo FROM usuarios 
              WHERE email = ? AND senha = ?`;
  });

  fastify.post("/checkcpf", (req, reply) => {
    const { cpf } = req.body;

    function calculo(array, peso) {
      let sum = 0;

      for (let i = 0; i < array.length; i++) {
        sum += parseInt(array[i]) * peso;
        peso--;
      }

      let digitoVerif = 11 - (sum % 11);
      return digitoVerif > 9 ? 0 : digitoVerif;
    }

    function validate(cpf) {
      let cpfVerif = 11111111111;
      for (let i = 0; i < 9; i++) {
        console.log(cpf);
        //cpfVerif = cpfVerif * i;
        console.log(cpfVerif * i);
        if (cpf == cpfVerif * i) {
          console.log("números iguais.");
          return false;
        }
      }
      let cpfArray = cpf.slice(0, 9).split("");

      let fstVerif = calculo(cpfArray, 10);

      if (parseInt(cpf[9]) !== fstVerif) {
        return false;
      }

      cpfArray.push(fstVerif);
      let sndVerif = calculo(cpfArray, 11);

      if (parseInt(cpf[10]) !== sndVerif) {
        return false;
      }

      return true;
    }

    if (validate(cpf)) {
      const res = sql`SELECT * FROM usuarios 
                      WHERE cpf = ${req.body.cpf}`;

        if (res.length != 0) {
          reply.code(401).send("CPF indisponível.");
        } else {
          reply.code(401).send("CPF disponível.");
        }
    } else {
      reply.code(401).send("CPF inválido.");
    }
  });

  fastify.post("/cpfexists", async (req, reply) => {
    const { cpf } = req.body;

    function calculo(array, peso) {
      let sum = 0;

      for (let i = 0; i < array.length; i++) {
        sum += parseInt(array[i]) * peso;
        peso--;
      }

      let digitoVerif = 11 - (sum % 11);
      return digitoVerif > 9 ? 0 : digitoVerif;
    }

    function validate(cpf) {
      if (cpf == "" || cpf == null) {
        return false;
      }
      let cpfVerif = 11111111111;
      for (let i = 0; i <= 9; i++) {
        console.log(cpf);
        //cpfVerif = cpfVerif * i;
        console.log(cpfVerif * i);
        if (cpf == cpfVerif * i) {
          console.log("números iguais.");
          return false;
        }
      }
      let cpfArray = cpf.slice(0, 9).split("");

      let fstVerif = calculo(cpfArray, 10);

      if (parseInt(cpf[9]) !== fstVerif) {
        return false;
      }

      cpfArray.push(fstVerif);
      let sndVerif = calculo(cpfArray, 11);

      if (parseInt(cpf[10]) !== sndVerif) {
        return false;
      }

      return true;
    }

    if (validate(cpf)) {
      const res = await sql`SELECT * FROM usuarios
                            WHERE cpf = ${req.body.cpf}`;

      if (res.length != 0) {
        console.log("tendo");
        return reply.send("CPF válido.");
      }
    }

    reply.code(401).send("CPF inválido.");
  });

  fastify.post("/checkemail", (req, reply) => {
    const res = sql`SELECT * FROM usuarios WHERE email = ${req.body.email}`;

    if (res.length != 0) {
      reply.code(401).send("e-mail indisponível.");
    } else {
      reply.code(200).send("e-mail disponível.");
    }
  });

  fastify.post("/searchemail", (req, reply) => {
    const res = sql`SELECT cpf FROM usuarios WHERE email = ${req.body.email}`;
    reply.send(res[0].cpf);
  });
}
