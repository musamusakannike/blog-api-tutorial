const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');

require('dotenv').config();

const middlewares = require('./middlewares');
const connectDB = require('./config/db');

const userRoutes = require('./routes/user.route')

const app = express();
connectDB()

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/users', userRoutes)


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
