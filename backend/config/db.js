import mongoose from 'mongoose'; 

const db = async () => {
  const uri = process.env.MONGO_URI; 
  
  if (!uri) {
    console.error('❌ MONGO_URI environment variable is not set.');
    console.error('Please create a .env file with your MongoDB connection string.');
    console.error('Example: MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database');
    process.exit(1);
  }

  if (!uri.startsWith("mongodb")) {
    console.error('❌ Invalid MONGO_URI. Make sure it starts with "mongodb://" or "mongodb+srv://".');
    process.exit(1);
  }

  // Set connection options for better reliability
  const options = {
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    bufferCommands: false, // Disable mongoose buffering
  };

  mongoose.connection.on('connected', () =>
    console.log("✅ Connected to MongoDB")
  );

  mongoose.connection.on('error', (err) =>
    console.error("❌ MongoDB connection error:", err)
  );

  mongoose.connection.on('disconnected', () =>
    console.log("⚠️ MongoDB disconnected")
  );

  try {
    await mongoose.connect(uri, options);
    console.log("🔗 MongoDB connection established successfully");
  } catch (err) {
    console.error("❌ Initial MongoDB connection failed:", err);
    console.error("\n🔧 Troubleshooting steps:");
    console.error("1. Check if your MongoDB Atlas cluster is running");
    console.error("2. Verify your IP address is whitelisted in MongoDB Atlas");
    console.error("3. Check your connection string format");
    console.error("4. Ensure your database user has proper permissions");
    process.exit(1);
  }
};

export default db;
