/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'coworking-world',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
    };
  },
  async run() {
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

    new sst.aws.Nextjs('Site', {
      environment: {
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_DISCORD_ID: process.env.AUTH_DISCORD_ID || '',
        AUTH_DISCORD_SECRET: process.env.AUTH_DISCORD_SECRET || '',
        AUTH_TWITCH_ID: process.env.AUTH_TWITCH_ID || '',
        AUTH_TWITCH_SECRET: process.env.AUTH_TWITCH_SECRET || '',
        NEXT_PUBLIC_PARTYKIT_PROJECT: process.env.NEXT_PUBLIC_PARTYKIT_URL,
      },
    });
  },
});
