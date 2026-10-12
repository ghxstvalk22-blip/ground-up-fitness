# Turning on the Fitness Coach AI

Fitness Coach works without this, using its built-in rules. These steps switch it to
Claude (an AI made by Anthropic), so it can read any question and answer it like a coach.

It takes about 15 minutes. You need two free accounts: Anthropic (for the AI) and Cloudflare
(a small server that keeps your API key secret, because a website can't hide a key).

## 1. Get an Anthropic API key

1. Go to **console.anthropic.com** and sign up.
2. **Billing:** add a small amount of credit (for example $10).
3. **Limits:** set a monthly spend limit you're comfortable with (for example $20). This is
   your safety net: the coach can never cost more than this.
4. **API keys > Create key.** Name it "ground-up-coach" and copy it. Keep it private:
   never paste it into the website files, a chat, or an email.

## 2. Create the Cloudflare Worker

1. Go to **dash.cloudflare.com** and sign up (the free plan is enough: 100,000 requests a day).
2. **Workers & Pages > Create > Create Worker.** Name it `ground-up-coach`, then **Deploy**.
3. Click **Edit code**. Delete everything in the editor.
4. Open `coach-ai/worker.js` in your GitHub repo, click **Raw**, copy all of it, and paste it
   into the Cloudflare editor. Click **Deploy**.
5. Go back to the Worker's **Settings > Variables and Secrets** and add:
   - `ANTHROPIC_API_KEY`, type **Secret**, value: the key from step 1
   - `ALLOWED_ORIGINS`, type **Text**, value: `https://ghxstvalk22-blip.github.io`
   - Optional: `MODEL`, type **Text**, value `claude-haiku-5-5` for a much cheaper,
     simpler coach. Without it, the coach uses `claude-sonnet-5-5` for more detailed answers.
6. Copy the Worker's address. It looks like `https://ground-up-coach.yourname.workers.dev`.

## 3. Switch it on in the site

Send the Worker address to Claude (or edit it yourself):
- In `script.js`, set `const COACH_AI_URL = "https://ground-up-coach.yourname.workers.dev";`
- On every HTML page, add that address to `connect-src` in the `Content-Security-Policy` tag.

## What it costs

You pay Anthropic for each answer. With `claude-sonnet-5-5` (about $2 per million tokens (word pieces)
in and $10 per million out), a typical answer costs around one cent. `claude-haiku-5-5` costs
about one twentieth of that. Cloudflare's free plan covers the server.

## Safety and privacy

- The key lives only in Cloudflare's secret settings, never in the website.
- Only your site can use the Worker, each visitor is limited to about 12 messages a minute,
  and answers are capped in length. Your spend limit caps the total.
- The coach sends only what's typed in the chat (and the site's list of exercises and plans).
  Logs, records, and settings stay on each person's phone.
- The coach's rules are in `worker.js` (`SYSTEM`): mainstream advice for healthy adults,
  doctor or physical therapist for pain, registered dietitian for eating plans, no
  supplements beyond the basics, nothing for under-18s. Pain and under-18 questions are
  still answered by the built-in safety replies without going to the AI at all.
