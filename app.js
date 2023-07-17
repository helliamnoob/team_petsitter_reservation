const express = require('express');
const cookieParser = require('cookie-parser');

const usersRouter = require('./routes/router.user');
const reviewsRouter = require('./routes/router.review');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 서버연결 확인 완료
// app.get('/', (req, res) => {
//     console.log('연결확인');
//     return res.status(200).json({ message: '안녕' });
// });

app.use('/', [usersRouter, reviewsRouter]);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
