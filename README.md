# Linda Mtoto

A local-first digital safety reporting prototype for UCC Testbed, SafeTech HackLab and Code for Humanity.

## Run

Python 3.10+, no dependencies:

```sh
python3 app.py
```

Open http://127.0.0.1:8000. Set `PORT` to change the port and `LINDA_DB` to choose the SQLite location.

## Working features

- Consent-based report creation without name, phone number or national ID.
- Category-specific safety plans; these are transparent rules, not AI predictions.
- Private retrieval using a random report ID and a separate 256-bit access key.
- Only a SHA-256 hash of the access key is stored. Keys never go into URLs or request logs.
- Evidence notes, local download and authorized deletion.
- Responsive UI with keyboard controls, accessible labels and a clear-screen action.

## Prototype limits

Use fictional examples only. This has no staffed response service and sends no reports to any organization. Data is stored locally in SQLite without application-level encryption. It is not ready for handling real safeguarding cases. Clear-screen removes visible information but does not erase browsing history or already-downloaded files.

Before a public deployment: add managed encrypted storage, HTTPS, rate limiting, retention policy, verified support pathways, safeguarding review and operator access controls. Before UCC submission: complete and evaluate its required AI component and confirm the accepted project brief. No final hackathon submission has been made.

## Verify

```sh
python3 test_app.py
```

The integration test checks consent, invalid data, unauthorized access, persistence across restarts, correct retrieval, deletion and cross-origin writes.

## License

MIT.

## Vercel AI Gateway integration

Optional AI drafts use the server-only Chat Completions endpoint. Set `AI_GATEWAY_MODEL` to a model from the live catalog and use `AI_GATEWAY_API_KEY` locally or `VERCEL_OIDC_TOKEN` on Vercel. `.env.example` documents configuration; the Python server reads exported environment variables and does not automatically load .env files.

Text is sent only after explicit consent. Use fictional examples; saved reports are never sent automatically. Output is validated and labeled AI-generated. No live generation has been verified without project credentials. Add authenticated access and rate limiting before exposing this endpoint publicly.
