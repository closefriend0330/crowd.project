### Coworking Party

Have fun getting stuff done.

https://coworking.party

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

Until the API key is exposed on the site under your profile settings, track down Joost and ask him for yours (seems safe, right?).

\- Joost Schuur (https://twitter.com/joostschuur, https://threads.net/@joostschuur)
