import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response, Router } from "express";
import http, { Server } from "http";

import { ProcessService } from "../processes/processService";

type WebServerConfig = {
  port: number;
  allowedOrigins: string[];
};

export class WebServer {
  private express: express.Express;
  private server: Server | undefined;
  private started = false;

  constructor(private config: WebServerConfig, private routers: Router[]) {
    this.express = this.createExpress();
    this.server = http.createServer(this.express);
    this.configureExpress(config);
    this.setupRoutes();
  }

  private createExpress() {
    return express();
  }

  private configureExpress(config: WebServerConfig) {
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      // const origin = req.headers.origin as string;
      // if (config.allowedOrigins.includes(origin)) {
      //   res.header("Access-Control-Allow-Credentials", "true");
      // }
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
      );
      res.setHeader("Access-Control-Allow-Credentials", "true");
      next();
    });

    // this.express.use(
    //   cors<Request>({
    //     origin: (origin: string | undefined, callback) => {
    //       if (config.allowedOrigins.indexOf(origin!) !== -1 || !origin) {
    //         callback(null, origin);
    //       } else {
    //         callback(new Error("Not allowed by CORS"), false);
    //       }
    //     },
    //     optionsSuccessStatus: 200,
    //   }),
    // );
    this.express.use(cors());
    this.express.options("*", cors());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(bodyParser.json());
    this.express.use(express.json());
    this.express.use(cookieParser());
  }

  private setupRoutes() {
    this.routers.forEach((router) => {
      this.express.use(router);
    });
  }

  getHttp() {
    if (!this.server) throw new Error("Server not yet started");
    return this.server;
  }

  async start(): Promise<void> {
    return new Promise((resolve, _reject) => {
      ProcessService.killProcessOnPort(this.config.port, () => {
        if (!this.server) {
        return _reject(new Error("Server not initialized"));
      }

        this.server.listen(this.config.port, () => {
          console.log(`Server is running on port ${this.config.port}`);
          this.started = true;
          resolve();
        });
      });
    });
  }

  isStarted() {
    return this.started;
  }

  async stop(): Promise<void> {
    return new Promise((resolve, _reject) => {
      if (this.server) {
        this.server.close(() => {
          this.started = false;
          resolve();
        });
      }
    });
  }
}
