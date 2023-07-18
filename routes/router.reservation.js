const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth-middleware');
const { Petsitters } = require('../models');
const { Reservations } = require('../models');

router.get('/reservation', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const reservation = await Reservations.findOne({ where: { UserId: userId } });

    res.status(200).json({ reservation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '예약 조회에 실패하였습니다.' });
  }
});

router.post('/petsitters/:petsitterId/reservation', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { petsitterId } = req.params;
    const { date } = req.body;
 
    if (!date) return res.status(400).json({ errorMessage: '날짜를 선택해주세요.' });

    await Reservations.create({
      UserId: userId,
      PetsitterId: petsitterId,
      date,
    });

    res.status(201).json({ message: '예약에 성공하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '예약에 실패하였습니다.' });
  }
});

router.put('/reservation/:reservationId', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { reservationId } = req.params;
    const { date } = req.body;

    const reservation = await Reservations.findOne({
      where: { reservationId },
    });

    if (userId !== reservation.UserId)
      return res.status(401).json({ errorMessage: '예약의 수정 권한이 없습니다.' });
    if (!date) return res.status(400).json({ errorMessage: '날짜를 입력해주세요.' });

    await Reservations.update(
      { date },
      { where: { reservationId } }
    );

    res.status(200).json({ message: '예약을 수정하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '예약 수정에 실패하였습니다.' });
  }
});

router.delete('/reservation/:reservationId', authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    const { reservationId } = req.params;

    const reservation = await Reservations.findOne({ where: { reservationId } });
    console.log(reservation);
    if (userId !== reservation.UserId)
      return res.status(401).json({ errorMessage: '예약의 삭제 권한이 없습니다.' });

    await reservation.destroy();

    res.status(200).json({ message: '예약을 삭제하였습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errorMessage: '예약 삭제에 실패하였습니다.' });
  }
});


module.exports = router;
