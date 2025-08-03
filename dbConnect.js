
const mongoose = require("mongoose");

module.exports = async() => {
    const mongoURI = 'mongodb+srv://Initiation:oIbJe1jkQCYrsGIa@namastenodejs.ecrw1k1.mongodb.net/social-media';

    try {
        const connect = await mongoose.connect(mongoURI)
        console.log(`Conneted to database ${connect.connection.host}`);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}