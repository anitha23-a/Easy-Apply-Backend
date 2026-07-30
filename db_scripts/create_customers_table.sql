-- SQL script to create `customers` table for SLTMobitel EasyApply
CREATE TABLE IF NOT EXISTS customers (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  telephone_number VARCHAR(50) NOT NULL UNIQUE,
  legal_owner VARCHAR(255) NOT NULL,
  contact_person VARCHAR(255),
  telephone VARCHAR(50),
  mobile VARCHAR(50),
  email VARCHAR(255),
  service_type ENUM('FTTH','LTE','Megaline','PEO TV') DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Optional sample data
INSERT IGNORE INTO customers (telephone_number, legal_owner, contact_person, telephone, mobile, email, service_type)
VALUES
('0112345678', 'ABC Telecom (Pvt) Ltd', 'John Doe', '0112345678', '0771234567', 'john.doe@example.com', 'FTTH');
