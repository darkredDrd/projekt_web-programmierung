import Fastify from "fastify";
import cors from "@fastify/cors";
import dbConnector from "./database/database.js";

const fastify = Fastify({ logger: true });

// CORS integration to improve security for Frontend
fastify.register(cors, {
    origin: (origin, cb) => {
        const allowedOrigins = ['http://localhost:3000', 'http://localhost:4200'];
        if (!origin || allowedOrigins.includes(origin)) {
            cb(null, true);
        } else {
            cb(new Error('Not allowed by CORS'));
        }
    }
});

fastify.register(dbConnector);

try {
    await fastify.listen({ port: 8080 });
} catch (err) {
    fastify.log.error(err);
    process.exit(1);
}