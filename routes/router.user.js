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

    // 이메일 인증 로직
    // transporter = 이메일 전송을 위한 전송자
    // createTransport = 전송자를 생성해주는 메서드 / nodemailer의 옵션중 하나이다.
    const transporter = nodemailer.createTransport({
      // host: 'smtp.naver.com', // 이메일 호스트 = 주인 , SMTP호스트 주소를 사용해야 한다.
      // port: 465, // 포트 일반적으로 25, 465, 587 중 하나를 지원한다.
      // secure: true, // 보안여부

      // service 옵션 = 이메일 전송에 사용할 메일 서비스를 의미한다. naver로 설정했다면, 해당 SMTP 서버를 이용하여 메일을 전송한다는 뜻이다.
      service: 'gmail',

      // auth 옵션 = 인증에 필요한 정보를 제공해준다.
      auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        // replace뜻 = 바꿔라 , forwardemail 뜻 = 전달이메일
        // 네이버 계정의 올바른 인증 정보를 제공해야 한다.
        user: process.env.AUTH_USERNAME, // 해당계정을 소문자로 입력해야 함 // 이메일발송자의 이메일 주소
        pass: process.env.AUTH_PASSWORD, // 해당 계정의 비밀번호를 입력한다. // 이메일발송자의 이메일 비밀번호
      },
    });

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      // transporter.sendMail = 이메일을 보내기 위한 메서드
      const info = await transporter.sendMail({
        from: '동물나라👻', // sender address : 이메일의 발신자의 이메일주소 또는 이름
        to: email, // list of receivers : 이메일의 수신자의 이메일 주소
        subject: '✔ 동물나라👻 회원가입을 위한 이메일 인증단계 입니다.', // Subject line : 발송하는 이메일의 제목
        text: '동물나라에 회원가입을 진행 하시겠습니까?', // plain text body : 이메일의 본문을 일반 텍스트로 보내준다.
        // html: '<b>Hello world?</b>', // html body : 이메일의 본문을 html형식으로 보내준다.
      });

      // info = 이메일 전송 정보 결과가 반환된 값
      // info.messageId = 전송된 메세지를 식별할 수 있는 sendMail메서드의 반환값이다 = ID
      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch((err) => {
      console.log(err);
    });

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

