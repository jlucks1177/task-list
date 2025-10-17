import express from "express";
import requireBody from "../middleware/requireBody.js";
import requireUser from "../middleware/requireUser.js";
import getUserFromToken from "../middleware/getUserFromToken.js";
import {
  createTask,
  getTasksByUserId,
  updateTask,
  deleteTask,
  getTaskById,
} from "../db/queries/tasks.js";

const router = express.Router();
export default router;

router.post(
  "/",
  getUserFromToken,
  requireUser,
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const { title, done } = req.body;
      const user_id = req.user.id;

      const task = await createTask({ title, done, user_id });
      res.status(201).send(task);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/", getUserFromToken, requireUser, async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const tasks = await getTasksByUserId(user_id);
    res.status(200).send(tasks);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  getUserFromToken,
  requireUser,
  requireBody(["title", "done"]),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const { title, done } = req.body;

      const task = await getTaskById(id);
      if (!task) return res.status(404).send("Task not found.");
      if (task.user_id !== req.user.id)
        return res.status(403).send("Not authorized to update tasks");

      const updatedTask = await updateTask({ id, title, done });
      res.status(200).send(updatedTask);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", getUserFromToken, requireUser, async (req, res, next) => {
  try {
    const id = req.params.id;

    const task = await getTaskById(id);
    if (!task) return res.status(404).send("Task not found.");
    if (task.user_id !== req.user.id)
      return res.status(403).send("Not authorized to delete tasks");

    await deleteTask(id);
    res.status(204).send("Task Deleted!");
  } catch (err) {
    next(err);
  }
});
