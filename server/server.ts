import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import apiEndpoint from './routes/apiEndpoint';
import authEndpoint from './routes/authEndpoint';
import tokenEndpoint from './routes/tokenEndpoint';
import cors from 'cors';

var app = express();
var port = process.env.PORT || 3000;

const whitelist = [ 'http://localhost:5173' ];
const corsOptions = {
    credentials: true,
    origin: function (origin: any, callback: any) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // callback(new Error('Not allowed by CORS'));
            callback(null, true);
        }
    },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use(apiEndpoint);
app.use(authEndpoint);
app.use(tokenEndpoint);

app.listen(port, function() {
    console.log('http://localhost:' + port);
});