const mongoose = require('mongoose');

const dbName = 'devTinder';
const clusetUrl = 'mongodb+srv://lakshaynamastenode:qwerty1234@namastenode.43tt9.mongodb.net';

const connectDB = async () => { 
    await mongoose.connect(`${clusetUrl}/${dbName}`);
}

module.exports = connectDB;
