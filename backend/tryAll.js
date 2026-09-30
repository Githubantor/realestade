import dns from 'dns';
dns.setServers(['8.8.8.8','1.1.1.1']);
import mongoose from 'mongoose';
const combos = [
  ['srv antor0019 elara', 'mongodb+srv://antor1234:antor0019@cluster0.ify2tzs.mongodb.net/elara-estates?retryWrites=true&w=majority&appName=Cluster0'],
  ['srv antor0019 sweet', 'mongodb+srv://antor1234:antor0019@cluster0.ify2tzs.mongodb.net/sweettable?retryWrites=true&w=majority&appName=Cluster0'],
  ['srv gLt elara', 'mongodb+srv://antor1234:gLtCjLFlziknQ5vC@cluster0.ify2tzs.mongodb.net/elara-estates?retryWrites=true&w=majority&appName=Cluster0'],
  ['srv gLt sweet', 'mongodb+srv://antor1234:gLtCjLFlziknQ5vC@cluster0.ify2tzs.mongodb.net/sweettable?retryWrites=true&w=majority&appName=Cluster0'],
  ['direct gLt sweet', 'mongodb://antor1234:gLtCjLFlziknQ5vC@ac-qfqjcqh-shard-00-00.ify2tzs.mongodb.net:27017,ac-qfqjcqh-shard-00-01.ify2tzs.mongodb.net:27017,ac-qfqjcqh-shard-00-02.ify2tzs.mongodb.net:27017/sweettable?ssl=true&replicaSet=atlas-egobpd-shard-0&authSource=admin&retryWrites=true&w=majority'],
  ['direct gLt elara', 'mongodb://antor1234:gLtCjLFlziknQ5vC@ac-qfqjcqh-shard-00-00.ify2tzs.mongodb.net:27017,ac-qfqjcqh-shard-00-01.ify2tzs.mongodb.net:27017,ac-qfqjcqh-shard-00-02.ify2tzs.mongodb.net:27017/elara-estates?ssl=true&replicaSet=atlas-egobpd-shard-0&authSource=admin&retryWrites=true&w=majority'],
];
for (const [name, uri] of combos) {
  console.log(`\n=== Trying ${name} ===`);
  console.log(uri.replace(/:([^@]+)@/, ':****@'));
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log('✅ SUCCESS', name, 'host', mongoose.connection.host, 'db', mongoose.connection.name);
    const cols = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', cols.map(c=>c.name).join(', ') || '(none)');
    for (const c of cols) {
      const cnt = await mongoose.connection.db.collection(c.name).countDocuments();
      console.log(`  ${c.name}: ${cnt}`);
    }
    await mongoose.disconnect();
    break;
  } catch(e){ console.log('❌', e.message.slice(0,300)); try{await mongoose.disconnect();}catch{} }
}
