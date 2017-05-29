const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const mongo_uri = 'mongodb://localhost:27017/ng4AwtNodeRestApi';

mongoose.connect(mongo_uri);

module.exports = {
	mongoose: mongoose
}