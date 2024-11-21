import Fastify from "fastify";
import dotenv from "dotenv";

const fastify = Fastify({
  logger: true,
});

fastify.register(import("@fastify/cors"), {
  origin: "*",
});

fastify.register(import("@fastify/cookie"));

fastify.register(import("@fastify/jwt"), {
  secret: process.env.JWT_SECRET || "abacate",
  cookie: {
    cookieName: "token",
    signed: false,
  },
});

fastify.decorateReply(
  "sendLogin",
  async function (userInfo) {
    const payload = {
      email: userInfo.email, 
      role: userInfo.role
    };

    const token = await this.jwtSign(payload);

    this.setCookie("token", token, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });

    this.header("Authorization", `Bearer ${token}`);

    return this.send({ payload });
  }
);

fastify.decorate(
  "authenticate",
  async function (req, reply) {
    try {
      await req.jwtVerify();
    } catch (err) {
      switch (err.code) {
        case "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED":
          return reply.code(403).send(err);

        default:
          return reply.code(401).send(err);
      }
    }
  }
)

fastify.register(import("./conn.js"));

fastify.register(import("./routes/users/users.js"));
fastify.register(import("./routes/sessions/sessions.js"));

fastify.get("/", (_, reply) => {
  reply.send("bogos binted 👽");
});

fastify.listen({ port: process.env.PORT || 3000 }, (err) => {
  if (err) throw err;
  console.log(`server listening on ${fastify.server.address().port}`);
});
