import pool from '../config/mysql.js';

const allowedServiceTypes = ['FTTH', 'LTE', 'Megaline', 'PEO TV'];

export const getCustomerByTelephone = async (telephone) => {
  if (!pool) return null;
  try {
    const sql = `SELECT telephone_number AS telephoneNumber, legal_owner AS legalOwner, contact_person AS contactPerson, telephone, mobile, email, service_type AS serviceType FROM customers WHERE telephone_number = ? OR telephone = ? LIMIT 1`;
    const [rows] = await pool.execute(sql, [telephone, telephone]);
    return rows[0] || null;
  } catch (err) {
    return null;
  }
};

export const updateCustomerByTelephone = async (telephone, updates) => {
  const fields = [];
  const values = [];

  if (updates.serviceType !== undefined) {
    if (!allowedServiceTypes.includes(updates.serviceType)) {
      throw new Error('Invalid service type');
    }
    fields.push('service_type = ?');
    values.push(updates.serviceType);
  }

  if (updates.contactPerson !== undefined) {
    fields.push('contact_person = ?');
    values.push(updates.contactPerson);
  }

  if (updates.mobile !== undefined) {
    fields.push('mobile = ?');
    values.push(updates.mobile);
  }

  if (updates.email !== undefined) {
    fields.push('email = ?');
    values.push(updates.email);
  }

  if (fields.length === 0) {
    return 0; // nothing to update
  }

  const sql = `UPDATE customers SET ${fields.join(', ')}, updated_at = NOW() WHERE telephone_number = ?`;
  values.push(telephone);
  const [result] = await pool.execute(sql, values);
  return result.affectedRows;
};
