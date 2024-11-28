import { v4 as uuidv4 } from "uuid";
import { db } from "../../db.js";

export default async function (fastify) {
  fastify.get("/users", (_, reply) => {
    fastify.mysql.query(
      `SELECT * FROM ${db.database}.usuarios`,
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  fastify.post("/users", (req, reply) => {
    fastify.mysql.query(
      `INSERT INTO ${db.database}.usuarios (cpf, nome, email, tipo, senha) VALUES (?, ?, ?, ?, ?)`,
      [
        req.body.cpf,
        req.body.nome,
        req.body.email,
        req.body.tipo,
        req.body.senha,
      ],
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  fastify.post("/user", (req, reply) => {
    fastify.mysql.query(
      `SELECT * FROM ${db.database}.usuarios WHERE nome = ?`,
      [req.params.nome],
      function onResult(err, result) {
        reply.send(err || result);
      }
    );
  });

  fastify.post("/login", (req, reply) => {
    fastify.mysql.query(
      `SELECT tipo FROM ${db.database}.usuarios WHERE email = ? AND senha = ?`,
      [req.body.email, req.body.senha],
      function onResult(err, result) {
        if (result.length === 0) {
          reply.code(401).send("Usuário ou senha inválidos");
        } else {
          reply.code(200).send(err || result);
        }
      }
    );
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
      console.log(cpf);
      fastify.mysql.query(
        `SELECT * FROM ${db.database}.usuarios WHERE cpf = ?`,
        [req.body.cpf],
        function onResult(_, result) {
          if (result.length != 0) {
            reply.code(401).send("CPF indisponível.");
          } else {
            reply.code(200).send("CPF disponível.");
          }
        }
      );
    } else {
      reply.code(401).send("CPF inválido.");
    }
  });

  fastify.post("/cpfexists", (req, reply) => {
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
      console.log(cpf);
      fastify.mysql.query(
        `SELECT * FROM ${db.database}.usuarios WHERE cpf = ?`,
        [req.body.cpf],
        function onResult(_, result) {
          console.log(req.body.cpf);
          if (result.length != 0) {
            console.log("tendo");
            reply.code(200).send("CPF válido.");
          } else {
            reply.code(401).send("CPF inválido.");
          }
        }
      );
    } else {
      reply.code(401).send("CPF inválido.");
    }
  });

  fastify.post("/checkemail", (req, reply) => {
    fastify.mysql.query(
      `SELECT * FROM ${db.database}.usuarios WHERE email = ?`,
      [req.body.email],
      function onResult(_, result) {
        if (result.length != 0) {
          reply.code(401).send("e-mail indisponível.");
        } else {
          reply.code(200).send("e-mail disponível.");
        }
      }
    );
  });
}
