const express = require('express');
const { ObjectId } = require('mongodb');
const _ = require('lodash');
const userRoutes = express.Router();

const { User } = require('../models/user.js');
const { authMiddleware } = require('../middleware/auth.js');


// get all users
userRoutes.get('/', (req, res) => {

    User.find({})
        .then((users) => {
            if (!users) return res.status(404).send();
            res.status(200).send({ users });
        })
        .catch((e) => {
            res.status(400).send();
        });

});

// user login
userRoutes.post('/login', (req, res) => {

    let findUser = _.pick(req.body, ['email', 'password']);

    User.findOne({ email: findUser.email })
        .then((user) => {
            if (!user) return res.status(404).send();
            return user.compare_passwords(findUser.password);
        })
        .then((user) => {
            if (!user) return res.status(404).send();
            //console.log(user);
            return user.generateAuthToken()
                .then((authToken) => {
                    res.header('x-auth', authToken).status(200).send({ authToken, user });
                });
        })
        .catch((e) => {
            console.log('notMatched');
            return res.status(400).send();
        });


});

userRoutes.get('/me', authMiddleware, (req, res) => {
    res.status(200).send(req.user);
});

userRoutes.delete('/logout', authMiddleware, (req, res) => {

    console.log('logout function block');
    req.user.deleteAuthToken(req.authToken)
        .then(() => {
            res.status(200).send('logout');
        })
        .catch((e) => {
            res.status(400).send('logout');
        });
});

// get user by Id
userRoutes.get('/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send();
    }

    User.findOne({ _id: req.params.id })
        .then((user) => {
            if (!user) return res.status(404).send();
            res.status(200).send({ user });
        })
        .catch((e) => {
            res.status(400).send();
        });

});

// create new user
userRoutes.post('/', (req, res) => {

    let userBody = _.pick(req.body, ['email', 'password']);
    userBody.createdAt = new Date().getTime();
    const newUser = new User(userBody);
    //console.log(newUser);

    newUser.save()
        .then((user) => {
            if (!user) return res.status(400).send();
            user.generateAuthToken()
                .then((authToken) => {
                    res.header('x-auth', authToken).status(200).send(user);
                });
        })
        .catch((e) => {
            res.status(400).send();
        });

});

// update user info
userRoutes.put('/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send();
    }

    let userBody = _.pick(req.body, ['name', 'gender', 'password']);

    userBody.updatedAt = new Date().getTime();

    //return res.send({userBody});

    User.findOneAndUpdate({ _id: req.params.id }, { $set: userBody }, { new: true })
        .then((user) => {
            if (!user) {
                return res.status(400).send();
            }
            res.status(200).send({ user });
        })
        .catch((e) => {
            res.status(400).send();
        });

});

// delete user
userRoutes.delete('/:id', (req, res) => {

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).send();
    }

    User.findOneAndRemove({ _id: req.params.id })
        .then((user) => {
            if (!user) return res.status(404).send();
            res.status(200).send();
        })
        .catch((e) => {
            res.status(400).send();
        });

});


module.exports = {
    userRoutes
}