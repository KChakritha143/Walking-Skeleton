const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.log('No MONGO_URI specified in environment. Starting persistent local MongoDB database...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const path = require('path');
      const fs = require('fs');

      const dbPath = path.join(__dirname, '../data');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      mongoServer = await MongoMemoryServer.create({
        binary: {
          version: '7.0.12',
        },
        instance: {
          dbPath: dbPath,
          storageEngine: 'wiredTiger',
        },
      });
      mongoUri = mongoServer.getUri();
      console.log(`Persistent local MongoDB server started at: ${mongoUri}`);
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongoServer) {
      await mongoServer.stop();
      console.log('In-memory MongoDB server stopped.');
    }
  } catch (error) {
    console.error(`Database disconnection error: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
