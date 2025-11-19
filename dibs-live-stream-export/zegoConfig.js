// ⚠️ IMPORTANT: This file provides sane defaults for local testing only.
// Never hard-code real secrets in source control. Expect to override these
// values using environment variables or by passing props into Host/Viewer.

const toBoolean = (value) => `${value}`.toLowerCase() === 'true';

export const APP_ID = Number(import.meta?.env?.VITE_ZEGO_APP_ID ?? 0);
export const SERVER_SECRET = import.meta?.env?.VITE_ZEGO_SERVER_SECRET ?? "";

// These identifiers should match the values stored for an active auction.
export const ROOM_ID = import.meta?.env?.VITE_ZEGO_ROOM_ID ?? "dibs-auction-room-1";
export const HOST_STREAM_ID = import.meta?.env?.VITE_ZEGO_HOST_STREAM_ID ?? "dibs-host-stream-1";

// ⚠️ TOKENS MUST BE FETCHED FROM BACKEND IN PRODUCTION.
// For temporary manual testing, you can place static tokens in env vars.
export const HOST_TOKEN = import.meta?.env?.VITE_ZEGO_HOST_TOKEN ?? "";
export const VIEWER_TOKEN = import.meta?.env?.VITE_ZEGO_VIEWER_TOKEN ?? "";

export const HOST_USER_ID = import.meta?.env?.VITE_ZEGO_HOST_USER_ID ?? "dibs-host";
export const VIEWER_USER_ID = import.meta?.env?.VITE_ZEGO_VIEWER_USER_ID ?? "dibs-viewer";

export const STATIC_TOKEN_MODE = toBoolean(import.meta?.env?.VITE_ZEGO_STATIC_TOKEN_MODE ?? "true");
