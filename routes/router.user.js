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
        errorMessage: `다음 도메인 중 하나를 선택해 주십시오.
                    (gmail, naver, kakao, daum, yahoo)`,
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

    // transporter = 이메일 전송에 사용되는 전송 객체를 나타낸다
    const transporter = nodemailer.createTransport({
      host: 'smtp.naver.com', // 이메일 호스트 = 주인 , SMTP호스트 주소를 사용해야 한다.
      port: 465, // 포트 일반적으로 25, 465, 587 중 하나를 지원한다.
      secure: true, // 보안여부
      auth: {
        // 인증정보
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        // 네이버 계정의 올바른 인증 정보를 제공해야 한다.
        user: 'inborn96', // 해당계정을 소문자로 입력해야 함
        pass: 'rnjsdbsdud00@', // 해당 계정의 비밀번호를 입력한다.
      },
    });
    // console.log(transporter);

    // async..await is not allowed in global scope, must use a wrapper
    async function main() {
      // send mail with defined transport object
      // transporter.sendMail = 이메일을 보내기 위한 메서드
      const info = await transporter.sendMail({
        from: '"동물나라👻" <foo@example.com>', // sender address : 이메일의 발신자
        to: 'inborn96@naver.com', // list of receivers : 이메일의 수신자
        subject: '이메일 인증 확인을 부탁드립니다. ✔', // Subject line : 제목
        text: '동물나라에 회원가입을 허용하시겠습니까?', // plain text body : 본문
        // html: '<b>Hello world?</b>', // html body : 본문
      });

      // info = 이메일 전송 정보 결과가 반환된 값
      // info.messageId = 전송된 메세지의 식별자
      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    }

    main().catch((err) => {
      console.log(err);
    });

    // 회원가입
    await Users.create({ email, nickname, password });
    res.status(201).json({ message: '회원가입을 축하드립니다.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errorMessage: '요청하신 데이터 형식이 올바르지 않습니다.' });
    return;
  }
});

