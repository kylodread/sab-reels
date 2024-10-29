import { z } from "zod";
import { Hono } from "hono";
import { eq, and, desc, asc } from "drizzle-orm";
import { zValidator } from "@hono/zod-validator";

import { db } from "@/db/drizzle";
import { projects, projectsInsertSchema } from "@/db/schema";

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        page: z.coerce.number(),
        limit: z.coerce.number(),
      }),
    ),
    async (c) => {
      const { page, limit } = c.req.valid("query");

      const data = await db
        .select()
        .from(projects)
        .limit(limit)
        .offset((page - 1) * limit)
        .orderBy(
          asc(projects.isPro),
          desc(projects.updatedAt),
        );

      return c.json({ data });
    },
  )
  .delete(
    "/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const { id } = c.req.valid("param");

      const data = await db
        .delete(projects)
        .where(eq(projects.id, id))
        .returning();

      if (data.length === 0) {
        return c.json({ error: "Not found" }, 404);
      }

      return c.json({ data: { id } });
    },
  )
  .post(
    "/",
    zValidator("json", projectsInsertSchema),
    async (c) => {
      const projectData = c.req.valid("json");
      const newProject = await db.insert(projects).values(projectData);
      return c.json(newProject);
    },
  );

export default app;
