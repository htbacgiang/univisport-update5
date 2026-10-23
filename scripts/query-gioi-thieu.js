const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function run() {
  const envPath = path.join(__dirname, '../.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/MONGODB_URI=(.*)/);
  if (!match) {
    throw new Error("MONGODB_URI not found in .env");
  }
  const MONGODB_URI = match[1].trim();

  await mongoose.connect(MONGODB_URI);
  console.log("Connected to DB");
  
  const posts = await mongoose.connection.db.collection('posts').find({}).project({ slug: 1, title: 1, isDirectPost: 1 }).toArray();
  console.log("All posts:", JSON.stringify(posts));
  
  await mongoose.disconnect();
}

run().catch(console.error);
