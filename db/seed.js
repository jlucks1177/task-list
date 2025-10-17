import db from "#db/client";

import { createTask } from "#db/queries/tasks";
import { createUser } from "#db/queries/users";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO
  const user = await createUser({
    username: "alice",
    password: "password123",
  });
  console.log("User created:", user);

  await createTask({
    title: "Finish SQL practice",
    done: false,
    user_id: user.id,
  });

  await createTask({
    title: "Build the Express routes",
    done: false,
    user_id: user.id,
  });

  await createTask({
    title: "Review authorization middleware",
    done: true,
    user_id: user.id,
  });

  console.log("Tasks created for user:", user.username);
}
