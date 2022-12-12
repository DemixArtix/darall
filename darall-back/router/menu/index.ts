const express = require('express');
import prisma from '../../prisma/prismaInstance'
import errorHandler from "../../helpers/errorHandler";

const menu = express.Router();

menu.get('/', async (req, res) => {
  try {
    const menu = await prisma.category.findMany({
      include: {
        dishes: true,
      },
    });
    res.status(200).send({
      menu,
      success: true,
      message: 'Блюда получены'
    })
  } catch (e) {
    await errorHandler(res)
  }
});

export default menu;