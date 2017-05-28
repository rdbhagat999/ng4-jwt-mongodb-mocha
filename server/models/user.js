const {mong} = require('../config/conn.js');
const validator = require('validator');
const _ = require('lodash');

const UserSchema = new mong.Schema({

	name: {
		type: String,
		required: false	,
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
		validate: {
          validator: (phone, cb) => {
              cb(/\d{3}-\d{3}-\d{4}/.test(phone)); 
          },
          message: '{VALUE} is not valid. Format as [xxx-xxx-xxxx]'
        },
        unique:true,
        default: "000-000-0000"
	},
	password: {
		type: String,
		required: true,
		minlength: [6, 'Minimum length must be 6'],
		maxlength: [45, 'Max length must be 45']
	},
	photos: [
		{
			pic: {
				type: String,
				default: 'user.png'
			},
			gallery: [String]
		}
	],
	tokens: [{
		access: {
			type: String,
			required: false
		},
		authToken: {
			type: String,
			required: false
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








const User = mong.model('User', UserSchema);

module.exports = {
	User
}