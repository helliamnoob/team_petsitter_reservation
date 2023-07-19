const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const auth = require('../middlewares/auth-middleware');

router.get('/profile/:user_id', auth, async (req, res) => {
  // email, nickname, reservation
  try {
    const { user_id } = req.params;
    const user = await Users.findOne({ where: { user_id } });
    return res.status(200).json({ msg: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '프로필 조회에 실패하였습니다.' });
  }
});
module.exports = router;
