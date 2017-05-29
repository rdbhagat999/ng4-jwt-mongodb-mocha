const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

    name: {
        type: String,
        required: false,
        minlength: [2, 'Minimum length must be 2'],
        lowercase: true,
        trim: true,
        required: true
    },
    gender: {
        type: Number,
        required: false,
        default: 0,
        min: 0,
        max: 2
    },
    email: {
        type: String,
        required: true,
        minlength: [5, 'Minimum length must be 5'],
        maxlength: [45, 'Minimum length must be 45'],
        trim: true,
        unique: true,
        validate: {
            validator: (email) => {
                return validator.isEmail(email);
            },
            message: '{VALUE} is not a valid email address!'
        },
    },
    phone: {
        type: String,
        required: true,
        minlength: [12, 'Minimum length must be 12'],
        maxlength: [12, 'Max length must be 12'],
        unique: true,
        default: "000-000-0000"
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Minimum length must be 6']
    },
    photos: [{
        pic: {
            type: String,
            default: 'user.png'
        },
        gallery: [String]
    }],
    tokens: [{
        access: {
            type: String,
            required: true
        },
        authToken: {
            type: String,
            required: true
        }
    }],
    createdAt: {
        type: Number,
        required: true,
        default: null
    },
    updatedAt: {
        type: Number,
        default: null
    }

});


UserSchema.pre('save', function(next) {

    let user = this;

    if (user.isModified('password')) {

        console.log('password modified')
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.password, salt, function(err, hash) {
                user.password = hash;
                next();
            });
        });

    } else {

        next();

    }

});

UserSchema.statics.findByToken = function(authToken) {

    let User = this;
    let decoded = null;

    console.log('findByToken function block');

    // console.log('authToken');
    // console.log(_.isString(authToken));

    try {

        decoded = jwt.verify(authToken, 'JWT_SECRET');

    } catch (e) {
        return Promise.reject(e);
    }

    // console.log('decoded isString?');
    // console.log(_.isString(decoded));
    // console.log('isEqual');
    // console.log(_.isEqual(authToken, decoded));

    // console.log('decoded');
    // console.log(JSON.stringify(decoded, undefined, 2));

    return User.findOne({
        _id: decoded._id,
        'tokens.access': 'auth',
        'tokens.authToken': authToken
    });

};

UserSchema.methods.generateAuthToken = function() {

    let currentUser = this;
    let access = 'auth';

    let authToken = jwt.sign({
        _id: currentUser._id.toHexString(),
        access: access
    }, 'JWT_SECRET').toString();

    currentUser.tokens = [];
    //console.log(authToken);

    currentUser.tokens.push({ access, authToken });

    return currentUser.save().then(() => {
        return authToken;
    });

};

UserSchema.methods.deleteAuthToken = function(authToken) {

    let currentUser = this;
    let access = 'auth';

    console.log('deleteAuthToken function block');

    return currentUser.update({
        $pull: {
            tokens: {
                authToken: authToken,
                access: access
            }
        }
    });

};

UserSchema.methods.compare_passwords = function(password) {

    let user = this;
    return bcrypt.compare(password, user.password)
        .then((res) => {
            if (!res) { // if false
                return Promise.reject('invalid pwd');
            }
            return user;

        }).catch((e) => {
            return Promise.reject();
        });
};

UserSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();

    return _.pick(userObject, ['_id', 'name', 'email', 'gender', 'phone']);

};


const User = mongoose.model('User', UserSchema);

module.exports = {
    User
}