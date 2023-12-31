const express = require('express');
const router = express.Router();
const { Users, Reservations, Reviews } = require('../models');
const auth = require('../middlewares/auth-middleware');

// 유저의 정보와 예약내역, 리뷰내역을 조회하는 로직
router.get('/profiles', auth, async (req, res) => {
  // email, nickname, reservation
  try {
    const { user_id } = res.locals.user
    const user = await Users.findOne({
      where: { user_id },
      attributes: ['user_id', 'email', 'nickname', 'createdAt', 'updatedAt'],
    });
    const reservation = await Reservations.findAll({
      where: { User_id: user_id },
    });
    const review = await Reviews.findAll({ where: { User_id: user_id } });

    return res.status(200).json({
      message: '정보조회에 성공하였습니다.',
      userInfo: user,
      Reservations: reservation,
      Reviews: review,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '프로필 조회에 실패하였습니다.' });
  }
});
module.exports = router;
