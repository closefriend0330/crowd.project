### Coworking Party

Have fun getting stuff done.

https://coworking.party

Very much a work in progress. Post your bugs and ideas to the [issues](https://github.com/jschuur/coworking.party/issues) and check out the [current priorities](https://github.com/users/jschuur/projects/7). [Contributions](https://github.com/jschuur/coworking.party/labels/good%20first%20issue) welcome. Especially a [logo](https://github.com/jschuur/coworking.party/issues/17).

## API

Currently, you can post a status update via the API with at least one of a free text 'update' field (up to 200 characters) or a 'status' option from the [userSelectableStatusOptions](./src/statusConfig.ts) list of options plus your 'apiKey'.

Make a POST request to `https://coworking-party-party.jschuur.partykit.dev/party/main/status` with a raw JSON body like this:

```JSON
{
    "apiKey": "YOUR API KEY HERE",
    "update": "Playing Helldivers 2!",
    "status": "gaming"
}
```

Until the API key is exposed on the site under your [profile settings](https://github.com/jschuur/coworking.party/issues/6), track down Joost and ask him for yours (seems safe, right?).

## Thanks

Big thanks to [The Claw](https://theclaw.team/) for the inspiration and being early adopters. Cool 'party' name via [Andreas](https://www.twitch.tv/andreassasdev) and [Matty](https://mattytwo.shoes/). First PR: [tdrayson](https://taylordrayson.com/).

## Tech Stack

[Next.js](https://nextjs.org), [Tailwind CSS](https://tailwindcss.com), [PartyKit](https://www.partykit.io), [Auth.js](https://authjs.dev), [Drizzle](https://orm.drizzle.team), [SST (Ion)](https://sst.dev), [AWS](https://aws.amazon.com), [Turso](https://turso.tech), [Shadcn UI](https://ui.shadcn.com) and more.

## Links

- [Project Discord](https://discord.gg/g9DtFax7Df)

\- Joost Schuur ([Threads](https://threads.net/@joostschuur), [Twitter](https://twitter.com/joostschuur))
