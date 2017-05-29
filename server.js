const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const hbs = require('hbs');
//const mongoose = require('mongoose');
const helmet = require('helmet');
const port = 3000;
const app = express();


app.disable('x-powered-by');
/*app.set('engine', hbs);*/

//app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'server/uploads')));
app.use(bodyParser.json()); // to send and recieve json data
app.use(bodyParser.urlencoded({ extended: false }));

var { mongoose } = require('./server/config/mongoose.js');
const { userRoutes } = require('./server/routes/users.js');

app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

app.use('/users', userRoutes);

app.get('*', (req, res) => {
    res.status(400).send('Bad Request');
});

app.listen(port, () => {
    console.log(`listening on port:${port}`);
})