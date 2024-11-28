import Fastify from "fastify";
import users from "./routes/users/users.js";
import dbConnector from "./conn.js";
import sessions from "./routes/sessions/sessions.js";
import sql from "./mysql.js";

const fastify = Fastify({
  logger: true,
});

fastify.decorateReply("sql", async function (queryParts, ...values) {
    let res;
    
    try {
        res = await sql(queryParts, values);
        this.send(res);
    } catch (err) {
        this.statusCode = 500;
        console.error(queryParts.join("?"));
        this.send("Erro no sql!");
    }
});

fastify.register(dbConnector);
fastify.register(users);
fastify.register(sessions);
fastify.register(import("@fastify/cors"), {
  origin: "*",
});

fastify.get("/", (_, reply) => {
  reply.send("bogos binted 👽");
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
