const mongoose = require('mongoose');

async function runMigration() {
  // Explicitly force process.env.MONGO_URI or fallback to host.docker.internal
  const mongoUri = process.env.MONGO_URI || 'mongodb://host.docker.internal:27017/interiordesign';
  console.log(`Connecting to MongoDB at ${mongoUri}...`);
  
  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
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
