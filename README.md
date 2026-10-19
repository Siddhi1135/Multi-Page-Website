# Wanderly – Travel Website with AI Assistant

A responsive multi-page travel booking website (HTML, CSS, JavaScript) with an AI travel assistant that answers questions using the site's real destination data.

**Live demo:** https://wanderly-travel-pi.vercel.app

![Wanderly AI assistant]<img width="1535" height="778" alt="Wanderly Ai Assistant " src="https://github.com/user-attachments/assets/3afff6a3-d86a-4c79-815f-42eecd87c56b" />


## Features

- Multi-page site: Home, About, Explore, Contact, Login
- Explore page with category filters (Beach, Mountains, City, Adventure)
- Floating AI assistant on every page
- Assistant recommends only destinations Wanderly actually offers, and politely declines anything else
- Input validation and automatic retries when the AI provider is busy

## How it works

```
Visitor's browser
   |  chat-widget.js (vanilla JS)
   v
POST /api/chat        <- Vercel serverless function (api/chat.js)
   |  adds a system prompt + the destination list
   |  reads GEMINI_API_KEY from server-side environment variables
   v
Gemini API (OpenAI-compatible endpoint)
   |
   v
Reply shown in the chat window
```

The API key lives only in Vercel's environment variables. It is never in the browser code or in this repository.

## The AI approach (prompt-grounded RAG-lite)

The 8 destinations (name, category, price) are inserted into the system prompt, so the model answers from site data instead of guessing. This works for a small dataset. For a larger catalogue, the next step is embeddings and vector search, retrieving only the most relevant items per question.

## Tech stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js serverless function (ES modules) on Vercel
- LLM: Google Gemini API (free tier)
- Deployment: Vercel, auto-deployed from the `main` branch on every push

## Project structure

```
api/chat.js         serverless endpoint (prompt, validation, retries)
chat-widget.js      chat UI injected into every page
index.html, about.html, explore.html, contact.html, login.html
style.css, main.js
package.json        sets "type": "module"
```

## Run it yourself

1. Clone the repo.
2. Open the site with VS Code Live Server to see the pages and the chat button.
3. The chat only answers when deployed, because `/api/chat` needs a server. To deploy:
   - Import the repo into Vercel.
   - Add an environment variable named `GEMINI_API_KEY` with your own key from Google AI Studio.
   - Deploy.

Never commit your key. `.gitignore` already excludes `.env` files.

## What I learned

- Calling an LLM over REST and reading API error codes (404 for a retired model, 503 under load)
- Why API keys belong on a server, and how environment variables work
- Writing a system prompt and fixing a hallucination (the bot invented a "sale") by tightening it
- Serverless functions and continuous deployment with Git and Vercel

## Known limitations and next steps

- Destination data is hardcoded in `api/chat.js`
- No rate limiting yet, so heavy use could exhaust the free quota
- Replace prompt-stuffing with embeddings and vector search
- Add an evaluation set of test questions to measure answer quality
- Add conversation memory

## Author

Siddhi Mane – B.Tech ETC student · GitHub: [@Siddhi1135](https://github.com/Siddhi1135)
