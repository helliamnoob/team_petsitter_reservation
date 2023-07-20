const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const usersRouter = require('./routes/router.user');
const reviewsRouter = require('./routes/router.review');
const petsittersRouter = require('./routes/router.petsitter.js');
const reservationRouter = require('./routes/router.reservation');
const profileRouter = require('./routes/router.profile');

const HOST = '127.0.0.1';
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 서버연결 확인 완료
// app.get('/', (req, res) => {
//     console.log('연결확인');
//     return res.status(200).json({ message: '안녕' });
// });
// 루트 경로에 대한 핸들러
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'main.html'));
});

app.use('/', [usersRouter, reviewsRouter, petsittersRouter, reservationRouter, profileRouter]);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
