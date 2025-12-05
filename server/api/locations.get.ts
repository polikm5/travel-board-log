import { findLocations } from "~~/lib/db/queries/location";
import defineAuthenciatedEventHandler from "~~/utils/define-authenticated-event-handler";

export default defineAuthenciatedEventHandler(async (event) => {
  const locations = await findLocations(event.context.user.id);
  return locations;
});
