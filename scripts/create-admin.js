const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const MONGODB_URI = "mongodb://univisport:univisport2025@ac-wtvu68n-shard-00-00.6xdwqt8.mongodb.net:27017,ac-wtvu68n-shard-00-01.6xdwqt8.mongodb.net:27017,ac-wtvu68n-shard-00-02.6xdwqt8.mongodb.net:27017/univisport_db?ssl=true&replicaSet=atlas-45rh52-shard-0&authSource=admin&retryWrites=true&w=majority";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  emailVerified: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function run() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const email = "admin@univisport.com";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 12);

    let user = await User.findOne({ email });
    if (user) {
      user.password = hashedPassword;
      user.role = "admin";
      user.emailVerified = true;
      await user.save();
      console.log(`Updated existing user ${email} to admin with password 'admin123'`);
    } else {
      user = new User({
        name: "Admin Tester",
        email,
        phone: "0987654321",
        password: hashedPassword,
        role: "admin",
        emailVerified: true
      });
      await user.save();
      console.log(`Created new admin user ${email} with password 'admin123'`);
    }
  } catch (error) {
    console.error("Error creating/updating admin:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

run();
