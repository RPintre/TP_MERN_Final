import cors from "cors";
import express from "express";
import router from "./routes";
import { ErrorMiddleware } from "./middlewares/error.middleware";

export class App {
  public app = express();

  constructor() {
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    this.app.use("/api", router);
  }

  private initializeErrorHandling(): void {
    this.app.use(ErrorMiddleware.handle);
  }
}

