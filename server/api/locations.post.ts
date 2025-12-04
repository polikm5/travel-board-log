import type { DrizzleError } from "drizzle-orm";

import { findLocationByName, findUniqueSlug, insertLocation } from "~~/lib/db/queries/location";
import { InsertLocation } from "~~/lib/db/schema";
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
  const locationExist = await findLocationByName(result.data, event.context.user.id);
  if (locationExist) {
    return sendError(event, createError({
      statusCode: 422,
      statusMessage: "location name is already exist",
    }));
  }
  const slug = await findUniqueSlug(slugify(result.data.name));

  try {
    return await insertLocation(result.data, slug, event.context.user.id);
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
