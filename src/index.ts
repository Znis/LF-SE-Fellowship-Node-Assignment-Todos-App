import express from "express";
import cors from "cors";
import config from "./config";
import router from "./routes";
import { genericErrorHandler, notFoundError } from "./middleware/errorHandler";
import { requestLogger } from "./middleware/logger";
import helmet from "helmet";
import rateLimiter from "express-rate-limit";

const app = express();
const limiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 10,
  message: "Too many request",
});

app.use(helmet());

app.use(limiter);

const allowerdOrigins = ["https://www.test.com"];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !allowerdOrigins.includes(origin)) {
        callback(null, origin);
      } else {
        callback(new Error("Not Allowed"));
      }
    },
  })
);
app.use(express.json());

app.use(requestLogger);
app.use(router);

app.use(genericErrorHandler);
app.use(notFoundError);

app.listen(config.port, () =>
  console.log(`Server Listening at Port ${config.port}`)
);
