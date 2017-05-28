const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const mongo_uri = 'mongodb://localhost:27017/ng4AwtNodeRestApi';

const mong = mongoose.connect(mongo_uri, (err, conn) => {
	if(err) return console.log(err);
	console.log(`Connected to mongodb: ${mongo_uri}`)
});

module.exports = {
	mong
}