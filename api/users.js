import express from "express";
import requireBody from "../middleware/requireBody.js";
import { createUser, getUserByUsername } from "../db/queries/users.js";
import { createToken } from "../utils/jwt.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

const router = express.Router();
export default router;

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const existingUser = await getUserByUsername(username);
      if (existingUser) {
        return res.status(400).send("Username already exists");
      }

      const hashedPassword = await hashPassword(password);
      const user = await createUser({ username, password: hashedPassword });
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const user = await getUserByUsername(username);
      if (!user) return res.status(401).send("Invalid username.");

      const okPassword = await comparePassword(password, user.password);
      if (!okPassword) return res.status(401).send("Invalid password.");

      const token = createToken({ id: user.id });

      res.status(200).send(token);
    } catch (err) {
      next(err);
    }
  }
);
