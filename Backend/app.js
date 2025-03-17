const express = require('express');
const cors = require('cors');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const mongooseconnection = require('./config/mongoose');
const cookieParser = require('cookie-parser');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());




app.listen(process.env.PORT || 4000);
