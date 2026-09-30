import dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import mongoose from 'mongoose';

const uri_correct = 'mongodb://antor1234:gLtCjLFlziknQ5vC@ac-qfqjcqh-shard-00-00.ify2tzs.mongodb.net:27017,ac-qfqjcqh-shard-00-01.ify2tzs.mongodb.net:27017,ac-qfqjcqh-shard-00-02.ify2tzs.mongodb.net:27017/elara-estates?ssl=true&replicaSet=atlas-egobpd-shard-0&authSource=admin&retryWrites=true&w=majority';
const uri_srv_correct = 'mongodb+srv://antor1234:gLtCjLFlziknQ5vC@cluster0.ify2tzs.mongodb.net/elara-estates?retryWrites=true&w=majority&appName=Cluster0';

console.log('Trying SRV with correct password...');
try {
  const conn = await mongoose.connect(uri_srv_correct, { serverSelectionTimeoutMS: 10000 });
  console.log(`✅ SRV Connected: ${conn.connection.host} / DB: ${conn.connection.name}`);
  const db = conn.connection.db;
  const cols = await db.listCollections().toArray();
  console.log(`📂 Collections: ${cols.length}`);
  for (const c of cols) {
    const cnt = await db.collection(c.name).countDocuments();
    console.log(` - ${c.name}: ${cnt}`);
    const docs = await db.collection(c.name).find({}).limit(3).toArray();
    docs.forEach((d,i)=>{ const p={...d}; if(p.password) p.password='***'; console.log(` [${i+1}]`, JSON.stringify(p,null,2).slice(0,1200))});
  }
  await mongoose.disconnect();
} catch(e){
  console.error('SRV failed:', e.message);
  console.log('\nTrying direct mongodb://...');
  try {
    const conn2 = await mongoose.connect(uri_correct, { serverSelectionTimeoutMS: 10000 });
    console.log(`✅ Direct Connected: ${conn2.connection.host} / DB: ${conn2.connection.name}`);
    const db = conn2.connection.db;
    const cols = await db.listCollections().toArray();
    console.log(`📂 Collections: ${cols.length}`);
    for (const c of cols) {
      const cnt = await db.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${cnt}`);
      const docs = await db.collection(c.name).find({}).limit(3).toArray();
      docs.forEach((d,i)=>{ const p={...d}; if(p.password) p.password='***'; console.log(` [${i+1}]`, JSON.stringify(p,null,2).slice(0,1500))});
    }
    await mongoose.disconnect();
  } catch(e2){
    console.error('Direct also failed:', e2.message);
  }
}
