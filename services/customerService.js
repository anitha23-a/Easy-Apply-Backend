import Customer from '../models/Customer.js';
import { getCustomerByTelephone as getCustomerFromSql } from '../models/customerModel.js';

export const findCustomerByTelephone = async (telephone) => {
  let customer = await Customer.findOne({ telephone }).lean();

  if (!customer) {
    try {
      const sqlCustomer = await getCustomerFromSql(telephone);
      if (sqlCustomer) {
        customer = sqlCustomer;
      }
    } catch (err) {
      // Ignore SQL query failure if MySQL server is not running
    }
  }

  if (customer) {
    // Map schema variations (e.g., fullName -> legalOwner/contactPerson, contactNo -> mobile, addressLine1 -> address1)
    const ownerName = customer.fullName || customer.legalOwner || customer.name || '';
    const contact = customer.contactPerson || customer.fullName || ownerName;
    const mobileNum = customer.contactNo || customer.mobile || customer.phone || '';
    const addr1 = customer.addressLine1 || customer.address1 || '';
    const addr2 = customer.addressLine2 || customer.address2 || '';

    customer.legalOwner = ownerName;
    customer.contactPerson = contact;
    customer.mobile = mobileNum;
    customer.serviceType = customer.serviceType || 'FTTH';
    customer.address1 = addr1;
    customer.address2 = addr2;

    customer.currentAddress = {
      address1: addr1,
      address2: addr2,
      city: customer.city || '',
      district: customer.district || '',
      postalCode: customer.postal_code || customer.postalCode || '',
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


