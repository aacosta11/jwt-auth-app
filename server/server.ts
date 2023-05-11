import express from 'express';
import routes from './routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';

var app = express();
var port = process.env.PORT || 3000;

const whitelist = [ 'localhost:5173' ];
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
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.use('/', routes);

app.listen(port, function() {
    console.log('http://localhost:' + port);
});