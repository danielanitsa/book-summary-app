/**
 * An array of routes that are meant for authentication
 * These routes will redirect the user to these pages if not signed in or signed up
 * @type {string[]}
 */

export const authRoutes = ["/signin"];

/**
 * The prefix for API authentication rotues
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */

export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/page/1";
