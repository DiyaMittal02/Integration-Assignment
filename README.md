
# Apify Integration Assignment Web App

A sleek, modern web app that lets you:
- Authenticate with your Apify API token
- Dynamically list your actors (“bots”)
- View and fill in their input schemas (live-fetched)
- Run any actor
- Instantly view the execution results—all in a beautiful, responsive interface with dark/light modes and neon-glow accents.

> **Assignment:** This was built for the [Integration Developer Assignment – Apify Web App Challenge].

## Features

- **Secure API key entry** (never exposed to frontend JS)
- **Dynamic actor listing** (from your Apify account)
- **Live schema fetching:** Form fields generate *dynamically from actor schema*—no hardcoding.
- **One-click actor execution:** Instantly see the result in the UI.
- **Neon card UI, dark/light toggle, responsive/mobile-ready.**
- **Clear error handling** for invalid tokens, schema-less actors, or run failures.

## Demo

  
*(Include a real screenshot file if possible)*

## Quick Start

### 1. **Clone the repo**
```bash
git clone https://github.com/yourusername/apify-webapp.git
cd apify-webapp
```

### 2. **Install backend dependencies**
```bash
cd backend
npm install
```

### 3. **Start backend**
```bash
node server.js
```
This will start the server at `http://localhost:3000`.

### 4. **Open the frontend**
Open the `index.html` file (in the `/frontend` folder or in the root) in your browser directly, or use a live server extension (like the one in VS Code).

> **Note:** If you open via `file://`, most browsers will allow fetch to `localhost:3000` for local development. If you want to host the frontend via a dev server, use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) or Python's `http.server`.

## Usage

1. **Paste your Apify API token** (find it [here](https://console.apify.com/account/integrations?tab=api)).
2. **Click "Load Actors"** to fetch your available actors.
3. **Select an actor** from the dropdown list.
4. **Fill out the generated form** for that actor's schema. (*If there's no form, the actor has no input schema—try another actor.*)
5. **Click "Run Actor"** to execute the actor.
6. **View result/output** displayed instantly below the form.
7. **Switch dark/light mode** using the toggle in the card corner.

## Folder Structure

```
apify-webapp/
  backend/
    server.js      # Express backend (Node.js)
    package.json   # Backend dependencies
  frontend/
    index.html     # Main UI HTML
    app.js         # Frontend logic (vanilla JS)
    styles.css     # All modern/neon UI styles
```

> For easiest setup, you can also keep all files in a single directory and run as above.

## Advanced

- **Customize UI:** Edit `styles.css` for color themes and card layout.
- **Change backend port:** Edit `server.js` (default is 3000).
- **Actor schema:** If your own actor doesn't show a form, add a JSON schema in the Apify console for richer UI!

## Troubleshooting

- **"Failed to fetch actors":**
    - Make sure the backend (`node server.js`) is running.
    - Double-check that you pasted a valid Apify API token.
    - Actor list will be empty if the token is invalid or has no actors.
- **"Schema load failed: No input schema"**
    - This actor has no published schema. Try a different actor or update schema in Apify dashboard.
- **CORS/network errors:**  
    - Ensure backend is running on the same machine/localhost.
    - If you serve frontend via HTTP server, make sure CORS headers are enabled (built in by default).
- **Port already in use:**  
    - Change the port in `server.js` or stop other apps on port 3000.

## Customization/Extending

- You can add more features:  
    - Actor result download/export  
    - Advanced field types in the schema renderer  
    - Persist token in browser `localStorage`

## Credits

- [Apify Platform](https://apify.com)
- [Assignment inspiration](https://console.apify.com/actors)
- [Feather Icons](https://feathericons.com) for SVG

## License

This project is for demo and interview assignment purposes only.
Contact [Your Name] for other usage.

**Happy scraping! If you have any issues, [open an issue](https://github.com/yourusername/apify-webapp/issues) or reach out.**

If you want a version adapted to your folder naming or additional custom usage notes, just let me know!
