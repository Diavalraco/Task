import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
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
