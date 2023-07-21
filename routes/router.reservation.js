const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const { Petsitters } = require('../models');
const { Reservations } = require('../models');

router.get('/reservations', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const reservation = await Reservations.findAll({ where: { User_id: user_id } });

    res.status(200).json(reservation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '예약 조회에 실패하였습니다.' });
  }
});

router.post('/petsitters/:petsitter_id/reservations', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const { petsitter_id } = req.params;
    const { start_date, end_date } = req.body;

    if (!start_date || !end_date) return res.status(400).json({ errorMessage: '날짜를 선택해주세요.' });

    await Reservations.create({
      User_id: user_id,
      Petsitter_id: petsitter_id,
      start_date,
      end_date
    });

    res.status(201).json({ message: '예약에 성공하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '예약에 실패하였습니다.' });
  }
});

router.put('/reservations/:reservation_id', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const { reservation_id } = req.params;
    const { start_date, end_date } = req.body;

    const reservation = await Reservations.findOne({
      where: { reservation_id },
    });

    if (user_id !== reservation.User_id)
      return res.status(403).json({ errorMessage: '예약의 수정 권한이 없습니다.' });
    if (!start_date || !end_date ) return res.status(412).json({ errorMessage: '날짜를 입력해주세요.' });

    await Reservations.update(
      { start_date, end_date },
      { where: { reservation_id } }
    );

    res.status(200).json({ message: '예약을 수정하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '예약 수정에 실패하였습니다.' });
  }
});

router.delete('/reservations/:reservation_id', authMiddleware, async (req, res) => {
  try {
    const { user_id } = res.locals.user;
    const { reservation_id } = req.params;

    const reservation = await Reservations.findOne({ where: { reservation_id } });
    console.log(reservation);
    if (user_id !== reservation.User_id)
      return res.status(403).json({ errorMessage: '예약의 삭제 권한이 없습니다.' });

    await reservation.destroy();

    res.status(200).json({ message: '예약을 삭제하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '예약 삭제에 실패하였습니다.' });
  }
});

module.exports = router;
