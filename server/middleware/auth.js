const { User } = require('../models/user.js');
const _ = require('lodash');

let authMiddleware = (req, res, next) => {

    console.log('auth function block');

    let authToken = req.header('x-auth');
    console.log('Auth: ', authToken);

    if (_.isNil(authToken)) {
        return res.status(401).send();
    }

    User.findByToken(authToken)
        .then((user) => {
            if (!user) return res.status(401).send();
            req.authToken = authToken;
            req.user = user;
            next();
        })
        .catch((e) => {
            res.status(401).send(e);
        });

};



module.exports = {
    authMiddleware
}