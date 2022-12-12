"use strict";
exports.__esModule = true;
var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var morgan = require('morgan');
require('dotenv').config();
var app = express();
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
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('node express work on ' + port);
});
//Routes
var menu_1 = require("./router/menu");
app.use("/menu", menu_1["default"]);
var categories_1 = require("./router/categories");
app.use("/categories", categories_1["default"]);
var dish_1 = require("./router/dish");
app.use("/dish", dish_1["default"]);
var auth_1 = require("./router/auth");
app.use("/", auth_1["default"]);
