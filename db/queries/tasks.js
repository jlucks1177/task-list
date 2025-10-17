import db from "#db/client";

export async function createTask({ title, done, user_id }) {
  const sql = `
        INSERT INTO tasks (title, done, user_id)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
  const params = [title, done, user_id];
  const { rows } = await db.query(sql, params);
  return rows[0];
}

export async function getTasksByUserId(userId) {
  const sql = `
        SELECT *
        FROM tasks
        WHERE user_id = $1;
    `;
  const { rows } = await db.query(sql, [userId]);
  return rows;
}

export async function getTaskById(id) {
  const sql = `
        SELECT *
        FROM tasks
        WHERE id = $1;
    `;
  const { rows } = await db.query(sql, [id]);
  return rows[0];
}

export async function updateTask({ id, title, done }) {
  const sql = `
        UPDATE tasks
        SET title = $1, done = $2
        WHERE id = $3
        RETURNING *;
    `;
  const params = [title, done, id];
  const { rows } = await db.query(sql, params);
  return rows[0];
}

export async function deleteTask(id) {
  const sql = `
        DELETE FROM tasks
        WHERE id = $1
        RETURNING *;
    `;
  const { rows } = await db.query(sql, [id]);
  return rows[0];
}
