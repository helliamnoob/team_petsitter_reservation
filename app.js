const express = require('express');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/router.user');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
    console.log('연결확인');
    return res.status(200).json({ message: '안녕' });
});

// app.use('/', [usersRouter]);

app.listen(PORT, HOST, () => {
    console.log('Server is listening...', PORT);
});
