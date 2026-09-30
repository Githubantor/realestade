import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
console.log('DNS servers:', dns.getServers());
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const uri = process.env.MONGO_URI;
console.log('🔗 URI:', uri.replace(/:([^@]+)@/, ':****@'));
try {
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  console.log(`✅ Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  console.log(`\n📂 Collections (${collections.length}):`);
  if (collections.length === 0) console.log('  (empty - run npm run seed)');
  for (const c of collections) {
    const count = await db.collection(c.name).countDocuments();
    console.log(`  - ${c.name}: ${count} docs`);
  }
  for (const c of collections) {
    console.log(`\n--- ${c.name} (first 5) ---`);
    const docs = await db.collection(c.name).find({}).limit(5).toArray();
    if (docs.length === 0) console.log('  (no documents)');
    else docs.forEach((d,i)=>{
      const p={...d}; if(p.password) p.password='***';
      console.log(`\n[${i+1}]` + JSON.stringify(p,null,2).slice(0,2000));
    });
  }
  await mongoose.disconnect();
  console.log('\n✅ Done');
} catch(e){
  console.error('❌', e.message);
  console.error(e);
}
