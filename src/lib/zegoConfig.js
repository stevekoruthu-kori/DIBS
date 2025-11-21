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
export const HOST_TOKEN = "04AAAAAGkhreUADPZAFiEjiQZwCmUpYACz2UFpjg4ScptFa+iRn5v8e+Vvf7osT1TfB5qh0r2l5/EhG3vuxSx50mmsc3DY+3QVVYcLm9ZiAS81Qq+iqBtU5LST+s73QyQR37ucP9V6LANTow7YpNJcV7hC1geKcx+XcYiWLMo5TMdPfVyTF7CVeCEiJbfBJLo2gyxI1pE+E6TlTZ5ouTQMtPYP8Z7zEavYqUJgIdDp0g7NnsJbpPLbFmLdr+JI/T/siuz6lEY4+8erDJAB";
export const VIEWER_TOKEN = "04AAAAAGkhrgcADNmVpnNQ0tVhpxO3rQC2SWLrGHlnhIWLqRHtIFl3o0UXLXg3cNs09RK3A8tCOLtKMmXVYCn89wJCqD/NKx4Qp0hNHnrHDuAIGKcEUWgvaV3hajyInhR6JPWVokiS7UnPi1uNF3wKAcSKJMJOrmITzqbz6b7H8oZv4Q2rOgsW8ssRZFDi5SAnbLk1eANzTe2lrtKbVk8yBEiIAagQJ5YJG2d3tdg3X//iJCEZR+Te45ScsxT+VSS7KdD4MprRCOMljHTkhLMB";
export const HOST_USER_ID = "dibs-host";
export const VIEWER_USER_ID = "dibs-viewer";

export const STATIC_TOKEN_MODE = true;
