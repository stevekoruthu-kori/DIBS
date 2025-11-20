// ⚠️ IMPORTANT: This file provides sane defaults for local testing only.
// Never hard-code real secrets in source control. Expect to override these
// values using environment variables or by passing props into Host/Viewer.

const toBoolean = (value) => `${value}`.toLowerCase() === 'true';

export const APP_ID = 1427457804;
export const SERVER_SECRET = "adad56046aa8784f658ee83ede0cb092"; // From the screenshot provided by user

// These identifiers should match the values stored for an active auction.
export const ROOM_ID = "dibs-room"; // Matching the room ID used in the example
export const HOST_STREAM_ID = "dibs-host-stream-1";

// ⚠️ TOKENS MUST BE FETCHED FROM BACKEND IN PRODUCTION.
// For temporary manual testing, you can place static tokens in env vars.
export const HOST_TOKEN = "04AAAAAGkgC7oADGcNB39oxkpRUPM7vgC0swucofoiLZQV5sZus1tvAww/ZUkEdfvshnAYmAed/troEaRrZkycSC0h5LZZr8GoVyoDVyrkU4+4TWEGcwZf/quPU+uWGeO+yJ5q1vknwkFSDVsBf3i8nsAA+takyR4r7uvTKERrx9KmiSTtUnTlKENMR/mL1M0rUuSz/xmm5VlN4YUs2ww++Qwm2crznZgmd41oQEnmV4WElpb1PJaWZ1s4hHc4Th1Gd2YTJRqeUpNWZjW0AQ==";
export const VIEWER_TOKEN = "04AAAAAGkgC9UADB0eQ9KMt2wvjOX/0wC2wfBYcLKzy2ml6LWyAxsAwFWsxbW+xYyn6XfrG+7dPXIFrW6L34IXyNqiYFy+pmG07o+Heo6LmeSiIE5ep4E2q0KPDe8mN+d9+ZJ+c47uk7BLeeJY7CFmnl6Cyxm/oNHNFO6lySEGYHevyczhPyD6YMps4O1h0K9fpJGjqsx892ULee1kUOrK7iRrbNP7eNzOYIE+ObyriJrF9mRXR5HnF4xYa7wcVJyjwik6ZA9m1GK1MS7RChsB";

export const HOST_USER_ID = "dibs-host";
export const VIEWER_USER_ID = "dibs-viewer";

export const STATIC_TOKEN_MODE = true;
