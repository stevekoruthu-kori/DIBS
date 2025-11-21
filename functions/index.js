/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions/v2/options");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// IMPORT THE ZEGO TOOL
// Ensure your folder is named 'utils' and file is 'zegoServerAssistant.js'
const { generateToken04 } = require("./utils/zegoServerAssistant");

// Set global options (maxInstances helps control costs)
setGlobalOptions({ maxInstances: 10 });

// ==========================================
//  YOUR CONFIGURATION (ENTER DATA HERE)
// ==========================================
const APP_ID = 000000000;  // Replace with your Zego App ID (Must be a NUMBER, no quotes)
const SERVER_SECRET = "your_server_secret_here"; // Replace with your Zego Server Secret (Keep the quotes)

// ==========================================
//  THE TOKEN FUNCTION
// ==========================================
exports.getZegoToken = onCall((request) => {
    // 1. Check if user is logged in
    if (!request.auth) {
        throw new HttpsError(
            "unauthenticated",
            "The user must be authenticated to generate a token."
        );
    }

    // 2. Get User Details
    const userId = request.auth.uid;
    const effectiveTimeInSeconds = 3600; // Token is valid for 1 hour
    const payload = ""; 

    try {
        // 3. Generate Token
        const token = generateToken04(
            APP_ID,
            userId,
            SERVER_SECRET,
            effectiveTimeInSeconds,
            payload
        );

        logger.info(`Token generated for user: ${userId}`);

        // 4. Return to App
        return {
            token: token,
            appID: APP_ID
        };

    } catch (error) {
        logger.error("Error generating token:", error);
        throw new HttpsError("internal", "Unable to generate token");
    }
});