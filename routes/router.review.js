const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const { Reviews } = require('../models');

router.get('/petsitters/:petsitterId/review', async (req, res) => {
  try {
    const reviews = await Reviews.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '리뷰 조회에 실패하였습니다.' });
  }
});

router.post('/petsitters/:petsitterId/review', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { petsittersId } = req.params;
    const { content, star } = req.body;

    if (!content) return res.status(400).json({ errorMessage: '내용을 입력해주세요.' });
    if (!star) return res.status(400).json({ errorMessage: '평점을 입력해주세요.' });
    // 해당 펫시터 사용 경험이 없을 경우 리뷰 작성 권한이 없어야 하는데 어떤식으로 구현해야 할까요?

    await Reviews.create({
      UserId: userId,
      PetsittersId: petsittersId,
      content,
      star,
    });

    res.status(201).json({ message: '리뷰 작성에 성공하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '리뷰 작성에 실패하였습니다.' });
  }
});

module.exports = router;
