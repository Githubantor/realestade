import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from './models/Property.js';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();
await connectDB();

const properties = [
  {
    title: "Trousdale Modern Masterpiece",
    price: "$139,000,000",
    priceValue: 139000000,
    address: "1021 N Beverly Drive, Beverly Hills",
    city: "Beverly Hills",
    neighborhood: "Trousdale",
    beds: 8,
    baths: 12,
    sqft: "18,500",
    sqftValue: 18500,
    tag: "TROUSDALE",
    status: "New Listing",
    description: "An architectural tour de force in the heart of Trousdale Estates. Floor-to-ceiling glass, resort-style amenities and unobstructed city-to-ocean views.",
    images: ["https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop"],
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop",
    features: ["Infinity Pool", "Home Theater", "Wine Cellar", "Smart Home"],
    type: "Buy",
    featured: true,
  },
  {
    title: "Bel Air Crest Estate",
    price: "$79,500,000",
    priceValue: 79500000,
    address: "950 Bel Air Road, Bel Air",
    city: "Bel Air",
    neighborhood: "Bel Air",
    beds: 7,
    baths: 10,
    sqft: "14,200",
    sqftValue: 14200,
    tag: "BEL AIR",
    status: "Private Listing",
    description: "Private and serene, this Bel Air estate offers timeless elegance with modern luxury. Gated, hedged, and utterly discreet.",
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    features: ["Tennis Court", "Guest House", "Spa"],
    type: "Buy",
    featured: true,
  },
  {
    title: "Bird Streets Architectural Gem",
    price: "$45,000,000",
    priceValue: 45000000,
    address: "1470 Carla Ridge, Beverly Hills",
    city: "Beverly Hills",
    neighborhood: "Beverly Hills",
    beds: 6,
    baths: 9,
    sqft: "11,800",
    sqftValue: 11800,
    tag: "BIRDNEST",
    status: "Just Sold",
    description: "Perched above the Bird Streets with jetliner views. A collector's estate for the design-obsessed.",
    images: ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop"],
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    features: ["Rooftop Deck", "Chef's Kitchen"],
    type: "Buy",
    featured: false,
  },
  {
    title: "Stradella Vineyard Estate",
    price: "$62,800,000",
    priceValue: 62800000,
    address: "864 Stradella Road, Bel Air",
    city: "Bel Air",
    neighborhood: "Bel Air",
    beds: 7,
    baths: 11,
    sqft: "13,400",
    sqftValue: 13400,
    tag: "STRADALLA",
    status: "New Listing",
    description: "Mediterranean grandeur meets California minimalism. Vineyard, orchard and canyon views.",
    images: ["https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    features: ["Vineyard", "Pool", "Gym"],
    type: "Buy",
    featured: true,
  },
  {
    title: "Sarbonne Modern Retreat",
    price: "$28,900,000",
    priceValue: 28900000,
    address: "755 Sarbonne Road, Bel Air",
    city: "Bel Air",
    neighborhood: "Bel Air",
    beds: 5,
    baths: 7,
    sqft: "8,950",
    sqftValue: 8950,
    tag: "SARBONNE",
    status: "Price Reduced",
    description: "A serene modern retreat with warm materials and curated art spaces.",
    images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop"],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1200&auto=format&fit=crop",
    features: ["Art Studio", "Pool"],
    type: "Buy",
    featured: false,
  },
  {
    title: "Doheny Grand Estate",
    price: "$88,000,000",
    priceValue: 88000000,
    address: "1181 N Doheny Drive, Hollywood Hills",
    city: "Hollywood Hills",
    neighborhood: "Hollywood Hills",
    beds: 9,
    baths: 14,
    sqft: "21,000",
    sqftValue: 21000,
    tag: "DOHENY ESTATE",
    status: "Iconic",
    description: "The iconic Doheny Estate — a legacy property with historic pedigree and contemporary restoration.",
    images: ["https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop"],
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=1200&auto=format&fit=crop",
    features: ["Historic", "Estate Grounds", "Ballroom"],
    type: "Buy",
    featured: true,
  },
];

const importData = async () => {
  try {
    await Property.deleteMany();
    // Create an admin user if not exists and assign as agent
    let admin = await User.findOne({ email: 'admin@elaraestates.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Elara Admin',
        email: 'admin@elaraestates.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('👤 Admin created: admin@elaraestates.com / admin123');
    }

    let agent = await User.findOne({ email: 'agent@elaraestates.com' });
    if (!agent) {
      agent = await User.create({
        name: 'Sebastian Vance',
        email: 'agent@elaraestates.com',
        password: 'agent123',
        role: 'agent',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop',
      });
      console.log('👤 Agent created: agent@elaraestates.com / agent123');
    }

    const withAgent = properties.map(p => ({ ...p, agent: agent._id }));
    await Property.insertMany(withAgent);
    console.log(`✅ ${withAgent.length} Properties Imported`);
    process.exit();
  } catch (error) {
    console.error(`❌ Seed Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Property.deleteMany();
    console.log('🗑️ Properties Destroyed');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
