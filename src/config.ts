import dotenv from "dotenv";

dotenv.config();
const pathToEnv = __dirname + "/../.env";

dotenv.config({ path: pathToEnv });

const config = {
  port: process.env.PORT,
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiry: 30,
    refreshTokenExpiry: 600,
  },
  database: {
    client: process.env.DB_CLIENT,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
  },
};

export default config;
