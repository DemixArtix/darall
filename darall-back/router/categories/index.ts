const express = require('express');
const passport = require('passport');
import prisma from '../../prisma/prismaInstance'
import errorHandler from "../../helpers/errorHandler";

const categories = express.Router();

categories.get('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.status(200).send({
      categories,
      success: true,
      message: 'Категории получены'
    })
  } catch (e) {
    await errorHandler(res)
  }
});

categories.post('/', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const category = await prisma.category.create({
      data: {
        title: req.body.title
      },
    })
    res.status(201).send({
      category,
      success: true,
      message: 'Категория создана'
    })
  } catch (e) {
    await errorHandler(res)
  }
});

categories.delete('/', passport.authenticate('jwt', { session: false }), async (req, res) => {

  try {
    const category = await prisma.category.delete({
      where: {
        id: Number(req.query.id)
      },
    });
    res.status(201).send({
      category,
      success: true,
      message: 'Категория удалена'
    })
  } catch (e) {
    await errorHandler(res)
  }
});



export default categories;