import type { UserWithId } from "~~/lib/auth";
import type { H3Event, H3EventContext } from "h3";

type AuthenticatedEvent = H3Event & {
  context: H3EventContext & {
    user: UserWithId;
  };
};

export default function defineAuthenciatedEventHandler<T>(handler: (event: AuthenticatedEvent) => T) {
  return defineEventHandler((event) => {
    // 调取接口时 先检查是否已登录
    if (!event.context.user) {
      return sendError(event, createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }));
    }

    return handler(event as AuthenticatedEvent);
  });
}
