import { findLocations } from "~~/lib/db/queries/location";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenciatedEventHandler(async (event) => {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const locations = await findLocations(event.context.user.id);
  return locations;
});
