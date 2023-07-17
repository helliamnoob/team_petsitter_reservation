const express = require('express');
const router = express.Router();
const { Petsitters } = require('../models');
const { Op } = require('sequelize');

// 펫시터 조회 API
router.get('/petsitters', async (req, res) => {
    try {
        const petsitters = await Petsitters.findAll();
        res.status(200).json(petsitters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: 'Petsitter 조회에 실패했습니다.' });
    }
});

// Petsitter 검색 API
router.get('/petsitters/search', async (req, res) => {
    const { carrer } = req.query;

    try {
        const petsitters = await Petsitters.findAll({
            where: {
                carrer: {
                    [Op.gt]: carrer // Op.gt를 사용하여 career보다 큰 데이터를 찾음
                }
            }
        });
        res.status(200).json(petsitters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: 'Petsitter 검색에 실패했습니다.' });
    }
});

module.exports = router;
