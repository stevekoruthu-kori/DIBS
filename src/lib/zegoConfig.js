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
export const HOST_TOKEN = "04AAAAAGke6DcADIEmFY/LyXgLPxi8SwC0QY3MqBetsXukDegzaWSO5Aolpx1r+jBQH4J6bIstLbLaQ2u6jsSD5Dxal+ipsdmMUMPR2DcLTjb1W6dlmUoONfRvTqr7h3aXKBQUP1zSB42+XCcZWA7X/CLvtlzNpEcMvgHj2jdKfp+FbcCV/Vdt8+TkY91tALBYtqQHIPQtQELmSuKvaZWg9CQFOJVm4RyuM6qntnMuyjzW5VDGL9toiFpXlkGdzWMM6waB3WT1nJH5O/1yAQ==";
export const VIEWER_TOKEN = "04AAAAAGke9dwADIP5xfshe3C8OsKvjAC1qmf2vRNRTy6NRDat3pCacAWFA1RvzVIkQ6jqab8aGVusTEc1nM74HzgQWnTZCwzbOwro/3oIL3En3X2nsj5T/cBgmUaYGmKyvsORIAXb5wvLRdMrnP52KTQ1dsTQags5FIHbZdSxgWSmVw1UUQ+9ZIuG9FVFYjQW3MiyI+0YXaCzq+aTqrlJxnhZezsLySlQZv9Xxw3+M9ssz21ikZWgOCVpMt7WOlrfMNBP0admG/mScAzp6AE=";

export const HOST_USER_ID = "dibs-host";
export const VIEWER_USER_ID = "dibs-viewer";

export const STATIC_TOKEN_MODE = true;
