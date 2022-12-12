const express = require('express');
import prisma from '../../prisma/prismaInstance'
import errorHandler from "../../helpers/errorHandler";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { generateTokens } = require('../../service/token-service');

const auth = express.Router();

auth.post('/login', async (req, res) => {
  const { login, password } = req.body;
  const candidate = await prisma.user.findUnique({
    where: {
      login,
    },
  });
  const sendError = () => {
    return res
      .status(401)
      .send({
        message: 'Неверный логин/пароль',
        success: false,
      })
  };
  if(candidate) {
    const passResult = bcrypt.compareSync(password, candidate.password);
    if(passResult) {
      const { accessToken, refreshToken } = generateTokens({
        login: candidate.login,
        userId: candidate.id,
      });

      res.status(200).
      send({
        ['access_token']: accessToken,
        ['refresh_token']: refreshToken,
        success: true,
        message: 'Авторизация прошла успешно',
      })
    } else {
      sendError();
    }
  } else {
    sendError();
  }
});

auth.post('/register', async (req, res) => {
  const { login, password } = req.body;

  const candidate = await prisma.user.findUnique({
    where: {
      login,
    },
  })

  if(candidate) {
    res
      .status(409)
      .send({
        success: false,
        message: 'Пользователь с данным login уже существует',
      })
  } else {
    const salt = bcrypt.genSaltSync(10);
    const pass = bcrypt.hashSync(password, salt);

    await prisma.user.create({
      data: {
        login,
        password: pass
      },
    })
      .then(async () => {
        res.
        status(201).
        send({
          success: true,
          message: 'User saved successfully',
        })
        await prisma.$disconnect()
      })
      .catch(async (e) => {
        await errorHandler(res)
      })
  }
});

auth.get('/refresh', async (req, res) => {

  const refreshSecretKey = process.env.REFRESH_SECRET_KEY;
  const refreshToken = req.headers['x-refresh-token'];
  try {
    jwt.verify(refreshToken, refreshSecretKey, async function(err, decoded) {
      if(err) {
        console.error(err);
        res.status(401).
        send({
          success: false,
          message: 'Неавторизованный пользователь',
        });
      }

      const { login, userId } = decoded;

      let user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      }).catch(async e => {
        await errorHandler(res)
      });

      if(user) {
        const { accessToken, refreshToken } = generateTokens({
          login, userId
        });

        res.status(200).
        send({
          ['access_token']: accessToken,
          ['refresh_token']: refreshToken,
          success: true,
          message: 'Токены обновлены',
        })
      } else {
        res.status(401).send({
          success: false,
          message: 'Пользователь не найден',
        })
      }

    });
  } catch (e) {
    await errorHandler(res)
  }

});

export default auth