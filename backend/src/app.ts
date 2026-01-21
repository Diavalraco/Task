import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { swaggerSpec } from './config/swagger';
import routes from './routes';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

app.get('/api-docs', (_req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HRMS API Documentation</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
  <script>
    window.onload = () => {
      SwaggerUIBundle({
        url: '/api-docs.json',
        dom_id: '#swagger-ui',
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>`;
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.get('/api-docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

app.use('/api', routes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/', (_req, res) => {
  res.json({ message: 'HRMS API is running', docs: '/api-docs' });
});

const PORT = process.env.PORT || 5000;

let isConnected = false;

const startServer = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log('Connected to MongoDB');
  }
};

if (process.env.NODE_ENV !== 'test') {
  if (process.env.VERCEL) {
    startServer();
  } else {
    startServer()
      .then(() => {
        app.listen(PORT, () => {
          console.log(`Server running on port ${PORT}`);
          console.log(`API Docs available at http://localhost:${PORT}/api-docs`);
        });
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
      });
  }
}

export default app;
