
const mongoose = require("mongoose");

// Function for database connectivity if unable to connect log the error and exit the process
module.exports = async() => {
    const mongoURI = 'mongodb+srv://Initiation:oIbJe1jkQCYrsGIa@namastenodejs.ecrw1k1.mongodb.net/Social-media';

    try {
        const connect = await mongoose.connect(mongoURI)
        console.log(`Conneted to database ${connect.connection.host}`);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}