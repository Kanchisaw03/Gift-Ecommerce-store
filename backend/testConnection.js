const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

console.log('Testing MongoDB connection...');
console.log(`MongoDB URI: ${process.env.MONGO_URI.substring(0, 20)}...`); // Show only part of the URI for security

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // List all collections in the database
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('Available collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Close the connection
    await mongoose.connection.close();
    console.log('Connection closed successfully');
    
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Run the function
connectDB();
