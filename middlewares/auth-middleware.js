const { Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  // req.cookies에서 Authorization라는 이름의 쿠키를 꺼냄
  const { Authorization } = req.cookies;
  // Authorization쿠키를 띄어쓰기 기준으로 쪼개서 authType과 authToken 두가지로 할당
  const [authType, authToken] = (Authorization ?? '').split(' ');

  // 토큰 유효성 확인
  // 토큰 쪼갠게 앞이 bearer이거나 뒤가 없으면 403으로 반환    !authToken은 authToken이 없다
  if (authType !== 'Bearer' || !authToken) {
    return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
  }

  // 시크릿키 일치 검증
  try {
    const { user_id } = jwt.verify(authToken, process.env.SECRET_KEY);
    const user = await Users.findOne({ where: { user_id } });

    // 할당된 유저를 res.locals.user에 할당
    res.locals.user = user;
    // req와 res를 꼭붙들고 다음 미들웨어로 진행
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ errorMessage: '확인한 쿠키에서 오류가 발생하였습니다.' });
  }
};
