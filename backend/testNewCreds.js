import dns from 'dns';
dns.setServers(['8.8.8.8','1.1.1.1']);
import mongoose from 'mongoose';

const user='antor12345';
const pass='Bku23HindHXCcLL5';
const cluster='cluster0.ify2tzs.mongodb.net';
const dbName='elara-estates';

const uris = [
  `mongodb+srv://${user}:${pass}@${cluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`,
  `mongodb+srv://${user}:${pass}@${cluster}/sweettable?retryWrites=true&w=majority&appName=Cluster0`,
  `mongodb+srv://${user}:${pass}@${cluster}/?retryWrites=true&w=majority&appName=Cluster0`
];

for(const uri of uris){
  console.log('\n=== Trying ===', uri.replace(/:([^@]+)@/, ':****@'));
  try{
    await mongoose.connect(uri, {serverSelectionTimeoutMS: 8000});
    console.log('✅ CONNECTED host', mongoose.connection.host, 'db', mongoose.connection.name);
    const db = mongoose.connection.db;
    const cols = await db.listCollections().toArray();
    console.log('📂 Collections:', cols.length);
    if(cols.length===0) console.log('  (empty)');
    for(const c of cols){
      const cnt = await db.collection(c.name).countDocuments();
      console.log(` - ${c.name}: ${cnt} docs`);
      const docs = await db.collection(c.name).find({}).limit(5).toArray();
      for(let i=0;i<docs.length;i++){
        const d={...docs[i]}; if(d.password) d.password='***';
        console.log(`\n[${c.name} ${i+1}]`, JSON.stringify(d,null,2).slice(0,1800));
      }
    }
    await mongoose.disconnect();
    // also try sweettable specifically if elara was empty? keep going
  }catch(e){
    console.log('❌', e.message.slice(0,500));
    try{await mongoose.disconnect();}catch{}
  }
}
