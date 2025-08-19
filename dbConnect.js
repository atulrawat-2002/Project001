
const mongoose = require("mongoose");

// Function for database connectivity if unable to connect log the error and exit the process
module.exports = async() => {

    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Conneted to database ${connect.connection.host}`);
        
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}