// 이메일 인증 실험차 만든 회원탈퇴 기능
router.get('/users', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(409).json({ errorMessage: '해당 유저가 존재하지 않습니다.' });
    }
    // 프라미스 상태값은 총 3가지가 있다 = 시작, 대기, 완료
    await user.destroy();
    return res.status(200).json({ message: '회원탈퇴가 완료되었습니다.' });

    // 트라이캐치문을 사용하는 이유 = 오류 핸들링 하는 이유
    // 유저한테는 정보를 보여주면 안된다 보안 이슈
    // 그래서 트라이 캐치문을 사용해서 어떤 에러가 나더라도 우리는 유저에게 이 부분을 보여주겠다 라는 의미이다.
    // 현업에서는 에러를 기록하고 아ㅏ아아
    // 실제 에러문은 따로 저장해서 어떻ㄱ ㅔ처리를 하겠다라는 정책이 있으면은 실제와 비슷하게 운영이 가능할 것 같다.
  } catch (err) {
    console.log(err);
    return res.status(500).json({ errorMessage: '오류' });
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

// '"동물나라👻" <foo@example.com>'
// 해당 오류 메시지 "getaddrinfo ENOTFOUND inborn96@naver.com"와 추가 정보는 DNS 조회 중에 주어진 호스트를 찾을 수 없다는 것을 나타냅니다. 아래는 상세한 오류 정보의 해석입니다:

// - `errno: -3008`: 오류 번호로, `-3008`은 DNS 오류를 나타냅니다.
// - `code: 'EDNS'`: 오류 코드로, `'EDNS'`는 확장 DNS(Domain Name System) 오류를 의미합니다.
// - `syscall: 'getaddrinfo'`: 시스템 호출로, `'getaddrinfo'`는 주어진 호스트의 IP 주소를 조회하는 DNS 호출을 의미합니다.
// - `hostname: 'inborn96@naver.com'`: 조회를 시도한 호스트 이름으로, `'inborn96@naver.com'`는 주어진 이메일 주소를 호스트 이름으로 잘못 사용한 것입니다.
// - `command: 'CONN'`: 커맨드로, `'CONN'`은 연결 작업을 의미합니다.

// 해석을 종합해보면, 오류는 DNS 조회 시 "inborn96@naver.com"라는 이메일 주소를 호스트 이름으로 잘못 사용하여 DNS 서버에서 IP 주소를 찾을 수 없다는 것을 나타냅니다.

// 이 오류를 해결하기 위해 다음과 같은 단계를 수행할 수 있습니다:

// 1. 호스트 이름을 올바르게 입력했는지 확인하세요. 이메일 주소는 호스트 이름으로 사용할 수 없으며, 호스트 이름은 도메인 이름 또는 IP 주소여야 합니다.

// 2. 호스트 이름을 올바르게 입력했는지 확인하기 위해 호스트에 대한 정보를 다시 확인하고 오타가 있는지 확인하세요.

// 3. DNS 설정을 확인하세요. DNS 서버 설정이 올바르게 구성되어 있는지 확인하여 호스트 이름을 올바르게 해석할 수 있도록 해야 합니다.

// 4. 인터넷 연결이 올바르게 설정되어 있는지 확인하세요. 네트워크 연결이 안정적이고 인터넷에 액세스할 수 있는지 확인해보세요.

// 위의 단계를 확인하고 문제를 해결해보세요. 올바른 호스트 이름을 사용하고 DNS 설정이 정확하며 인터넷 연결이 정상적으로 작동한다면, 오류가 해결될 것입니다.

//  ===================== = == = = = === == = = = == = = = == = = === = =

// 이메일이 제대로 전송되지 않는 이유는 일반적으로 다음과 같은 가능성이 있습니다:

// 1. 호스트 설정 오류: `host` 필드에 'naver.com'을 사용하고 있으나, 실제로는 SMTP 호스트 주소를 사용해야 합니다. Naver의 경우 SMTP 호스트 주소를 확인하고 해당 주소를 `host` 필드에 사용해야 합니다. SMTP 호스트 주소는 보통 `smtp.naver.com` 또는 `smtp.naver.com`과 유사한 형식을 가지며, Naver 이메일 서비스 공급자에 따라 다를 수 있습니다.

// 2. 포트 설정 오류: `port` 필드에 465를 사용하고 있으나, 실제로는 Naver의 SMTP 서버가 해당 포트를 지원하는지 확인해야 합니다. SMTP 포트는 일반적으로 25, 465 또는 587 중 하나를 사용합니다. Naver의 SMTP 서버가 다른 포트를 사용하는 경우 해당 포트를 사용해야 합니다.

// 3. 인증 정보 오류: `user`와 `pass` 필드에는 Naver 이메일 계정의 올바른 인증 정보를 제공해야 합니다. `user` 필드에는 이메일 주소를 소문자로 입력하고, `pass` 필드에는 해당 계정의 비밀번호를 제공해야 합니다.

// 4. 스팸 필터 또는 보안 정책: 수신자 이메일 주소로 설정한 `inborn96@naver.com`이 스팸 필터링이나 기타 보안 정책으로 인해 메일을 받지 못할 수도 있습니다. 이 경우, 스팸함 또는 기타 이메일 필터를 확인하고, 필요한 경우 발신자 도메인을 승인 목록에 추가해야 할 수 있습니다.

// 이러한 가능성을 고려하여 위의 사항을 확인해보세요. 호스트, 포트, 인증 정보 및 스팸 필터와 관련된 문제를 해결하면 이메일이 제대로 전송될 수 있습니다.

// ==============================================

// 해당 오류 메시지 "Invalid login: 535 5.7.1 Username and Password not accepted HvoVq2O0SIioNuVQSjs-XA - nsmtp"는 로그인 정보가 잘못되어 인증이 실패했음을 나타냅니다. 아래는 상세한 오류 정보의 해석입니다:

// - `code: 'EAUTH'`: 오류 코드로, `'EAUTH'`는 인증 오류를 나타냅니다.
// - `response: '535 5.7.1 Username and Password not accepted HvoVq2O0SIioNuVQSjs-XA - nsmtp'`: 서버 응답으로, 사용자 이름과 비밀번호가 인증되지 않았음을 나타냅니다.
// - `responseCode: 535`: 응답 코드로, `535`는 인증 오류를 나타냅니다.
// - `command: 'AUTH PLAIN'`: 커맨드로, `'AUTH PLAIN'`은 인증 메커니즘으로 사용자 이름과 비밀번호를 보내는 것을 의미합니다.

// 해석을 종합해보면, 이메일 서버가 사용자 이름과 비밀번호를 인증할 수 없어 인증 오류가 발생했음을 알 수 있습니다.

// 해결 방법을 찾기 위해 다음 사항을 확인해야 합니다:

// 1. 사용자 이름과 비밀번호를 올바르게 입력했는지 확인하세요. `user` 필드에는 이메일 계정의 올바른 사용자 이름을, `pass` 필드에는 해당 계정의 비밀번호를 제공해야 합니다. 오타가 없는지 확인하고 대소문자를 정확하게 입력했는지 확인하세요.

// 2. 이메일 서비스 제공업체에서 제공하는 SMTP 호스트, 포트, 보안 설정 등을 정확하게 설정했는지 확인하세요. 서비스 제공업체의 문서 또는 지원 문서를 참조하여 올바른 설정을 확인하세요.

// 3. 이메일 서비스 제공업체에서 SMTP 인증 방법에 대한 요구 사항이 있는지 확인하세요. 예를 들어, OAuth 인증이 필요한 경우 애플리케이션에 액세스 권한을 부여하고 올바른 인증 방법을 사용해야 합니다.

// 4. 계정의 보안 설정이나 2단계 인증 설정으로 인해 액세스가 제한될 수 있습니다. 이 경우, 이메일 서비스 제공업체의 관리 대시보드에서 보안 설정을 확인하고 필요한 조치를 취하세요.

// 위의 사항을 확인하고 문제를 해결해보세요. 올바른 사용자 이름과 비밀번호, SMTP 호스트 설정, 인증 방법, 보안 설정 등을 확인하면 이메일 전송이 제대로 작동할 수 있습니다.
