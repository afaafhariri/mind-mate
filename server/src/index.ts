import "dotenv/config";
import express, { Express, Request } from "express";
import http from "http";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolver";
import { logger } from "./utils/logger";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  const app: Express = express();
  const httpServer = http.createServer(app);

  // Initialize Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Mount GraphQL middleware
  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }: { req: Request }) => ({ req }),
    })
  );

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: PORT }, resolve)
  );
  logger.info(`🚀 Server ready at http://localhost:${PORT}/graphql`);
};

startServer().catch((err) => {
  logger.error("Error starting server:", err);
});
