const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const jwt = require('jsonwebtoken');

// 회원가입 API
router.post('/signup', async (req, res) => {
    const { email, nickname, password, confirm } = req.body;
    try {
        // 이메일 양식 검증
        const emailCheck = new RegExp(/^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/);
        if (!emailCheck.test(email))
            return res.status(412).json({ errorMessage: '이메일의 형식이 올바르지 않습니다.' });

        // 이메일 중복 확인
        const Email = await Users.findOne({ where: { email } });
        if (Email) return res.status(412).json({ errorMessage: '이미 존재하는 이메일 입니다.' });

        // 닉네임 형식 확인
        const nicknameCheck = /^[a-zA-Z0-9]{3,}$/.test(nickname);
        if (!nicknameCheck) {
            return res.status(412).json({
                errorMessage: '닉네임의 형식이 올바르지 않습니다.',
            });
        }

        // 닉네임 중복 확인
        const Nickname = await Users.findOne({ where: { nickname } });
        if (Nickname) {
            return res.status(412).json({
                errorMessage: '이미 존재하는 닉네임 입니다.',
            });
        }

        // 패스워드 형식 확인
        const checkPassword = new RegExp(/^[a-zA-Z0-9!@#$%^&*()]+$/);
        if (!checkPassword.test(password) || password.length < 4)
            return res.status(412).send({ errorMessage: '패스워드의 형식이 올바르지 않습니다.' });

        // 닉네임 패스워드 일치여부 확인
        if (nickname === password) {
            return res.status(412).json({ errorMessage: '닉네임과 패스워드가 같습니다.' });
        }

        // 패스워드 일치 확인
        if (password !== confirm) {
            return res.status(412).json({
                errorMessage: '패스워드가 일치하지 않습니다.',
            });
        }

        // 회원가입
        const user = new Users({ email, nickname, password });
        await user.save();
        res.status(201).json({ message: '회원가입을 축하드립니다.' });
    } catch (err) {
        console.log(err);
        res.status(400).json({ errorMessage: '요청하신 데이터 형식이 올바르지 않습니다.' });
        return;
    }
});

// 로그인 API
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findOne({ email });

        if (!email || password !== user.password) {
            return res.status(412).json({ errorMessage: '이메일 또는 패스워드를 확인해 주세요.' });
        }

        // jwt 생성
        const token = jwt.sign({ userId: user.userId }, 'customized-secret-key');

        // 쿠키 생성
        res.cookie('Authorization', `Bearer ${token}`).status(200).json({ token });
    } catch (error) {
        console.log(error);
        res.status(400).json({ errorMessage: '로그인에 실패하였습니다.' });
    }
});

module.exports = router;
