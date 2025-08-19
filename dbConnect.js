
const mongoose = require("mongoose");

module.exports = async() => {
    const mongoURI = 'mongodb+srv://Initiation:oIbJe1jkQCYrsGIa@namastenodejs.ecrw1k1.mongodb.net/Social-media';

    try {
        const connect = await mongoose.connect(mongoURI)
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}