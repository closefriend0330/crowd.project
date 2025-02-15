/// <reference path="./.sst/platform/config.d.ts" />

import { DEFAULT_SITENAME } from '@/config';

export default $config({
  app(input) {
    return {
      name: 'coworking-party',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
    if ((!process.env.DATABASE_URL || !process.env.DATABASE_AUTH_TOKEN) && !$dev) {
      throw new Error('DATABASE_URL and DATABASE_AUTH_TOKEN are required');
    }

    if (!process.env.AUTH_SECRET) {
      throw new Error('AUTH_SECRET is required');
    }

    if (!process.env.NEXT_PUBLIC_PARTYKIT_URL) {
      throw new Error('NEXT_PUBLIC_PARTYKIT_URL is required');
    }

    if (!process.env.AUTH_DISCORD_ID || !process.env.AUTH_DISCORD_SECRET) {
      throw new Error('Missing Discord credentials: https://discord.com/developers/applications');
    }

    if (!process.env.AUTH_TWITCH_ID || !process.env.AUTH_TWITCH_SECRET) {
      throw new Error('Missing Twitch credentials: https://dev.twitch.tv/console/apps');
    }

    /////nnnvbvv

    if (!process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID && !$dev) {
      console.warn('Warning; NEXT_PUBLIC_GOOGLE_ANALYTICS_ID is not set for non dev environment');
    }

    if (!process.env.NEXT_PUBLIC_SENTRY_DSN && !$dev) {
      console.warn('Warning; NEXT_PUBLIC_SENTRY_DSN is not set for non dev environment');
    }

    if (!process.env.SENTRY_AUTH_TOKEN && !$dev) {
      console.warn('Warning; SENTRY_AUTH_TOKEN is not set for non dev environment');
    }

    new sst.aws.Nextjs('Site', {
      openNextVersion: '3.0.0-rc.16',
      domain: $dev ? undefined : process.env.SITE_DOMAIN,
      warm: parseInt(process.env.WARM || '0') || undefined,
      environment: {
        SST_STAGE: $app.stage,
        NEXT_PUBLIC_SST_STAGE: $app.stage,
        DATABASE_URL: process.env.DATABASE_URL!,
        DATABASE_AUTH_TOKEN: process.env.DATABASE_AUTH_TOKEN!,
        DATABASE_DEBUG: process.env.DATABASE_DEBUG || '',
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_DEBUG: process.env.AUTH_DEBUG || '',
        AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID || '',
        AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET || '',
        AUTH_TWITCH_ID: process.env.AUTH_TWITCH_ID || '',
        AUTH_TWITCH_SECRET: process.env.AUTH_TWITCH_SECRET || '',
        DISCORD_WEBHOOK_URL: process.env.DISCORD_WEBHOOK_URL || '',
        SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN || '',
        NEXT_PUBLIC_PARTYKIT_PROJECT: process.env.NEXT_PUBLIC_PARTYKIT_URL,
        NEXT_PUBLIC_SITENAME: process.env.NEXT_PUBLIC_SITENAME || DEFAULT_SITENAME,
        NEXT_PUBLIC_LOGGING: process.env.LOGGING || '',
        LOGGING: process.env.LOGGING || '',
        NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
        NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || '',
        NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || '',
        NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || '',
        NEXT_PUBLIC_AWAY_TIME_THRESHOLD: process.env.NEXT_PUBLIC_AWAY_TIME_THRESHOLD || '',
        NEXT_PUBLIC_MAX_UPDATE_LENGTH: process.env.NEXT_PUBLIC_MAX_UPDATE_LENGTH || '',
        NEXT_PUBLIC_MAX_TODO_ITEM_LENGTH: process.env.NEXT_PUBLIC_MAX_TODO_ITEM_LENGTH || '',
        NEXT_PUBLIC_TODO_LIST_WARNING_THRESHOLD:
          process.env.NEXT_PUBLIC_TODO_LIST_WARNING_THRESHOLD || '',
        NEXT_PUBLIC_MAX_OPEN_TODO_LIST_ITEMS:
          process.env.NEXT_PUBLIC_MAX_OPEN_TODO_LIST_ITEMS || '',
      },
    });
  },
});
