const express = require('express')
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRouter = require('./src/routes/auth')
const sessionRouter = require('./src/routes/sessions')

const app = express();

const whitelist = [
    'http://localhost:3000',
    'https://main.dpmnef24xg4zi.amplifyapp.com::3000'
]

app.use(
    cors({
        origin(origin, callback) {
            // allow requests with no origin
            if (!origin) return callback(null, true);
            if (whitelist.indexOf(origin) === -1) {
                const message = "The CORS policy for this origin doesn't ";
                ('allow access from the particular origin.');
                return callback(new Error(message), false);
            }
            return callback(null, true);
        },
        credentials: true,
    }),
);

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/v1/internal/', authRouter);
app.use('/v1/internal/sessions/', sessionRouter);

module.exports = app;