import mongoose from 'mongoose';
import Customer from '../models/Customer.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/paperlessoutlet';

async function sync() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const customerData = {
      telephone: '0112345678',
      fullName: 'Lionel Perera',
      nic: '198512345678',
      contactNo: '0771234567',
      addressLine1: 'No 45, Lotus Road',
      addressLine2: 'Colombo 01',
      customerType: 'home',
      email: 'lio.perera@example.lk',
      status: 'disconnected',
      disconnectedFrom: '2023-01-15',
      disconnectedTo: '2023-10-15',
      outstandingBalance: 2500.5,
    };

    const doc = await Customer.findOneAndReplace(
      { telephone: '0112345678' },
      customerData,
      { upsert: true, returnDocument: 'after' }
    );

    console.log('Successfully updated MongoDB customer document:');
    console.log(JSON.stringify(doc, null, 2));

    process.exit(0);
  } catch (err) {
    console.error('Error syncing customer:', err);
    process.exit(1);
  }
}

sync();
