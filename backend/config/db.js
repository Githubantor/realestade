import mongoose from 'mongoose';
import dns from 'dns';
// Fix SRV ECONNREFUSED on routers that block _mongodb._tcp lookups (like 192.168.1.1)
try { dns.setServers(['8.8.8.8', '1.1.1.1']); } catch {}
// Also prefer IPv4 for Atlas
import { setDefaultResultOrder } from 'dns';
try { setDefaultResultOrder('ipv4first'); } catch {}

const connectDB = async () => {
  try {
    // Timeout faster for dev environments without internet
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 15000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.warn('⚠️  Running in OFFLINE/MOCK mode — API will use in-memory data until MongoDB is reachable.');
    console.warn('   Check internet / firewall for port 27017 and DNS SRV (_mongodb._tcp).');
    return false;
  }
};

export default connectDB;
