import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import RegionController from "./routes/region.route";
import cors from "cors";
import winston from "winston";

export const prisma = new PrismaClient();

const app = express();
app.use(cors());
const port = 8000;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

async function main() {
  app.use(express.json({limit: "20mb"}));

  // Register API routes
  app.use("/api/v1/region/", RegionController);

  // Catch unregistered routes
  app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });

  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
    logger.info("logger is running")
  });
}

main()
    .then(async () => {
      await prisma.$connect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });

export { logger };
