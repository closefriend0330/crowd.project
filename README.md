### Coworking Party

Have fun getting stuff done.

https://coworking.party

Very much a work in progress. Post your bugs and ideas to the [issues](https://github.com/jschuur/coworking.party/issues) and check out the [current priorities](https://github.com/users/jschuur/projects/7). [Contributions](https://github.com/jschuur/coworking.party/labels/good%20first%20issue) welcome. Especially a [logo](https://github.com/jschuur/coworking.party/issues/17).

## API

Currently, you can post a status update via the API with at least one of a free text 'update' field (up to 200 characters) or a 'status' option from the [userSelectableStatusOptions](./src/statusOptions.ts) list of options plus your 'apiKey'.

Make a POST request to `https://coworking-party-party.jschuur.partykit.dev/party/main/status` with a raw JSON body like this:

```JSON
{
    "apiKey": "YOUR API KEY HERE",
    "update": "Playing Helldivers 2!",
    "status": "gaming"
}
```

Until the API key is exposed on the site under your [profile settings](https://github.com/jschuur/coworking.party/issues/6), track down Joost and ask him for yours (seems safe, right?).

## Local Development

If you're looking to contribute or just want to try running this locally, here's a quick setup guide:

1. Clone the repo and install the dependencies. Note that some of the scripts in `package.json` have explicit references to [pnpm](https://pnpm.io) that you may wish to adjust if you use a different package manager.
2. Create a `.env` file in the root of the project based on the `.env.example` file and adjust the secrets as needed.
3. Create a free [Turso](https://turso.tech/) account, [install the CLI](https://docs.turso.tech/cli/introduction), run `turso auth login` and initialise the local database with `pnpm run db:migrate`. Local development uses a [local](https://docs.turso.tech/local-development) Turso dev instance. The `DATABASE_URL` secret already points to http://127.0.0.1:8080 (no auth token needed for local dev).
4. [PartyKit](https://docs.partykit.io/) should not require an account for local development, but create a new `partykit.json` file in the root of the project based on `partykit.example.json`.
5. Create a [Twitch app](https://dev.twitch.tv/console/apps) and [Discord app](https://discord.com/developers/applications/) and define the respective `AUTH_` secrets in the `.env` file. You could use just one and modify the `providers` in `src/authConfigEdge.ts` accordingly. Also add a random `AUTH_SECRET`.
6. Configure the OAuth callback URLs for the Twitch and Discord apps to point to `http://localhost:3000/api/auth/callback/twitch` and `http://localhost:3000/api/auth/callback/discord` respectively on their dev portals.

Configuring additional third party services (Posthog, Google Analytics, Sentry, Discord webhook URL etc) is optional. The app will run gracefully without them.

### Running Coworking Party Locally

[SST Ion](https://ion.sst.dev/) is used to deploy the app to AWS. The default `pnpm run dev` script also uses SST for [live](https://ion.sst.dev/docs/live/) mode during local development, which would require a [configured AWS account](https://docs.sst.dev/setting-up-aws) and the [3.0 sst CLI](https://ion.sst.dev/docs/reference/cli/) installed.

For local development, you can skip SST and needing an AWS account by running `pnpm run dev-nosst` instead. This launches Next.js with the regular `next dev` command, along with all the other local services (Turso, PartyKit, etc).

The local Next.js app will be at http://localhost:3000/, a local [Drizzle Studio](https://orm.drizzle.team/drizzle-studio/overview) instance to manage the database at https://local.drizzle.studio/ and the PartyKit instance at port 1999. This means you can hit http://localhost:1999/party/main/debug e.g. to see the PartyKit debug endpoint.

Join the [#dev channel](https://discord.com/channels/1236966373549150218/1236966426070482975) on the Discord or start an [issue](https://github.com/jschuur/coworking.party/issues) for further help.

## Thanks

Big thanks to [The Claw](https://theclaw.team/) for the inspiration and being early adopters. Cool 'party' name via [Andreas](https://www.twitch.tv/andreassasdev) and [Matty](https://mattytwo.shoes/). First PR: [tdrayson](https://taylordrayson.com/), additional contributions from [DR-DinoMight](https://github.com/DR-DinoMight).

## Tech Stack

[Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [PartyKit](https://www.partykit.io), [Auth.js](https://authjs.dev), [Drizzle](https://orm.drizzle.team), [SST (Ion)](https://sst.dev), [AWS](https://aws.amazon.com), [Turso](https://turso.tech), [Shadcn UI](https://ui.shadcn.com) and more.

## Links

- [Project Discord](https://discord.gg/g9DtFax7Df)

\- Joost Schuur ([Threads](https://threads.net/@joostschuur), [Twitter](https://twitter.com/joostschuur))

```

```
