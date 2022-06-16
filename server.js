const http = require('http');
const useMongodb = require("./modules/useMongodb")
const usePlayer = require('./modules/usePlayer')
const useGame = require('./modules/useGame')

const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const { connectDB } = useMongodb()
const { createGame, appendGame } = useGame()
connectDB()

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next()
})

// set the view engine to ejs
app.set('view engine', 'ejs')

// Routes which should handle requests
app.use("/", require('./controllers'))

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);
console.log(`🚀 Server ready at http://localhost:${port}`);