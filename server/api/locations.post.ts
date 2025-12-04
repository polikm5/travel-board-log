import type { DrizzleError } from "drizzle-orm";

import db from "~~/lib/db";
import { InsertLocation, location } from "~~/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import slugify from "slug";

export default defineEventHandler(async (event) => {
  // 调取接口时 先检查是否已登录
  if (!event.context.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }
  // 后端做校验
  const result = await readValidatedBody(event, InsertLocation.safeParse);

  if (!result.success) {
    const statusMessage = result.error.issues.map(issue => `${issue.path.join()}: ${issue.message}`).join("; ");
    const data = result.error.issues.reduce((errorMsg, issue) => {
      errorMsg[issue.path.join()] = issue.message;
      return errorMsg;
    }, {} as Record<string, string>);
    return sendError(event, createError({
      statusCode: 422,
      statusMessage,
      data,
    }));
  }
  const locationExist = await db.query.location.findFirst({
    where: and(
      eq(location.name, result.data.name),
      eq(location.userId, event.context.user.id),
    ),
  });
  if (locationExist) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "location name is already exist",
    }));
  }
  let slug = slugify(result.data.name);

  let existing = !!(await db.query.location.findFirst({
    where: eq(location.slug, slug),
  }));
  while (existing) {
    const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvwsyz", 5);
    const idSlug = `${slug}-${nanoid()}`;
    existing = !!(await db.query.location.findFirst({
      where: eq(location.slug, idSlug),
    }));
    if (!existing) {
      slug = idSlug;
    }
  }
  try {
    const [inserted] = await db.insert(location).values({
      ...result.data,
      slug,
      userId: event.context.user.id,
    }).returning();
    return inserted;
  }
  catch (e) {
    const error = e as DrizzleError;
    console.error("INSERT ERROR", error.cause);
    return sendError(event, createError({
      statusCode: 409,
      statusMessage: (error?.cause as { message: string }).message || error.message,
    }));
  }
});
