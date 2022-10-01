const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const VERSION = process.env.VERSION || 'v1';
const NAME = process.env.API_NAME || 'api';
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const API_URL = process.env.API_URL || `http://${HOST}:${PORT}/${NAME}/${VERSION}`;



// Routes
const authRouter = require('./routes/auth-router');
app.use(`/${NAME}/${VERSION}/auth`, authRouter);



app.listen(PORT,HOST, () => {
    console.log(`Server is running on ${API_URL}`);
});
