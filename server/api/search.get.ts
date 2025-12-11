import type { TiandiMap } from "~~/lib/types";

import env from "~~/lib/env";
import { SearchSchema } from "~~/lib/zod-schema";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";
import sendZodError from "~~/utils/send-zod-error";

export default defineAuthenciatedEventHandler(
  defineCachedEventHandler(async (event) => {
    const result = await getValidatedQuery(event, body => SearchSchema.safeParse(body));

    if (!result.success) {
      return sendZodError(event, result.error);
    }

    try {
      const response = await fetch(`http://api.tianditu.gov.cn/v2/search?type=query&postStr={"keyWord":${result.data.q},"level":10,"mapBound":"-180,-90,180,90","queryType":1,"start":0,"count":100}&tk=${env.TIANDITU_KEY}`, {
        signal: AbortSignal.timeout(5000),
        headers: {
          "User-Agent": "nuxt-travel-log | 864423284@qq.com",
        },

      });

      if (!response.ok) {
        const json = await response.json();
        console.error(json);
        return sendError(event, createError({
          statusCode: 504,
          statusMessage: "unable to reach search API",
        }));
      }

      const data = await response.json() as TiandiMap;
      return data;
    }
    catch {
      return sendError(event, createError({
        statusCode: 500,
        statusMessage: "unable to reach search API",
      }));
    }
  }),
);
