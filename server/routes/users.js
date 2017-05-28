const express = require('express');
const {ObjectId} = require('mongodb');
const _ = require('lodash');
const userRoutes = express.Router();

const {User} = require('../models/user.js');

// get all users
userRoutes.get('/', (req, res) => {

	User.find({})
	.then((users) => {
		if(!users) return res.status(404).send();
		res.status(200).send({users});
	})
	.catch((e) => {
		res.status(400).send();
	});

});

// get user by Id
userRoutes.get('/:id', (req, res) => {

	if(!ObjectId.isValid(req.params.id)){
		return res.status(400).send();
	}

	User.findOne({_id:req.params.id})
	.then((user) => {
		if(!user) return res.status(404).send();
		res.status(200).send({user});
	})
	.catch((e) => {
		res.status(400).send();
	});

});

// create new user
userRoutes.post('/', (req, res) => {

	let userBody = _.pick(req.body, ['name', 'email', 'password', 'phone']);

	userBody.createdAt = new Date().getTime();

	const user = new User( userBody );
	//return res.send(user);
	user.save()
	.then((user) => {
		if(!user) return res.status(400).send();
		res.status(200).send({user});
	})
	.catch((e) => {
		res.status(400).send(e);
	});

});

// update user info
userRoutes.put('/:id', (req, res) => {

	if(! ObjectId.isValid(req.params.id)){
		return res.status(400).send();
	}

	let userBody = _.pick(req.body, ['name', 'gender', 'password']);

	userBody.updatedAt = new Date().getTime();

	//return res.send({userBody});

	User.findOneAndUpdate(
		{_id:req.params.id},
		{$set:userBody},
		{new: true}
	)
	.then((user) => {
		if(!user) {
			return res.status(400).send();
		}
		res.status(200).send({user});
	})
	.catch((e) => {
		res.status(400).send();
	});

});

// delete user
userRoutes.delete('/:id', (req, res) => {
	
	if(! ObjectId.isValid(req.params.id)){
		return res.status(400).send();
	}

	User.findOneAndRemove({_id:req.params.id})
	.then((user) => {
		if(!user) return res.status(404).send();
		res.status(200).send();
	})
	.catch((e) => {
		res.status(400).send();
	});

});



module.exports = {
	userRoutes
}