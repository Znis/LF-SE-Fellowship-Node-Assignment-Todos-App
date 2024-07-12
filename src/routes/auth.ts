import express from "express";
import { login, refresh } from "../controller/auth";
import { validateReqBody } from "../middleware/validator";
import { loginBodySchema } from "../schema/auth";

const router = express();

router.post("/login", validateReqBody(loginBodySchema), login);
router.post("/refresh", refresh);

export default router;
