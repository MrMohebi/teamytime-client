import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: "https://7b824d838b764fca9daa116044d8ed05@sentry.hamravesh.com/412",

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
});