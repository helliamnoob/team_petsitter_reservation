const express = require('express');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/router.user');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', [usersRouter]);

app.listen(PORT, HOST, () => {
    console.log('Server is listening...', PORT);
});
