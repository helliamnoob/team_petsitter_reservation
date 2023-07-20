const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const { Reviews, Reservations } = require('../models');

router.get('/petsitters/:petsitter_id/reviews', async (req, res) => {
  try {
    const reviews = await Reviews.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({ reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '리뷰 조회에 실패하였습니다.' });
  }
});

router.post('/petsitters/:petsitter_id/reviews', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const { petsitter_id } = req.params;
    const { content, rating } = req.body;

    const bookingConfirmation = await Reservations.findOne({ where: { User_id: user_id, Petsitter_id: petsitter_id}});

    if (!bookingConfirmation)
      return res.status(403).json({ errorMessage: '리뷰 작성 권한이 없습니다.' });
    if (!content) return res.status(412).json({ errorMessage: '내용을 입력해주세요.' });
    if (!rating) return res.status(412).json({ errorMessage: '평점을 입력해주세요.' });

    await Reviews.create({
      User_id: user_id,
      Petsitter_id: petsitter_id,
      content,
      rating,
    });

    res.status(201).json({ message: '리뷰 작성에 성공하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '리뷰 작성에 실패하였습니다.' });
  }
});

router.put('/reviews/:review_id', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const { review_id } = req.params;
    const { content, rating } = req.body;

    const review = await Reviews.findOne({ where: { review_id } });

    if (user_id !== review.User_id)
      return res.status(403).json({ errorMessage: '리뷰 수정 권한이 없습니다.' });
    if (!content) return res.status(412).json({ errorMessage: '내용을 입력해주세요.' });
    if (!rating) return res.status(412).json({ errorMessage: '평점을 입력해주세요.' });

    await Reviews.update({ content, rating }, { where: { review_id } });

    res.status(200).json({ message: '리뷰를 수정하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '리뷰 수정에 실패하였습니다.' });
  }
});

router.delete('/reviews/:review_id', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const { review_id } = req.params;

    const review = await Reviews.findOne({ where: { review_id } });

    if (user_id !== review.User_id)
      return res.status(403).json({ errorMessage: '리뷰 삭제 권한이 없습니다.' });

    await review.destroy();

    res.status(200).json({ message: '리뷰를 삭제하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '리뷰 삭제에 실패하였습니다.' });
  }
});

// test

module.exports = router;
