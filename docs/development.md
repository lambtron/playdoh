
# Plato: Development

If you want to work on Plato, it's structured similarly to our other Segment projects, with folders for:

  - `bin` — for the Plato CLI.
  - `client` — for the Plato theme.
  - `lib` — for the main logic that powers the CLI.
  - `support` — a place to store the built theme.
  - `test` — an example blog to test with.

To help conceptualize it: Plato is an opinionated CLI wrapper around Metalsmith. You can think of it like Jekyll, but with a built-in theme, and with GitHub pages deploying built in.

So that users only need to throw `./articles` in a folder, and then they can easily `plato deploy` to make it live.

All of the opinion happens in the [`plugins.js`](lib/build/plugins.js) file.