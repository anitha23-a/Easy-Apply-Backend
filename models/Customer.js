import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  telephone: { type: String, required: true, unique: true },
  legalOwner: { type: String, default: '' },
  fullName: { type: String, default: '' },
  contactPerson: { type: String, default: '' },
  contactNo: { type: String, default: '' },
  mobile: { type: String, default: '' },
  email: { type: String, default: '' },
  serviceType: { type: String, default: 'FTTH' },
  address1: { type: String, default: '' },
  address2: { type: String, default: '' },
  addressLine1: { type: String, default: '' },
  addressLine2: { type: String, default: '' },
  city: { type: String, default: '' },
  district: { type: String, default: '' },
  postal_code: { type: String, default: '' },
}, { timestamps: true, strict: false });

const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
export default Customer;
