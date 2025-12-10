import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";
import sendZodError from "~~/utils/send-zod-error";
import z from "zod";

const searchSchema = z.object({
  q: z.string().min(1),
});

export default defineAuthenciatedEventHandler(async (event) => {
  const result = await getValidatedQuery(event, body => searchSchema.safeParse(body));

  if (!result.success) {
    return sendZodError(event, result.error);
  }

  try {
    const response = await fetch(` https://nominatim.openstreetmap.org/search?q=${result.data.q}&format=json`, {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "nuxt-travel-log | 864423284@qq.com",
      },
    });

    if (!response.ok) {
      return sendError(event, createError({
        statusCode: 504,
        statusMessage: "unable to reach search API",
      }));
    }

    const data = await response.json();
    return data;
  }
  catch {
    return sendError(event, createError({
      statusCode: 500,
      statusMessage: "unable to reach search API",
    }));
  }
});
