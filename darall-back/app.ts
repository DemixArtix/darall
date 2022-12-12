const express = require('express');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config()

const app = express();

app.use(morgan('combined'));

// отключение политики CORS
app.use(cors({
  credentials: true,
  origin: process.env.FRONT_ORIGIN
}));

//распарсить json
app.use(bodyParser.json());

app.use(cookieParser());

//инициализация passportjs в приложении
app.use(passport.initialize());
require('./middleware/passport')(passport);

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log('node express work on ' + port);
});



//Routes
import menu from './router/menu'
app.use(`/menu`, menu);

import categories from './router/categories'
app.use(`/categories`, categories);

import dish from './router/dish'
app.use(`/dish`, dish);

import auth from './router/auth'
app.use(`/`, auth);


