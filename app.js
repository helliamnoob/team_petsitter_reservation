const express = require('express');
const { WebSocketServer } = require('ws');
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

// 웹소켓 서버 생성
const wss = new WebSocketServer({ port: 3001 });

wss.broadcast = (message) => {
  wss.clients.forEach((client) => {
    client.send(message);
  });
};

wss.on('connection', (ws, request) => {
  wss.broadcast(`새로운 유저가 접속했습니다. 현재 유저 ${wss.clients.size} 명`);
  ws.on('message', (data) => {
    wss.broadcast(data.toString());
  });

  ws.on('close', () => {
    wss.broadcast(`유저 한명이 떠났습니다. 현재 유저 ${wss.clients.size} 명`);
  });
});

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

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.get('/reservation', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'reservation.html'));
});

app.get('/petsitters/id=:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'psdetail.html'));
});

app.get('/reservation/id=:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'psdetail.html'));
});

// 프로필 조회 화면 띄우는 코드
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'profile.html'));
});

app.use('/', [usersRouter, reviewsRouter, petsittersRouter, reservationRouter, profileRouter]);

app.listen(PORT, HOST, () => {
  console.log('Server is listening...', PORT);
});
