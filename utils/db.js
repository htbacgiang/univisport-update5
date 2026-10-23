import mongoose from "mongoose";

const connection = {};

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDb() {
  if (cached.conn) {
    connection.isConnected = cached.conn.connections[0].readyState;
    return cached.conn;
  }

  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose;
    connection.isConnected = 1;
    return mongoose;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => {
      console.log("New connection to the database.");
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
    connection.isConnected = cached.conn.connections[0].readyState;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

async function disconnectDb() {
  if (process.env.NODE_ENV === "production") {
    if (cached.conn) {
      await mongoose.disconnect();
      cached.conn = null;
      cached.promise = null;
      connection.isConnected = 0;
    }
  }
}

const db = { connectDb, disconnectDb };
export default db;