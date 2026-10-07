const mongoose = require('mongoose');
require('dotenv').config();

async function runMigration() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/interiordesign';
  console.log(`Connecting to MongoDB at ${mongoUri}...`);
  
  await mongoose.connect(mongoUri);
  const db = mongoose.connection.db;

  console.log("Running migration: Adding default status to Users...");
  const result = await db.collection('users').updateMany(
    { status: { $exists: false } },
    { $set: { status: 'ACTIVE', updatedAt: new Date() } }
  );

  console.log(`Migration complete! Modified ${result.modifiedCount} documents.`);
  await mongoose.disconnect();
}

runMigration().catch(err => {
  console.error("❌ Migration failed:", err.message);
  process.exit(1);
});
