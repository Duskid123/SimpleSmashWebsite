import { MongoClient } from "mongodb";
import mongoose from "mongoose";

const uri = "mongodb+srv://dduskis:sKmaQ1hmXIGiYTZP@cluster0.oxgja.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const connectionString = process.env.ATLAS_URI || uri;

const options = {
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000,         // 45 seconds

};
const client = new MongoClient(connectionString, options);

// let conn;
// try {
//   conn = await client.connect();
// } catch(e) {
//   console.error(e);
// }
//
// mongoose.set('bufferCommands', false); // Optional: Disable buffering if you don't want queries to queue
// mongoose.set('maxTimeMS', 30000); // Set max time for operations
//
// let db = conn.db("myData");
//
// export default db;


async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("myData");

  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    process.exit(1);
  }
}

export default connectDB;