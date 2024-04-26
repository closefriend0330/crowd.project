import * as Sentry from '@sentry/nextjs';

// https://docs.sentry.io/platforms/javascript/guides/nextjs/
Sentry.init({
  dsn: process.env.PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SST_STAGE,
  tracesSampleRate: 1,
  debug: false,
});
