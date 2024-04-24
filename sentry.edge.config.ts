// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  tracesSampleRate: 1,

  environment: process.env.SST_STAGE,
  debug: false,

  beforeSend(event) {
    if (
      process.env.NODE_ENV === 'development' ||
      (event.environment && ['joostschuur', 'development'].includes(event.environment))
    )
      return null;

    return event;
  },
});
