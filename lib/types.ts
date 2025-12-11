import type { UserWithId } from "./auth";

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: UserWithId;
  }
}

export type LatLongItem = {
  lat: number;
  long: number;
};

export type MapPoints = {
  id: number | string;
  name: string;
  description?: string | null;

} & LatLongItem;

export type SearchData = {
  id: string;
  name: string;
  address?: string | null;

} & LatLongItem;
export type TiandiMap = {
  area: Area;
  pois: Pois;
};

export type Area = {
  level: string;
  name: string;
  adminCode: number;
  lonlat: string;
};
export type Pois = {
  address: string;
  hotPointID: string;
  lonlat: string;
  name: string;
}[];
