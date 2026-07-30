import Customer from '../models/Customer.js';

export const findCustomerByTelephone = async (telephone) => {
  const customer = await Customer.findOne({ telephone }).lean();
  if (customer) {
    customer.currentAddress = {
      address1: customer.address1 || '',
      address2: customer.address2 || '',
      city: customer.city || '',
      district: customer.district || '',
      postalCode: customer.postal_code || '',
    };
  }
  return customer;
};

export const updateCustomer = async (telephone, updates) => {
  // Prevent updating immutable fields
  if (updates.telephoneNumber || updates.telephone || updates.legalOwner) {
    const err = new Error('telephone and legalOwner cannot be updated');
    err.status = 400;
    throw err;
  }

  const allowed = {};
  if (updates.serviceType !== undefined) allowed.serviceType = updates.serviceType;
  if (updates.contactPerson !== undefined) allowed.contactPerson = updates.contactPerson;
  if (updates.mobile !== undefined) allowed.mobile = updates.mobile;
  if (updates.email !== undefined) allowed.email = updates.email;

  const result = await Customer.updateOne({ telephone }, { $set: allowed });
  return result.modifiedCount;
};


