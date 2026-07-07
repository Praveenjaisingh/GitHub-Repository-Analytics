const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');

const routes = require('./routes');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const apiLimiter = require('./middleware/rateLimiter');
const logger = require('./config/logger');

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',');

app.use(helmet());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use('/api', apiLimiter, routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.status(200).json({
    status: true,
    message: 'GitHub Repository Analytics API',
    docs: '/api-docs',
  });
});

app.use((req, res) => {
  res.status(404).json({ status: false, errors: ['Route not found'] });
});

app.use(errorHandler);

module.exports = app;
