const express = require('express');
const { createClient } = require('redis');

const app = express();
const port = process.env.PORT || 3000;

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://redis-service:6379'
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

async function startApp() {
  try {
    await redisClient.connect();
    console.log('Connected to Redis successfully');
  } catch (err) {
    console.error('Failed to connect to Redis on startup, will retry on request', err);
  }

  app.get('/', async (req, res) => {
    try {
      if (!redisClient.isOpen) await redisClient.connect();
      const visits = await redisClient.incr('visits');
      res.status(200).send(`
        <html>
          <head><title>FoCC Lab Pro App</title></head>
          <body style="font-family: Arial; text-align: center; margin-top: 50px;">
            <h1>FoCC Lab 2 - Upgraded Web Service</h1>
            <p style="font-size: 1.5rem; color: #2e7d32;"><strong>Visitor Count:</strong> ${visits}</p>
            <p>Status: <span style="color: green;">Healthy & Connected</span></p>
          </body>
        </html>
      `);
    } catch (err) {
      res.status(500).send('<h1>Database Connection Error</h1><p>Unable to increment visitor count.</p>');
    }
  });

  app.get('/work', (req, res) => {
    const ms = parseInt(req.query.ms) || 50;
    const maxMs = Math.min(ms, 500);
    const start = Date.now();
    while (Date.now() - start < maxMs) {}
    res.status(200).json({ status: 'success', burnedMs: maxMs });
  });

  app.get('/healthz', (req, res) => {
    res.status(200).send('OK');
  });

  app.get('/ready', async (req, res) => {
    try {
      if (redisClient.isOpen) {
        await redisClient.ping();
        res.status(200).send('READY');
      } else {
        res.status(503).send('NOT READY - Redis closed');
      }
    } catch (e) {
      res.status(503).send('NOT READY');
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

startApp();
