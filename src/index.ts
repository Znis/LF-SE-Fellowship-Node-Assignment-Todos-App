import express from "express";
import cors from "cors";
import config from "./config";
import router from "./routes";
import { genericErrorHandler, notFoundError } from "./middleware/errorHandler";
import {requestLogger} from "./middleware/logger";


const app = express();

app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.use(router);

app.use(genericErrorHandler);
app.use(notFoundError);



app.listen(config.port, () =>
console.log(`Server Listening at Port ${config.port}`));



