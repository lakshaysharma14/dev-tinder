const mongoose = require('mongoose');

const dbName = 'devTinder';
const clusetUrl = '';

const connectDB = async () => { 
    await mongoose.connect(`${clusetUrl}/${dbName}`);
}

module.exports = connectDB;
