const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const { Reviews } = require('../models');

router.get('/review', async (req, res) => {
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

module.exports = router;
