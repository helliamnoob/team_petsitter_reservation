const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const { Reviews } = require('../models');

router.get('/petsitters/:petsitterId/review', async (req, res) => {
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

router.post('/petsitters/:petsitterId/review', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { petsittersId } = req.params;
    const { content, star } = req.body;

    if (!content) return res.status(412).json({ errorMessage: '내용을 입력해주세요.' });
    if (!star) return res.status(412).json({ errorMessage: '평점을 입력해주세요.' });
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

router.put('/petsitters/:petsitterId/review/:reviewId', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { reviewId } = req.params;
    const { content, star } = req.body;

    const review = await Reviews.findOne({ where: { reviewId } });

    if (userId !== review.UserId)
      return res.status(403).json({ errorMessage: '댓글의 수정 권한이 없습니다.' });
    if (!content) return res.status(412).json({ errorMessage: '내용을 입력해주세요.' });
    if (!star) return res.status(412).json({ errorMessage: '평점을 입력해주세요.' });

    await Reviews.update({ content, star }, { where: { reviewId } });

    res.status(200).json({ message: '댓글을 수정하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '댓글 수정에 실패하였습니다.' });
  }
});

router.delete('/petsitters/:petsitterId/review/:reviewId', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { reviewId } = req.params;

    const review = await Reviews.findOne({ where: { reviewId } });

    if (userId !== review.UserId)
      return res.status(403).json({ errorMessage: '댓글의 삭제 권한이 없습니다.' });

    await review.destroy();

    res.status(200).json({ message: '댓글을 삭제하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '댓글 삭제에 실패하였습니다.' });
  }
});

// 해치웠나

module.exports = router;