// 로그인 페이지 띄우기
router.get('/login', (req, res) => {
  const filePath = path.join(__dirname, '../public/html/login.html');
  res.sendFile(filePath);
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
    res
      .cookie('Authorization', `Bearer ${token}`)
      .status(201)
      .json({ token, message: '로그인에 성공하셨습니다.' });
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
router.delete('/users/out', authMiddleware, async (req, res) => {
  console.log('1, hi');
  const { password, confirm } = req.body;
  const { user_id } = res.locals.user;
  const userPassword = res.locals.user.password;
  const user = await Users.findOne({ where: { user_id } });
  try {
    if (!password.trim() || !confirm.trim()) {
      console.log('2, hi');
      return res.status(412).json({ errorMessage: '비밀번호를 입력해주세요.' });
    }
    if (!user) {
      console.log('3, hi');
      return res.status(409).json({ errorMessage: '해당 유저가 존재하지 않습니다.' });
    }
    if (userPassword !== password) {
      console.log('4, hi');
      return res.status(412).json({ errorMessage: '현재 유저의 비밀번호와 일치하지 않습니다.' });
    }
    if (password !== confirm) {
      console.log('5, hi');
      return res.status(412).json({ errorMessage: '비밀번호 확인값이 일치하지 않습니다.' });
    }

    // 유저정보 지우기 코드가 끝나기 전까지 뒤에 있는 걸 진행하지 않게 하기 위해 await 붙임
    await Users.destroy({ where: { user_id } });
    console.log('6, hi');
    return res
      .clearCookie('Authorization')
      .status(200)
      .json({ message: '성공적으로 회원탈퇴가 완료되었습니다.' });
  } catch (error) {
    console.log('7, hi');
    console.error(error);
    return res.status(500).json({ errorMessage: '회원탈퇴에 실패하였습니다.' });
  }
});

module.exports = router;

// // 이메일 인증 시간 검증을 위한 dayjs 패키지
// const dayjs = require('dayjs');
// // 이메일 인증 코드를 위한 nodemailer 패키지
// const nodemailer = require('nodemailer');

// // 이메일 인증 메일 전송
// router.post('/signUp/confirm', async (req, res) => {
//   const { email } = req.body;

//   // 이메일 인증 번호 생 성
//   const AuthCode = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
//   // 생성한 이메일 인증 번호 저장
//   await AuthMails.create({
//     email,
//     authCode: AuthCode,
//   });
//   // 이메일 인증: 메일 전송
//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.admin_email, // 발송자 이메일
//       pass: process.env.admin_password, // 발송자 비밀번호
//     },
//   });
//   const main = async () => {
//     await transporter.sendMail({
//       from: 'NODEKING',
//       to: email,
//       subject: 'NODEKING 배달서비스 회원가입 이메일 인증',
//       html: `<h1>인증번호를 입력해 주세요.</h1><br><br>${AuthCode}`,
//     });
//   };
//   main();
//   res.status(201).json({ message: '인증번호가 전송되었습니다.' });
// });
// // 회원가입 api
// router.post('/signup', async (req, res) => {
//   try {
//     const { email, password, confirmPassword, nickname, userAddress, AuthCode } = req.body;
//     // 이메일 또는 닉네임 값이 비었을 때
//     if (!email || !nickname) {
//       return res.status(400).json({ message: '이메일 또는 닉네임을 입력해주세요.' });
//     }
//     // 비밀번호 또는 주소 값이 비었을 때
//     if (!password || !userAddress) {
//       return res.status(400).json({ message: '비밀번호 또는 주소를 입력해주세요.' });
//     }
//     // 닉네임 유효성
//     if (password.includes(nickname) || nickname.includes(password)) {
//       return res.status(400).json({ message: '닉네임이 패스워드에 포함될 수 없습니다.' });
//     }
//     // 비밀번호 유효성
//     if (password !== confirmPassword) {
//       return res.status(400).json({ message: '패스워드와 패스워드 확인값이 일치하지 않습니다.' });
//     }
//     const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,20}$/;
//     if (!passwordRegex.test(password)) {
//       return res
//         .status(400)
//         .json({ message: '비밀번호는 5글자 이상 20글자 이하이며 특수문자를 포함해야 합니다.' });
//     }
//     // 비밀번호 암호화
//     const hashedPassword = await bcrypt.hash(password, 10);
//     // 이메일 인증을 하지 않았을 경우
//     const isEmailValid = await AuthMails.findOne({
//       where: { email },
//       limit: 1,
//       order: [['createdAt', 'DESC']],
//     });
//     if (!isEmailValid) {
//       return res.status(400).json({ message: '이메일을 인증해 주세요.' });
//     }
//     // 이메일 인증 번호가 틀린 경우
//     const isEmailValidAuthCode = isEmailValid.authCode == AuthCode;
//     if (!isEmailValidAuthCode) {
//       return res.status(405).json({ message: '인증번호가 일치하지 않습니다. 다시 확인해 주세요.' });
//     }
//     // 이메일 인증 시간이 초과된 경우
//     const isEmailValidExpiryTime = dayjs().diff(new Date(isEmailValid.createdAt), 'm') >= 30;
//     if (isEmailValidExpiryTime) {
//       return res
//         .status(405)
//         .json({ message: '이메일 인증 시간이 초과되었습니다. 이메일 인증을 재시도 해주세요.' });
//     }
//     const newUser = await Users.create({
//       email,
//       password: hashedPassword,
//       nickname,
//       userAddress,
//     });
//     res.status(201).json({
//       message: '회원가입이 완료되었습니다. 가입 축하 1,000,000 포인트 지급되었습니다.',
//       newUser,
//     });
//   } catch (error) {
//     console.error('Error sign up:', error);
//     return res.status(500).json({ message: '회원가입에 실패했습니다.' });
//   }
// });
