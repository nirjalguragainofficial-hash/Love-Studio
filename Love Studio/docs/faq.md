# FAQ

## General

**Q: Is Love Studio free?**
A: Yes, Love Studio is completely free and open source under the MIT license. You just need your own free Groq API key to run it.

**Q: What data does Love Studio collect?**
A: Love Studio stores all your data locally in your browser's `localStorage`. We do not send your chat history, journal entries, or companion configuration to any central database.

**Q: Can I use Love Studio offline?**
A: The chat feature requires an active internet connection to reach the Groq API. However, you can still read and write journal entries offline since they are stored locally.

**Q: Which browsers are supported?**
A: Love Studio works best in modern Chromium-based browsers (Chrome, Edge, Brave) and Firefox. Voice input via the Web Speech API has the widest support in Chrome/Edge. Safari has partial support.

## API & Setup

**Q: Where do I get a Groq API key?**
A: Sign up for free at [console.groq.com](https://console.groq.com), create a new API key from the dashboard, and paste it into `server/.env` as `GROQ_API_KEY=your_key_here`.

**Q: I see a "rate limit" error — what does that mean?**
A: The built-in server enforces a limit of **10 requests per IP per minute** to protect against abuse. If you hit it during normal use, wait 60 seconds and try again. You can adjust the limit in `server/index.js`.

**Q: Can I change which Groq model Love Studio uses?**
A: Yes. Open `server/index.js`, find the `model` field in the Groq API call, and replace it with any model available in your Groq account (e.g., `llama3-70b-8192`).

## Companion & Journal

**Q: How do I reset my companion and start over?**
A: Open your browser's developer tools (`F12`), go to **Application → Local Storage**, and delete the `loveStudio_companion` key. On your next visit you will be taken back to the onboarding flow.

**Q: Is there a limit to how many journal entries I can save?**
A: There is no hard limit enforced by the app, but `localStorage` has a browser-imposed limit of roughly **5 MB** per origin. If you write very lengthy entries over a long time you may eventually see a storage warning.

**Q: Can I export my journal entries?**
A: Not yet — this is planned for a future release. In the meantime you can manually copy your entries, or export the raw JSON from `localStorage` via the browser developer tools.

**Q: How do I change my companion's name or personality after onboarding?**
A: Click the **⚙️ Settings** icon in the chat header. From there you can update the companion's name, avatar, vibe, and voice without losing your chat history.

**Q: Can I backup my Love Studio data?**
A: Currently, you can manually backup your data by exporting the `loveStudio_*` keys from your browser's Local Storage. A more robust backup feature is planned for the future.
