import type { UserWithId } from "../../lib/auth";

import { auth } from "../../lib/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  // 在event.context挂载需要的数据 后面接口方便使用
  event.context.user = session?.user as unknown as UserWithId;
  if (event.path.startsWith("/dashboard")) {
    if (!session) {
      await sendRedirect(event, "/", 302);
    }
  }
});
