const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("MONGODB connected");
    } catch (error) {
        console.log("error connecting in mongodb", error);
        process.exit(1);
    }
};

module.exports = connectDB; 
