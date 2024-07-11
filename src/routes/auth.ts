import express from "express";
import { login, refresh } from "../controller/auth";

const router = express();

router.post("/login", login);
router.post("/refresh", refresh);

export default router;
