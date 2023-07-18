const { Users } = require('../models');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const { Authorization } = req.cookies;
  const [authType, authToken] = (Authorization ?? '').split(' ');

  // 토큰 유효성 확인
  if (authType !== 'Bearer' || !authToken) {
    return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
  }

  // 시크릿키 일치 검증
  try {
    const { user_id } = jwt.verify(authToken, process.env.SECRET_KEY);
    const user = await Users.findOne({ where: { user_id } });

    res.locals.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ errorMessage: '확인한 쿠키에서 오류가 발생하였습니다.' });
  }
};
