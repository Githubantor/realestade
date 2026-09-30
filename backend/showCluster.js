import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;
console.log('🔗 URI:', uri.replace(/:([^@]+)@/, ':****@'));

try {
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`✅ Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);

  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log(`\n📂 Collections (${collections.length}):`);
  if (collections.length === 0) console.log('  (empty - no collections yet, run npm run seed)');
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`  - ${c.name}: ${count} docs`);
  }

  for (const c of collections) {
    console.log(`\n--- ${c.name} (first 5 docs) ---`);
    const docs = await db.collection(c.name).find({}).limit(5).toArray();
    if (docs.length === 0) console.log('  (no documents)');
    else docs.forEach((d, i) => {
      console.log(`\n[${i+1}] _id: ${d._id}`);
      // pretty print without huge fields
      const preview = { ...d };
      if (preview.password) preview.password = '***';
      console.log(JSON.stringify(preview, null, 2).slice(0, 1500));
    });
  }

  await mongoose.disconnect();
  console.log('\n✅ Done');
} catch (e) {
  console.error('❌ Error:', e.message);
  if (e.message.includes('querySrv ECONNREFUSED')) {
    console.error('\n⚠️ DNS SRV blocked - see previous fix (change DNS to 8.8.8.8, whitelist IP 0.0.0.0/0)');
  }
  if (e.message.includes('authentication failed')) {
    console.error('⚠️ Check DB Access user antor1234 / antor0019 in Atlas');
  }
  process.exit(1);
}
