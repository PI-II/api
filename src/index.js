import Fastify from "fastify";
import dotenv from "dotenv";

dotenv.config();

const fastify = Fastify({
  logger: true,
});

fastify.register(import("./conn.js"));
fastify.register(import("./routes/users/users.js"));
fastify.register(import("./routes/sessions/sessions.js"));
fastify.register(import("@fastify/cors"), {
  origin: "*",
});

fastify.get("/", (_, reply) => {
  reply.send("bogos binted 👽");
});

fastify.listen({ port: process.env.PORT || 3000 }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
