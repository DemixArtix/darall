const express = require('express');
const passport = require('passport');
import prisma from '../../prisma/prismaInstance'
import errorHandler from "../../helpers/errorHandler";

const dish = express.Router();


dish.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const list = await prisma.category.findMany({
      orderBy: {
        id: 'desc',
      },
      include: {
        dishes: {
          orderBy: {
            id: 'desc',
          },
        },
      },
    });
    res.status(200).send({
      list,
      success: true,
      message: 'Блюда получены'
    })
  } catch (e) {
    await errorHandler(res)
  }
});

dish.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const dish = await prisma.dish.create({
      data: {
        name: req.body.name,
        categoryId: req.body.categoryId
      },
    })
    res.status(201).send({
      dish,
      success: true,
      message: 'Блюдо добавлено'
    })
  } catch (e) {
    await errorHandler(res)
  }
});

dish.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const category = await prisma.dish.delete({
      where: {
        id: Number(req.query.id)
      },
    });
    res.status(201).send({
      category,
      success: true,
      message: 'Блюдо удалено'
    })
  } catch (e) {
    await errorHandler(res)
  }
});



export default dish;