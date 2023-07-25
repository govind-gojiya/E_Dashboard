const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(`mongodb+srv://govind-gojiya:D8Pt7uGswaUrbU0J@e-dashboard.4h5ielj.mongodb.net/?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
        });
    
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        // console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;