const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const staticRoot = path.join(__dirname);

app.use(express.json());
app.use(express.static(staticRoot));

app.get('/api/status', (req, res) => {
    const configured = Boolean(process.env.OPENAI_API_KEY);
    res.json({
        configured,
        message: configured ? 'OpenAI API key loaded from server environment.' : 'OpenAI API key not configured on server.'
    });
});

app.post('/api/chat', async (req, res) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured on server.' });
    }

    const { messages, model, temperature, max_tokens } = req.body;

    try {
        const fetchImpl = typeof fetch !== 'undefined' ? fetch : (await import('node-fetch')).default;
        const response = await fetchImpl('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'gpt-3.5-turbo',
                messages,
                temperature,
                max_tokens
            })
        });

        const data = await response.json();
        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('OpenAI proxy error:', error);
        res.status(500).json({ error: 'Unable to reach OpenAI API.' });
    }
});

app.listen(port, () => {
    console.log(`NovaBudget server running at http://localhost:${port}`);
});
