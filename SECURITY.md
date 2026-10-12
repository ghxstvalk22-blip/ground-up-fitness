# Security

Ground Up Fitness is a static website: there is no server or database of ours to break into,
and unless someone signs in to an account, everything they log stays in their own browser.

## What protects the site

- A strict Content Security Policy on every page: scripts can only come from this site (and
  Google's Firebase files when accounts are switched on). No inline scripts are allowed.
- Everything a visitor saves is checked or escaped before it's shown, and the automatic test
  tries to inject code through saved data and links before every update goes live.
- Links that open new tabs can't control this page (`rel="noopener"`).
- No passwords or secret keys in the repo; the test scans for them.
- Accounts (when switched on) use Firebase sign-in, and `firestore.rules` lets each person reach
  only their own data.

## Found a problem?

Please don't post it publicly. Send a message through the Contact page and describe what you found.
