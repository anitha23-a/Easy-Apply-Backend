import mongoose from 'mongoose';
import Customer from '../models/Customer.js';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/paperlessoutlet';

const customers = [
  {
    telephone: '0112345678',
    legalOwner: 'ABC Telecom (Pvt) Ltd',
    contactPerson: 'John Doe',
    mobile: '0771234567',
    email: 'john.doe@example.com',
    serviceType: 'FTTH',
    address1: '123 Main Street',
    address2: 'Floor 4',
    city: 'Colombo 03',
    district: 'Colombo',
    postal_code: '00300',
  },
  {
    telephone: '0112345679',
    legalOwner: 'SLT Test Customer',
    contactPerson: 'Jane Smith',
    mobile: '0779876543',
    email: 'jane.smith@example.com',
    serviceType: 'Megaline',
    address1: '45 Galle Road',
    address2: '',
    city: 'Dehiwala',
    district: 'Colombo',
    postal_code: '10350',
  },
  {
    telephone: '0112111222',
    legalOwner: 'Saman Perera',
    contactPerson: 'Saman Perera',
    mobile: '0714445556',
    email: 'saman@example.com',
    serviceType: 'LTE',
    address1: '78 Kandy Road',
    address2: '',
    city: 'Kelaniya',
    district: 'Gampaha',
    postal_code: '11600',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    for (const cust of customers) {
      await Customer.findOneAndUpdate(
        { telephone: cust.telephone },
        cust,
        { upsert: true, new: true }
      );
      console.log(`Seeded customer: ${cust.telephone}`);
    }

    console.log('Customer seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding customers:', err);
    process.exit(1);
  }
}

seed();
