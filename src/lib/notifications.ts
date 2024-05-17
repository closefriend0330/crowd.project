import { newUserAdjectives } from '@/config';
import { getUserAccounts } from '@/db/queries';
import { capitaliseFirst, debug } from '@/lib/utils';

import { User } from '@/lib/types';

export async function newUserNotification(user: User) {
  const [account] = await getUserAccounts(user.id);
  const { provider, providerAccountId } = account || {};

  const randomAdjective = newUserAdjectives[Math.floor(Math.random() * newUserAdjectives.length)];
  let message = `A new ${randomAdjective} user has joined the party 🎉: `;

  if (provider) {
    if (provider === 'twitch')
      message += `${user.name} (via Twitch: <https://twitch.tv/${user.name}>)`;
    else if (provider === 'discord') message += `<@${providerAccountId}> (via Discord)`;
    else message += `${user.name} (via ${capitaliseFirst(account.provider)}`;
  } else {
    debug('No provider found for new user announcement to Discord', {
      name: user.name,
      userId: user.id,
      providerAccountId,
    });
  }

  await discordNotification(message);
}

export async function discordNotification(message: string) {
  if (!process.env.DISCORD_WEBHOOK_URL)
    debug('No DISCORD_WEBHOOK_URL set, skipping Discord notification.');
  else {
    const webhookUrls = process.env.DISCORD_WEBHOOK_URL.split(',');

    for (const url of webhookUrls) {
      debug('Sending Discord notification:', { message, url });

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: message }),
      });
    }
  }
}
