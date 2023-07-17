const { Users } = require('../models');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const { Authorization } = req.cookies;
    const [authType, authToken] = (Authorization ?? '').split(' ');

    // 토큰 확인
    if (authType !== 'Bearer' || !authToken) {
        return res.status(403).json({ errorMessage: '로그인이 필요한 기능입니다.' });
    }

    // 토큰 유효성 검사
    try {
        const { userId } = jwt.verify(authToken, 'customized-secret-key');
        const user = await Users.findOne({ userId });

        res.locals.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(403).json({ errorMessage: '확인한 쿠키에서 오류가 발생하였습니다.' });
    }
};
