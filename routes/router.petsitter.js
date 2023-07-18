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
    const { category, keyword } = req.query;

    try {
        let searchCondition = {};

        // 카테고리가 'name'인 경우
        if (category === 'name') {
            searchCondition = {
                name: {
                    [Op.like]: `%${keyword}%`,
                },
            };
        }

        // 카테고리가 'career'인 경우
        if (category === 'career') {
            searchCondition = {
                career: {
                    [Op.gt]: parseInt(keyword),
                },
            };
        }

        const petsitters = await Petsitters.findAll({
            where: searchCondition,
        });

        res.status(200).json(petsitters);
    } catch (err) {
        console.error(err);
        res.status(500).json({ errorMessage: 'Petsitter 검색에 실패했습니다.' });
    }
});

module.exports = router;

