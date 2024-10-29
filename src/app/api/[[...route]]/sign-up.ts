import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const app = new Hono().post("/", async (c) => {
  const { name, email, password } = await c.req.json();

  const query = await db.select().from(users).where(eq(users.email, email))

  if (query[0]) {
    return c.json({ error: "Email already in use" }, 400);
  }

  
  await db.insert(users).values({
    email,
    name,
    password, // Assuming plain password is acceptable
  });

  return c.json(null, 200);
});

export default app;
