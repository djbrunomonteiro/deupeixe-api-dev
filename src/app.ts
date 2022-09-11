import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import routes from "./routes/routes";

import dotenv from "dotenv";

dotenv.config();

class App {
  public express: express.Application;
  port = process.env.PORT;

  public constructor() {
    this.express = express();
    this.middlewares();
    this.database();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use(cors());
  }

  private database(): void {
    const DB_HOST = process.env.DB_HOST;
    const DB_PORT = process.env.DB_PORT;
    const DB_NAME = process.env.DB_NAME;

    mongoose.connect(`mongodb://${DB_HOST}:${DB_PORT}/${DB_NAME}`);

  }

  private routes(): void {
    this.express.use(routes);
  }
}

export default new App().express;

// app.get("/", (req: Request, res: Response) => {
//   res.send({ teste: "teste" });
// });

// app.listen(port, () => {
//   console.log(`run server https://localhost:${port}`);
// });
