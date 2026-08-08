import mongoose from 'mongoose';
import Customer from '../models/Customer.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/paperlessoutlet';

async function clean() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Keep only the 3 seeded customers, delete any auto-generated ones
    const seeded = ['0112345678', '0112345679', '0112111222'];
    const result = await Customer.deleteMany({ telephone: { $nin: seeded } });
    console.log(`Deleted ${result.deletedCount} auto-created customers.`);

    const remaining = await Customer.find({}).lean();
    console.log('Remaining real database customers:', remaining.length);
    remaining.forEach(c => console.log(`- Telephone: ${c.telephone} | Owner: ${c.legalOwner}`));

    process.exit(0);
  } catch (err) {
    console.error('Error cleaning customers:', err);
    process.exit(1);
  }
}

clean();
