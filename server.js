const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ACTORS LIST ENDPOINT
app.post('/actors', async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ error: 'API token required.' });
    }
    try {
        const response = await fetch('https://api.apify.com/v2/acts', {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        // Uncomment to debug structure if needed
        // console.log('Apify response:', JSON.stringify(data, null, 2));

        if (data && data.data && Array.isArray(data.data.items)) {
            res.json({ data: data.data.items }); // send array for ease
        } else if (data && data.error) {
            res.status(400).json({ error: data.error.message || JSON.stringify(data.error) });
        } else {
            res.status(400).json({ error: 'Failed to fetch actors from Apify API.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error: ' + err.message });
    }
});

// ACTOR SCHEMA ENDPOINT
app.post('/schema', async (req, res) => {
    const { token, actorId } = req.body;
    if (!token || !actorId) {
        return res.status(400).json({ error: 'API token and actorId required.' });
    }
    try {
        const response = await fetch(`https://api.apify.com/v2/acts/${actorId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data && data.data?.input?.schema) {
            res.json({ inputSchema: data.data.input.schema });
        } else {
            res.status(400).json({ error: 'No input schema found for this actor.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch schema: ' + err.message });
    }
});

// RUN ACTOR ENDPOINT
app.post('/run', async (req, res) => {
    const { token, actorId, input } = req.body;
    if (!token || !actorId) {
        return res.status(400).json({ error: 'API token and actorId required.' });
    }
    try {
        const response = await fetch(
            `https://api.apify.com/v2/acts/${actorId}/run-sync`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ input })
            }
        );
        const result = await response.json();
        if (!result.error) {
            res.json({ result });
        } else {
            res.status(400).json({ error: result.error.message || JSON.stringify(result.error) });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to run actor: ' + err.message });
    }
});

// For get requests, a friendly message
app.get('/actors', (req, res) => {
    res.send('POST only. Use the web interface.');
});

app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
});
