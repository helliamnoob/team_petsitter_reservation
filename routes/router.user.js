const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const authMiddleware = require('../middlewares/auth-middleware.js');
const { Users } = require('../models');

// 회원가입 페이지 띄우기
router.get('/signup', (req, res) => {
  const filePath = path.join(__dirname, '../public/html/signup.html');
  res.sendFile(filePath);
});

// 회원가입
router.post('/signup', async (req, res) => {
  const { email, nickname, password, confirm } = req.body;
  try {
    // 이메일 양식 검증
    const emailCheck = new RegExp(
      /^[a-zA-Z0-9_.+-]+@(gmail.com|naver.com|kakao.com|daum.net|yahoo.com)$/
    );
    if (!emailCheck.test(email))
      return res.status(412).json({
        errorMessage: `(gmail, naver, kakao, daum, yahoo)다음 도메인 중 하나를 선택해 주십시오.`,
      });

    // 이메일 중복 확인
    const Email = await Users.findOne({ where: { email } });
    if (Email) return res.status(409).json({ errorMessage: '이미 존재하는 이메일 입니다.' });

    // 닉네임 형식 확인
    const nicknameCheck = /^[a-zA-Z0-9]{3,}$/.test(nickname);
    if (!nicknameCheck) {
      return res.status(412).json({
        errorMessage: '닉네임의 형식이 올바르지 않습니다.',
      });
    }

    // 닉네임 중복 확인
    const Nickname = await Users.findOne({ where: { nickname } });
    if (Nickname) {
      return res.status(409).json({
        errorMessage: '이미 존재하는 닉네임 입니다.',
      });
    }

    // 패스워드 형식 확인
    const checkPassword = new RegExp(/^[a-zA-Z0-9!@#$%^&*()]+$/);
    if (!checkPassword.test(password) || password.length < 4)
      return res.status(412).send({ errorMessage: '패스워드의 형식이 올바르지 않습니다.' });

    // 닉네임 패스워드 일치여부 확인
    if (nickname === password) {
      return res
        .status(412)
        .json({ errorMessage: '비밀번호는 nickname과 같은 값이 입력될 수 없습니다' });
    }

    // 패스워드 일치 확인
    if (password !== confirm) {
      return res.status(412).json({
        errorMessage: '패스워드가 일치하지 않습니다.',
      });
    }

    // // 이메일 인증 로직

    // // transporter = 이메일 전송에 사용되는 전송 객체를 나타낸다
    // const transporter = nodemailer.createTransport({
    //   host: 'smtp.naver.com', // 이메일 호스트 = 주인 , SMTP호스트 주소를 사용해야 한다.
    //   port: 465, // 포트 일반적으로 25, 465, 587 중 하나를 지원한다.
    //   secure: true, // 보안여부
    //   auth: {
    //     // 인증정보
    //     // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    //     // 네이버 계정의 올바른 인증 정보를 제공해야 한다.
    //     user: 'inborn96', // 해당계정을 소문자로 입력해야 함
    //     pass: 'rnjsdbsdud00@', // 해당 계정의 비밀번호를 입력한다.
    //   },
    // });
    // // console.log(transporter);

    // // async..await is not allowed in global scope, must use a wrapper
    // async function main() {
    //   // send mail with defined transport object
    //   // transporter.sendMail = 이메일을 보내기 위한 메서드
    //   const info = await transporter.sendMail({
    //     from: '"동물나라👻" <foo@example.com>', // sender address : 이메일의 발신자
    //     to: 'inborn96@naver.com', // list of receivers : 이메일의 수신자
    //     subject: '이메일 인증 확인을 부탁드립니다. ✔', // Subject line : 제목
    //     text: '동물나라에 회원가입을 허용하시겠습니까?', // plain text body : 본문
    //     // html: '<b>Hello world?</b>', // html body : 본문
    //   });

    //   // info = 이메일 전송 정보 결과가 반환된 값
    //   // info.messageId = 전송된 메세지의 식별자
    //   console.log('Message sent: %s', info.messageId);
    //   // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    // }

    // main().catch((err) => {
    //   console.log(err);
    // });

    // 프라미스 상태값은 총 3가지가 있다 = 시작, 대기, 완료

    // 회원가입
    await Users.create({ email, nickname, password });
    res.status(201).json({ message: '회원가입을 축하드립니다.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: '요청하신 데이터 형식이 올바르지 않습니다.' });
    return;
  }
});

// 로그인
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    // 유저확인
    if (!user) {
      return res.status(409).json({ errorMessage: '존재하지 않는 계정입니다.' });
    }
    // 패스워드 확인
    if (email !== user.email || password !== user.password) {
      return res.status(409).json({ errorMessage: '이메일 또는 패스워드를 확인해 주세요.' });
    }

    // jwt 생성
    const token = jwt.sign({ user_id: user.user_id }, process.env.SECRET_KEY);

    // 쿠키 생성
    res.cookie('Authorization', `Bearer ${token}`).status(201).json({ token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ errorMessage: '로그인에 실패하였습니다.' });
  }
});

// 로그아웃
router.get('/logout', authMiddleware, async (req, res) => {
  try {
    res.clearCookie('Authorization').status(200).json({ message: '로그아웃 되었습니다.' });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ errorMessage: '로그아웃에 실패하였습니다.' });
  }
});

// 회원탈퇴
router.delete('/users/:user_id', authMiddleware, async (req, res) => {
  try {
    const { user_id } = req.params;
    const loggedInId = res.locals.user.user_id;
    const userPassword = res.locals.user.password;
    const { password, confirm } = req.body;
    console.log(userPassword, password);
    console.log(user_id, loggedInId);
    const user = await Users.findOne({ where: { user_id } });
    if (!user) {
      return res.status(409).json({ errorMessage: '해당 유저가 존재하지 않습니다.' });
    }
    if (userPassword !== password) {
      return res.status(412).json({ errorMessage: '현재 유저의 비밀번호와 일치하지 않습니다.' });
    }
    if (password !== confirm) {
      return res.status(412).json({ errorMessage: '비밀번호 확인값이 일치하지 않습니다.' });
    }

    if (user_id !== String(loggedInId)) {
      return res.status(403).json({ errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.' });
    } else {
      // 유저정보 지우기       코드가 끝나기 전까지 뒤에 있는 걸 진행하지 않게 하기 위해 await 붙임
      await Users.destroy({ where: { user_id } });
      return res.status(200).json({ message: '성공적으로 회원탈퇴가 완료되었습니다.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errorMessage: '회원탈퇴에 실패하였습니다.' });
  }
});

module.exports = router;
