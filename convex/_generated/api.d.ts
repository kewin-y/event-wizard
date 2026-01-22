/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as event_createEvent from "../event/createEvent.js";
import type * as event_deleteEvent from "../event/deleteEvent.js";
import type * as event_getEventBySlug from "../event/getEventBySlug.js";
import type * as event_getEvents from "../event/getEvents.js";
import type * as event_isEventSlugUnique from "../event/isEventSlugUnique.js";
import type * as http from "../http.js";
import type * as storage from "../storage.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "event/createEvent": typeof event_createEvent;
  "event/deleteEvent": typeof event_deleteEvent;
  "event/getEventBySlug": typeof event_getEventBySlug;
  "event/getEvents": typeof event_getEvents;
  "event/isEventSlugUnique": typeof event_isEventSlugUnique;
  http: typeof http;
  storage: typeof storage;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
